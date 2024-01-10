// ** React Imports
import { MouseEvent, ReactNode, useState, useEffect, ChangeEvent } from 'react'

// ** Next Imports
import Link from 'next/link'

import { useRouter } from 'next/router'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import { styled } from '@mui/material/styles'
import MuiCard, { CardProps } from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'

// ** Icons Imports
import Google from 'mdi-material-ui/Google'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'
import Introduction from 'src/layouts/components/login/Introduction'
import { signIn, useSession } from 'next-auth/react'
import * as Yup from 'yup'
import { Field, Form, Formik } from 'formik'
import { useToasts } from 'react-toast-notifications'
import { KEY } from 'src/common/Keys'
import BackDrop from 'src/layouts/components/loading/BackDrop'
import { Checkbox, FormControlLabel } from '@mui/material'

interface State {
  showPassword: boolean
}

// ** Styled Components
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const LinkStyled = styled('a')(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const validationSchema = Yup.object({
  username: Yup.string().required('Tên đăng nhập là bắt buộc.'),
  password: Yup.string().required('Mật khẩu là bắt buộc.')
})

const LoginPage = () => {
  // ** State
  const [values, setValues] = useState<State>({
    showPassword: false
  })
  const [loading, setLoading] = useState<boolean>(false)
  const { data: session, status } = useSession()
  const [remember, setRemember] = useState<boolean>(false)
  const [initialValues] = useState<any>({
    username: typeof window !== 'undefined' ? localStorage.getItem('username') || '' : '',
    password: typeof window !== 'undefined' ?  localStorage.getItem('password') || '' : ''
  })

  useEffect(() => {
    if (status === 'authenticated') {
      setLoading(false)
      router.push('/')
    } else if (status === 'loading') {
      console.log('ở nà: ', status, session)
      setLoading(true)
    } else {
      setLoading(false)
    }
  }, [session, status])

  // ** Hook
  const router = useRouter()
  const addToast = useToasts()

  const handleChangeRemember = (e: ChangeEvent<HTMLInputElement>) => {
    setRemember(e.target.checked)
    if (e.target.checked) {
      localStorage.setItem(KEY.REMEMBER, 'true')
    } else {
      localStorage.setItem(KEY.REMEMBER, 'false')
    }
  }

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const handleSubmitLogin = async (payload: { username: string; password: string }) => {
    setLoading(true)

    localStorage.setItem('username', remember ? payload.username : '')
    localStorage.setItem('password', remember ? payload.password : '')
    console.log(remember)
    

    try {
      const res = await signIn('credentials', {
        redirect: false,
        userName: payload.username,
        password: payload.password,
        role: 0,
        callbackUrl: `/`
      })

      if (res?.status === 200) {
        // router.push('/')
      } else if (res?.status === 401) {
        addToast.addToast(res.error, {
          appearance: 'error'
        })
      } else {
        addToast.addToast(res?.error, {
          appearance: 'error'
        })
      }
    } catch (error) {
      console.error(error)
    }

    setLoading(false)
  }

  const handleLoginWithGoogle = async () => {
    setLoading(true)
    try {
      await signIn('google', {
        callbackUrl: '/'
      })
    } catch (error) {
      console.error(error)
    }

    setLoading(false)
  }

  return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
				alignContent: 'center',
				paddingX: 10,
				justifyContent: 'space-between',
				flex: 3
			}}
		>
			<Introduction />
			<Card sx={{ zIndex: 1, bgcolor: 'rgba(255,255,255, 0.65)' }}>
				<CardContent sx={{ padding: (theme) => `${theme.spacing(12, 9, 7)} !important` }}>
						<Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
							<img src={KEY.LOGO_WITH_NAME_URL} height={50} alt='logo' />
						</Box>
					<Box sx={{ mb: 1 }}>
						<Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
							Chào mừng đến với {themeConfig.templateName}! 👋🏻
						</Typography>
						<Typography variant='body2' align='center'>
							Vui lòng đăng nhập vào tài khoản của bạn và bắt đầu hành trình nhân ái
						</Typography>
					</Box>

					{typeof window !== 'undefined' && (
						<Formik
							initialValues={initialValues}
							validationSchema={validationSchema}
							onSubmit={async (values) => {
								handleSubmitLogin(values)
							}}
						>
							{({}) => (
								<Form>
									<Box
										sx={{
											display: 'flex',
											gap: 2,
											flexDirection: 'column'
										}}
									>
										<Field name='username'>
											{({ field, meta }: any) => (
												<TextField
													{...field}
													label='Tên đăng nhập'
													error={meta.touched && !!meta.error}
													helperText={meta.touched && meta.error ? meta.error : ''}
													fullWidth
													placeholder='Email hoặc số điện thoại'
												/>
											)}
										</Field>
										<Field name='password'>
											{({ field, meta }: any) => (
												<FormControl fullWidth>
													<TextField
														{...field}
														label='Mật khẩu'
														id='auth-login-password'
														type={values.showPassword ? 'text' : 'password'}
														error={meta.touched && !!meta.error}
														helperText={meta.touched && meta.error ? meta.error : ''}
														InputProps={{
															endAdornment: (
																<InputAdornment position='end'>
																	<IconButton
																		edge='end'
																		onClick={handleClickShowPassword}
																		onMouseDown={handleMouseDownPassword}
																		aria-label='toggle password visibility'
																	>
																		{values.showPassword ? <EyeOutline /> : <EyeOffOutline />}
																	</IconButton>
																</InputAdornment>
															)
														}}
													/>
												</FormControl>
											)}
										</Field>
									</Box>
									<Box
										sx={{
											mb: 4,
											display: 'flex',
											alignItems: 'center',
											flexWrap: 'wrap',
											justifyContent: 'space-between'
										}}
									>
										<FormControlLabel
											control={
												<Checkbox
													onChange={(e) => handleChangeRemember(e)}
													defaultChecked={remember}
												/>
											}
											label='Ghi nhớ đăng nhập'
										/>
										<Link passHref href='/'>
											<LinkStyled onClick={(e) => e.preventDefault()}>Quên mật khẩu?</LinkStyled>
										</Link>
									</Box>
									<Button
										fullWidth
										size='large'
										variant='contained'
										sx={{ marginBottom: 1 }}
										type='submit'
									>
										Đăng nhập
									</Button>
									<Button
										fullWidth
										size='large'
										variant='contained'
										sx={{ marginBottom: 7 }}
										onClick={() => {
											router.push('/')
										}}
										color='secondary'
									>
										Quay lại trang chủ
									</Button>

									<Box
										sx={{
											display: 'flex',
											alignItems: 'center',
											flexWrap: 'wrap',
											justifyContent: 'center'
										}}
									>
										<Typography variant='body2' sx={{ marginRight: 2 }}>
											Chưa có tài khoản?
										</Typography>
										<Typography variant='body2'>
											<Link passHref href='/tinh-nguyen-vien/dang-ky'>
												<LinkStyled>Tạo tài khoản</LinkStyled>
											</Link>
										</Typography>
									</Box>
									<Box
										sx={{
											display: 'flex',
											alignItems: 'center',
											flexWrap: 'wrap',
											justifyContent: 'center'
										}}
									>
										<Typography variant='body2' sx={{ marginRight: 2 }}>
											Bạn là tổ chức từ thiện?
										</Typography>
										<Typography variant='body2'>
											<Link passHref href='/to-chuc-tu-thien/dang-nhap'>
												<LinkStyled>Đăng nhập tổ chức từ thiện</LinkStyled>
											</Link>
										</Typography>
									</Box>
									<Divider sx={{ my: 5 }}>Hoặc</Divider>
									<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
										<Button
											sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
											onClick={() => handleLoginWithGoogle()}
										>
											<Box
												component='a'
												onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
												sx={{
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													gap: 3
												}}
											>
												<Google sx={{ color: '#db4437' }} />
												<Typography variant='body2' color={'primary'}>
													Đăng nhập bằng Google
												</Typography>
											</Box>
										</Button>
									</Box>
								</Form>
							)}
						</Formik>
					)}
				</CardContent>
			</Card>
			<BackDrop open={loading} />
		</Box>
	)
}

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default LoginPage
