import { FilterNotifcationModel } from 'src/models/Notification'
import axiosClient from './ApiClient'

export const NotificationAPI = {
  getNotification(payload: FilterNotifcationModel) {
    return axiosClient.get(`/notifications`, {
      params: {
        ...payload
      }
    })
  },

  readNotification(notificationIdList: string[]) {
    return axiosClient.put(`/notifications`, {
      notificationIds: notificationIdList,
      status: 1
    })
  }
}
