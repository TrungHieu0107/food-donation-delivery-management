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
    this.currentPage = value?.currentPage || 1
    this.pageSize = value?.pageSize || 10
    this.total = value?.total || 0
  }
}
