import moment from 'moment'
import { ScheduledTime } from './AidRequest'
import { ReportModel } from './Report'

export class HistoryDeliveryRequestModel {
	id: string
	currentScheduledTime: ScheduledTime
	exportedDate: string
	finishedDate: string
	exportNote: string
	proofImage: string
	avatar: string
	name: string
	phone: string

	constructor(value: Partial<HistoryDeliveryRequestModel>) {
		this.id = value.id || ''
		this.currentScheduledTime =
			value.currentScheduledTime ||
			new ScheduledTime({
				day: moment().format('YYYY-MM-DD'),
				startTime: '00:01',
				endTime: '23:59'
			})
		this.exportedDate = value.exportedDate || ''
		this.finishedDate = value.finishedDate || ''
		this.exportNote = value.exportNote || ''
		this.proofImage = value.proofImage || ''
		this.avatar = value.avatar || ''
		this.name = value.name || ''
		this.phone = value.phone || ''
	}
}

export class HistoryDeliveryRequestDetailModel extends HistoryDeliveryRequestModel {
	isReported: boolean
	branchId: string
	branchName: string
	branchAddress: string
	branchImage: string
	deliveryItems: DeliveryItemModel[]
	report: ReportModel

	constructor(value: Partial<HistoryDeliveryRequestDetailModel>) {
		super(value)

		this.isReported = value.isReported || false
		this.branchId = value.branchId || ''
		this.branchName = value.branchName || ''
		this.branchAddress = value.branchAddress || ''
		this.branchImage = value.branchImage || ''
		this.deliveryItems = value.deliveryItems || ([] as DeliveryItemModel[])
		this.report = value.report || new ReportModel({})
	}
}

export class DeliveryItemModel {
	deliveryItemId: string
	name: string
	image: string
	unit: string
	confirmedExpirationDate: string
	assignedQuantity: number
	exportedQuantity: number
	stocks: StockModel[]

	constructor(value: Partial<DeliveryItemModel>) {
		this.deliveryItemId = value.deliveryItemId || ''
		this.name = value.name || ''
		this.image = value.image || ''
		this.unit = value.unit || ''
		this.confirmedExpirationDate = value.confirmedExpirationDate || ''
		this.assignedQuantity = value.assignedQuantity || 0
		this.exportedQuantity = value.exportedQuantity || 0
		this.stocks = value.stocks || []
	}
}

export class StockModel {
	stockId: string
	stockCode: string
	quantity: number
	expirationDate: string

	constructor(value?: Partial<StockModel>) {
		this.stockId = value?.stockId || ''
		this.stockCode = value?.stockCode || ''
		this.quantity = value?.quantity || 0
		this.expirationDate = value?.expirationDate || ''
	}
}
