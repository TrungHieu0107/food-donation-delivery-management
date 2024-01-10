import axiosClient from './ApiClient'

export const Registration = {
  sendEmailVerifying(email: string) {
    return axiosClient.post('/users/email/verification', {
      email: email
    })
  },

  sendCodeVerifyEmail(code: string) {
    return axiosClient.get('/users/email/verification', {
      params: {
        code: code
      }
    })
  },

  register(payload: { phone: string; fullName: string }) {
    return axiosClient.post('/users', payload)
  },

  completePassword(payload: { password: string; verifyCode: string }) {
    return axiosClient.put('/users/password', payload)
  },

  reSendOTP(payload: { phone: string }) {
    if (!payload.phone.startsWith('0')) {
      payload.phone = `+84${payload.phone}`
    }

    return axiosClient.put('/users/otp', {
      phone: `${payload.phone}`
    })
  },

  verifyOTP(payload: { phone: string; otp: string }) {
    return axiosClient.post('/users/phone/verification', payload)
  }
}
