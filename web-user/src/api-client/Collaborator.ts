import { CollaboratorModel } from 'src/models/Collaborator'
import axiosClient from './ApiClient'
import moment from 'moment'
import { capitalizeFirstLetter } from 'src/@core/layouts/utils'

export const CollaboratorAPI = {
  register(collaborator: CollaboratorModel) {
    const payload = new FormData()

    for (const [key, value] of Object.entries(collaborator)) {
      switch (key) {
        case 'dateOfBirth':
          payload.append(capitalizeFirstLetter(key), moment(value).toISOString())
          break

        default:
          payload.append(capitalizeFirstLetter(key), value)
      }
    }

    return axiosClient.post('/collaborators', payload, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  handleChangeStatus(status: string) {
    return axiosClient.put('/collaborators', {
      isActive: status === 'ACTIVE'
    })
  }
}
