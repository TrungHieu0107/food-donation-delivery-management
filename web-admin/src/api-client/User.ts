import axiosClient from './ApiClient'

export const UserAPI = {
  getProfileLogin() {
    return axiosClient.get('/users/profile')
  },

  getListUserWithKeyword(payload: {
    keyword?: string
    pageSize?: number
    page?: number
    sortType?: number
    status?: number
    roleIds?: string[]
  }) {
    return axiosClient.get('/users', {
      params: {
        ...payload
      }
    })
  }
}
