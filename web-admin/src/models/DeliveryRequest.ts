import { LatLngExpression } from 'leaflet'
import { ItemTemplateResponseModel, ScheduledTime, SimpleUserResponse } from './DonatedRequest'
import { generateUUID } from 'src/@core/layouts/utils'
import { KEY } from 'src/common/Keys'
import { ItemTemplateResponse } from './Item'
import moment from 'moment'
import { UserModel } from './User'

export class DataForDeliveryRequestModel {
  pickUpLocation: LocationModel
  deliveryLocation: LocationModel
  scheduleTime: ScheduledTime[]
  deliveryItems: DeliveryItemModel[]
  type: string
  note: string
  status: string
  createdDate: string
  images: string[]

  constructor(values?: Partial<DataForDeliveryRequestModel>) {
    this.pickUpLocation = values?.pickUpLocation || new LocationModel({})
    this.deliveryLocation = values?.deliveryLocation || new LocationModel({})
    this.scheduleTime = values?.scheduleTime || []
    this.deliveryItems = values?.deliveryItems || []
    this.type = values?.type || KEY.DEFAULT_VALUE
    this.note = values?.note || KEY.DEFAULT_VALUE
    this.status = values?.status || KEY.DEFAULT_VALUE
    this.createdDate = values?.createdDate || KEY.DEFAULT_VALUE
    this.images = values?.images || []
  }
}

export class LocationModel {
  id: string
  address: string
  location: LatLngExpression
  name: string
  phone: string
  role: string
  avatar: string
  charityName?: string

  constructor(values: Partial<LocationModel>) {
    this.id = values.id ?? generateUUID()
    this.address = values?.address ?? KEY.DEFAULT_VALUE
    this.location = values?.location ?? [0, 0]
    this.name = values?.name ?? KEY.DEFAULT_VALUE
    this.phone = values?.phone ?? KEY.DEFAULT_VALUE
    this.role = values?.role ?? KEY.DEFAULT_VALUE
    this.avatar = values?.avatar ?? KEY.DEFAULT_VALUE
    this.charityName = values.charityName || KEY.DEFAULT_VALUE
  }
}

export class DeliveryItemModel {
  id?: string
  quantity?: number
  exportedQuantity?: number
  initialExpirationDate?: string
  status?: string
  itemTemplateResponse?: ItemTemplateResponseModel
  stocks: StockModel[]
  deliveryItemId: string
  name: string
  image: string
  unit: string
  confirmedExpirationDate: string
  assignedQuantity: number

