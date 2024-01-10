import { ObjValidateResult, ObjValidation, ValueValidation } from 'src/utils/validation/validation'

export class Account {
  email: string
  password: string

  constructor(value: Partial<Account>) {
    this.email = value.email || ''
    this.password = value.password || ''
  }

  public validate(): ObjValidateResult {
    const result: ObjValidation = {}
    let isError = false

    //Email validation
    result.email = new ValueValidation({
      key: 'Email',
      value: this.email
    })
      .email()
      .required()
    isError = result.email.isError

    //Password validation
    // result.password = new ValueValidation({
    //   key: 'Mật khẩu',
    //   value: this.password
    // })
    //   .required()
    //   .isPassword()
    // isError = result.password.isError

    return {
      isError: isError,
      resultError: result,
      value: new Account({
        email: this.email,
        password: this.password
      })
    } as ObjValidateResult
  }
}
