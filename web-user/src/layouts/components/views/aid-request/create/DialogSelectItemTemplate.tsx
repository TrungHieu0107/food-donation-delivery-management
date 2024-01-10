import {
	Box,
	Button,
	Card,
	CardMedia,
	Chip,
	Divider,
	Grid,
	MenuItem,
	Select,
	Stack,
	TextField,
	Typography,
	InputAdornment,
	Skeleton,
	Pagination
} from '@mui/material'
import { Check } from 'mdi-material-ui'
import { useEffect, useState } from 'react'
import DialogCustom from 'src/@core/layouts/components/dialog/Dialog'
import { CategoryAPI } from 'src/api-client/Category'
import { ItemAPI } from 'src/api-client/Item'
import {
	Category,
	ItemDetailSearchKeywordModel,
	ItemSearchKeywordModel,
	UnitModel
} from 'src/models/Item'
import { SearchItemParamsModel } from 'src/models/common/CommonModel'
import { CommonRepsonseModel, PaginationModel } from 'src/models/common/CommonResponseModel'
import { customColor } from 'src/@core/theme/color'
import InfoIcon from '@mui/icons-material/Info'
import VolunteerActivismOutlinedIcon from '@mui/icons-material/VolunteerActivismOutlined'
import * as React from 'react'
import { Field, FieldProps, Form, Formik, FormikProps } from 'formik'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DatePicker, { registerLocale } from 'react-datepicker'
import vi from 'date-fns/locale/vi'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import moment from 'moment'
import { ItemTemplateResponse } from 'src/models/Activity'
import * as Yup from 'yup'
import { VolunteerDonateItem } from 'src/pages/tao-yeu-cau-quyen-gop'
import { digitsOnly } from 'src/@core/layouts/utils'

const validationInputQuantityAidRequest = Yup.object({
	quantity: Yup.number()
		.min(1, 'Số lượng nhỏ nhất phải là 1')
		.max(9999, 'Số lượng không được vượt quá 9999')
		.test('Digits only', 'Số lượng chỉ nhập số nguyên', digitsOnly)
		.integer('Số lượng chỉ nhập số nguyên')
		.required('Hãy nhập số lượng cần hỗ trợ')
})

const validationInputQuantityDonatedRequest = Yup.object({
	quantity: Yup.number()
		.min(1, 'Số lượng nhỏ nhất phải là 1')
		.max(9999, 'Số lượng không được vượt quá 9999')
		.test('Digits only', 'Số lượng chỉ nhập số nguyên', digitsOnly)
		.integer('Số lượng chỉ nhập số nguyên')
		.required('Hãy nhập số lượng quyên góp'),
	initialExpirationDate: Yup.date()
		.test('minDate', 'Thời gian phải sau ngày hôm nay.', (value) => {
			if (!value) return false

			return moment().startOf('date').isBefore(value)
		})
		.required('Hãy nhập thời gian bảo quản.')
})
registerLocale('vi', vi)
export interface DialogSelectItemTemplateProps {
	open: boolean
	handleClose: () => void
	handleSelectItemTemplate: (isSelect: boolean, value: VolunteerDonateItem, id?: string) => void
	itemTemplatesSelected: VolunteerDonateItem[]
	isAidScreen: boolean
	charityItemSelected?: VolunteerDonateItem
}

