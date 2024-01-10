export class AddressModel {
  province: ProvinceModel | undefined | null
  district: DistrictModel | undefined | null
  ward: WardModel | undefined | null
  street?: string

  constructor(value?: Partial<AddressModel>) {
    this.province = value?.province
    this.district = value?.district
    this.ward = value?.ward
    this.street = value?.street
  }

  getAddress() {
    const result: string[] = []
    if (this.province && this.province.name) {
      result.push(this.province.name)
      if (this.district && this.district.name) {
        result.push(this.district.name)
        if (this.ward && this.ward.name) {
          result.push(this.ward.name)
        }
      }
    }

    return result.join(', ')
  }
}

export class ProvinceModel {
  name: string | undefined
  code: number | undefined
  codename: string | undefined
  division_type: string | undefined
  phone_code: number | undefined
  districts: DistrictModel[] | undefined
}

export class DistrictModel {
  name: string | undefined
  code: number | undefined
  codename: string | undefined
  division_type: string | undefined
  short_codename: string | undefined
  wards: WardModel[] | undefined
}

export class WardModel {
  name: string | undefined
  code: number | undefined
  codename: string | undefined
  division_type: string | undefined
  short_codename: string | undefined
}
