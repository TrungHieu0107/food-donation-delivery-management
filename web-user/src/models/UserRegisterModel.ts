export class FreeVolunteerRegistrationModel {
  fullName: string
  email: string
  password: string
  phone: string
  otp: string
  registerCheckByfullName: boolean
  verifyCode: string

  constructor(value: Partial<FreeVolunteerRegistrationModel>) {
    this.fullName = value?.fullName || ''
    this.email = value?.email || ''
    this.password = value?.password || ''
    this.phone = value?.phone || ''
    this.registerCheckByfullName = value?.registerCheckByfullName || false
    this.otp = value?.otp || ''
    this.verifyCode = value?.verifyCode || ''
  }
}
