import moment from 'moment'
import { formateDateDDMMYYYY } from 'src/@core/layouts/utils'

export interface ObjValidation {
  [key: string]: ValueValidation
}

export interface ObjValidateResult {
  resultError: ObjValidation
  isError: boolean
  value: any
}

const getMessageLengthError = (key: string, minLength?: number, maxLength?: number) => {
  if (minLength && maxLength) return `Độ dài của ${key} phải từ ${minLength} đến ${maxLength} kí tự.`

  if (minLength) return `Độ dài của ${key} phải lớn hơn ${minLength} kí tự.`

  return `Độ dài của ${key} phải nhỏ hơn ${minLength} kí tự.`
}

const getMessageAgeError = (minAge?: number, maxAge?: number) => {
  if (minAge && maxAge) return `Độ tuổi quy định phải từ ${minAge} đến ${maxAge} tuổi.`

  if (minAge) return `Độ tuổi phải lớn hơn ${maxAge} tuổi.`

  return `Độ tuổi phải nhỏ hơn ${minAge} tuổi.`
}

const getMessageRequired = (key: string) => {
  return `${key} là bắt buộc.`
}

function calculateNumOfDays(start: string, end: string): number {
  const a = moment(start)
  const b = moment(end)

  return a.diff(b, 'days') + 1
}

export class ValueValidation {
  value: any | any[]
  error: string
  isError: boolean
  key: string

  constructor(valueValidate?: Partial<ValueValidation>) {
    this.value = valueValidate?.value || null
    this.error = valueValidate?.error || ''
    this.isError = valueValidate?.isError || false
    this.key = valueValidate?.key || ''
  }

  length(minLength?: number, maxLength?: number): ValueValidation {
    const message = getMessageLengthError(this.key, minLength, maxLength)

    if ((minLength && this.value?.length < minLength) || (maxLength && this.value?.length > maxLength)) {
      return new ValueValidation({
        key: this.key,
        value: this.value,
        error: this.isError ? this.error : message,
        isError: true
      })
    }

    return new ValueValidation({
      key: this.key,
      value: this.value,
      error: this.isError ? this.error : '',
      isError: this.isError
    })
  }

  required(): ValueValidation {
    if (this.value === undefined || this.value === null || this.value.length === 0) {
      return new ValueValidation({
        key: this.key,
        value: this.value,
        error: this.isError ? this.error : getMessageRequired(this.key),
        isError: true
      })
    }

    return new ValueValidation({
      key: this.key,
      value: this.value,
      error: this.isError ? this.error : '',
      isError: this.isError
    })
  }

  email(): ValueValidation {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.value)) {
      return new ValueValidation({
        key: this.key,
        value: this.value,
        error: this.isError ? this.error : '',
        isError: this.isError
      })
    }

    return new ValueValidation({
      key: this.key,
      value: this.value,
      error: this.isError ? this.error : 'Email không hợp lệ.',
      isError: true
    })
  }

  age(minAge?: number, maxAge?: number) {
    const currentYear: number = moment().year()
    const birthDay: number = moment(this.value).year()

    const age = currentYear - birthDay

    if ((maxAge && age > maxAge) || (minAge && age < minAge)) {
      return new ValueValidation({
        key: this.key,
        value: this.value,
        error: this.isError ? this.error : getMessageAgeError(minAge, maxAge),
        isError: true
      })
    }

    return new ValueValidation({
      key: this.key,
      value: this.value,
      error: this.isError ? this.error : '',
      isError: this.isError
    })
  }

  phone() {
    if (/^(1\s|1|)?((\(\d{3}\))|\d{3})(\-|\s)?(\d{3})(\-|\s)?(\d{4})$/.test(this.value)) {
      return new ValueValidation({
        key: this.key,
        value: this.value,
        error: this.isError ? this.error : this.isError ? this.error : '',
        isError: this.isError
      })
    }

    return new ValueValidation({
      key: this.key,
      value: this.value,
      error: this.isError ? this.error : 'Số điện thoại không hợp lệ.',
      isError: true
    })
  }

  isDayAfter(start: string) {
    if (!moment(this.value).isAfter(start)) {
      return new ValueValidation({
        key: this.key,
        value: this.value,
        error: this.isError ? this.error : 'Ngày kết thúc phải sau ngày bắt đầu',
        isError: true
      })
    }

    return new ValueValidation({
      key: this.key,
      value: this.value,
      error: this.isError ? this.error : '',
      isError: this.isError
    })
  }

  checkCountDaysBetween2Day(start: string, end: string) {
    if (this.value <= 0) {
      return new ValueValidation({
        key: this.key,
        value: this.value,
        error: this.isError ? this.error : `${this.key} phải lớn hơn 0.`,
        isError: true
      })
    }

    const diff = calculateNumOfDays(end, start)
    if (this.value > diff) {
      return new ValueValidation({
        key: this.key,
        value: this.value,
        error: this.isError
          ? this.error
          : `${this.key} phải từ ${diff} (${formateDateDDMMYYYY(start)} đến ${formateDateDDMMYYYY(end)})`,
        isError: true
      })
    }

    return new ValueValidation({
      key: this.key,
      value: this.value,
      error: this.isError ? this.error : '',
      isError: this.isError
    })
  }

  checkMatch(x: ValueValidation) {
    if (this.value !== x.value) {
      return new ValueValidation({
        key: this.key,
        value: this.value,
        error: this.isError ? this.error : `${this.key} không trùng khớp với ${x.key.toLowerCase()}.`,
        isError: true
      })
    }

    return new ValueValidation({
      key: this.key,
      value: this.value,
      error: this.isError ? this.error : '',
      isError: this.isError
    })
  }

  isPassword() {
    if ((this.value as string)?.indexOf(' ') !== -1) {
      return new ValueValidation({
        key: this.key,
        value: this.value,
        error: this.isError ? this.error : `${this.key} phải không chứa khoảng trắng.`,
        isError: true
      })
    }

    if ((/[a-z]/.test(this.value) || /[A-Z]/.test(this.value)) && /[0-9]/.test(this.value)) {
      return new ValueValidation({
        key: this.key,
        value: this.value,
        error: this.isError ? this.error : '',
        isError: this.isError
      })
    }

    return new ValueValidation({
      key: this.key,
      value: this.value,
      error: this.isError ? this.error : `${this.key} phải chứa ít nhất một chữ hoặc một số.`,
      isError: true
    })
  }
}
