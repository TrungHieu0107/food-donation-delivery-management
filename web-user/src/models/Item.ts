import { ItemTemplateResponse } from './Activity'

export class Item {
	id: string | undefined
	name: string | undefined
	createdDate: string | undefined
	status: string | undefined
	unit?: UnitModel
	note: string | undefined
	itemCategoryResponse: Category | undefined
	image: string | undefined
	updatedBy: string | undefined
	attributes: Attribute[] | undefined | null
	itemTemplateResponses?: ItemTemplateResponses[]

	constructor(value: Partial<Item>) {
		this.id = value?.id
		this.name = value?.name
		this.createdDate = value?.createdDate
		this.status = value?.status
		this.unit = value?.unit
		this.note = value?.note
		this.itemCategoryResponse = value?.itemCategoryResponse
		this.image = value?.image
		this.updatedBy = value?.updatedBy
		this.attributes = value?.attributes
		this.itemTemplateResponses = value?.itemTemplateResponses
	}
}

export class ItemTemplateResponses {
	id?: string
	name?: string
	attributes?: AttributeTemplate[]
	note?: string
	image?: string
	estimatedExpirationDays?: number
	maximumTransportVolume?: number
	status?: string | number
	unit?: string

	constructor(value?: Partial<ItemTemplateResponses>) {
		this.id = value?.id
		this.name = value?.name
		this.attributes = value?.attributes
		this.note = value?.note
		this.image = value?.image
		this.estimatedExpirationDays = value?.estimatedExpirationDays
		this.maximumTransportVolume = value?.maximumTransportVolume
		this.status = value?.status
		this.unit = value?.unit
	}
}

export class AttributeTemplate {
	itemTemplateAttributeId?: string
	name?: string
	attributeValue?: AttributeValueTemplate

	constructor(value?: Partial<AttributeTemplate>) {
		this.itemTemplateAttributeId = value?.itemTemplateAttributeId
		this.name = value?.name
		this.attributeValue = value?.attributeValue
	}
}

export class AttributeValueTemplate {
	value?: string
	attributeValueId?: string

	constructor(value?: Partial<AttributeValueTemplate>) {
		this.value = value?.value
		this.attributeValueId = value?.attributeValueId
	}
}

export class ItemCreatingModel {
	id: string | undefined
	name: string | undefined
	createdDate: string | undefined
	status: number | undefined
	estimatedExpirationDays: number | undefined
	unit: number | undefined
	note: string | undefined
	itemcategoryId: string | undefined
	imageUrl: string | undefined
	updatedBy: string | undefined
	attributes: Attribute[] | undefined | null
	itemTemplates: ItemTemplateCreatingModel[] | undefined

	constructor(value: Partial<ItemCreatingModel>) {
		this.id = value?.id
		this.name = value?.name
		this.createdDate = value?.createdDate
		this.estimatedExpirationDays = value?.estimatedExpirationDays
		this.unit = value?.unit
		this.note = value?.note
		this.itemcategoryId = value?.itemcategoryId
		this.imageUrl = value?.imageUrl
		this.updatedBy = value?.updatedBy
		this.attributes = value?.attributes
		this.itemTemplates = value?.itemTemplates
		this.status = value?.status
	}
}

export class ItemTemplateCreatingModel {
	id?: string
	values: string[] | undefined
	note: string | undefined
	estimatedExpirationDays?: number
	maximumTransportVolume?: number
	imageUrl?: string
	status?: string | number

	constructor(value?: Partial<ItemTemplateCreatingModel>) {
		this.id = value?.id
		this.values = value?.values
		this.note = value?.note
		this.estimatedExpirationDays = value?.estimatedExpirationDays
		this.maximumTransportVolume = value?.maximumTransportVolume
		this.imageUrl = value?.imageUrl
		this.status = value?.status
	}
}

export class Attribute {
	id?: string
	name: string
	itemId?: string
	createdBy?: string
	attributeValues: AttributeValue[]
	status?: string | number

	constructor(value?: Partial<Attribute>) {
		this.id = value?.id
		this.name = value?.name ?? ''
		this.createdBy = value?.createdBy
		this.itemId = value?.itemId
		this.attributeValues = value?.attributeValues ?? []
		this.status = value?.status ?? 0
	}
}

export class AttributeValue {
	id?: string
	value: string
	itemTemplateAttributeId?: string
	createdBy?: string
	constructor(value?: Partial<AttributeValue>) {
		this.id = value?.id
		this.value = value?.value || ''
		this.itemTemplateAttributeId = value?.itemTemplateAttributeId
		this.createdBy = value?.createdBy
	}
}

export class Category {
	id: string
	name: string
	type?: number | string

	constructor(value: Partial<Category>) {
		this.id = value?.id || ''
		this.name = value?.name || ''
		this.type = value?.type
	}
}

export class UnitModel {
	id: number | undefined
	label: string | undefined
	key?: string
	name?: string
	symbol?: string

	constructor(value?: Partial<UnitModel>) {
		this.id = value?.id
		this.label = value?.label
		this.key = value?.key
		this.name = value?.name
		this.symbol = value?.symbol
	}
}

export class ItemTemplateModel {
	id: string | undefined
	name: string | undefined
	createdDate: string | undefined
	status: number | undefined
	estimatedExpirationDays: number | undefined
	unit: number | undefined
	note: string | undefined
	itemcategoryId: string | undefined
	imageUrl: string | undefined
	updatedBy: string | undefined
	attributes: Attribute[] | undefined | null
	itemTemplates: ItemTemplateCreatingModel[] | undefined

	constructor(value: Partial<ItemTemplateModel>) {
		this.id = value?.id
		this.name = value?.name
		this.createdDate = value?.createdDate
		this.estimatedExpirationDays = value?.estimatedExpirationDays
		this.unit = value?.unit
		this.note = value?.note
		this.itemcategoryId = value?.itemcategoryId
		this.imageUrl = value?.imageUrl
		this.updatedBy = value?.updatedBy
		this.attributes = value?.attributes
		this.itemTemplates = value?.itemTemplates
		this.status = value?.status
	}
}

// quyên góp, hỗ trợ
export class CharityItemModel {
	itemTemplateId?: string
	quantity?: number
	item?: ItemTemplateResponses | ItemTemplateResponse
	initialExpirationDate?: Date | string

	constructor(value?: Partial<CharityItemModel>) {
		this.itemTemplateId = value?.itemTemplateId
		this.quantity = value?.quantity
		this.item = value?.item
		this.initialExpirationDate = value?.initialExpirationDate
	}
}

export type ObjectFilterItemWithKeyword = {
	searchKeyWord?: string
	itemCategoryType?: number
	itemCategoryId?: string
	page?: number
	pageSize?: number
}

export class ItemSearchKeywordModel {
	itemTemplateId?: string
	name?: string
	image?: string
	unit?: UnitModel
	attributes?: [
		{
			attributeValue: string
		}
	]

	constructor(values?: Partial<ItemSearchKeywordModel>) {
		Object.assign(this, values)
	}
}

export class ItemDetailSearchKeywordModel {
	id?: string
	name?: string
	attributeValues?: []
	image?: string
	note?: string
	estimatedExpirationDays?: number
	maximumTransportVolume?: number
	unit?: string
	categoryResponse?: Category

	constructor(value: Partial<ItemDetailSearchKeywordModel>) {
		Object.assign(this, value)
	}
}
