export class AuthenticationModel {
  userName: string
  password: string
  loginRole: 0 | 1 | 2 | 3

  constructor(value: Partial<AuthenticationModel>) {
    this.userName = value.userName || ''
    this.password = value.password || ''
    this.loginRole = value.loginRole || 0
  }
}

export class AuthenticationResponseModel {
  accessToken: string
  expirationTime: string
  issuer: string
  subject: string
  refreshToken: string

  constructor(value: Partial<AuthenticationResponseModel>) {
    this.accessToken = value.accessToken || ''
    this.expirationTime = value.expirationTime || ''
    this.issuer = value.issuer || ''
    this.subject = value.subject || ''
    this.refreshToken = value.refreshToken || ''
  }
}

export class RefreshTokenModel {
  oldAccessToken: string
  refreshToken: string
  userId: string

  constructor(value: Partial<RefreshTokenModel>) {
    this.oldAccessToken = value.oldAccessToken || ''
    this.refreshToken = value.refreshToken || ''
    this.userId = value.userId || ''
  }
}

export class UpdatePasswordModel {
  oldPassword: string
  newPassword: string

  constructor(value: Partial<UpdatePasswordModel>) {
    this.oldPassword = value?.oldPassword ?? ''
    this.newPassword = value?.newPassword ?? ''
  }
}
