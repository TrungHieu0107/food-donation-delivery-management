// ** React Imports
import { ReactNode, useState, useEffect } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** MUI Components
import { Box, Button, TextField, Typography, IconButton, CardContent, FormControl, Grid, CardActions, CardHeader } from '@mui/material'
import { styled } from '@mui/material/styles'
import MuiCard, { CardProps } from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import StepContent from '@mui/material/StepContent'

// ** Icons Imports
import { EyeOutline, EyeOffOutline, Account } from 'mdi-material-ui'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { useSession } from 'next-auth/react'
import BackDrop from 'src/layouts/components/loading/BackDrop'

// ** Formik and Yup Imports
import * as Yup from 'yup'
import { Field, Form, Formik } from 'formik'

// ** Model Imports
import { FreeVolunteerRegistrationModel } from 'src/models/UserRegisterModel'
import { CommonRepsonseModel } from 'src/models/common/CommonResponseModel'

// ** API Client Import
import { Registration } from 'src/api-client/userRegistration'

// ** Toasts Import
import { useToasts } from 'react-toast-notifications'

// ** Axios Import
import { AxiosError } from 'axios'

// ** Utils Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

// ** Constants Import
import { KEY } from 'src/common/Keys'

interface State {
	showPassword: boolean
	showConfirmPassword: boolean
}

