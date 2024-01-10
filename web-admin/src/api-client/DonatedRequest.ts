import { QuueryDonatedRequestModel } from 'src/models/DonatedRequest'
import axiosClient from './ApiClient'

export const DonatedRequestAPI = {
  get(payload: QuueryDonatedRequestModel) {
    return axiosClient.get('/donated-requests', {
      params: payload
    })
  },

  getById(id: string) {
    return axiosClient.get('/donated-requests/' + id)
  },

  acceptDonatedRequest(payload: { id: string; donatedItemIds: string[]; rejectingReason?: string }) {
    return axiosClient.put('/acceptable-donated-requests', payload)
  },

  rejectDonatedRequest(payload: { id: string; rejectingReason: string }) {
    return axiosClient.put('/acceptable-donated-requests', { ...payload, donatedItemIds: [] })
  },

  getFinishDeliveryRequest(donatedRequestId: string, page: number) {
    return axiosClient.get('/donated-requests/' + donatedRequestId + '/finished-delivery-requests', {
      params: {
        page: page
      }
    })
  }
}
