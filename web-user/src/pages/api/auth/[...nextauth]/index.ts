import axios, { AxiosError } from 'axios'
import NextAuth, { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { Authentation } from 'src/api-client/authentication'
import { KEY } from 'src/common/Keys'
import { AuthenticationModel } from 'src/models/Authentication'
import https from 'https'

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID ?? '',
      clientSecret: process.env.GOOGLE_SECRET ?? ''
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        userName: {
          label: 'Tên đăng nhập',
          type: 'string',
          placeholder: 'jsmith@example.com'
        },
        password: { label: 'Mật khẩu', type: 'password' },
        role: {
          type: 'number',
          label: 'Vai trò'
        }
      },
      async authorize(credentials) {
        const payload: AuthenticationModel = {
          userName: credentials?.userName || '',
          password: credentials?.password || '',
          loginRole: Number.parseInt(credentials?.role || '0')
        } as AuthenticationModel

        try {
          const res: any = await axios.post(KEY.BASE_URL_API + '/authenticate', payload, {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Methods': '*',
              'Access-Control-Allow-Headers': 'Content-Type',
              'Access-Control-Allow-Credentials': 'true',
              'Access-Control-Allow-Origin': '*'
            },
            httpsAgent: new https.Agent({
              rejectUnauthorized: false // Allow self-signed certificates
            })
          })
           console.log('===================\n', res.data, payload, '\n=========================')

          return res.data.data
        } catch (error) {
          const status = (error as AxiosError).response?.status
          if (status === 401 || status === 400) {
            const errorData: any = (error as AxiosError).response?.data
            console.log(error)

            throw new Error(errorData?.message)
          } else {
            console.log(error)

            throw new Error('Một số lỗi đã xảy ra. Vui lòng thử lại sau.')
          }
        }
      }
    })
  ],
  secret: process.env.JWT_SECRET,
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        if (account.provider === 'google') {
          console.log('account: ', account, ' user: ', user, ' token: ', token)
          const res = await Authentation.googleSignIn(account.access_token || '')
          console.log('===================================',res.data);
          
          user = res.data.data
        }

        return {
          ...token,
          ...user
        }
      }

      return token
    },

    async session({ session, token }) {
      // console.log('-----------------\n', 'session: ', session, '\n', 'token: ', token, '--------------------')
      session.user.name = token.name
      session.user.image = token.image
      session.user.role = token.role as string
      session.accessToken = token.accessToken
      session.refreshToken = token.refreshToken

      // console.log('--------------------')
      // console.log('==================\n', session, '\n=======================')

      return session
    }
  }
}
export default NextAuth(authOptions)
