import { SearchItemParamsModel } from 'src/models/common/CommonModel'
import axiosClient from './ApiClient'
import { ItemCreatingModel } from 'src/models/Item'
import { ScheduledTime } from 'src/models/DonatedRequest'
import { ObjectFilterItemWithKeyword } from '../pages/van-chuyen/tao-moi/AddOtherItems'

export const ItemAPI = {
  getAll(payload: SearchItemParamsModel) {
    return axiosClient.get('/item-templates', {
      params: payload
    })
  },

  addNew(payload: ItemCreatingModel) {
    return axiosClient.post('/item-templates', payload)
  },

  getItemDetail(id: string) {
    return axiosClient.get(`/item-templates/${id}`)
  },

  updateItem(payload: ItemCreatingModel) {
    return axiosClient.put('/item-templates/' + payload.id, payload)
  },

  getAllUnit() {
    return axiosClient.get('/item-units')
  },

  searchItemWithKeyword(payload: ObjectFilterItemWithKeyword) {
    return axiosClient.get('/item', {
      params: {
        ...payload
      }
    })
  },

  getItemAvaiableInStock(payload: { itemId: string; scheduledTimes: ScheduledTime[] }) {
    return axiosClient.post('/stocks', payload)
  },

  getListStockAvaiableByListItemId(listItemId: string[], scheduleTime: ScheduledTime[], branchId?: string) {
    if (!!branchId) {
      return axiosClient.post('/stocks/available?branchId=' + branchId, {
        itemIds: listItemId,
        scheduledTimes: scheduleTime,
        branchId: branchId
      })
    }

    return axiosClient.post('/stocks/available', {
      itemIds: listItemId,
      scheduledTimes: scheduleTime,
      branchId: branchId
    })
  }
}
