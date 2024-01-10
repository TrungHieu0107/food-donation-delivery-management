import axiosClient from "./ApiClient"

export const StockAPI = {
	getStockUpdateHistoryById(id: string) {
		return axiosClient.get('stock-updated-histories/' + id)
	},

	getStockReceivedOfChariry(charityunitId: string, filterObject : any) {
		return axiosClient.get(`/stock-updated-history-details/Charity-Unit/${charityunitId}`, {
			params: filterObject,
			paramsSerializer: {
				indexes: null
			}
		})
	}
}