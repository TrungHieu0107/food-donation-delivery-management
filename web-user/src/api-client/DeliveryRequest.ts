import axiosClient from './ApiClient'

export const DeleiveryRequestAPI = {
	reportDeliveryRequest(deliveryID: string, title: string, content: string) {
		return axiosClient.post('/delivery-requests/' + deliveryID + '/reports', {
			title: title,
			content: content
		})
	},

	getDetialOfDeliveryRequest(deliveryId: string) {
		return axiosClient.get('/delivery-requests/' + deliveryId)
	}
}
