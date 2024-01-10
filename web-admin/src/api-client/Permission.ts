import axiosClient from './ApiClient'

export const PermissionAPI = {
  getPermissionByRoleId(payload: { roleId: string; page: number; pageSize: number; sortType?: 0 | 1 }) {
    return axiosClient.get('/role-permissions/', {
      params: { ...payload }
    })
  }
}
