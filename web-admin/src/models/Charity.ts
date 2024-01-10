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

export class CharityUnitModel {
  name: string
  status: string
  email: string
  id: string
  phone: string
  description: string
  image: string
  legalDocuments: string
  location: string | LatLngExpression
  address: string
  isWatingToConfirmUpdate?: boolean
  userId?: string
  isHeadQuater?: boolean

  constructor(values: Partial<CharityUnitModel>) {
    this.name = values?.name || '_'
    this.status = values?.status || '_'
    this.email = values?.email || '_'
    this.id = values?.id || '_'
    this.phone = values?.phone || '_'
    this.description = values?.description || '_'
    this.image = values?.image || '_'
    this.legalDocuments = values?.legalDocuments || '_'
    this.location = values?.location || '_'
    this.address = values?.address || '_'
    this.isWatingToConfirmUpdate = values?.isWatingToConfirmUpdate
    this.userId = values?.userId
    this.isHeadQuater = values?.isHeadQuater
  }
}

export class ConfirmCharityModel {
  id: string
  reason?: string
  isAccept: boolean

  constructor(values: Partial<ConfirmCharityModel>) {
    this.id = values.id || '_'
    this.reason = values.reason || ''
    this.isAccept = values.isAccept || false
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
