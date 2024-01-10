import axios, { AxiosError, AxiosResponse } from 'axios'
import { KEY } from 'src/common/Keys'
import https from 'https'
import { getSession, signOut } from 'next-auth/react'
import { toast } from 'react-toastify'
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
	async (config) => {
		const session = await getSession() // Access session data
		if (session?.accessToken) {
			config.headers.Authorization = `Bearer ${session.accessToken}`
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
	async (error) => {
		const prevRequest = error?.config
		if (error?.response?.status === 401 && !prevRequest?.sent) {
			const session = await getSession()

			prevRequest.sent = true
			try {
				const res = await axios.post(KEY.BASE_URL_API + '/refresh-access-token', {
					refreshToken: session?.refreshToken
				})

				if (session && res.data) {
					session.accessToken = res.data.data.accessToken
					prevRequest.headers['Authorization'] = `Bearer ${res.data.data.accessToken}`

					const data = await axios(prevRequest)

					return data.data
				}
			} catch (err) {
				console.log('Error rồi nè')
				toast.error(
					'Tài khoản của bạn đã hết hạn đăng nhập.\n Hệ thống sẽ tự động thoát sau 3 giây.',
					{
						onClose() {
							signOut({
								redirect: true,
								callbackUrl: '/'
							})
						},
						autoClose: 3000,
						pauseOnHover: false
					}
				)

				return null
			}
		} else if (error?.response?.status === 403) {
			signOut({
				callbackUrl: '/403'
			})
		} else if (error?.response?.status === 500) {
			// toast.error(KEY.MESSAGE.COMMON_ERROR)
			console.log(error)

			// window.location.replace('/500')
		} else {
			const x: any = (error as AxiosError).response?.data
			if (x?.errors) {
				for (const [key, value] of Object.entries(x.errors)) {
					console.log(key, value)
					const errorMessage = value as string[]
					errorMessage.map((err) => toast.error(err))
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