export default function DialogSelectItemTemplate({
	open,
	handleClose,
	itemTemplatesSelected,
	handleSelectItemTemplate,
	isAidScreen,
	charityItemSelected
}: DialogSelectItemTemplateProps) {
	const itemSelectedMap = new Map(itemTemplatesSelected.map((obj) => [obj.itemTemplateId, obj]))

	const [categories, setCategories] = useState<Category[]>([])
	const [isloading, setIsLoading] = useState<boolean>(true)
	const [dataSearch, setDateSearch] = useState<SearchItemParamsModel>(new SearchItemParamsModel())
	const [items, setItems] = useState<ItemSearchKeywordModel[]>([])
	const [currentItemSelected, setCurrentItemSelected] = useState<ItemSearchKeywordModel>()
	const [itemDetail, setItemDetail] = useState<ItemDetailSearchKeywordModel>()
	const [pagination, setPagination] = useState<PaginationModel>(new PaginationModel())
	const [nameSearch, setNameSearch] = useState<string>('')
	const [isFetchDetail, setIsFetchDetail] = useState<boolean>(false)
	const formikRef = React.useRef<FormikProps<any>>(null)

	useEffect(() => {
		try {
			setIsLoading(true)
			setIsFetchDetail(true)
			fetchDataCategory()
			handleSearchItem()
		} catch (error) {
			console.log(error)
		} finally {
			setIsLoading(false)
		}
	}, [])

	const fetchDataCategory = () => {
		CategoryAPI.getAllCategories()
			.then((data) => {
				const dataResponse = new CommonRepsonseModel<Category[]>(data)
				setCategories(dataResponse.data ?? [])
			})
			.catch((error) => {
				console.log(error)
			})
	}

	useEffect(() => {
		handleSearchItem()
	}, [dataSearch])

	useEffect(() => {
		const handleGetInfoItem = async () => {
			try {
				setIsFetchDetail(true)
				if (!currentItemSelected?.itemTemplateId) return
				const response = await ItemAPI.getItemWithItemId(currentItemSelected?.itemTemplateId)
				console.log(new CommonRepsonseModel<ItemTemplateResponse>(response).data)

				setItemDetail(new CommonRepsonseModel<ItemDetailSearchKeywordModel>(response).data)
			} catch (error) {
				console.log(error)
			} finally {
				setIsFetchDetail(false)
			}
		}

		handleGetInfoItem()
	}, [currentItemSelected])

	useEffect(() => {
		const id = charityItemSelected?.item?.id || ''

		if (id) {
			if (itemSelectedMap.has(id)) {
				setCurrentItemSelected(
					new ItemSearchKeywordModel({
						...itemSelectedMap.get(id),
						unit: new UnitModel({
							name: itemSelectedMap.get(id)?.unit
						})
					})
				)
				isAidScreen
					? formikRef.current?.setValues({
							quantity: itemSelectedMap.get(id || '')?.quantity
					  })
					: formikRef.current?.setValues({
							initialExpirationDate: itemSelectedMap.get(id || '')?.initialExpirationDate,
							quantity: itemSelectedMap.get(id || '')?.quantity
					  })
			}
		}
	}, [charityItemSelected])

	const handleSearchItem = async () => {
		try {
			setIsLoading(true)

			const response = await ItemAPI.searchItemWithKeyword({
				searchKeyWord: dataSearch.name,
				itemCategoryId: dataSearch.itemCategoryId || undefined,
				page: dataSearch.page
			})
			const commonReponse = new CommonRepsonseModel<ItemSearchKeywordModel[]>(response)
			setItems(commonReponse.data || [])
			if (!!commonReponse.data?.at(0)) {
				setCurrentItemSelected(commonReponse.data?.at(0))
				if (itemSelectedMap.has(commonReponse.data?.at(0)?.itemTemplateId)) {
					isAidScreen
						? formikRef.current?.setValues({
								quantity: itemSelectedMap.get(commonReponse.data?.at(0)?.itemTemplateId || '')
									?.quantity
						  })
						: formikRef.current?.setValues({
								initialExpirationDate: itemSelectedMap.get(
									commonReponse.data?.at(0)?.itemTemplateId || ''
								)?.initialExpirationDate,
								quantity: itemSelectedMap.get(commonReponse.data?.at(0)?.itemTemplateId || '')
									?.quantity
						  })
				}
			}
			setPagination(commonReponse.pagination)
		} catch (error) {
			console.log(error)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<>
			<DialogCustom
				open={open}
				content={
					<Stack
						divider={<Divider orientation='vertical' />}
						sx={{
							height: 400,
							overflow: 'hidden'
						}}
						flexDirection={'row'}
						gap={2}
					>
						<Box
							display={'flex'}
							flexDirection={'column'}
							gap={2}
							flexWrap={'nowrap'}
							width={500}
							sx={{
								overflow: 'auto'
							}}
						>
							<Grid
								container
								flexDirection={'row'}
								flexWrap={'nowrap'}
								justifyContent={'space-between'}
								gap={3}
							>
								<Grid item display={'flex'} gap={2}>
									<Typography
										fontWeight={550}
										sx={{
											whiteSpace: 'nowrap'
										}}
									>
										Thể loại:
									</Typography>
									<Select
										variant='standard'
										sx={{
											paddingX: '10px'
										}}
										value={dataSearch.itemCategoryId ? dataSearch.itemCategoryId : 'all'}
										onChange={(e) => {
											console.log(e.target.value)
											setDateSearch({
												...dataSearch,
												itemCategoryId: e.target.value !== 'all' ? e.target.value : undefined
											})
										}}
									>
										<MenuItem
											sx={{
												paddingX: '10px'
											}}
											value={'all'}
										>
											Tất cả
										</MenuItem>
										{categories.map((item, index) => (
											<MenuItem
												value={item.id}
												key={index}
												sx={{
													paddingX: '10px'
												}}
											>
												{item.name}
											</MenuItem>
										))}
									</Select>
								</Grid>
								<Grid item>
									<Grid item display={'flex'} gap={2}>
										<Typography
											fontWeight={550}
											sx={{
												whiteSpace: 'nowrap'
											}}
										>
											Tên:
										</Typography>
										<TextField
											autoComplete='off'
											variant='standard'
											sx={{
												paddingX: '10px',
												minWidth: 200
											}}
											value={nameSearch}
											onChange={(e) => {
												setNameSearch(e.target.value)
											}}
											onBlur={() => {
												if (nameSearch !== dataSearch.name) {
													setDateSearch({
														...dataSearch,
														name: nameSearch
													})
												}
											}}
											onKeyDown={(e) => {
												if (e.key !== 'Enter') return
												if (nameSearch !== dataSearch.name) {
													setDateSearch({
														...dataSearch,
														name: nameSearch
													})
												}
											}}
										></TextField>
									</Grid>
								</Grid>
							</Grid>
							<Box display={'flex'} flexDirection={'column'} gap={2} mx={3}>
								{!isloading
									? items.map((item, index) => {
											const isSelected = itemSelectedMap.has(item.itemTemplateId || '')

											return (
												<Card
													key={index}
													sx={{
														padding: '5px',
														cursor: 'pointer',
														position: 'relative',
														':hover': {
															backgroundColor: customColor.tertiary,
															'& .item-selected': {
																color: (theme) => theme.palette.text.primary
															}
														},
														...(isSelected
															? {
																	backgroundColor: (theme) =>
																		theme.palette.primary[theme.palette.mode],
																	'& .item-selected': {
																		color: (theme) => theme.palette.common.white
																	}
															  }
															: null),
														...(currentItemSelected?.itemTemplateId === item.itemTemplateId
															? {
																	backgroundColor: (theme) =>
																		theme.palette.secondary[theme.palette.mode],
																	'& .item-selected': {
																		color: (theme) => theme.palette.common.white
																	}
															  }
															: null)
													}}
													onClick={() => {
														setCurrentItemSelected(item)
														if (itemSelectedMap.has(item.itemTemplateId)) {
															isAidScreen
																? formikRef.current?.setValues({
																		quantity: itemSelectedMap.get(item.itemTemplateId || '')
																			?.quantity
																  })
																: formikRef.current?.setValues({
																		initialExpirationDate: itemSelectedMap.get(
																			item.itemTemplateId || ''
																		)?.initialExpirationDate,
																		quantity: itemSelectedMap.get(item.itemTemplateId || '')
																			?.quantity
																  })
														}
													}}
												>
													<Grid container key={index} gap={2}>
														<Grid
															item
															width={75}
															height={75}
															display={'flex'}
															alignItems={'center'}
														>
															<CardMedia image={item.image} component={'img'} alt={item.name} />
														</Grid>
														<Grid
															item
															display={'flex'}
															flexDirection={'column'}
															justifyContent={'center'}
														>
															<Box display={'flex'} gap={3}>
																<Typography fontWeight={600} className='item-selected'>
																	{item.name}
																</Typography>
																{item.attributes?.map((attribute, index) => (
																	<Chip
																		className='item-selected'
																		key={index}
																		label={attribute.attributeValue}
																		color={
																			currentItemSelected?.itemTemplateId === item.itemTemplateId
																				? 'primary'
																				: 'secondary'
																		}
																		sx={{
																			borderWidth: '2px'
																		}}
																		variant='outlined'
																		size='small'
																	/>
																))}
															</Box>
															<Typography variant='body2' className='item-selected'>
																Đơn vị: {item.unit?.name}
															</Typography>
														</Grid>
													</Grid>
													{isSelected && (
														<Box
															sx={{
																position: 'absolute',
																display: 'flex',
																justifyContent: 'flex-end',
																alignItems: 'flex-end',
																width: '100%',
																top: 0,
																bottom: 0,
																left: 0
															}}
														>
															<Chip
																color='success'
																icon={<Check color='success' />}
																label='Đã chọn'
																size='small'
																sx={{
																	marginX: 5,
																	marginBottom: 5
																}}
															/>
														</Box>
													)}
												</Card>
											)
									  })
									: [0, 1, 2, 3, 4].map((item) => (
											<Card
												key={item}
												sx={{
													display: 'flex',
													gap: 3,
													padding: '5px'
												}}
											>
												<Skeleton variant='rectangular' height={75} width={75} />
												<Skeleton variant='rectangular' height={25} width={200} />
											</Card>
									  ))}
								<Pagination
									sx={{
										display: 'flex',
										justifyContent: 'center'
									}}
									count={Math.ceil(pagination.total / 10)}
									page={pagination.currentPage}
									color='primary'
									onChange={(e, page) => {
										setDateSearch({
											...dataSearch,
											page: page
										})
									}}
								/>
							</Box>
						</Box>
						<Box
							display={'flex'}
							flexDirection={'column'}
							gap={3}
							sx={{
								overflow: 'auto',
								width: '400px'
							}}
						>
							<Box display={'flex'} flexDirection={'row'} gap={3}>
								<InfoIcon color='secondary' />
								<Typography fontWeight={650} color='secondary'>
									Thông tin vật phẩm
								</Typography>
							</Box>
							<Grid container direction={'column'} justifyContent={'center'}>
								<Grid
									item
									display={'flex'}
									alignItems={'center'}
									width={100}
									height={75}
									justifyContent={'center'}
								>
									{!isFetchDetail ? (
										<CardMedia
											component={'img'}
											image={itemDetail?.image}
											sx={{
												maxHeight: '74px'
											}}
										/>
									) : (
										<Skeleton height={'74px'} variant='rectangular' width={'100px'} />
									)}
								</Grid>
								<Grid item display={'flex'} gap={1}>
									<Typography fontWeight={700}>{itemDetail?.name}</Typography>
									<Box display={'flex'} flexDirection={'row'} gap={1}>
										{itemDetail?.attributeValues?.map((item, index) => (
											<Chip
												variant='outlined'
												label={item}
												key={index}
												sx={{
													minWidth: '50px',
													borderWidth: '2px'
												}}
												color='primary'
												size='small'
											/>
										))}
									</Box>
								</Grid>
								<Grid item display={'flex'}>
									<Typography fontWeight={600} variant='body2'>
										Loại :
									</Typography>
									<Typography variant='body2'>{itemDetail?.categoryResponse?.name}</Typography>
									<Typography component={'span'} fontWeight={500} px={5}>
										-
									</Typography>
									<Typography fontWeight={600} variant='body2'>
										Đơn vị :
									</Typography>
									<Typography variant='body2'>{itemDetail?.unit}</Typography>
								</Grid>
								<Grid item display={'flex'}>
									<Typography fontWeight={600} variant='body2'>
										Ghi chú :
										<Typography component={'span'} variant='body2'>
											{itemDetail?.note}
										</Typography>
									</Typography>
								</Grid>
							</Grid>
							<Box display={'flex'} flexDirection={'row'} gap={3}>
								<VolunteerActivismOutlinedIcon color='secondary' />
								<Typography fontWeight={650} color='secondary'>
									Thông tin quyên góp
								</Typography>
							</Box>
							<Formik
								innerRef={formikRef}
								validationSchema={
									isAidScreen
										? validationInputQuantityAidRequest
										: validationInputQuantityDonatedRequest
								}
								initialValues={
									isAidScreen
										? {
												quantity: itemDetail ? 0 : charityItemSelected?.quantity ?? 0
										  }
										: {
												quantity: itemDetail ? 0 : charityItemSelected?.quantity ?? 0,
												initialExpirationDate: itemDetail
													? new Date()
													: moment(charityItemSelected?.initialExpirationDate).toDate()
										  }
								}
								onSubmit={(values) => {
									if (!itemDetail) return
									if (!itemSelectedMap.has(itemDetail?.id || '')) {
										handleSelectItemTemplate(
											true,
											new VolunteerDonateItem({
												quantity: values.quantity,
												itemTemplateId: itemDetail?.id ?? '',
												item: {
													id: itemDetail?.id,
													name: itemDetail?.name,
													image: itemDetail?.image,
													attributeValues: itemDetail?.attributeValues
												},
												initialExpirationDate: moment(values.initialExpirationDate).toISOString(),
												unit: itemDetail.unit
											})
										)
									} else {
										handleSelectItemTemplate(
											true,
											new VolunteerDonateItem({
												quantity: values.quantity,
												itemTemplateId: itemDetail?.id ?? '',
												item: {
													id: itemDetail?.id,
													attributeValues: itemDetail?.attributeValues,
													name: itemDetail?.name,
													image: itemDetail?.image
												},
												initialExpirationDate: moment(values.initialExpirationDate).toISOString(),
												unit: itemDetail.unit
											}),
											itemDetail?.id ?? ''
										)
									}
									formikRef.current?.resetForm()
								}}
							>
								{({}) => (
									<Form>
										<Grid container spacing={3} flexDirection={'column'}>
											{!isAidScreen && (
												<Grid item>
													<Field name='initialExpirationDate'>
														{({ field, meta, form: { setFieldValue } }: FieldProps) => (
															<DatePickerWrapper>
																<DatePicker
																	autoComplete='false'
																	customInput={
																		<TextField
																			{...field}
																			fullWidth
																			size='medium'
																			label='Chọn thời gian bảo quản'
																			InputProps={{
																				startAdornment: (
																					<InputAdornment position='start'>
																						<CalendarTodayIcon />
																					</InputAdornment>
																				)
																			}}
																			variant='standard'
																			error={meta.touched && !!meta.error}
																			helperText={meta.touched && meta.error ? meta.error : ''}
																		/>
																	}
																	minDate={moment().add('day', 2).toDate()}
																	selected={
																		field.value
																			? moment(field.value).toDate()
																			: moment().add('day', 2).toDate()
																	}
																	onChange={(val) => {
																		setFieldValue(field.name, val)
																	}}
																	placeholderText='Chọn thời gian'
																	dateFormat='dd/MM/yyyy'
																	withPortal
																/>
															</DatePickerWrapper>
														)}
													</Field>
												</Grid>
											)}
											<Grid item>
												<Field name='quantity'>
													{({ field, meta }: FieldProps) => (
														<TextField
															{...field}
															type='number'
															name='quantity'
															label='Số lượng hỗ trợ'
															fullWidth
															error={meta.touched && !!meta.error}
															helperText={meta.touched && !!meta.error ? meta.error : ''}
															variant='standard'
														/>
													)}
												</Field>
											</Grid>

											<Grid item display={'flex'} justifyContent={'center'} gap={3}>
												{itemTemplatesSelected?.filter(
													(template) =>
														template.itemTemplateId === currentItemSelected?.itemTemplateId
												).length > 0
													? [
															<Button
																disabled={!itemDetail}
																type='submit'
																variant='contained'
																key={'update'}
																color='secondary'
															>
																Cập nhật
															</Button>,
															<Button
																type='submit'
																variant='text'
																key={'delete'}
																onClick={() =>
																	handleSelectItemTemplate(
																		false,
																		new VolunteerDonateItem({
																			item: {
																				id: currentItemSelected?.itemTemplateId
																			}
																		})
																	)
																}
															>
																Xóa
															</Button>
													  ]
													: [
															<Button
																type='submit'
																variant='contained'
																key={'add'}
																color='secondary'
																disabled={!itemDetail}
															>
																Thêm
															</Button>
													  ]}
											</Grid>
										</Grid>
									</Form>
								)}
							</Formik>
						</Box>
					</Stack>
				}
				handleClose={handleClose}
				title={isAidScreen ? 'Chọn vật phẩm cần hỗ trợ' : 'Chọn vật phẩm quyên góp'}
				action={
					<>
						<Button onClick={handleClose}>Đóng</Button>
					</>
				}
			/>
		</>
	)
}
