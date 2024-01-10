import { ConfirmCharityModel } from 'src/models/Charity'
import axiosClient from './ApiClient'

export const CharityAPI = {
  getDetail(id: string) {
    return axiosClient.get('/charities/' + id)
  },

  getCharityUnits(id: string) {
    return axiosClient.get('/charities/admin/' + id + '/charity-units')
  },

  confirmCharity(payload: ConfirmCharityModel) {
    return axiosClient.put('/charities/' + payload.id, {
      isAccept: payload.isAccept,
      reason: payload.reason
    })
  },

  confirmUpdateCharityUnits(id: string, isAccept: boolean, reason: string) {
    return axiosClient.put('/charity-units/admin/' + id + '?update=true', {
      isAccept: isAccept,
      reason: reason
    })
  },

  confirmCreateNewCharityUnits(id: string, isAccept: boolean, reason: string) {
    return axiosClient.put('/charity-units/admin/' + id + '?update=false', {
      isAccept: isAccept,
      reason: reason
    })
  },

  getCharityUnitProfileWithStatus(id: string, status: number) {
    return axiosClient.get('/charity-units/users/' + id, {
      params: {
        status: status
      }
    })
  },

  getListCharityUnit(payload: {
    page?: number
    pageSize?: number
    sortType?: number
    keyWord?: string
    charityId?: string
    charityStatus?: number
  }) {
    return axiosClient.get('/charity-units', {
      params: { ...payload }
    })
  }
}
