import axiosClient from './ApiClient'

export const CategoryAPI = {
  getAllCategories() {
    return axiosClient.get('/item-categories')
  },
  addNew(payload: { name: string; type: string | number }) {
    return axiosClient.post('/item-categories', payload)
  }
}
