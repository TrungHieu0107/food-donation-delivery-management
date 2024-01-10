import { Box, Button, Divider, Grid, MenuItem, SxProps, TextField, Typography } from '@mui/material'
import { Field, FieldProps, Form, Formik, FormikProps } from 'formik'
import { EmailEditOutline } from 'mdi-material-ui'
import { useRef, useState } from 'react'
import { toast } from 'react-toastify'
import DialogCustom from 'src/@core/layouts/components/dialog/Dialog'
import { Authentation } from 'src/api-client/authentication'
import { CommonRepsonseModel } from 'src/models/common/CommonResponseModel'
import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
	email: Yup.string().email('Định dạng không hợp lệ.').required('Hãy nhập email sẽ liên kết.')
})

const validationCodeSchema = Yup.object().shape({
	verifyCode: Yup.string().required('Hãy nhập mã xác nhận.')
})

export default function LinkEmailDialog({ styles }: { styles: SxProps }) {
	const [open, setOpen] = useState<boolean>(false)
	const [isSend, setIsSend] = useState<boolean>(false)
	const [email, setEmail] = useState<string>()
	const formikRef = useRef<FormikProps<any>>(null)
	const formInputVerifyCodeRef = useRef<FormikProps<any>>(null)

	const handleClose = () => {
		setOpen(false)
	}

	const handleSubmitSendEmail = (values: any) => {
		setEmail(values.email)
		Authentation.sendEmailVerify(values.email ?? '')
			.then(() => {
				setIsSend(true)
			})
			.catch((err) => {
				console.log(err)
				setEmail(undefined)
			})
	}

	const handleSendVerifyCode = (values: any) => {
		Authentation.verifyEmail(email ?? '', values.verifyCode ?? '')
			.then((res) => {
				const commonResponse = new CommonRepsonseModel<any>(res)
				toast.success(commonResponse.message)
				handleClose()
			})
			.catch((err) => {
				console.log(err)
				formInputVerifyCodeRef.current?.setSubmitting(false)
			})
	}

	return (
		<>
			<MenuItem
				key={1}
				sx={{ p: 0 }}
				onClick={() => {
					setOpen(true)
				}}
			>
				<Box sx={styles}>
					<EmailEditOutline sx={{ marginRight: 2 }} />
					Liên kết Email
				</Box>
			</MenuItem>
			<DialogCustom
				width={500}										
				content={
					<>
						{open && (
							<Formik
								innerRef={formikRef}															
								initialValues={{
									email: ''
								}}
								validationSchema={validationSchema}
								onSubmit={handleSubmitSendEmail}
							>
								{({}) => (
									<Form>
										<Grid container flexDirection={'column'} spacing={3} padding={5}>
											<Grid item>
												<Field name='email'>
													{({ field, form, meta }: FieldProps) => (
														<TextField
															{...field}
															fullWidth
															autoComplete='off'
															label='Email liên kết'
															error={meta.touched && !!meta.error}
															helperText={meta.touched && meta.error ? meta.error : ''}
															disabled={form.isSubmitting}
														/>
													)}
												</Field>
											</Grid>
											<Grid item>
												<Button
													variant='contained'
													onClick={() => {
														formikRef.current?.submitForm()
														formikRef.current?.setSubmitting(true)
													}}
													disabled={formikRef.current?.isSubmitting}
												>
													Gửi email
												</Button>
											</Grid>
										</Grid>
									</Form>
								)}
							</Formik>
						)}
						{isSend ? (
							<>
								<Divider />
								<Grid container direction={'column'} padding={5}>
									<Grid item>
										<Typography fontWeight={500} variant='body1'>
											Nhập mã xác nhận
										</Typography>
									</Grid>
									<Grid item>
										<Formik
											innerRef={formInputVerifyCodeRef}
											initialValues={{
												verifyCode: ''
											}}
											validationSchema={validationCodeSchema}
											onSubmit={handleSendVerifyCode}
										>
											{({}) => (
												<Form>
													<Field name='verifyCode'>
														{({ field, form, meta }: FieldProps) => (
															<TextField
																{...field}
																fullWidth
																autoComplete='off'
																label='Mã xác nhận'
																error={meta.touched && !!meta.error}
																helperText={meta.touched && meta.error ? meta.error : ''}
																disabled={form.isSubmitting}
															/>
														)}
													</Field>
												</Form>
											)}
										</Formik>
									</Grid>
								</Grid>
							</>
						) : null}
					</>
				}
				handleClose={handleClose}
				open={open}
				title={'Thay đổi mật khẩu'}
				action={
					<>
						<Button
							color='secondary'
							onClick={() => {
								handleClose()
							}}
						>
							Đóng
						</Button>
						<Button
							variant='contained'
							onClick={() => {
								formInputVerifyCodeRef.current?.submitForm()
								formInputVerifyCodeRef.current?.setSubmitting(true)
							}}
							disabled={formInputVerifyCodeRef.current?.isSubmitting}
						>
							Cập nhật
						</Button>
					</>
				}
			/>
		</>
	)
}
