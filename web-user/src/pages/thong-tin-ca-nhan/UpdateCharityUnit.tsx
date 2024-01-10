import { EditOutlined } from '@mui/icons-material'
import {
	Avatar,
	Box,
	Button,
	CircularProgress,
	Divider,
	Grid,
	Skeleton,
	Stack,
	TextField,
	Typography,
	TypographyProps,
	styled
} from '@mui/material'
import { ChangeEvent, Fragment, useRef, useState } from 'react'
import DialogCustom from 'src/@core/layouts/components/dialog/Dialog'
import { CharityAPI } from 'src/api-client/Charity'
import BackDrop from 'src/layouts/components/loading/BackDrop'
import { CharityUnitModel } from 'src/models/Charity'
import { CommonRepsonseModel } from 'src/models/common/CommonResponseModel'
import { toast } from 'react-toastify'
import UpdateAvatarDialog from './UpdateAvatarDialog'
import GetLocationDialog from 'src/layouts/components/popup-get-location/PopUpGetLocation'
import { LatLngExpression, LatLngTuple } from 'leaflet'
import { UserModel } from 'src/models/User'
import * as Yup from 'yup'
import { Formik, Form, Field, FieldProps, FormikProps } from 'formik'

export interface IUpdateCharityUnitProps {
	id: string
	userId: string
}

const Label = styled(Typography)<TypographyProps>(({ theme }) => ({
	...theme.typography.h6,
	fontWeight: 600
}))

const validationSchema = Yup.object({
	email: Yup.string()
		.email('Email không khả dụng.')
		.required('Hãy chọn điền email của đơn vị tổ chức'),
	phone: Yup.string()
		.matches(/(03|05|07|08|09|01|3|5|7|8|9|1[2|6|8|9])+([0-9]{8})\b/, 'Số điện thoại không hợp lệ.')
		.required('Hãy điền số điện thoại của đơn vị tổ chức'),
	name: Yup.string().required('Hãy điền tên của đơn vị tổ chức.'),
	address: Yup.string().required('Hãy chọn địa chỉ của đơn vị tổ chức'),
	location: Yup.array().of(Yup.string()).required('Hãy chọn địa vị của đơn vị tổ chức.'),
	description: Yup.string()
})

