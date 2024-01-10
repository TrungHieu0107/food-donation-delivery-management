import { Box, Button, Grid, IconButton, InputAdornment, MenuItem, SxProps, TextField } from '@mui/material'
import { Field, FieldProps, Form, Formik, FormikProps } from 'formik'
import {  EyeOffOutline, EyeOutline, KeyOutline } from 'mdi-material-ui'
import { Fragment, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import DialogCustom from 'src/@core/layouts/components/dialog/Dialog'
import { Authentation } from 'src/api-client/authentication'
import { UpdatePasswordModel } from 'src/models/Authentication'
import { CommonRepsonseModel } from 'src/models/common/CommonResponseModel'
import * as Yup from 'yup'

const validationSchema = Yup.object({
  oldPassword: Yup.string().required('Hãy nhập mất khẩu cũ.'),
  newPassword: Yup.string()
    .required('Hãy nhập mật khẩu mới.')
    .matches(/^.*(?=.{8,})(?=.*\d)^(?=.*[A-Za-z]).*$/, 'Mật khẩu phả chứa ít nhất 8 kí tự gồm chữ và số.'),
  confirmPassword: Yup.string()
    .required('Hãy nhập lại mất khẩu mới.')
    .oneOf([Yup.ref('newPassword')], 'Mật khẩu không trùng khớp.')
})

interface State {
  showConfirmPassword: boolean
  showNewPassword: boolean
  showOldPassword: boolean
}
export default function UpdatePasswordDialog({styles} : {styles: SxProps}) {
  const [open, setOpen] = useState<boolean>(false)
  const [value, setValue] = useState<State>({
    showConfirmPassword: false,
    showOldPassword: false,
    showNewPassword: false
  })
  const handleClose = () => {
    setOpen(false)
  }
  const handleChange = (prop: keyof State) => {
    setValue({ ...value, [prop]: !value[prop] })
  }
  const formikRef = useRef<FormikProps<any>>(null)

  const handleSubmit = (values: any) => {
    const payload = new UpdatePasswordModel(values)
    console.log(payload)

    Authentation.updatePassword(payload)
      .then(res => {
        const commonResponse = new CommonRepsonseModel<any>(res)
        toast.success(commonResponse.message)
        handleClose()
      })
      .catch(err => {
        console.log(err)
      })
      .then(() => {
        formikRef.current?.setSubmitting(false)
      })
  }

  return (
		<Fragment>
			<MenuItem
				key={1}
				sx={{ p: 0 }}
				onClick={() => {
					setOpen(true)
				}}
			>
				<Box sx={styles}>
					<KeyOutline sx={{ marginRight: 2 }} />
					Thay đổi mật khẩu
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
									oldPassword: '',
									newPassword: '',
									confirmPassword: ''
								}}
								validationSchema={validationSchema}
								onSubmit={handleSubmit}
							>
								{({}) => (
									<Form>
										<Grid container flexDirection={'column'} spacing={3}>
											<Grid item>
												<Field name='oldPassword'>
													{({ field, form, meta }: FieldProps) => (
														<TextField
															{...field}
															fullWidth
															autoComplete='off'
															label='Mật khẩu cũ'
															type={value.showOldPassword ? 'text' : 'password'}
															InputProps={{
																endAdornment: (
																	<InputAdornment position='end'>
																		<IconButton
																			edge='end'
																			onClick={() => handleChange('showOldPassword')}
																			aria-label='toggle password visibility'
																		>
																			{value.showOldPassword ? <EyeOutline /> : <EyeOffOutline />}
																		</IconButton>
																	</InputAdornment>
																)
															}}
															error={meta.touched && !!meta.error}
															helperText={meta.touched && meta.error ? meta.error : ''}
															disabled={form.isSubmitting}
														/>
													)}
												</Field>
											</Grid>
											<Grid item>
												<Field name='newPassword'>
													{({ field, form, meta }: any) => (
														<TextField
															{...field}
															fullWidth
															autoComplete='off'
															type={value.showNewPassword ? 'text' : 'password'}
															label='Mật khẩu mới'
															InputProps={{
																endAdornment: (
																	<InputAdornment position='end'>
																		<IconButton
																			edge='end'
																			onClick={() => handleChange('showNewPassword')}
																			aria-label='toggle password visibility'
																		>
																			{value.showNewPassword ? <EyeOutline /> : <EyeOffOutline />}
																		</IconButton>
																	</InputAdornment>
																)
															}}
															error={meta.touched && !!meta.error}
															helperText={meta.touched && meta.error ? meta.error : ''}
															disabled={form.isSubmitting}
														/>
													)}
												</Field>
											</Grid>
											<Grid item>
												<Field name='confirmPassword'>
													{({ field, form, meta }: any) => (
														<TextField
															{...field}
															fullWidth
															autoComplete='off'
															label='Nhập lại mật khẩu'
															type={value.showConfirmPassword ? 'text' : 'password'}
															error={meta.touched && !!meta.error}
															helperText={meta.touched && meta.error ? meta.error : ''}
															disabled={form.isSubmitting}
															InputProps={{
																endAdornment: (
																	<InputAdornment position='end'>
																		<IconButton
																			edge='end'
																			onClick={() => handleChange('showConfirmPassword')}
																			aria-label='toggle password visibility'
																		>
																			{value.showConfirmPassword ? (
																				<EyeOutline />
																			) : (
																				<EyeOffOutline />
																			)}
																		</IconButton>
																	</InputAdornment>
																)
															}}
														/>
													)}
												</Field>
											</Grid>
										</Grid>
									</Form>
								)}
							</Formik>
						)}
					</>
				}
				handleClose={handleClose}
				open={open}
				title={'Thay đổi mật khẩu'}
				action={
					<>
						<Button color='secondary'>Đóng</Button>
						<Button
							variant='contained'
							onClick={() => {
								formikRef.current?.submitForm()
								formikRef.current?.setSubmitting(true)
							}}
							disabled={formikRef.current?.isSubmitting}
						>
							Cập nhật
						</Button>
					</>
				}
			/>
		</Fragment>
	)
}
