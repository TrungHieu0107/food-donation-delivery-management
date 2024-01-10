import axiosClient from './ApiClient'
import { ObjectFilterItemWithKeyword, SearchItemParamsModel } from 'src/models'

export const ItemAPI = {
	getAll(payload: SearchItemParamsModel) {
		return axiosClient.get('/item-templates', {
			params: payload
		})
	},

	getItemTemplates(payload: SearchItemParamsModel) {
		return axiosClient.get('/items', {
			params: payload
		})
	},

	getItemDetail(id: string) {
		return axiosClient.get(`/item-templates/${id}`)
	},
	searchItemWithKeyword(payload: ObjectFilterItemWithKeyword) {
		return axiosClient.get('/item', {
			params: {
				...payload
			}
		})
	},
	getItemWithItemId(id: string) {
		return axiosClient.get('/item/' + id)
	}
}
