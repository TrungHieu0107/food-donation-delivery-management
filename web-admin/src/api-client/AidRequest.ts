import { FilterAidRequestModel } from 'src/models/AidRequest'
import axiosClient from './ApiClient'
import moment from 'moment'

export const AidRequestAPI = {
  getListAidRequest(filter: FilterAidRequestModel) {
    return axiosClient.get('/aid-requests', {
      params: {
        ...filter
      }
    })
  },

  acceptAidRequest(payload: { id: string; aidItemIds: string[]; rejectingReason?: string }) {
    return axiosClient.put(`/acceptable-aid-requests`, payload)
  },

  rejectAidRequest(id: string, reason: string) {
    return axiosClient.put(`/acceptable-aid-requests`, {
      id: id,
      rejectingReason: reason
    })
  },

  getById(id: string) {
    return axiosClient.get(`/aid-requests/${id}`)
  },

  exportStockForSelfShipping(
    exportedItems: {
      itemId: string
      quantity: number
      note: string | undefined
    }[],
    aidRequestId: string,
    note: string
  ) {
    return axiosClient.post('/stock-updated-histories/stock-updated-history-type-export-by-items', {
      note: note,
      scheduledTimes: [
        {
          day: moment().format('YYYY-MM-DD'),
          startTime: '00:01',
          endTime: '23:59'
        }
      ],
      aidRequestId: aidRequestId,
      exportedItems: exportedItems
    })
  },

  finishDeliveryRequest(aidRequestId: string) {
    return axiosClient.put('/aid-requests/' + aidRequestId + '/finished-aid-request')
  },
  
  getFinishDeliveryRequest(aidRequestId: string, page: number) {
    return axiosClient.get('/aid-requests/' + aidRequestId + '/finished-delivery-requests', {
      params: {
        page: page
      }
    })
  }
}
