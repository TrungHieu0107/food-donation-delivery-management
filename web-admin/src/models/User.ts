import { LatLngExpression } from 'leaflet'

export class UserModel {
  id?: string
  name?: string
  fullName?: string
  phone?: string
  email?: string
  description?: string
  address?: string
  location?: LatLngExpression
  avatar?: string
  otherContacts?: string

  constructor(value?: Partial<UserModel>) {
    this.id = value?.id
    this.email = value?.email
    this.name = value?.name
    this.fullName = value?.fullName
    this.phone = value?.phone
    this.description = value?.description
    this.address = value?.address
    this.location = value?.location
    this.avatar = value?.avatar
    this.otherContacts = value?.otherContacts
  }
}

export class UserContextModel {
  user: {
    role: string
  }
  accessToken: string
  refreshToken: string

  constructor(value: Partial<UserContextModel>) {
    this.user = {
      role: value?.user?.role || ''
    }
    this.refreshToken = value?.refreshToken || ''
    this.accessToken = value?.accessToken || ''
  }
}
