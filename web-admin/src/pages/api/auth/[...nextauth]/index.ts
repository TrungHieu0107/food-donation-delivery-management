import { AxiosError } from 'axios'
import NextAuth, { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import axiosClient from 'src/api-client/ApiClient'
import { Authentation } from 'src/api-client/authentication'
import { AuthenticationModel } from 'src/models/Authentication'

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

        console.log('===================\n', payload, '\n=========================')
        
        try {
          const res: any = await axiosClient.post('/authenticate', payload)

           console.log('===================\n', res, '\n=========================')

          return res.data
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
      }
    })
  ],
  secret: process.env.JWT_SECRET,
  pages:{
  error:"/quan-tri-vien/dang-nhap"
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        if (account.provider === 'google') {
          // console.log('account: ', account, ' user: ', user, ' token: ', token)
          const res = await Authentation.googleSignIn(account.access_token || '')
          user = res.data
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
      console.log('==================\n', session, '\n=======================')

      return session
    }
  }
}
export default NextAuth(authOptions)
