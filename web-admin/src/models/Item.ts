import { ItemTemplateResponseModel } from './DonatedRequest'

export class Item {
  id: string | undefined
  name: string | undefined
  createdDate: string | undefined
  status: string | undefined
  unit: UnitModel | undefined
  note: string | undefined
  itemCategoryResponse: Category | undefined
  image: string | undefined
  updatedBy: string | undefined
  attributes: Attribute[] | undefined | null
  itemTemplateResponses?: ItemTemplateResponse[]

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

export class ItemTemplateResponse {
  id?: string
  name?: string
  attributes?: AttributeTemplate[]
  note?: string
  image?: string
  estimatedExpirationDays?: number
  maximumTransportVolume?: number
  status?: string | number

  constructor(value?: Partial<ItemTemplateResponse>) {
    this.id = value?.id
    this.name = value?.name
    this.attributes = value?.attributes
    this.note = value?.note
    this.image = value?.image
    this.estimatedExpirationDays = value?.estimatedExpirationDays
    this.maximumTransportVolume = value?.maximumTransportVolume
    this.status = value?.status
  }
}

export class AttributeTemplate {
  itemTemplateAttributeId?: string
  name?: string
  status?: string
  attributeValue?: AttributeValueTemplate

  constructor(value?: Partial<AttributeTemplate>) {
    this.itemTemplateAttributeId = value?.itemTemplateAttributeId
    this.name = value?.name
    this.status = value?.status
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
  itemUnitId: string | undefined
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
    this.itemUnitId = value?.itemUnitId
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
  itemTemplateAttributeId?: string
  name: string
  value: string
  attributeId?: string
  createdBy?: string
  constructor(value?: Partial<AttributeValue>) {
    this.itemTemplateAttributeId = value?.itemTemplateAttributeId
    this.id = value?.itemTemplateAttributeId
    this.value = value?.value || ''
    this.name = value?.name || ''
    this.attributeId = value?.attributeId
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
  id: string | undefined
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
  id?: string
  name?: string
  attribute?: Attribute[]

  constructor(value?: Partial<ItemTemplateModel>) {
    this.id = value?.id
    this.name = value?.name
    this.attribute == value?.attribute
  }
}

export class ItemAvaliableInStockModel {
  estimatedExpirationDays?: number
  id?: string
  image?: string
  maximumTransportVolume?: number
  name?: string
  note?: string
  totalStock?: number
  unit?: string
  item?: ItemTemplateResponseModel
  quantity?: number

  constructor(values?: Partial<ItemAvaliableInStockModel>) {
    this.estimatedExpirationDays = values?.estimatedExpirationDays
    this.id = values?.id
    this.image = values?.image
    this.maximumTransportVolume = values?.maximumTransportVolume
    this.name = values?.name
    this.note = values?.note
    this.totalStock = values?.totalStock
    this.unit = values?.unit
    this.item = values?.item
    this.quantity = values?.quantity || 0
  }
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
    this.itemTemplateId = values?.itemTemplateId
    this.name = values?.name
    this.image = values?.image
    this.unit = values?.unit
    this.attributes = values?.attributes
  }
}
