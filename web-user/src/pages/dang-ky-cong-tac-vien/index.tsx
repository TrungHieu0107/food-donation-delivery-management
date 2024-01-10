import {
	Button,
	FormControl,
	FormHelperText,
	Grid,
	InputLabel,
	MenuItem,
	Paper,
	Select,
	TextField,
	Typography,
	styled
} from '@mui/material'
import { Field, FieldProps, Form, Formik, FormikProps } from 'formik'
import moment from 'moment'
import { CollaboratorModel } from 'src/models/Collaborator'
import SelectAvatar from 'src/layouts/components/image/SelectAvatar'
import { useRouter } from 'next/router'
import * as React from 'react'
import { useRef, useState } from 'react'
import { KEY } from 'src/common/Keys'
import SelectOneImageView from 'src/layouts/components/image/SelectOneImage'
import RulesDialog from 'src/layouts/components/views/collaborator-register/RulesDialog'
import * as Yup from 'yup'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DatePicker, { registerLocale } from 'react-datepicker'
import vi from 'date-fns/locale/vi'
import { CollaboratorAPI } from 'src/api-client/Collaborator'
import { CommonRepsonseModel } from 'src/models/common/CommonResponseModel'
import { toast } from 'react-toastify'

registerLocale('vi', vi)

registerLocale('vi', vi)

const Page = styled(Paper)(({ theme }) => ({
	...theme.typography.body2,
	textAlign: 'center',
	color: theme.palette.text.secondary,
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	width: 'auto',
	gap: 2,
	padding: 20,
	minHeight: 400,
	maxWidth: '80vw',
	margin: 'auto'
}))

const validationSchema = Yup.object<CollaboratorModel>({
	fullName: Yup.string()
		.min(5, 'Tên dài ít nhất 5 kí tự.')
		.max(50, 'Tên dài tối đa 50 kí tự')
		.required('Hãy nhập tên của bạn.'),
	avatar: Yup.mixed().required('Hãy chọn hình ảnh chân dung của bạn'),
	dateOfBirth: Yup.string().required('Hãy chọn ngày sinh của bạn'),
	gender: Yup.number().required('Hãy chọn giới tính của bạn.'),
	frontOfIdCard: Yup.mixed().required('Hãy tải mặt trước của CMND/CCCD'),
	backOfIdCard: Yup.mixed().required('Hãy tải mặt sau của CMND/CCCD'),
	note: Yup.string().max(250, 'Ghi chú không được vượt quá 250 kí tự')
})

