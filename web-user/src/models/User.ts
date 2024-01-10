import { LatLngExpression } from 'leaflet'

export class UserModel {
	id?: string
	name?: string
	phone?: string
	email?: string
	description?: string
	address?: string
	location?: LatLngExpression
	avatar?: string
	frontOfIdCard?: string
	backOfIdCard?: string
	otherContacts?: string
	collaboratorStatus?: string
	isHeadquarter?: boolean
	legalDocuments?: string
	charity?: CharityModel
	charityUnitId?: string

	constructor(value?: Partial<UserModel>) {
		this.id = value?.id
		this.name = value?.name
		this.email = value?.email
		this.phone = value?.phone
		this.description = value?.description
		this.address = value?.address
		this.location = value?.location
		this.avatar = value?.avatar
		this.frontOfIdCard = value?.frontOfIdCard
		this.backOfIdCard = value?.backOfIdCard
		this.otherContacts = value?.otherContacts
		this.collaboratorStatus = value?.collaboratorStatus
		this.isHeadquarter = value?.isHeadquarter
		this.legalDocuments = value?.legalDocuments
		this.charity = value?.charity
		this.charityUnitId = value?.charityUnitId
	}
}

class CharityModel {
	name: string
	id: string
	email: string
	status: string
	description: string
	logo: string

	constructor(values?: Partial<CharityModel>) {
		this.name = values?.name || ''
		this.id = values?.id || ''
		this.email = values?.email || ''
		this.status = values?.status || ''
		this.description = values?.description || ''
		this.logo = values?.logo || ''
	}
}
