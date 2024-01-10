export class CommonRepsonseModel<T> {
  status: number
  data: T | undefined
  pagination: PaginationModel 
  message: string

  constructor(value: Partial<CommonRepsonseModel<T>>) {
    this.status = value?.status || 0
    this.data = value?.data ?? undefined
    this.pagination = value?.pagination || new PaginationModel()
    this.message = value?.message || ''
  }
}

export class PaginationModel {
  currentPage: number 
  pageSize: number 
  total: number 

  constructor(value?: Partial<PaginationModel>) {
    this.currentPage = value?.currentPage || 0
    this.pageSize = value?.pageSize || 10
    this.total = value?.total || 0
  }
}

export class TransferItemListObject {
  id: string
  image: string
  name: string
  quantity: number
  unit: string
  outOfDate: string
  attributes: string[]

  constructor(values: Partial<TransferItemListObject>) {
    this.id = values.id || ''
    this.image = values?.image || ''
    this.name = values?.name || ''
    this.quantity = values?.quantity || 0
    this.unit = values?.unit || ''
    this.outOfDate = values?.outOfDate || ''
    this.attributes = values?.attributes || []
  }
}