import { LatLngExpression } from 'leaflet'

export class DonatedRequestModel {
  id?: string
  createdDate?: string
  acceptedDate?: string
  scheduledTimes?: ScheduledTime[]
  status?: string
  simpleBranchResponse?: SimpleBranchResponse
  simpleUserResponse?: SimpleUserResponse
  simpleActivityResponse?: SimpleActivityResponse

  constructor(value?: Partial<DonatedRequestModel>) {
    Object.assign(this, value)
  }
}

export class SimpleBranchResponse {
  id?: string
  name?: string
  image?: string

  constructor(value?: Partial<SimpleBranchResponse>) {
    this.id = value?.id
    this.name = value?.name
    this.image = value?.image
  }
}

export class SimpleActivityResponse {
  id?: string
  name?: string

  constructor(value?: Partial<SimpleBranchResponse>) {
    this.id = value?.id
    this.name = value?.name
  }
}

export class SimpleUserResponse {
  id?: string
  fullName?: string
  avatar?: string
  role?: string
  phone?: string
  email?: string
  status?: string
  address?: string

  constructor(value?: Partial<SimpleUserResponse>) {
    Object.assign(this, value)
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

export class QuueryDonatedRequestModel {
  status?: number
  startDate?: string
  endDate?: string
  isJoined?: boolean
  branchId?: string
  userId?: string
  pageSize: number
  page: number
  orderBy?: string
  sortType?: 0 | 1

  constructor(value?: Partial<QuueryDonatedRequestModel>) {
    this.status = value?.status
    this.startDate = value?.startDate
    this.endDate = value?.endDate
    this.isJoined = value?.isJoined
    this.branchId = value?.branchId
    this.userId = value?.userId
    this.pageSize = value?.pageSize ?? 10
    this.page = value?.page ?? 1
    this.orderBy = value?.orderBy
    this.sortType = value?.sortType
  }
}

//Detail
export class DonatedRequestDetailModel {
  id?: string
  isConfirmable?: boolean
  createdDate?: string
  acceptedDate?: string
  scheduledTimes?: ScheduledTime[]
  status?: string
  note?: string
  acceptedBranch?: AcceptedBranchModel
  donatedItemResponses?: DonatedItemResponseModel[]
  simpleUserResponse?: SimpleUserResponse
  rejectingBranchResponses?: RejectingBranchResponse[]
  simpleActivityResponse?: any
  address: string
  images?: string[]
  location?: [number, number]
  finishedDate?: string

  constructor(value?: Partial<DonatedRequestDetailModel>) {
    this.id = value?.id
    this.isConfirmable = value?.isConfirmable
    this.createdDate = value?.createdDate
    this.acceptedDate = value?.acceptedDate
    this.scheduledTimes = value?.scheduledTimes
    this.status = value?.status
    this.note = value?.note
    this.acceptedBranch = value?.acceptedBranch
    this.donatedItemResponses = value?.donatedItemResponses
    this.rejectingBranchResponses = value?.rejectingBranchResponses
    this.simpleActivityResponse = value?.simpleActivityResponse
    this.simpleUserResponse = value?.simpleUserResponse
    this.address = value?.address ?? '_'
    this.images = value?.images ?? []
    this.location = value?.location ?? [0, 0]
    this.finishedDate = value?.finishedDate
  }
}

export class RejectingBranchResponse extends SimpleBranchResponse {
  rejectingReason?: string

  constructor(value?: Partial<RejectingBranchResponse>) {
    super(value)
    this.rejectingReason = value?.rejectingReason
  }
}

export class AcceptedBranchModel {
  id?: string
  name?: string
  address?: string
  image?: string
  createdDate?: string
  status?: string
  location?: LatLngExpression

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

export class DonatedItemResponseModel {
  id?: string
  quantity?: number
  initialExpirationDate?: string
  status?: string
  itemTemplateResponse?: ItemTemplateResponseModel
  importedQuantity?: number

  constructor(value?: Partial<DonatedItemResponseModel>) {
    this.id = value?.id
    this.quantity = value?.quantity
    this.initialExpirationDate = value?.initialExpirationDate
    this.status = value?.status
    this.itemTemplateResponse = value?.itemTemplateResponse
    this.importedQuantity = value?.importedQuantity || 0
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

export const DonatedRequestStatus = [
  { id: 0, label: 'Chờ xử lí', key: 'PENDING' },
  { id: 1, label: 'Đã chấp nhận', key: 'ACCEPTED' },
  { id: 2, label: 'Từ chối', key: 'REJECTED' },
  { id: 3, label: 'Hủy', key: 'CANCELED' },
  { id: 4, label: 'Hết hạn', key: 'EXPIRED' },
  { id: 5, label: 'Đang xử lí', key: 'PROCESSING' },
  { id: 6, label: 'Hoàn thành', key: 'FINISHED' }
]

export const AidRequestStatus = [
  { id: 0, label: 'Chờ xử lí', key: 'PENDING' },
  { id: 1, label: 'Đã chấp nhận', key: 'ACCEPTED' },
  { id: 2, label: 'Từ chối', key: 'REJECTED' },
  { id: 3, label: 'Hủy', key: 'CANCELED' },
  { id: 4, label: 'Hết hạn', key: 'EXPIRED' },
  { id: 5, label: 'Đang xử lí', key: 'PROCESSING' },
  { id: 6, label: 'Hoàn thành', key: 'FINISHED' }
]
