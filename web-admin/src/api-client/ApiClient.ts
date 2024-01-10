import axios, { AxiosError, AxiosResponse } from 'axios'
import https from 'https'
import { toast } from 'react-toastify'
import { KEY } from 'src/common/Keys'
import { CommonRepsonseModel } from 'src/models/common/CommonResponseModel'

const axiosClient = axios.create({
  baseURL: KEY.BASE_URL_API,
  httpsAgent: new https.Agent({
    rejectUnauthorized: false // Allow self-signed certificates
  }),
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Origin': '*'
  }
})

axiosClient.interceptors.request.use(
  async config => {
    let userDataLocal
    if (typeof window !== 'undefined') {
      userDataLocal = localStorage.getItem('tu_tam_admin')
    }
    const userData = userDataLocal ? JSON.parse(userDataLocal) : null
    if (userData) {
      config.headers.Authorization = `Bearer ${userData?.accessToken}`
    }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data
  },
  async error => {
    const prevRequest = error?.config
    if (error?.response?.status === 401 && !prevRequest?.sent) {
      let userDataLocal: any
      if (typeof window !== 'undefined') {
        userDataLocal = localStorage.getItem('tu_tam_admin')
      }
      const userData = userDataLocal ? JSON.parse(userDataLocal) : null

      prevRequest.sent = true
      try {
        const res = await axios.post(KEY.BASE_URL_API + '/refresh-access-token', {
          refreshToken: userData?.refreshToken
        })

        if (userData?.user && res.data) {
          if (typeof window !== 'undefined') {
            const userData = {
              user: {
                role: res?.data?.role
              },
              accessToken: res?.data?.accessToken,
              refreshToken: res?.data?.refreshToken
            }
            localStorage.setItem('tu_tam_admin', JSON.stringify(userData))

            //  setSession(userData)
          }
          prevRequest.headers['Authorization'] = `Bearer ${res.data.data.accessToken}`

          const data = await axios(prevRequest)

          return data.data
        }
      } catch (err) {
        console.log('Error rồi nè')
        toast.error('Tài khoản của bạn đã hết hạn đăng nhập.\n Hệ thống sẽ tự động thoát sau 3 giây.', {
          onClose() {
            if (typeof window !== 'undefined') {
              localStorage.removeItem('tu_tam_admin')
              window.location.href = '/quan-tri-vien/dang-nhap'
            }
          },
          autoClose: 3000,
          pauseOnHover: false
        })

        return null
      }
    } else if (error?.response?.status === 403) {
      // signOut({
      //   redirect: true,
      //   callbackUrl: '/403'
      // })
      if (typeof window !== 'undefined') window.location.href = '/403'
    } else if (error?.response?.status === 500) {
      // window.location.replace('/500')
      console.log(error)

      // toast.error(KEY.MESSAGE.COMMON_ERROR)
    } else {
      const x: any = (error as AxiosError).response?.data
      if (x.errors) {
        for (const [key, value] of Object.entries(x.errors)) {
          console.log(key, value)
          const errorMessage = value as string[]
          errorMessage.map(err => toast.error(err))
        }
      } else {
        const dataResponse = new CommonRepsonseModel<any>(x)
        const message = dataResponse.message ? dataResponse.message : KEY.MESSAGE.COMMON_ERROR
        toast.error(message)
      }
    }

    return Promise.reject(error)
  }
)

export default axiosClient
