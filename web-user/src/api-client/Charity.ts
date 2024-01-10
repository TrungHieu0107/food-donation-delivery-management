import { capitalizeFirstLetter } from 'src/@core/layouts/utils'
import { CharityCreatingModel, CharityUnitModel } from 'src/models/Charity'
import axiosClient from './ApiClient'
import { LatLngTuple } from 'leaflet'

export const CharityAPI = {
	register(charityModel: CharityCreatingModel) {
		const formData = generateFormData(charityModel)

		return axiosClient.post('/charities', formData, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		})
	},
	createCharityUnit(charityUnitModel: CharityUnitModel) {
		const formData = generateFormDataCharityUnits(charityUnitModel)

		return axiosClient.post('/charity-units', formData, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		})
	},

	getCharityUnitsOfCharity(id: string) {
		return axiosClient.get(`/charities/${id}/charity-units`)
	},

	getCharityUnitsById(id: string) {
		return axiosClient.get(`/charity-units/${id}`)
	},

	updateCharityUnit(value: CharityUnitModel) {
		const formData = new FormData()

		value.name && formData.append('Name', value.name)
		value.description && formData.append('Description', value.description)
		value.address && formData.append('Address', value.address)
		if (value.location) {
			const [lat, lng] = value.location as LatLngTuple
			if (lat !== 0 && lng !== 0) {
				formData.append('Location[0]', lat.toString())
				formData.append('Location[1]', lng.toString())
			}
		}
		value.image && formData.append('Image', value.image)
		value.legalDocument && formData.append('LegalDocument ', value.legalDocument)
		value.email && formData.append('Email', value.email)
		value.phone && formData.append('Phone', value.phone)

		return axiosClient.put('/charity-units', formData, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		})
	},

	getCharityUnitProfileWithStatus(id: string, status: number) {
		return axiosClient.get('/charity-units/users/' + id, {
			params: {
				status: status
			}
		})
	}
}

const generateFormData = (data: CharityCreatingModel) => {
	const payload = new FormData()

	for (const [key, value] of Object.entries(data)) {
		switch (key) {
			case 'charityUnits':
				data.charityUnits.map((unitValue, index) => {
					for (const [key, value] of Object.entries(unitValue)) {
						switch (key) {
							case 'location':
								payload.append(`CharityUnits[${index}].Location[0]`, value.toString().split(',')[0])
								payload.append(`CharityUnits[${index}].Location[1]`, value.toString().split(',')[1])
								break
							default:
								payload.append(`CharityUnits[${index}].${capitalizeFirstLetter(key)}`, value)
								break
						}
					}
				})
				break
			default:
				payload.append(capitalizeFirstLetter(key), value)
				break
		}
	}

	return payload
}

const generateFormDataCharityUnits = (charityUnitModel: CharityUnitModel) => {
	const payload = new FormData()

	for (const [key, value] of Object.entries(charityUnitModel)) {
		switch (key) {
			case 'location':
				payload.append(`Location[0]`, value.toString().split(',')[0])
				payload.append(`Location[1]`, value.toString().split(',')[1])
				break
			case 'phone':
				const phone = value as string
				payload.append(`Phone`, `0${+phone}`)
				break
			default:	
				payload.append(`${capitalizeFirstLetter(key)}`, value)
				break
		}
	}

	return payload
}
