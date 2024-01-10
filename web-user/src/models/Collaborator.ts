export class CollaboratorModel {
  fullName?: string
  avatar?: string
  dateOfBirth?: string
  gender?: number
  frontOfIdCard?: File
  backOfIdCard?: File
  note?: string
  status?: string

  constructor(values?: Partial<CollaboratorModel>) {
    this.fullName = values?.fullName
    this.avatar = values?.avatar
    this.dateOfBirth = values?.dateOfBirth
    this.gender = values?.gender
    this.frontOfIdCard = values?.frontOfIdCard
    this.backOfIdCard = values?.backOfIdCard
    this.note = values?.note
    this.status = values?.status
  }
}
