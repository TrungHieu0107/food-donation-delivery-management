import axiosClient from './ApiClient'

export const RoleAPI = {
  getAll() {
    return axiosClient.get('/roles')
  }
}
