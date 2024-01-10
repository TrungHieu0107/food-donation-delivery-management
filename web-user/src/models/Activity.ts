export class ActivityResponseModel {
	id?: string
	name?: string
	address?: string
	startDate?: string
	endDate?: string
	estimatedStartDate?: string
	estimatedEndDate?: string
	deliveringDate?: string
	status?: string
	description?: string
	images?: string[]
	scope?: string
	isNearby?: boolean
	numberOfParticipants?: number
	activityTypeComponents?: string[]
	targetProcessResponses?: TargetProcessResponse[]
	isJoined?: boolean
	branchResponses?: BranchResponseModel[]
	charityUnitResponses?: CharityUnitResponseModel[]
	creater?: UserExecuteModel
	updater?: UserExecuteModel
	totalTargetProcessPercentage: number

	//   targetProcessResponses:

	constructor(value?: Partial<ActivityResponseModel> | any) {
		this.id = value?.id
		this.name = value?.name
		this.startDate = value?.startDate
		this.endDate = value?.endDate
		this.estimatedStartDate = value?.estimatedStartDate
		this.estimatedEndDate = value?.estimatedEndDate
		this.status = value?.status
		this.description = value?.description
		this.images = value?.images
		this.scope = value?.scope
		this.isNearby = value?.isNearby
		this.activityTypeComponents = value?.activityTypeComponents
    this.totalTargetProcessPercentage = value?.totalTargetProcessPercentage || 0
	}
}

export class TargetProcessResponse {
  target?: number
  process?: number
  itemTemplateResponse?: ItemTemplateResponse

  constructor(value?: Partial<TargetProcessResponse>) {
    this.target = value?.target
    this.process = value?.process
    this.itemTemplateResponse = value?.itemTemplateResponse
  }
}

export class ItemTemplateResponse {
	id?: string
	name?: string
	image?: string
	attributeValues?: string[]
	note?: number
	estimatedExpirationDays?: number
	maximumTransportVolume?: number
	unit?: string
	target?: number

	constructor(value?: Partial<ItemTemplateResponse>) {
		Object.assign(this, value)
	}
}

export class QueryActivityListModel {
  name?: string | undefined | null
  status?: string | number //   NOT_STARTED(0), STARTED(1), ENDED(2), INACTIVE(3) - leave null to get all? statuses
  activityTypeIds?: string[] | undefined | null
  startDate?: string | undefined | null
  endDate?: string | undefined | null
  isJoined?: boolean | undefined | null
  branchId?: string | undefined | null
  address: string | undefined | null
  charityUnitId?: string | undefined | null
  pageSize?: number | 9
  page: number | 0
  orderBy?: string | undefined | null
  sortType?: string | number | undefined | null

  constructor(value?: Partial<QueryActivityListModel>) {
    this.name = value?.name
    this.status = value?.status === '-1' ? undefined : value?.status
    this.activityTypeIds = value?.activityTypeIds
    this.startDate = value?.startDate
    this.endDate = value?.endDate
    this.isJoined = value?.isJoined
    this.branchId = value?.branchId
    this.charityUnitId = value?.charityUnitId
    this.pageSize = value?.pageSize || 9
    this.page = value?.page || 0
    this.orderBy = value?.orderBy
    this.sortType = value?.sortType
    this.address = value?.address
  }

  logObjectWithoutEmptyStrings() {
    const filteredObject: Record<string, any> = {}
    const propertyNames = Object.keys(this)

    propertyNames.map(key => {
      const value = (this as any)[key]
      if (!(value === undefined || value === '')) {
        filteredObject[key] = value
      }
    })

    return filteredObject
  }
}

export class ActivityType {
  id: string | undefined
  name: string | undefined

  constructor(value?: Partial<ActivityType> | any) {
    this.id = value ? value.id : undefined
    this.name = value ? value.name : undefined
  }
}

export class UserExecuteModel {
  id?: string
  fullName?: string
  avatar?: string
  role?: string

  constructor(value?: Partial<UserExecuteModel>) {
    this.id = value?.id
    this.fullName = value?.fullName
    this.avatar = value?.avatar
    this.role = value?.role
  }
}

export class BranchResponseModel {
  id?: string
  name?: string
  address?: string
  image?: string
  createdDate?: string
  status?: string
}

export class CharityUnitResponseModel {
  id?: string
  name?: string
  image?: string
  address?: string
  status?: string
  charityName?: string
  charityLogo?: string
}
