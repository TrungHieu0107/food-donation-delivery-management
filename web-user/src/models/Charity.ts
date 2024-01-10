import { LatLngExpression } from 'leaflet'

export class CharityModel {
	name: string
	status: string
	email: string
	id: string
	numberOfPost: number
	numberOfCharityUnit: number
	description: string
	logo: string

	constructor(values: Partial<CharityModel>) {
		this.name = values?.name || '_'
		this.status = values?.status || '_'
		this.email = values?.email || '_'
		this.id = values?.id || '_'
		this.numberOfPost = values?.numberOfPost || 0
		this.numberOfCharityUnit = values?.numberOfCharityUnit || 0
		this.description = values?.description || '_'
		this.logo = values?.logo || '_'
	}
}
export class CharityCreatingModel {
	name: string
	logo: File | null
	description: string
	email: string
	charityUnits: CharityUnitModel[]

	constructor(values?: Partial<CharityCreatingModel>) {
		this.name = values?.name || ''
		this.logo = values?.logo || null
		this.description = values?.description || ''
		this.charityUnits = values?.charityUnits || []
		this.email = values?.email || ''
	}
}

export class CharityUnitModel {
	id?: string
	email?: string
	phone?: string
	name?: string
	image?: File | string | null
	legalDocument?: File | string | null
	address?: string
	location: LatLngExpression
	description?: string
	isHeadquarter?: boolean
	avatar?: string

	constructor(values?: Partial<CharityUnitModel>) {
		this.email = values?.email || ''
		this.phone = values?.phone || ''
		this.name = values?.name || ''
		this.image = values?.image || null
		this.legalDocument = values?.legalDocument || null
		this.address = values?.address || ''
		this.location = values?.location || [0, 0]
		this.description = values?.description || ''
		this.isHeadquarter = values?.isHeadquarter || false
		this.id = values?.id
		this.avatar = values?.avatar || ''
	}
}

export class ItemCharityRecievedMModel {
	id: string
	quantity: number
	name: string
	attributeValues: string[]
	unit: string
	pickUpPoint: string
	deliveryPoint: string
	createdDate: string
	type: string
	note: string
	activityName: string

	constructor(value: Partial<ItemCharityRecievedMModel>) {
		this.id = value?.id || ''
		this.quantity = value?.quantity || 0
		this.name = value?.name || ''
		this.attributeValues = value?.attributeValues || []
		this.unit = value?.unit || ''
		this.pickUpPoint = value?.pickUpPoint || ''
		this.deliveryPoint = value?.deliveryPoint || ''
		this.createdDate = value?.createdDate || ''
		this.type = value?.type || ''
		this.note = value?.note || ''
		this.activityName = value?.activityName || ''
	}
}
