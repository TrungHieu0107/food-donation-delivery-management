import { FilterAidRequestModel } from 'src/models/AidRequest'
import axiosClient from './ApiClient'

export const AidRequestAPI = {
	addNew(payload: any) {
		return axiosClient.post('/aid-requests', payload)
	},

	getListAidRequest(filter: FilterAidRequestModel) {
		return axiosClient.get('/aid-requests', {
			params: {
				...filter,
				orderBy: 'CreatedDate',
				sortType: 1
			}
		})
	},

	getDetail(aidRequestId: string) {
		return axiosClient.get('/aid-requests/' + aidRequestId)
	},

	getFinishDeliveryRequest(aidRequestId: string, page: number) {
		return axiosClient.get('/aid-requests/' + aidRequestId + '/finished-delivery-requests', {
			params: {
				page: page
			}
		})
	}
}
