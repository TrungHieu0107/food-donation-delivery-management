export class PermissionModel {
  id?: string
  name?: string
  displayName?: string
  status?: string
  rolePermissions?: any[]

  constructor(values: Partial<PermissionModel>) {
    this.id = values?.id
    this.name = values?.name
    this.displayName = values?.displayName
    this.status = values?.status
    this.rolePermissions = values?.rolePermissions
  }
}
