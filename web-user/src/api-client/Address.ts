import axios from 'axios'
import { ProvinceModel, DistrictModel, WardModel } from 'src/models/common/Address'

export const AddressAPI = {
  async getAllProvince(): Promise<ProvinceModel[]> {
    const provinces = (await axios.get('https://provinces.open-api.vn/api/p/')).data as ProvinceModel[]

    return provinces
  },

  async getDistrictOfProvince(provinceCode: number): Promise<DistrictModel[]> {
    const response = (await axios.get(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`))
      .data as ProvinceModel

    return response.districts ?? []
  },

  async getWardsOfDistrict(districtCode: number): Promise<WardModel[]> {
    const data = (await axios.get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`)).data as DistrictModel

    return data.wards ?? []
  }
}
