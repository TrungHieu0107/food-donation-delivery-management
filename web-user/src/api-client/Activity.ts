import * as ActivityModel from 'src/models/Activity'
import axiosClient from './ApiClient'

export const ActivityAPI = {
  getAll(payload: ActivityModel.QueryActivityListModel) {
    return axiosClient.get('/activities', {
      params: payload.logObjectWithoutEmptyStrings()
    })
  },

  getAllType() {
    return axiosClient.get('/activity-types')
  },

  getActivityDetail(id: string) {
    return axiosClient.get(`/activities/${id}`)
  }
}
