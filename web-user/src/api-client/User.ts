import { LatLngExpression, LatLngTuple } from 'leaflet'
import axiosClient from './ApiClient'

export const UserAPI = {
	getProfileLogin() {
		return axiosClient.get('/users/profile')
	},
	updateProfile(payload: {
		location?: LatLngExpression
		address?: string
		avatar?: File
		name?: string
	}) {
		const formData = new FormData()
		if (payload.location) {
			const [lat, lng] = payload.location as LatLngTuple
			formData.append('Location[0]', lat.toString())
			formData.append('Location[1]', lng.toString())
		}

		payload.address && formData.append('Address', payload.address)
		payload.avatar && formData.append('Avatar', payload.avatar)
		payload.name && formData.append('Name', payload.name)

		return axiosClient.put('/users/profile', formData, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		})
	}
}