export default function UpdateCharityUnit(props: IUpdateCharityUnitProps) {
	const [editOpen, setEditOpen] = useState<boolean>(false)
	const [isLoadingData, setIsLoadingData] = useState<boolean>(false)
	const [charity, setCharity] = useState<CharityUnitModel>()
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
	const formikRef = useRef<FormikProps<CharityUnitModel>>(null)
	const [isUpdated, setIsUpdated] = useState<boolean>(false)

	const [newCharity, setNewCharity] = useState<CharityUnitModel>(new CharityUnitModel({}))

	const handleOpen = () => {
		fetchData()
	}

	const handleClose = () => {
		setCharity(undefined)
		setEditOpen(false)
	}

	const fetchData = async () => {
		setEditOpen(true)
		setIsLoadingData(true)
		try {
			const dataUpdated = await fetchDataUpdate()
			if (dataUpdated) {
				const location = dataUpdated?.location?.toString().split(', ') || [0, 0]
				dataUpdated.location = [Number.parseFloat(location[0]), Number.parseFloat(location[1])]
				setCharity(dataUpdated)

				return
			}
			const response = await CharityAPI.getCharityUnitsById(props.id)
			const location = response.data?.location?.split(', ') || [0, 0]
			response.data.location = location
			setCharity(new CommonRepsonseModel<CharityUnitModel>(response).data)
		} catch (error) {
			console.log(error)
		} finally {
			setIsLoadingData(false)
		}
	}

	const fetchDataUpdate = async () => {
		try {
			const response = await CharityAPI.getCharityUnitProfileWithStatus(props.userId, 1)
			const dataUpdated = new CommonRepsonseModel<CharityUnitModel>(response).data
			if (dataUpdated) {
				setIsUpdated(true)

				return dataUpdated
			} else {
				return undefined
			}
		} catch (error) {
			return undefined
		}
	}

	const handleChangeAvatar = async (imageSrc: string, fileData: File) => {
		try {
			setCharity(
				new CharityUnitModel({
					...charity,
					image: imageSrc
				})
			)
			setNewCharity({
				...newCharity,
				image: fileData
			})

			return true
		} catch (error) {
			return false
		}
	}

	const handleSubmitData = async (value: CharityUnitModel) => {
		setIsSubmitting(true)
		try {
			console.log({ value, newCharity })

			const reponse = await CharityAPI.updateCharityUnit(newCharity)
			toast.success(new CommonRepsonseModel<any>(reponse).message)
			setCharity(value)
		} catch (error) {
			console.log(error)
			throw error
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleChangeValue = async (e: ChangeEvent<HTMLInputElement>) => {
		setNewCharity({
			...newCharity,
			[e.target.name]: e.target.value
		})
		formikRef.current?.setFieldValue(e.target.name, e.target.value)
	}

	const handleChangeLocation = (value: UserModel) => {
		setNewCharity({
			...newCharity,
			address: value.address,
			location: value.location || [0, 0]
		})
	}

	return (
		<Fragment>
			<Button variant='contained' startIcon={<EditOutlined />} onClick={handleOpen}>
				Chỉnh sửa thông tin
			</Button>
			<DialogCustom
				content={
					!isLoadingData && !!charity ? (
						<Formik
							innerRef={formikRef}
							initialValues={charity}
							validationSchema={validationSchema}
							onSubmit={handleSubmitData}
						>
							{({}) => (
								<Form>
									<Stack divider={<Divider />} width={600} padding={5} direction={'column'}>
										{isUpdated && (
											<Typography color={'error'}>
												<Typography component={'span'} color={'error'} fontWeight={550} sx={{
													paddingRight: '10px'
												}}>Chú ý:</Typography>Thông tin của
												bạn đã được chỉnh sửa và đang chờ duyệt
											</Typography>
										)}
										<Grid container direction={'column'}>
											<Grid item>
												<Label>Ảnh đại diện</Label>
											</Grid>
											<Grid item display={'flex'} justifyContent={'center'}>
												{!isLoadingData ? (
													<Box
														sx={{
															position: 'relative'
														}}
													>
														<Avatar
															key={'avatar'}
															alt={charity?.name}
															src={(charity?.image as string) || '/images/avatars/1.png'}
															sx={{
																width: 185,
																height: 185,
																border: (theme) => `0.25rem solid ${theme.palette.common.white}`
															}}
														/>
														<UpdateAvatarDialog
															toogleOpen={setEditOpen}
															handleChangeAvatar={handleChangeAvatar}
															avatar={(charity?.image as string) || ''}
															top={140}
															left={130}
														/>
													</Box>
												) : (
													<Skeleton
														variant='circular'
														sx={{
															width: 150,
															height: 150
														}}
													/>
												)}
											</Grid>
										</Grid>

										<Field name={`name`}>
											{({ field, meta }: FieldProps) => (
												<Grid container direction={'column'}>
													<Grid item>
														<Label>Tên</Label>
													</Grid>
													<Grid item display={'flex'} justifyContent={'center'}>
														{!isLoadingData ? (
															<TextField
																{...field}
																error={meta.touched && !!meta.error}
																helperText={meta.touched && meta.error ? meta.error : ''}
																value={newCharity.name || charity?.name || ''}
																onChange={handleChangeValue}
																inputProps={{
																	style: {
																		textAlign: 'center'
																	}
																}}
																fullWidth
															/>
														) : (
															<Skeleton
																variant='circular'
																sx={{
																	width: 150,
																	height: 150
																}}
															/>
														)}
													</Grid>
												</Grid>
											)}
										</Field>
										<Field name={`phone`}>
											{({ field, meta }: any) => (
												<Grid container direction={'column'}>
													<Grid item>
														<Label>Số điện thoại</Label>
													</Grid>
													<Grid item display={'flex'} justifyContent={'center'}>
														<TextField
															{...field}
															error={meta.touched && !!meta.error}
															helperText={meta.touched && meta.error ? meta.error : ''}
															fullWidth
															type='number'
															inputProps={{
																maxLength: 10
															}}
															onWheel={(e) => {
																e.preventDefault()
																e.currentTarget.blur()
															}}
															onScroll={(e) => {
																e.preventDefault()
																e.currentTarget.blur()
															}}
															onChange={handleChangeValue}
															InputProps={{
																startAdornment: (
																	<Typography
																		title='+84'
																		variant='body1'
																		sx={{
																			px: 3,
																			borderRight: 1,
																			borderColor: '#d5d5d6'
																		}}
																	>
																		
																		+84
																	</Typography>
																)
															}}
															sx={{
																'& .MuiOutlinedInput-root': {
																	paddingLeft: '0px !important'
																},
																'& .css-15vcgfp-MuiInputBase-input-MuiOutlinedInput-input': {
																	paddingLeft: '15px !important'
																}
															}}
														/>
													</Grid>
												</Grid>
											)}
										</Field>
										<Field name={`address`}>
											{({ field, form, meta }: FieldProps) => (
												<Grid container direction={'column'}>
													<Grid item width={'100%'}>
														<Typography variant='h6' fontWeight={600}>
															Vị trí
														</Typography>
													</Grid>
													<Grid item>
														{charity && (
															<GetLocationDialog
																buttonProps={{
																	size: 'small',
																	sx: {
																		p: 0,
																		textTransform: 'none'
																	},
																	variant: 'text'
																}}
																handleChangeAddress={handleChangeLocation}
																setLatlng={(value: LatLngExpression) => {
																	const [lat, lng] = value as LatLngTuple
																	form.setFieldValue(`location`, [lat, lng])
																}}
																fieldProps={{ field, form, meta }}
																location={formikRef.current?.values.location}
																textButton='Cập nhật'
																withoutLabel={true}
															/>
														)}
													</Grid>
												</Grid>
											)}
										</Field>
										<Grid container direction={'column'}>
											<Grid item container justifyContent={'space-between'}>
												<Grid item>
													<Label>Mô tả</Label>
												</Grid>
												<Grid item></Grid>
											</Grid>
											<Grid item display={'flex'} justifyContent={'center'}>
												{!isLoadingData ? (
													<Field name={`description`}>
														{({ field, meta }: any) => (
															<TextField
																{...field}
																multiline
																minRows={5}
																maxRows={10}
																error={meta.touched && !!meta.error}
																helperText={meta.touched && meta.error ? meta.error : ''}
																fullWidth
																onChange={handleChangeValue}
															/>
														)}
													</Field>
												) : (
													<Skeleton
														variant='circular'
														sx={{
															width: 150,
															height: 150
														}}
													/>
												)}
											</Grid>
										</Grid>
									</Stack>
								</Form>
							)}
						</Formik>
					) : (
						<Stack
						sx={{ height: '50vh', width: '100%' }}
						direction={'column'}
						justifyContent={'center'}
						alignItems={'center'}
					  >
						<CircularProgress color='info' />
						<Typography>Đang tải dữ liệu...</Typography>
					  </Stack>
					)
				}
				handleClose={handleClose}
				open={editOpen}
				title={'Cập nhật thông tin tổ chức từ thiện'}
				action={
					<Grid container justifyContent={'center'} spacing={3}>
						<Grid item>
							<Button color='secondary' onClick={handleClose}>
								Đóng
							</Button>
							<Button
								variant='contained'
								onClick={() => {
									handleSubmitData(formikRef.current?.values || new CharityUnitModel({}))
								}}
							>
								Cập nhật
							</Button>
						</Grid>
					</Grid>
				}
			/>
			<BackDrop open={isSubmitting} />
		</Fragment>
	)
}