  constructor(value?: Partial<DeliveryItemModel>) {
    this.id = value?.id
    this.quantity = value?.quantity
    this.initialExpirationDate = value?.initialExpirationDate
    this.status = value?.status
    this.itemTemplateResponse = value?.itemTemplateResponse
    this.exportedQuantity = value?.exportedQuantity || 0
    this.stocks = value?.stocks || []
    this.deliveryItemId = value?.deliveryItemId || ''
    this.name = value?.name || ''
    this.image = value?.image || ''
    this.unit = value?.unit || ''
    this.confirmedExpirationDate = value?.confirmedExpirationDate || ''
    this.assignedQuantity = value?.assignedQuantity || 0
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

export class DeliveryRequestCreateDataModel {
  note: string
  scheduledTimes: ScheduledTime[]
  donatedRequestId: string
  deliveryItemsForDeliveries: DeliveryItemsForDeliveryModel[][]

  constructor(value: DeliveryRequestCreateDataModel) {
    this.note = value.note
    this.scheduledTimes = value.scheduledTimes
    this.donatedRequestId = value.donatedRequestId
    this.deliveryItemsForDeliveries = value.deliveryItemsForDeliveries
  }
}
export class DeliveryRequestCreateDataBranchtoCharityModel {
  note: string
  scheduledTimes: ScheduledTime[]
  aidRequestId: string
  deliveryItemsForDeliveries: DeliveryItemsForDeliveryModel[][]

  constructor(value: DeliveryRequestCreateDataBranchtoCharityModel) {
    this.note = value.note
    this.scheduledTimes = value.scheduledTimes
    this.aidRequestId = value.aidRequestId
    this.deliveryItemsForDeliveries = value.deliveryItemsForDeliveries
  }
}

export class DeliveryItemsForDeliveryModel {
  itemId: string
  quantity: number

  constructor(value: DeliveryItemsForDeliveryModel) {
    this.itemId = value.itemId
    this.quantity = value.quantity
  }
}

//Use for list delivery
export class DeliveryRequestModelForList {
  id?: string
  createdDate?: string
  status?: string
  pickUpPoint?: PointRequestModel
  deliveryPoint?: PointRequestModel
  deliveryType?: string
  itemResponses?: ItemTemplateResponse[]

  constructor(value: DeliveryRequestModelForList) {
    this.id = value.id
    this.createdDate = value.createdDate
    this.status = value.status
    this.pickUpPoint = value.pickUpPoint
    this.deliveryPoint = value.deliveryPoint
    this.deliveryType = value.deliveryType
    this.itemResponses = value.itemResponses
  }
}

export class PointRequestModel {
  userId?: string
  branchId?: string
  charityUnitId?: string
  name?: string
  avatar?: string
  phone?: string
  email?: string
  address?: string
  location?: string

  constructor(values: Partial<PointRequestModel>) {
    this.userId = values.userId
    this.branchId = values.branchId
    this.charityUnitId = values.charityUnitId
    this.name = values.name
    this.avatar = values.avatar
    this.phone = values.phone
    this.email = values.email
    this.address = values.address
    this.location = values.location
  }
}

export class FilterDeliveryRequestList {
  pageSize?: number
  page?: number
  startDate?: string
  endDate?: string
  keyWord?: string
  address?: string
  itemId?: string
  deliveryType: number
  status?: string
  branchId?: string

  constructor(values: Partial<FilterDeliveryRequestList>) {
    this.pageSize = values?.pageSize
    this.page = values?.page
    this.startDate = values?.startDate
    this.endDate = values?.endDate
    this.keyWord = values?.keyWord
    this.address = values?.address
    this.itemId = values?.itemId
    this.deliveryType = values?.deliveryType || 0
    this.status = values?.status
    this.branchId = values?.branchId
  }
}

export class DeliveryRequestDetailModel {
  id: string
  createdDate: string
  status: string
  pickUpPoint: PointDetail
  deliveryPointResponse: PointDetail
  deliveryType: string
  itemResponses: ItemResponse[]
  currentScheduledTime: string | null
  scheduledTimes: ScheduledTime[]
  proofImage: string | null
  collaborator: UserModel | null

  constructor(data: any) {
    this.id = data.id
    this.createdDate = data.createdDate
    this.status = data.status
    this.pickUpPoint = new PointDetail(data.pickUpPoint)
    this.deliveryPointResponse = new PointDetail(data.deliveryPointResponse)
    this.deliveryType = data.deliveryType
    this.itemResponses = data.itemResponses?.map((item: any) => new ItemResponse(item))
    this.currentScheduledTime = data.currentScheduledTime
    this.scheduledTimes = data.scheduledTimes?.map((time: any) => new ScheduledTime(time))
    this.proofImage = data.proofImage
    this.collaborator = data.collaborator
  }
}

export class PointDetail {
  userId?: string
  branchId?: string | null
  charityUnitId?: string | null
  name?: string
  avatar?: string
  phone?: string
  email?: string
  address?: string
  location?: string

  constructor(data: any) {
    Object.assign(this, data)
  }
}

export class ItemResponse {
  id?: string
  name?: string
  attributeValues?: string[]
  image?: string
  note?: string
  estimatedExpirationDays?: number
  maximumTransportVolume?: number
  unit?: string
  quantity?: number
  initialExpirationDate?: string
  status?: string
  receivedQuantity?: number

  constructor(data: Partial<ItemResponse>) {
    Object.assign(this, data)
  }
}

export class ScheduleRoute {
  id?: string
  numberOfDeliveryRequests?: number
  scheduledTime?: ScheduledTime
  orderedAddresses?: string[]
  totalDistanceAsMeters?: number
  totalTimeAsSeconds?: number
  bulkyLevel?: string
  type?: string
  status?: string
  branch?: {
    id?: string
    name?: string
    image?: string
  }

  constructor(data: Partial<ScheduleRoute>) {
    Object.assign(this, data)
  }
}

export class ObjectFilterScheduledRoute {
  branchId?: string
  stockUpdatedHistoryType?: number
  status?: number
  startDate?: string
  endDate?: string
  sortType?: number // thời gian kết thúc
  page?: number
  pageSize?: number

  constructor(value: Partial<ObjectFilterScheduledRoute>) {
    Object.assign(this, value)
  }
}

export class ScheduleRouteDetail extends ScheduleRoute {
  orderedDeliveryRequests?: ScheduledRouteDeliveryRequestDetail[]
  acceptedUser?: SimpleUserResponse
  finishedDate?: string

  constructor(data: Partial<ScheduleRouteDetail>) {
    super(data)
    Object.assign(this, data)
  }
}

export class ScheduledRouteDeliveryRequestDetail {
  id?: string
  status?: string
  address?: string
  location?: number[]
  currentScheduledTime?: ScheduledTime
  proofImage?: string
  avatar?: string
  name?: string
  phone?: string
  activityId?: string
  activityName?: string
  deliveryItems?: ItemRouteDeliveryRequestDetail[]

  constructor(data: Partial<ScheduledRouteDeliveryRequestDetail>) {
    Object.assign(this, data)
  }
}

export class ItemRouteDeliveryRequestDetail {
  deliveryItemId?: string
  name?: string
  image?: string
  unit?: string
  quantity?: number
  receivedQuantity?: number
  initialExpirationDate?: string
  note?: string
  stocks?: StockItemDelivery[]

  constructor(data: Partial<ItemRouteDeliveryRequestDetail>) {
    Object.assign(this, data)
  }
}

export class StockItemDelivery {
  stockId?: string
  quantity?: number
  stockCode?: string
  expirationDate?: string

  constructor(value: StockItemDelivery) {
    Object.assign(this, value)
  }
}

export type ObjectImportStockDeliveryRequest = {
  scheduledRouteId: string
  deliveryRequests: {
    deliveryRequestId: string
    receivedDeliveryItemRequests: {
      deliveryItemId: string
      quantity: number
      expirationDate: string | undefined
      note: string
    }[]
  }[]
}

export class ConfirmExportStockScheduleRouteModel {
  scheduledRouteId: string
  note?: string
  notesOfStockUpdatedHistoryDetails: NoteStockUpdateHistoryModel[]

  constructor(value: ConfirmExportStockScheduleRouteModel) {
    this.scheduledRouteId = value.scheduledRouteId
    this.note = value?.note
    this.notesOfStockUpdatedHistoryDetails = value.notesOfStockUpdatedHistoryDetails
  }
}

export class NoteStockUpdateHistoryModel {
  stockId: string
  note?: string

  constructor(value: NoteStockUpdateHistoryModel) {
    this.stockId = value.stockId
    this.note = value.note
  }
}

export enum DeliveryType {
  DONATE = 'quyen-gop',
  AID = 'ho-tro'
}

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

  constructor(value: Partial<HistoryDeliveryRequestDetailModel>) {
    super(value)

    this.isReported = value.isReported || false
    this.branchId = value.branchId || ''
    this.branchName = value.branchName || ''
    this.branchAddress = value.branchAddress || ''
    this.branchImage = value.branchImage || ''
    this.deliveryItems = value.deliveryItems || ([] as DeliveryItemModel[])
  }
}
