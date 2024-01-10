import { AuthenticationModel, RefreshTokenModel, UpdatePasswordModel } from 'src/models/Authentication'
import axiosClient from './ApiClient'
import { Session } from 'next-auth/core/types'
import axios from 'axios'
import { KEY } from 'src/common/Keys'

export const Authentation = {
  authenticate(authenticate: AuthenticationModel) {
    return axios.post(KEY.BASE_URL_API + '/authenticate', authenticate)
  },

  googleSignIn(googleToken: string) {
    return axios.post(KEY.BASE_URL_API + '/google-sign-in', {
      googleToken: googleToken
    })
  },

  logout() {
    return axiosClient.get('/logout')
  },

  refreshToken(session: Session | null) {
    if (session) {
      const refreshTokenModel = new RefreshTokenModel({
        oldAccessToken: (session.accessToken as string) || '',
        refreshToken: (session.refreshToken as string) || ''
      })

      console.log('refreshTokenModel: ', refreshTokenModel)

      return axiosClient.post('/refresh-access-token', refreshTokenModel)
    }

    throw new Error('Authentication')
  },

  updatePassword(payload: UpdatePasswordModel) {
    return axiosClient.put('/users/profile/password', payload)
  },

  sendEmailVerify(email: string) {
    return axiosClient.post('/users/verifycode', {
      email: email
    })
  },

  verifyEmail(email: string, verifyCode: string) {
    return axiosClient.put('/users/email/link', {
      email: email,
      verifyCode: verifyCode
    })
  }
}
