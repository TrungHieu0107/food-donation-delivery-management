import axiosClient from './ApiClient'

export const CategoryAPI = {
  getAllCategories() {
    return axiosClient.get('/item-categories')
  }
}
