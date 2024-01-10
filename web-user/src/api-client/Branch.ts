import { QueryBranchModel } from 'src/models/Branch'
import axiosClient from './ApiClient'

export const BranchAPI = {
  getBranches(payload: QueryBranchModel) {
    return axiosClient.get('/branches', {
      params: payload
    })
  }
}
