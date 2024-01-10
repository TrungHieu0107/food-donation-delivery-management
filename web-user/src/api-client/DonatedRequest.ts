import axiosClient from './ApiClient'

export const DonatedRequestAPI = {
	createNew(formData: FormData) {
		return axiosClient.post('/donated-requests', formData, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		})
	},

	getListDonatedRequest(payLoad?: { page?: number; startDate?: string; endDate?: string }) {
		return axiosClient.get('/donated-requests', {
			params: {
				...payLoad,
				orderBy: 'CreatedDate',
				sortType: 1
			}
		})
	},
	getDetailDonatedRequest(id: string) {
		return axiosClient.get('/donated-requests/'  + id)
	}
}