// ** Styled Components
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
	[theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const validateAccount = Yup.object({
	phone: Yup.string()
		.matches(/(03|05|07|08|09|01|3|5|7|8|9|1[2|6|8|9])+([0-9]{8})\b/, 'Số điện thoại không hợp lệ.')
		.required('Số điện thoại là bắt buộc.'),
	fullName: Yup.string().test('len', 'Tên phải dài từ 8 đến 60 chữ cái.', (val) => {
		if (val && val.length >= 8 && val.length <= 60) return true

		return false
	})
})

const validationPassword = Yup.object().shape({
	password: Yup.string()
		.required('Mật khẩu là bắt buộc.')
		.matches(
			/^.*(?=.{8,})(?=.*\d)^(?=.*[A-Za-z]).*$/,
			'Mật khẩu phả chứa ít nhất 8 kí tự gồm chữ và số.'
		),
	confirmPassword: Yup.string()
		.required('Hảy nhập lại mất khẩu là bắt buộc')
		.oneOf([Yup.ref('password')], 'Mật khẩu không trùng khớp.')
})

const validationVerifyCode = Yup.object().shape({
	verifyCode: Yup.string()
		.length(5, 'Mã xác nhận phải dài 5 kí tự')
		.required('Hãy nhập mã xác nhận.')
})

interface UsernameEnteringStepProps {
	handleCheckUsername: (values: { phone: string; fullName: string }) => void
}

const UsernameEnteringStep = (props: UsernameEnteringStepProps) => {
	const { handleCheckUsername } = props

	return (
		<Formik
			initialValues={{
				phone: '',
				fullName: ''
			}}
			validationSchema={validateAccount}
			onSubmit={async (values) => {
				handleCheckUsername(values)
			}}
		>
			{({}) => (
				<Form>
					<StepContent>
						<Field name='phone'>
							{({ field, meta }: any) => (
								<TextField
									{...field}
									label='Số điện thoại'
									error={meta.touched && !!meta.error}
									helperText={meta.touched && meta.error ? meta.error : ''}
									fullWidth
									type='number'
									inputProps={{
										maxLength: 10
									}}
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
							)}
						</Field>
						<Field name='fullName'>
							{({ field, meta }: any) => (
								<TextField
									{...field}
									label='Tên của bạn'
									error={meta.touched && !!meta.error}
									helperText={meta.touched && meta.error ? meta.error : ''}
									fullWidth
									type='string'
									InputProps={{
										startAdornment: (
											<Box
												sx={{
													px: 3,
													borderRight: 1,
													borderColor: '#d5d5d6'
												}}
											>
												<Account />
											</Box>
										)
									}}
									sx={{
										mt: 3,
										'& .MuiOutlinedInput-root': {
											paddingLeft: '0px !important'
										},
										'& .css-15vcgfp-MuiInputBase-input-MuiOutlinedInput-input': {
											paddingLeft: '15px !important'
										}
									}}
								/>
							)}
						</Field>
						<Box sx={{ mb: 2 }}>
							<Button variant='contained' type='submit' sx={{ mt: 1, mr: 1 }}>
								Tiếp tục
							</Button>
						</Box>
					</StepContent>
				</Form>
			)}
		</Formik>
	)
}

interface VerifyCodeEnterringStepProps {
	handleSubmitVerifyCode: (value: string) => void
	handleBack: () => void
	handleResendOTP: () => void
}

const VerifyCodeEnterringStep = (props: VerifyCodeEnterringStepProps) => {
	const { handleSubmitVerifyCode, handleBack, handleResendOTP } = props

	return (
		<Formik
			initialValues={{
				verifyCode: ''
			}}
			validationSchema={validationVerifyCode}
			onSubmit={async (values) => {
				handleSubmitVerifyCode(values.verifyCode)
			}}
		>
			{({}) => (
				<Form>
					<StepContent>
						<Field name='verifyCode'>
							{({ field, meta }: any) => (
								<Grid container flexDirection={'row'} alignContent={'center'} alignItems={'center'}>
									<Grid item>
										<TextField
											{...field}
											label='Mã xác nhận'
											error={meta.touched && !!meta.error}
											helperText={meta.touched && meta.error ? meta.error : ''}
											fullWidth
										/>
									</Grid>
									<Grid item>
										<Typography variant='caption'> Không nhận được OTP.</Typography>
										<Typography
											variant='caption'
											fontWeight={600}
											onClick={handleResendOTP}
											color={KEY.COLOR.PRIMARY}
											sx={{
												ml: 2,
												':hover': {
													cursor: 'pointer'
												}
											}}
										>
											Gửi lại
										</Typography>
									</Grid>
								</Grid>
							)}
						</Field>
						<Box sx={{ mb: 2 }}>
							<Button variant='contained' type='submit' sx={{ mt: 1, mr: 1 }}>
								Tiếp tục
							</Button>
							<Button variant='text' onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
								Trờ về
							</Button>
						</Box>
					</StepContent>
				</Form>
			)}
		</Formik>
	)
}

interface PasswordEnterringStepProps {
	handleSubmitPassword: (value: { password: string; confirmPassword: string }) => void
	handleBack: () => void
}

const PasswordEnterringStep = (props: PasswordEnterringStepProps) => {
	const { handleSubmitPassword, handleBack } = props
	const [value, setValue] = useState<State>({
		showConfirmPassword: false,
		showPassword: false
	})

	const handleChange = (prop: keyof State) => {
		setValue({ ...value, [prop]: !value[prop] })
	}

	return (
		<Formik
			initialValues={{
				password: '',
				confirmPassword: ''
			}}
			validationSchema={validationPassword}
			onSubmit={async (values) => {
				handleSubmitPassword(values)
			}}
		>
			{({}) => (
				<Form>
					<StepContent>
						<Box
							sx={{
								display: 'flex',
								gap: 3,
								flexDirection: 'column'
							}}
						>
							<Field name='password'>
								{({ field, meta }: any) => (
									<FormControl fullWidth>
										<TextField
											{...field}
											label='Mật khẩu'
											id='auth-login-password'
											type={value.showPassword ? 'text' : 'password'}
											error={meta.touched && !!meta.error}
											helperText={meta.touched && meta.error ? meta.error : ''}
											InputProps={{
												endAdornment: (
													<InputAdornment position='end'>
														<IconButton
															edge='end'
															onClick={() => handleChange('showPassword')}
															aria-label='toggle password visibility'
														>
															{value.showPassword ? <EyeOutline /> : <EyeOffOutline />}
														</IconButton>
													</InputAdornment>
												)
											}}
										/>
									</FormControl>
								)}
							</Field>
							<Field name='confirmPassword'>
								{({ field, meta }: any) => (
									<FormControl fullWidth>
										<TextField
											{...field}
											label='Nhập lại mật khẩu'
											id='auth-login-password'
											type={value.showConfirmPassword ? 'text' : 'password'}
											error={meta.touched && !!meta.error}
											helperText={meta.touched && meta.error ? meta.error : ''}
											InputProps={{
												endAdornment: (
													<InputAdornment position='end'>
														<IconButton
															edge='end'
															onClick={() => handleChange('showConfirmPassword')}
															aria-label='toggle password visibility'
														>
															{value.showConfirmPassword ? <EyeOutline /> : <EyeOffOutline />}
														</IconButton>
													</InputAdornment>
												)
											}}
										/>
									</FormControl>
								)}
							</Field>
						</Box>
						<Box sx={{ mb: 2 }}>
							<Button variant='contained' type='submit' sx={{ mt: 1, mr: 1 }}>
								Tiếp tục
							</Button>
							<Button variant='text' onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
								Trở về
							</Button>
						</Box>
					</StepContent>
				</Form>
			)}
		</Formik>
	)
}

const RegisterPage = () => {
	// ** State
	const [data, setData] = useState<FreeVolunteerRegistrationModel>(
		new FreeVolunteerRegistrationModel({})
	)

	const [loading, setLoading] = useState<boolean>(false)
	const [activeStep, setActiveStep] = useState(0)

	const { data: session, status } = useSession()

	useEffect(() => {
		if (status === 'authenticated') {
			setLoading(false)
		} else if (status === 'loading') {
			console.log(status, session)
			setLoading(true)
		} else {
			setLoading(false)
		}
	}, [session, status])

	// ** Hook
	const router = useRouter()
	const toast = useToasts()

	const handleNext = () => {
		setActiveStep((prevActiveStep) => prevActiveStep + 1)
	}

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1)
	}

	const handleCheckUsername = (values: { phone: string; fullName: string }) => {
		console.log(values.phone, typeof values.phone === 'string')

		setLoading(true)
		const newData: FreeVolunteerRegistrationModel = data

		newData.phone = values.phone
		newData.fullName = values.fullName

		Registration.register({
			phone: values.phone.toString(),
			fullName: values.fullName.toString()
		})
			.then((res) => {
				console.log(res)
				const dataResponse = new CommonRepsonseModel(res)
				handleNext()
				setLoading(false)
				toast.addToast(dataResponse.message, {
					appearance: 'success'
				})
			})
			.catch((err) => {
				const dataResponse = new CommonRepsonseModel<any>((err as AxiosError).response?.data as any)
				const message = dataResponse.message ? dataResponse.message : KEY.MESSAGE.COMMON_ERROR

				toast.addToast(message, {
					appearance: 'error'
				})

				setLoading(false)
				console.error(err)
			})
		setData(newData)
	}

	const handleSubmitVerifyCode = (otp: string) => {
		console.log('otp', otp)
		const newData = data
		newData.otp = otp
		setData(newData)

		Registration.verifyOTP({
			otp: otp,
			phone: data.phone.toString()
		})
			.then((res) => {
				console.log(res)
				const dataResponse = new CommonRepsonseModel(res)
				newData.verifyCode = dataResponse.data
				handleNext()
				toast.addToast(dataResponse.message, {
					appearance: 'success'
				})
			})
			.catch((err) => {
				const dataResponse = new CommonRepsonseModel<any>((err as AxiosError).response?.data as any)
				const message = dataResponse.message ? dataResponse.message : KEY.MESSAGE.COMMON_ERROR

				toast.addToast(message, {
					appearance: 'error'
				})

				setLoading(false)
				console.error(err)
			})
	}

	const handleSubmitPassword = (value: { password: string; confirmPassword: string }) => {
		const newData: FreeVolunteerRegistrationModel = data
		newData.password = value.password

		console.log(newData)

		Registration.completePassword({
			password: value.password,
			verifyCode: 'dd32199a-3be9-4fd5-acc6-277e65183756'
		})
			.then((res) => {
				console.log(res)
				const dataResponse = new CommonRepsonseModel(res)
				toast.addToast(dataResponse.message, {
					appearance: 'success'
				})
				router.push('/tinh-nguyen-vien/dang-nhap')
			})
			.catch((err) => {
				const dataResponse = new CommonRepsonseModel<any>((err as AxiosError).response?.data as any)
				const message = dataResponse.message ? dataResponse.message : KEY.MESSAGE.COMMON_ERROR

				toast.addToast(message, {
					appearance: 'error'
				})

				setLoading(false)
				console.error(err)
			})
	}

	const handleResendOTP = () => {
		Registration.reSendOTP({ phone: data.phone })
			.then((res) => {
				console.log(res)
				const dataResponse = new CommonRepsonseModel(res)
				toast.addToast(dataResponse.message, {
					appearance: 'success'
				})
				router.push('/tinh-nguyen-vien/dang-nhap')
			})
			.catch((err) => {
				const dataResponse = new CommonRepsonseModel<any>((err as AxiosError).response?.data as any)
				dataResponse?.message &&
					toast.addToast(dataResponse.message, {
						appearance: 'error'
					})
				setLoading(false)
				console.error(err)
			})
	}

	return (
		<Box
			sx={{
				backgroundColor: (theme) => hexToRGBA(theme.palette.common.white, 0),
				border: 'none',
				boxShadow: 'none',
        display: 'flex',
        justifyContent: 'center',
        height: '100vh',
        alignItems: 'center',
			}}
		>
			<Card
				sx={{
					p: 10,
					height: 'fit-content',
					width: '500px !important'
				}}
			>
				<CardHeader
					title='Đăng ký tài khoản người hỗ trợ'
					component='h4'
					sx={{
						m: 0
					}}
				></CardHeader>
				<CardContent>
					<Stepper activeStep={activeStep} orientation='vertical'>
						{/* Tạo tên đăng nhập */}
						<Step>
							<StepLabel>Tạo tên đăng nhập</StepLabel>
							<UsernameEnteringStep handleCheckUsername={handleCheckUsername} />
						</Step>

						{/* Nhập mã xác nhận */}
						<Step>
							<StepLabel>Nhập mã xác nhận</StepLabel>
							<VerifyCodeEnterringStep
								handleBack={handleBack}
								handleSubmitVerifyCode={handleSubmitVerifyCode}
								handleResendOTP={handleResendOTP}
							/>
						</Step>
						{/* Nhập mã xác nhận */}

						<Step>
							<StepLabel>Tạo mật khẩu</StepLabel>
							<PasswordEnterringStep
								handleBack={handleBack}
								handleSubmitPassword={handleSubmitPassword}
							/>
						</Step>
					</Stepper>
				</CardContent>
				<CardActions
					sx={{
						display: 'flex',
						width: '100%',
						justifyContent: 'center'
					}}
				>
					<Button
						variant='contained'
						onClick={() => {
							router.push('/tinh-nguyen-vien/dang-nhap')
						}}
					>
						Quay lại đăng nhập
					</Button>
				</CardActions>
				<BackDrop open={loading} />
			</Card>
		</Box>
	)
}

RegisterPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default RegisterPage
