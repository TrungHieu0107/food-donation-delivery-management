
export class Account {
  email: string
  password: string

  constructor(value: Partial<Account>) {
    this.email = value.email || ''
    this.password = value.password || ''
  }
}