export default function CollaboratorRegisterPage() {
	const [acceptRules, setAcceptRules] = useState(false)
	const router = useRouter()
	const formikRef = useRef<FormikProps<any>>(null)

	const handleAcceptRules = (isAccept: boolean) => {
		setAcceptRules(isAccept)
	}

	const handleSubmit = (values: any) => {
		try {
			if (acceptRules) {
				CollaboratorAPI.register(new CollaboratorModel(values)).then((res) => {
					const commonResponse = new CommonRepsonseModel<any>(res)
					toast.success(commonResponse.message)
					router.push('/')
				})
			} else {
				toast.error('Bạn phải chấp nhận điều khoản trước thi thực hiện việc đăng ký.')
			}
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<Page elevation={2}>
			<Typography textAlign={'center'} fontWeight={600} variant='h6'>
				Đăng ký hỗ trợ vận chuyển
			</Typography>
			<DatePickerWrapper>
				<Formik
					innerRef={formikRef}
					validationSchema={validationSchema}
					initialValues={{
						fullName: '',
						avatar: null,
						dateOfBirth: '',
						gender: 0,
						frontOfIdCard: null,
						backOfIdCard: null,
						note: ''
					}}
					onSubmit={handleSubmit}
				>
					{({}) => (
						<Form>
							<Grid
								container
								spacing={3}
								flexDirection={'column'}
								sx={{
									mt: 3
								}}
							>
								<Grid item container>
									<Grid item lg={4} md={4} sm={5} xs={6}>
										<Field name='avatar'>
											{(fieldProps: FieldProps) => (
												<SelectAvatar formProp={fieldProps} title={'Chân dung của bạn'} />
											)}
										</Field>
									</Grid>
									<Grid
										item
										container
										xl
										lg
										md
										sm
										xs
										direction={'column'}
										spacing={3}
										justifyContent={'center'}
									>
										<Grid item>
											<Field name='fullName'>
												{({ field, meta }: FieldProps) => (
													<TextField
														{...field}
														fullWidth
														label='Tên của bạn'
														error={meta.touched && !!meta.error}
														helperText={meta.touched && !!meta.error ? meta.error : ''}
													/>
												)}
											</Field>
										</Grid>
										<Grid item container spacing={3}>
											<Grid item xl lg md sm={12} xs={12}>
												<Field name='dateOfBirth'>
													{({ field, form, meta }: FieldProps) => (
														<DatePicker
															locale={'vi'}
															selected={
																form.values.dateOfBirth
																	? moment(form.values.dateOfBirth).toDate()
																	: null
															}
															name='dateOfBirth'
															autoComplete='off'
															showYearDropdown
															showMonthDropdown
															placeholderText='Ngày-Tháng-Năm'
															minDate={moment().subtract(80, 'year').startOf('year').toDate()}
															maxDate={moment().subtract(16, 'year').endOf('year').toDate()}
															customInput={
																<TextField
																	fullWidth
																	label='Ngày sinh của bạn'
																	error={meta.touched && !!meta.error}
																	helperText={meta.touched && !!meta.error ? meta.error : ''}
																/>
															}
															onBlur={() => {
																form.setFieldTouched(field.name)
															}}
															dateFormat={'dd/MM/yyyy'}
															onChange={(date: Date | null) => {
																if (date) {
																	form.setFieldValue('dateOfBirth', date?.toString())
																} else {
																	form.setFieldValue('dateOfBirth', '')
																}
															}}
														/>
													)}
												</Field>
											</Grid>
											<Grid item xl lg md sm={12} xs={12}>
												<Field name='gender'>
													{({ field, meta }: FieldProps) => (
														<FormControl fullWidth>
															<InputLabel id='gender' error={meta.touched && !!meta.error}>
																Giới tính
															</InputLabel>
															<Select
																{...field}
																labelId='gender'
																id='demo-simple-select'
																label='Giới tính'
																placeholder='Tất cả'
																fullWidth
																error={meta.touched && !!meta.error}
																defaultValue={0}
																sx={{
																	textAlign: 'left'
																}}
															>
																<MenuItem value={0}>Nam</MenuItem>
																<MenuItem value={1}>Nữ</MenuItem>
															</Select>
															{meta.touched && !!meta.error && (
																<FormHelperText error>
																	{meta.touched && !!meta.error ? meta.error : ''}
																</FormHelperText>
															)}
														</FormControl>
													)}
												</Field>
											</Grid>
										</Grid>
									</Grid>
								</Grid>
								<Grid item container>
									<Grid item lg={6} md={6} sm={12} xs={12}>
										<Field name='frontOfIdCard'>
											{(fieldProps: FieldProps) => (
												<SelectOneImageView formProp={fieldProps} title='Mặt trước CMND/CCCD' />
											)}
										</Field>
									</Grid>
									<Grid item lg={6} md={6} sm={12} xs={12}>
										<Field name='backOfIdCard'>
											{(fieldProps: FieldProps) => (
												<SelectOneImageView formProp={fieldProps} title='Mặt sau CMND/CCCD' />
											)}
										</Field>
									</Grid>
								</Grid>
								<Grid item>
									<Field name='note'>
										{({ field, meta }: FieldProps) => (
											<TextField
												{...field}
												fullWidth
												multiline
												maxRows={5}
												minRows={3}
												label='Ghi chú'
												error={meta.touched && !!meta.error}
												helperText={meta.touched && !!meta.error ? meta.error : ''}
											/>
										)}
									</Field>
								</Grid>

								<Grid item container spacing={3} direction={'row'} justifyContent={'center'} mt={3}>
									<Grid item md={2} sm={3} xs={6}>
										<Button
											onClick={() => {
												router.push('/')
											}}
											fullWidth
											color='tertiary'
										>
											Quay lại
										</Button>
									</Grid>
									<Grid item md={2} sm={3} xs={6}>
										<Button type='submit' variant='contained' fullWidth>
											Gửi
										</Button>
									</Grid>
								</Grid>
							</Grid>
						</Form>
					)}
				</Formik>
			</DatePickerWrapper>

			<RulesDialog acceptRules={acceptRules} handleAcceptRules={handleAcceptRules} />
		</Page>
	)
}

CollaboratorRegisterPage.auth = [KEY.ROLE.CONTRIBUTOR]
