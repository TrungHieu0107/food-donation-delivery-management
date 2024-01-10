export class NotificationModel {
	id: string
	name: string
	image?: string
	content: string
	createdDate: string
	receiverId: string
	type: string
	status: string
	dataType: string
	dataId: string

	constructor(values: Partial<NotificationModel>) {
		this.id = values?.id ?? '_'
		this.name = values?.name ?? '_'
		this.image = values?.image
		this.content = values?.content ?? '_'
		this.createdDate = values?.createdDate ?? '_'
		this.receiverId = values?.receiverId ?? '_'
		this.type = values?.type ?? '_'
		this.status = values?.status ?? '_'
		this.dataType = values?.dataType ?? '_'
		this.dataId = values?.dataId ?? '_'
	}
}

export class NotificationDataResponse {
	notificationResponses: NotificationModel[]
	notSeen: number

	constructor(value?: Partial<NotificationDataResponse>) {
		this.notificationResponses = value?.notificationResponses ?? []
		this.notSeen = value?.notSeen ?? 0
	}
}

export class FilterNotifcationModel {
	notificationStatus?: number
	page: number
	pageSize: number

	constructor(values?: Partial<FilterNotifcationModel>) {
		this.notificationStatus = values?.notificationStatus
		this.page = values?.page ?? 1
		this.pageSize = values?.pageSize ?? 10
	}
}

export enum NotificationType {
	NONE = 'NONE',
	USER = 'USER',
	POST = 'POST',
	DELIVERY_REQUEST = 'DELIVERY_REQUEST',
	REPORTABLE_DELIVERY_REQUEST = 'REPORTABLE_DELIVERY_REQUEST',
	DONATED_REQUEST = 'DONATED_REQUEST',
	AID_REQUEST = 'AID_REQUEST',
	ACTIVITY = 'ACTIVITY',
	STOCK = 'STOCK',
	SCHEDULED_ROUTE = 'SCHEDULED_ROUTE'
}
