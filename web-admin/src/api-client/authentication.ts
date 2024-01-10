import { AuthenticationModel } from 'src/models/Authentication'
import axiosClient from './ApiClient'
import { Session } from 'next-auth/core/types'

export const Authentation = {
  authenticate(authenticate: AuthenticationModel) {
    return axiosClient.post('/authenticate', authenticate)
  },

  googleSignIn(googleToken: string) {
    return axiosClient.post('/google-sign-in', {
      googleToken: googleToken
    })
  },

  logout() {
    return axiosClient.get('/logout')
  },

  refreshToken(session: Session | null) {
    if (session) {
      console.log('refreshTokenModel: ', session.refreshToken)

      return axiosClient.post('/refresh-access-token', {
        refreshToken: session.refreshToken as string
      })
    }

    throw new Error('Authentication')
  }
}
