import { LatLngExpression } from 'leaflet'
import { AcceptedBranchModel, ItemTemplateResponseModel, ScheduledTime, SimpleBranchResponse } from './DonatedRequest'

export class AidRequestListModel {
  id: string
  address: string
  location: LatLngExpression | number[]
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
    this.simpleCharityUnitResponse = values?.simpleCharityUnitResponse || new SimpleCharityUnitResponse()
    this.isSelfShipping = values?.isSelfShipping || false
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

export class FilterAidRequestModel {
  name?: string
  status?: number
  startDate?: string
  endDate?: string
  branchId?: string
  page?: number
  orderBy?: string
  sortType?: number

  constructor(values?: Partial<FilterAidRequestModel>) {
    this.name = values?.name
    this.status = values?.status
    this.startDate = values?.startDate
    this.endDate = values?.endDate
    this.branchId = values?.branchId
    this.page = values?.page
    this.sortType = values?.sortType
    this.orderBy = values?.orderBy
  }
}

export class AidRequestDetailModel {
  id?: string
  address?: string
  location?: LatLngExpression | number[]
  isConfirmable?: boolean
  createdDate?: string
  acceptedDate?: string
  scheduledTimes?: ScheduledTime[]
  status?: string
  note?: string
  acceptedBranches?: SimpleBranchResponse
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
  phone?: string
  email: string

  constructor(values: Partial<CharityUnitAidRequestResponse>) {
    this.id = values?.id
    this.name = values?.name
    this.image = values?.image
    this.address = values?.address
    this.status = values?.status
    this.charityName = values?.charityName
    this.charityLogo = values?.charityLogo
    this.phone = values.phone || ''
    this.email = values.email || ''
  }
}

export class AidItemResponseModel {
  id?: string
  quantity?: number
  exportedQuantity?: number
  status?: string
  itemResponse?: ItemTemplateResponseModel

  constructor(values: Partial<AidItemResponseModel>) {
    this.id = values?.id
    this.quantity = values?.quantity
    this.itemResponse = values?.itemResponse
    this.exportedQuantity = values?.exportedQuantity
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