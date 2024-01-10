export class BranchModel {
  id?: string
  name?: string
  address?: string
  image?: string
  createdDate?: string
  status?: string

  constructor(value?: Partial<BranchModel>) {
    this.id = value?.id
    this.name = value?.name
    this.address = value?.address
    this.image = value?.image
    this.createdDate = value?.createdDate
    this.status = value?.status
  }
}

export class QueryBranchModel {
  name?: string
  status?: number
  address?: string
  pageSize: number
  page: number
  orderBy?: string
  sortType?: number

  constructor(value?: Partial<QueryBranchModel>) {
    this.name = value?.name
    this.status = value?.status
    this.address = value?.address
    this.pageSize = value?.pageSize || 100
    this.page = value?.page || 1
    this.orderBy = value?.orderBy
    this.sortType = value?.sortType
  }
}
