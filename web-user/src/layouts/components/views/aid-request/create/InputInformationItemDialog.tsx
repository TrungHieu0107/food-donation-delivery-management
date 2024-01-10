import {
	Typography,
	TextField,
	Button,
	Grid,
	styled,
	TypographyProps,
	InputAdornment
} from '@mui/material'
import * as React from 'react'
import DialogCustom from 'src/@core/layouts/components/dialog/Dialog'
import { ItemTemplateResponses } from 'src/models/Item'
import * as Yup from 'yup'
import { Field, FieldProps, Form, Formik } from 'formik'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DatePicker, { registerLocale } from 'react-datepicker'
import vi from 'date-fns/locale/vi'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import moment from 'moment'
import { ItemTemplateResponse } from 'src/models/Activity'
import { VolunteerDonateItem } from 'src/pages/tao-yeu-cau-quyen-gop'

registerLocale('vi', vi)

const validationInputQuantityAidRequest = Yup.object({
	quantity: Yup.number()
		.min(1, 'Số lượng nhỏ nhất phải là 1')
		.max(9999, 'Số lượng không được vượt quá 9999')
		.integer('Số lượng phải là số nguyên.')
		.required('Hãy nhập số lượng cần hỗ trợ')
})

const validationInputQuantityDonatedRequest = Yup.object({
	quantity: Yup.number()
		.min(1, 'Số lượng nhỏ nhất phải là 1')
		.max(9999, 'Số lượng không được vượt quá 9999')
		.integer('Số lượng phải là số nguyên.')
		.required('Hãy nhập số lượng quyên góp'),
	initialExpirationDate: Yup.date()
		.test('minDate', 'Thời gian phải sau ngày hôm nay.', (value) => {
			if (!value) return false

			return moment().startOf('date').isBefore(value)
		})
		.required('Hãy nhập thời gian bảo quản.')
})

export interface InputInformationItemDialogProps {
	dialogInputInfoOpen: boolean
	itemTemplateSelected?: ItemTemplateResponses | ItemTemplateResponse
	setDialogInputInfoOpen: () => void
	handleSelectItemTemplate: (isSelect: boolean, value: VolunteerDonateItem, id?: string) => void
	isAidScreen: boolean
	charityItemSelected?: VolunteerDonateItem
}
const Label = styled(Typography)<TypographyProps>(() => ({
	textAlign: 'left',
	fontWeight: 550,
	minWidth: 150
}))

export default function InputInformationItemDialog({
	dialogInputInfoOpen,
	itemTemplateSelected,
	setDialogInputInfoOpen,
	handleSelectItemTemplate,
	isAidScreen,
	charityItemSelected
}: InputInformationItemDialogProps) {
	const [nameItem, setNameItem] = React.useState<string>('')

	React.useEffect(() => {
		if (itemTemplateSelected) {
			let name: string = itemTemplateSelected.name ?? ''

			const data: any = itemTemplateSelected
			if (data?.attributeValues && data?.attributeValues?.length > 0) {
				name += `(${data.attributeValues.join(', ')})`
			} else if (data.attributes) {
				name += `(${data.attributes
					?.map((item: { attributeValue: { name: string } }) => item?.attributeValue?.name)
					.join(', ')})`
			}
			setNameItem(name)
		}
	}, [itemTemplateSelected])

	return (
		<>
			<DialogCustom
				content={
					dialogInputInfoOpen &&
					(itemTemplateSelected || charityItemSelected) && (
						<>
							<Grid container flexDirection={'row'} spacing={3}>
								<Grid item>
									<Label>Thông tin chi thiết</Label>
								</Grid>
								<Grid item>
									<Typography variant='body1' maxWidth={200}>
										{nameItem}
									</Typography>
								</Grid>
							</Grid>

							<Formik
								validationSchema={
									isAidScreen
										? validationInputQuantityAidRequest
										: validationInputQuantityDonatedRequest
								}
								initialValues={
									isAidScreen
										? {
												quantity: itemTemplateSelected ? 0 : charityItemSelected?.quantity ?? 0
										  }
										: {
												quantity: itemTemplateSelected ? 0 : charityItemSelected?.quantity ?? 0,
												initialExpirationDate: itemTemplateSelected
													? new Date()
													: moment(charityItemSelected?.initialExpirationDate).toDate()
										  }
								}
								onSubmit={(values) => {
									if (itemTemplateSelected) {
										handleSelectItemTemplate(
											true,
											new VolunteerDonateItem({
												quantity: values.quantity,
												itemTemplateId: itemTemplateSelected?.id ?? '',
												item: itemTemplateSelected,
												initialExpirationDate: moment(values.initialExpirationDate).toISOString(),
												unit: itemTemplateSelected.unit
											})
										)
									} else {
										handleSelectItemTemplate(
											true,
											new VolunteerDonateItem({
												quantity: values.quantity,
												itemTemplateId: charityItemSelected?.item?.id ?? '',
												item: charityItemSelected?.item,
												initialExpirationDate: moment(values.initialExpirationDate).toISOString(),
												unit: charityItemSelected?.unit
											}),
											charityItemSelected?.item?.id ?? ''
										)
									}

									setDialogInputInfoOpen()
								}}
							>
								{({}) => (
									<Form>
										<Grid
											container
											spacing={3}
											flexDirection={'column'}
											sx={{
												maxWidth: 400,
												mt: 3
											}}
										>
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
																			error={meta.touched && !!meta.error}
																			helperText={meta.touched && meta.error ? meta.error : ''}
																		/>
																	}
																	minDate={moment().toDate()}
																	selected={field.value || null}
																	onChange={(val) => {
																		setFieldValue(field.name, val)
																	}}
																	placeholderText='Chọn thời gian'
																	dateFormat='dd/MM/yyyy'
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
														/>
													)}
												</Field>
											</Grid>

											<Grid item display={'flex'} justifyContent={'center'}>
												<Button type='submit' variant='contained'>
													Tạo
												</Button>
											</Grid>
										</Grid>
									</Form>
								)}
							</Formik>
						</>
					)
				}
				handleClose={() => {
					setDialogInputInfoOpen()
				}}
				open={dialogInputInfoOpen}
				title={isAidScreen ? 'Nhập thông tin cẩn hỗ trợ' : 'Nhập thông tin quyên góp'}
				action={undefined}
				width={400}
				height={350}
			/>
		</>
	)
}
