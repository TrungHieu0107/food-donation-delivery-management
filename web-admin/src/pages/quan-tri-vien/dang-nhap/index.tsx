// ** React Imports
import { MouseEvent, ReactNode, useState, useEffect, ChangeEvent } from 'react'

// ** Next Imports
import Link from 'next/link'

import { useRouter } from 'next/router'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

// import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import { styled } from '@mui/material/styles'
import MuiCard, { CardProps } from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'

// ** Icons Imports
// import Google from 'mdi-material-ui/Google'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'
import BackDrop from 'src/layouts/components/loading/BackDrop'
import * as Yup from 'yup'
import { Field, Form, Formik } from 'formik'
import { KEY } from 'src/common/Keys'
import { Checkbox, FormControlLabel } from '@mui/material'
import { toast } from 'react-toastify'
import { AuthenticationModel } from 'src/models/Authentication'
import axios, { AxiosError } from 'axios'
import useSession from 'src/@core/hooks/useSession'
import { UserContextModel } from 'src/models/User'
import { CommonRepsonseModel } from 'src/models/common/CommonResponseModel'

// import Introduction from 'src/layouts/components/login/Introduction'

interface State {
  showPassword: boolean
}

interface DataLogin {
  role: string
accessToken: string
refreshToken: string
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
  password: Yup.string()
    .required('Mật khẩu là bắt buộc.')
    .matches(/^.*(?=.{8,})(?=.*\d)^(?=.*[A-Za-z]).*$/, 'Mật khẩu phả chứa ít nhất 8 kí tự gồm chữ và số.')
})

const LoginPage = () => {
  // ** State
  const [values, setValues] = useState<State>({
    showPassword: false
  })
  const { session, setSession }: any = useSession()
  const [loading, setLoading] = useState<boolean>(false)

  // const { data: session, status } = useSession()
  const [remember, setRemember] = useState<boolean>(false)
  const [initialValues] = useState<any>({
    username:
      typeof window !== 'undefined'
        ? localStorage.getItem('username') || 'branchadminquan9@gmail.com'
        : 'branchadminquan9@gmail.com',
    password: typeof window !== 'undefined' ? localStorage.getItem('password') || '1234567890a' : '1234567890a'
  })

  const handleChangeRemember = (e: ChangeEvent<HTMLInputElement>) => {
    setRemember(e.target.checked)
    if (e.target.checked) {
      localStorage.setItem(KEY.REMEMBER, 'true')
    } else {
      localStorage.setItem(KEY.REMEMBER, 'false')
    }
  }

  useEffect(() => {
    if (session?.user) {
      setLoading(false)

      // router.push('/')
    } else {
      setLoading(false)
    }
  }, [session])

  // ** Hook
  const router = useRouter()

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const handleSubmitLogin = async (payload: { username: string; password: string }) => {
    setLoading(true)

    try {
      const dataSubmit: AuthenticationModel = {
        userName: payload.username || '',
        password: payload.password || '',
        loginRole: 2
      } as AuthenticationModel

      try {
        const res: any = await axios.post(KEY.BASE_URL_API + '/authenticate', dataSubmit)

        const commonResponse = new CommonRepsonseModel<DataLogin>(res.data)
        if (res?.status === 200) {
          if (typeof window !== 'undefined') {
            const userData = new UserContextModel({
              user: {
                role: commonResponse.data?.role || ''
              },
              accessToken: commonResponse?.data?.accessToken || '',
              refreshToken: commonResponse?.data?.refreshToken || ''
            })
            console.log({ userData })

            localStorage.setItem('tu_tam_admin', JSON.stringify(userData))
            setSession(userData)
          }
          console.log('zo đây')
          router.push('/')
        } else if (res?.status === 401) {
          toast.error(commonResponse.message)
        } else {
          toast.error('Một số lỗi đã xảy ra. Vui lòng thử lại sau.')
        }
      } catch (error) {
        if ((error as AxiosError).response?.status === 401) {
          const errorData: any = (error as AxiosError).response?.data
          console.log(error)

          throw new Error(errorData?.message)
        } else {
          console.log(error)

          throw new Error('Một số lỗi đã xảy ra. Vui lòng thử lại sau.')
        }
      }
    } catch (error) {
      toast.error((error as Error).message)
    }

    setLoading(false)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        alignItems: 'center',
        paddingX: 10,
        justifyContent: 'center'
      }}
    >
      {/* <Introduction /> */}
      <Card sx={{ zIndex: 1, bgcolor: 'rgba(255,255,255, 0.75)' }}>
        <CardContent sx={{ padding: theme => `${theme.spacing(12, 9, 7)} !important` }}>
          <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={KEY.LOGO_URL} width={45} height={45} alt='logo' />
            <Typography
              variant='h6'
              sx={{
                ml: 3,
                lineHeight: 1,
                fontWeight: 600,
                textTransform: 'uppercase',
                fontSize: '1.5rem !important'
              }}
            >
              {themeConfig.templateName}
            </Typography>
          </Box>
          <Box sx={{ mb: 6 }}>
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
              onSubmit={async values => {
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
                          helperText={meta.touched && !!meta.error ? meta.error : ''}
                          fullWidth
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
                            helperText={meta.touched && !!meta.error ? meta.error : ''}
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
                      control={<Checkbox onChange={e => handleChangeRemember(e)} defaultChecked={remember} />}
                      label='Ghi nhớ đăng nhập'
                    />
                    <Link passHref href='/'>
                      <LinkStyled onClick={e => e.preventDefault()}>Quên mật khẩu?</LinkStyled>
                    </Link>
                  </Box>
                  <Button
                    fullWidth
                    size='large'
                    color='secondary'
                    variant='contained'
                    sx={{ marginBottom: 7 }}
                    type='submit'
                  >
                    Đăng nhập
                  </Button>
                  {/* <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <Typography variant='body2' sx={{ marginRight: 2 }}>
                    Chưa có tài khoản?
                  </Typography>
                  <Typography variant='body2'>
                    <Link passHref href='/quan-tri-vien/dang-ky'>
                      <LinkStyled>Tạo tài khoản</LinkStyled>
                    </Link>
                  </Typography>
                </Box> */}
                  {/* <Divider sx={{ my: 5 }}>Hoặc</Divider>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Button
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onClick={() => handleLoginWithGoogle()}
                  >
                    <Box
                      component='a'
                      onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
                      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Google sx={{ color: '#db4437' }} />
                      <Typography variant='body2' color={'primary'}>
                        Đăng nhập bằng Google
                      </Typography>
                    </Box>
                  </Button>
                </Box> */}
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
