import { LatLngTuple } from 'leaflet'

export class AidRequestModelCreating {
	receivingTimeStart: string
	receivingTimeEnd: string
	receivingDateStart: string
	receivingDateEnd: string
	note: string

	constructor(value: Partial<AidRequestModelCreating>) {
		this.receivingTimeStart = value?.receivingTimeStart ?? ''
		this.receivingTimeEnd = value?.receivingTimeEnd ?? ''
		this.receivingDateStart = value?.receivingDateStart ?? ''
		this.receivingDateEnd = value?.receivingDateEnd ?? ''
		this.note = value?.note ?? ''
	}
}

export class AidItemRequestsForCreating {
	itemTemplateId: string
	quantity: number

	constructor(value: Partial<AidItemRequestsForCreating>) {
		this.itemTemplateId = value?.itemTemplateId ?? ''
		this.quantity = value?.quantity ?? 0
	}
}

export class AidRequestListModel {
	id: string
	address: string
	location: LatLngTuple | number[]
	createdDate: string
	acceptedDate: string
	scheduledTimes: ScheduledTime[]
	status: string
	simpleBranchResponses: SimpleBranchResponse[]
	simpleCharityUnitResponse: SimpleCharityUnitResponse
	isSelfShipping: boolean

	constructor(values?: Partial<AidRequestListModel>) {
		this.id = values?.id || ''
		this.address = values?.address || ''
		this.location = values?.location || [0, 0]
		this.createdDate = values?.createdDate || ''
		this.acceptedDate = values?.acceptedDate || ''
		this.scheduledTimes = values?.scheduledTimes || []
		this.status = values?.status || ''
		this.simpleBranchResponses = values?.simpleBranchResponses || []
		this.simpleCharityUnitResponse =
			values?.simpleCharityUnitResponse || new SimpleCharityUnitResponse()
			this.isSelfShipping = !!values?.isSelfShipping
	}
}

export class SimpleBranchResponse {
	id?: string
	name?: string
	address?: string
	image?: string
	rejectingReason?: string
	status?: string
	createdDate?: string

	constructor(value?: Partial<SimpleBranchResponse>) {
		this.id = value?.id
		this.name = value?.name
		this.image = value?.image
	}
}

export class SimpleCharityUnitResponse {
	id: string
	name: string
	image: string

	constructor(values?: Partial<SimpleCharityUnitResponse>) {
		this.id = values?.id || ''
		this.name = values?.name || ''
		this.image = values?.image || ''
	}
}

export class ScheduledTime {
	day?: string
	startTime?: string
	endTime?: string

	constructor(value?: Partial<ScheduledTime>) {
		this.day = value?.day
		this.startTime = value?.startTime
		this.endTime = value?.endTime
	}
}

export class FilterAidRequestModel {
	name?: string
	status?: number
	startDate?: string
	endDate?: string
	page?: number
	orderBy?: string
	sortType?: number

	constructor(values?: Partial<FilterAidRequestModel>) {
		Object.assign(this, values)
	}
}

export class AidRequestDetailModel {
	id?: string
	address?: string
	location?: LatLngTuple | number[]
	isConfirmable?: boolean
	createdDate?: string
	acceptedDate?: string
	scheduledTimes?: ScheduledTime[]
	status?: string
	note?: string
	isSelfShipping?: boolean
	acceptedBranches?: SimpleBranchResponse[]
	aidItemResponses?: AidItemResponseModel[]
	charityUnitResponse?: CharityUnitAidRequestResponse
	rejectingBranchResponses?: SimpleBranchResponse[]
	startingBranch?: AcceptedBranchModel

	constructor(values?: Partial<AidRequestDetailModel>) {
		this.id = values?.id
		this.address = values?.address
		this.location = values?.location
		this.isConfirmable = values?.isConfirmable
		this.createdDate = values?.createdDate
		this.acceptedDate = values?.acceptedDate
		this.scheduledTimes = values?.scheduledTimes
		this.status = values?.status
		this.note = values?.note
		this.acceptedBranches = values?.acceptedBranches
		this.aidItemResponses = values?.aidItemResponses
		this.charityUnitResponse = values?.charityUnitResponse
		this.rejectingBranchResponses = values?.rejectingBranchResponses
		this.startingBranch = values?.startingBranch
		this.isSelfShipping = values?.isSelfShipping
	}
}

export class AidItemResponseModel {
	id?: string
	quantity?: number
	exportedQuantity?: number
	itemResponse?: ItemTemplateResponseModel

	constructor(values: Partial<AidItemResponseModel>) {
		this.id = values?.id
		this.quantity = values?.quantity
		this.itemResponse = values?.itemResponse
	}
}

export class ItemTemplateResponseModel {
	id?: string
	name?: string
	attributeValues?: string[]
	image?: string
	note?: string
	estimatedExpirationDays?: number
	maximumTransportVolume?: number
	unit?: string

	constructor(value?: Partial<ItemTemplateResponseModel>) {
		this.id = value?.id
		this.name = value?.name
		this.attributeValues = value?.attributeValues
		this.image = value?.image
		this.note = value?.note
		this.estimatedExpirationDays = value?.estimatedExpirationDays
		this.maximumTransportVolume = value?.maximumTransportVolume
		this.unit = value?.unit
	}
}

export class CharityUnitAidRequestResponse {
	id?: string
	name?: string
	image?: string
	address?: string
	status?: string
	charityName?: string
	charityLogo?: string

	constructor(values: Partial<CharityUnitAidRequestResponse>) {
		this.id = values?.id
		this.name = values?.name
		this.image = values?.image
		this.address = values?.address
		this.status = values?.status
		this.charityName = values?.charityName
		this.charityLogo = values?.charityLogo
	}
}

export class AcceptedBranchModel {
	id?: string
	name?: string
	address?: string
	image?: string
	createdDate?: string
	status?: string
	location?: LatLngTuple

	constructor(value?: Partial<AcceptedBranchModel>) {
		this.id = value?.id
		this.name = value?.name
		this.address = value?.address
		this.image = value?.image
		this.createdDate = value?.createdDate
		this.status = value?.status
		this.location = value?.location
	}
}

export class HistoryRecieveAidRequestModel {
	id: string
	exportedDate: string
	finishedDate: string
	exportNote: string

	constructor(value: Partial<HistoryRecieveAidRequestModel>) {
		this.id = value?.id || ''
		this.exportedDate = value?.exportedDate || ''
		this.finishedDate = value?.finishedDate || ''
		this.exportNote = value?.exportNote || ''
	}
}

export class HistoryDetailRecieveAidRequestModel extends HistoryRecieveAidRequestModel {
	exportedItems: ExportedItemModel[]
	constructor(value: Partial<HistoryDetailRecieveAidRequestModel>) {
		super(value)
		this.exportedItems = value.exportedItems || []
	}
}

export class ExportedItemModel {
	stockUpdatedHistoryDetailId: string
	name: string
	image: string
	unit: string
	confirmedExpirationDate: string
	exportedQuantity: number

	constructor(value: Partial<ExportedItemModel>) {
		this.stockUpdatedHistoryDetailId = value.stockUpdatedHistoryDetailId || ''
		this.name = value.name || ''
		this.image = value.image || ''
		this.unit = value.unit || ''
		this.confirmedExpirationDate = value.confirmedExpirationDate || ''
		this.exportedQuantity = value.exportedQuantity || 0
	}
}
