export class RoleModel {
  id?: string
  name?: string
  displayName?: string
  users?: any[]
  rolePermissions?: any[]

  constructor(values?: Partial<RoleModel>) {
    this.id = values?.id
    this.name = values?.name
    this.displayName = values?.displayName
    this.users = values?.users
    this.rolePermissions = values?.rolePermissions
  }
}
