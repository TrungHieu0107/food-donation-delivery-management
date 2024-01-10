import { UserModel } from './User'

export class CollaboratorModel extends UserModel {
  fullName?: string
  dateOfBirth?: string
  gender?: number
  frontOfIdCard?: File
  backOfIdCard?: File
  note?: string
  status: string

  constructor(values: Partial<CollaboratorModel>) {
    super(values)
    this.fullName = values?.fullName
    this.dateOfBirth = values?.dateOfBirth
    this.gender = values?.gender
    this.frontOfIdCard = values?.frontOfIdCard
    this.backOfIdCard = values?.backOfIdCard
    this.note = values?.note
    this.status = values?.status ?? '_'
  }
}
