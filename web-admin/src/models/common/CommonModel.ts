import { ReactNode } from 'react'
import { ItemTemplateResponseModel } from '../DonatedRequest'

export class HeadCell<T> {
  disablePadding?: boolean
  id: keyof T
  label: string | ReactNode
  numeric?: boolean
  minWidth?: number
  width?: number
  maxWidth?: number
  sortable?: boolean
  clickAble?: boolean
  keySort?: string
  format?: (val: T) => string | React.ReactNode

  constructor(value: Partial<HeadCell<T>>) {
    this.id = value.id!
    this.label = value?.label || ''
    this.numeric = value?.numeric || true
    this.minWidth = value?.minWidth || 0
    this.width = value?.width
    this.maxWidth = value?.maxWidth
    this.format = value?.format
    this.disablePadding = value?.disablePadding || false
    this.keySort = value?.keySort
    this.clickAble= value?.clickAble ?? false
    this.sortable = value?.sortable ?? false
  }
}

export class SearchItemParamsModel {
  categoryType: number | null | undefined
  itemCategoryId: string | null | undefined
  name: string | '' | undefined
  pageSize: number
  page: number

  constructor(value?: Partial<SearchItemParamsModel>) {
    this.categoryType = value?.categoryType
    this.itemCategoryId = value?.itemCategoryId
    this.name = value?.name
    this.pageSize = value?.pageSize || 10
    this.page = value?.page || 1
  }
}

export type Order = 'asc' | 'desc' | false

export class QueryAidRequestModel {
  branchId?: string
  startDate?: string
  endDate?: string
  charityId?: string

  constructor(value?: Partial<QueryAidRequestModel>) {
    this.branchId = value?.branchId
    this.startDate = value?.startDate
    this.endDate = value?.endDate
    this.charityId = value?.charityId
  }
}

export class ObjectLabel {
  key: string
  label: string
  value: number

  constructor(value?: Partial<ObjectLabel>) {
    this.key = value?.key ?? '_'
    this.label = value?.label ?? '_'
    this.value = value?.value ?? 0
  }
}

export class ItemTagModel {
  id?: string
  quantity?: number
  initialExpirationDate?: string
  status?: string
  itemTemplateResponse?: ItemTemplateResponseModel

  constructor(value?: Partial<ItemTagModel>) {
    this.id = value?.id
    this.quantity = value?.quantity
    this.initialExpirationDate = value?.initialExpirationDate
    this.status = value?.status
    this.itemTemplateResponse = value?.itemTemplateResponse
  }
}
