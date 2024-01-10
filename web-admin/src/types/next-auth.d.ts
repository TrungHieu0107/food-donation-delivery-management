import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      role: string | null | undefined
      name: string | null | undefined
      image: string | null | undefined | unknown
      email: string | null | undefined
      image: string | null | undefined
      phone: string | null | undefined
      collaboratorStatus: string | null | undefined
    }
    accessToken: string | null | undefined | unknown
    refreshToken: string | null | undefined | unknown
  }
}
