import axiosClient from './ApiClient'

export const ImageAPI = {
  upload(payload: FormData) {
    return axiosClient.post('/image', payload, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  delete(payload: string) {
    return axiosClient.delete('/image', {
      params: {
        imageUrl: payload
      }
    })
  }
}
