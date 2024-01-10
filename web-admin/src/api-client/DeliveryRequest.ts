import { ConfirmExportStockScheduleRouteModel, DeliveryType } from './../models/DeliveryRequest'
import { CommonRepsonseModel } from 'src/models/common/CommonResponseModel'
import { DonatedRequestAPI } from './DonatedRequest'
import { AidRequestDetailModel } from 'src/models/AidRequest'
import { DonatedRequestDetailModel } from 'src/models/DonatedRequest'
import { AidRequestAPI } from './AidRequest'
import {
  DataForDeliveryRequestModel,
  DeliveryItemModel,
  DeliveryRequestCreateDataModel,
  LocationModel,
  ObjectFilterScheduledRoute,
  ObjectImportStockDeliveryRequest
} from 'src/models/DeliveryRequest'
import axiosClient from './ApiClient'
import { DeliveryRequestCreateDataBranchtoCharityModel } from '../models/DeliveryRequest'

export const DeliveryRequestAPI = {
  async getDataDetail(id: string, type: string) {
    try {
      if (type === DeliveryType.AID) {
        const repsonse = await AidRequestAPI.getById(id)
        const commonResponse = new CommonRepsonseModel<AidRequestDetailModel>(repsonse)

        return new DataForDeliveryRequestModel({
          deliveryItems: commonResponse.data?.aidItemResponses
            ?.filter(item => item.status !== 'REJECTED')
            ?.map(
              item =>
                new DeliveryItemModel({
                  id: item.id,
                  itemTemplateResponse: item.itemResponse,
                  quantity: item.quantity,
                  exportedQuantity: item.exportedQuantity || 0,
                  status: item.status
                })
            ),
          scheduleTime: commonResponse.data?.scheduledTimes,
          deliveryLocation: new LocationModel({
            avatar: commonResponse.data?.charityUnitResponse?.image,
            phone: commonResponse.data?.charityUnitResponse?.phone || '_',
            name: `${commonResponse.data?.charityUnitResponse?.name}`,
            address: commonResponse.data?.charityUnitResponse?.address,
            charityName: commonResponse.data?.charityUnitResponse?.charityName
          }),
          pickUpLocation: new LocationModel({
            avatar: commonResponse.data?.startingBranch?.image,
            name: `${commonResponse.data?.startingBranch?.name}`,
            address: commonResponse.data?.startingBranch?.address,
            location: commonResponse.data?.startingBranch?.location
          }),
          type: type,
          note: commonResponse.data?.note,
          status: commonResponse.data?.status,
          createdDate: commonResponse.data?.createdDate
        })
      } else if (type === DeliveryType.DONATE) {
        const repsonse = await DonatedRequestAPI.getById(id)
        const commonResponse = new CommonRepsonseModel<DonatedRequestDetailModel>(repsonse)

        return new DataForDeliveryRequestModel({
          deliveryItems: commonResponse.data?.donatedItemResponses
            ?.filter(item => item.status === 'ACCEPTED')
            ?.map(
              item =>
                new DeliveryItemModel({
                  id: item.id,
                  itemTemplateResponse: item.itemTemplateResponse,
                  initialExpirationDate: item.initialExpirationDate,
                  quantity: item.quantity
                })
            ),
          scheduleTime: commonResponse.data?.scheduledTimes,
          deliveryLocation: new LocationModel({
            avatar: commonResponse.data?.simpleUserResponse?.avatar,
            name: `${commonResponse.data?.acceptedBranch?.name}`,
            address: commonResponse.data?.acceptedBranch?.address,
            location: commonResponse.data?.acceptedBranch?.location
          }),
          pickUpLocation: new LocationModel({
            avatar: commonResponse.data?.simpleUserResponse?.avatar,
            name: `${commonResponse.data?.simpleUserResponse?.fullName}`,
            address: commonResponse.data?.address,
            phone: commonResponse.data?.simpleUserResponse?.phone,
            role: commonResponse.data?.simpleUserResponse?.role,
            location: commonResponse.data?.location
          }),
          type: type,
          note: commonResponse.data?.note,
          images: commonResponse.data?.images,
          status: commonResponse.data?.status,
          createdDate: commonResponse.data?.createdDate
        })
      } else {
        throw new Error(`Invalid slug`)
      }
    } catch (error) {
      throw error
    }
  },

  createDeliveryRequestDonatedToBranch(value: DeliveryRequestCreateDataModel) {
    return axiosClient.post('/delivery-requests/donated-request-to-branch', value)
  },

  createDeliveryRequestBranchToCharity(value: DeliveryRequestCreateDataBranchtoCharityModel) {
    return axiosClient.post('/delivery-requests/branch-to-aid-request', value)
  },

  getListDeliveryRequest(payload: any) {
    return axiosClient.get('/delivery-requests', {
      params: { ...payload }
    })
  },

  getDetailOfDeliveryRequest(deliveryRequestId: string) {
    return axiosClient.get('/delivery-requests/' + deliveryRequestId)
  },

  getScheduledRoute(payload: ObjectFilterScheduledRoute) {
    return axiosClient.get('/scheduled-routes/admin', {
      params: {
        ...payload,
        sortType: 0
      }
    })
  },
  getScheduledRouteDetail(id: string) {
    return axiosClient.get('/scheduled-routes/' + id + '/admin')
  },

  importStock(payload: ObjectImportStockDeliveryRequest) {
    return axiosClient.put('/scheduled-routes/scheduled-route-type-donated-requests-to-branch', payload)
  },

  createScheduleRoute(type: number) {
    return axiosClient.post('/scheduled-routes?deliveryType=' + type)
  },

  getSampleITemStockByScheduledRoute(id: string) {
    return axiosClient.get('/scheduled-routes/scheduled-route-type-branch-to-charity-unit/' + id)

    // return Promise.resolve({
    //   status: 200,
    //   data: {
    //     id: 'edc59670-5c8a-ee11-b75c-6045bd211e64',
    //     numberOfDeliveryRequests: 1,
    //     scheduledTime: {
    //       day: '2023-11-25',
    //       startTime: '07:00',
    //       endTime: '23:30'
    //     },
    //     orderedDeliveryRequests: [
    //       {
    //         id: null,
    //         status: null,
    //         address: 'Long Thạnh Mỹ, Quận 9, Thành phố Hồ Chí Minh',
    //         location: [10.841258610402729, 106.80986783307503],
    //         currentScheduledTime: null,
    //         images: null,
    //         proofImage: null,
    //         avatar:
    //           'https://storage.googleapis.com/download/storage/v1/b/fooddonationdeliveryrequest.appspot.com/o/f152a272-83da-494d-a4d4-7aacd59f47f5.png?generation=1695732440681501&alt=media',
    //         name: 'Từ Tâm số 1',
    //         phone: '0223456789',
    //         activityId: null,
    //         activityName: null,
    //         deliveryItems: null
    //       },
    //       {
    //         id: '0272a7e3-bb89-ee11-b75c-6045bd211e64',
    //         status: 'ARRIVED_PICKUP',
    //         address: 'Lô E2a-7, Trường Đại học FPT TP.HCM, Đường D1, Phường Long Thạnh Mỹ, Thành phố Thủ Đức, Việt Nam',
    //         location: [10.841258610402729, 106.80986783307503],
    //         currentScheduledTime: {
    //           day: '2023-11-25',
    //           startTime: '07:00',
    //           endTime: '23:30'
    //         },
    //         images: null,
    //         proofImage: null,
    //         avatar:
    //           'https://storage.googleapis.com/download/storage/v1/b/fooddonationdeliveryrequest.appspot.com/o/b0082381-08b0-419a-828c-1b54b4a223b3.png?generation=1694755421417315&alt=media',
    //         name: 'Hội Chữ thập đỏ Việt Nam chi nhánh chính',
    //         phone: '0223456789',
    //         activityId: null,
    //         activityName: null,
    //         deliveryItems: [
    //           {
    //             deliveryItemId: '0372a7e3-bb89-ee11-b75c-6045bd211e64',
    //             name: 'Nước tương 1l, Mặn',
    //             image:
    //               'https://storage.googleapis.com/download/storage/v1/b/fooddonationdeliveryrequest.appspot.com/o/7d593df2-9c97-4ff3-914b-f798febb5d0e.jpg?generation=1696512074491022&alt=media',
    //             unit: 'Chai',
    //             quantity: 12,
    //             stocks: [
    //               {
    //                 stockId: '3a89cfbf-6e76-ee11-9f24-005056c00008',
    //                 quantity: 12,
    //                 expirationDate: '2024-01-01T00:00:00'
    //               },
    //               {
    //                 stockId: '3a89cfbf-6e76-ee11-9f24-231231231rew',
    //                 quantity: 12,
    //                 expirationDate: '2024-01-01T00:00:00'
    //               }
    //             ],
    //             initialExpirationDate: null,
    //             receivedQuantity: null
    //           },
    //           {
    //             deliveryItemId: '0472a7e3-bb89-ee11-b75c-6045bd211e64',
    //             name: 'Cá',
    //             image:
    //               'https://storage.googleapis.com/download/storage/v1/b/fooddonationdeliveryrequest.appspot.com/o/3bdbb11c-6bf2-4485-88c2-49e060226d9c.jpg?generation=1695890299748342&alt=media',
    //             unit: 'Kí',
    //             quantity: 12,
    //             stocks: [
    //               {
    //                 stockId: 'cb019b24-6f76-ee11-9f24-005056c00008',
    //                 quantity: 12,
    //                 expirationDate: '2024-01-01T00:00:00'
    //               }
    //             ],
    //             initialExpirationDate: null,
    //             receivedQuantity: null
    //           }
    //         ]
    //       }
    //     ],
    //     totalDistanceAsMeters: 0,
    //     totalTimeAsSeconds: 300,
    //     bulkyLevel: 'NOT_BULKY',
    //     type: 'EXPORT',
    //     status: 'PROCESSING',
    //     acceptedUser: {
    //       id: 'bed94e48-4e57-ee11-9937-6045bd1b698d',
    //       fullName: 'Unknow và Unknow',
    //       avatar:
    //         'https://storage.googleapis.com/download/storage/v1/b/fooddonationdeliveryrequest.appspot.com/o/54b5de56-f32b-40e2-82eb-752136cf4b83.jpg?generation=1700703344474973&alt=media',
    //       role: null,
    //       phone: '0382212074',
    //       email: 'datnhtse151251@fpt.edu.vn',
    //       status: null
    //     }
    //   },
    //   pagination: null,
    //   message: 'Lấy lịch trình vận chuyển thành công.'
    // })
  },

  confirmExportStockForScheduledRoute(payload: ConfirmExportStockScheduleRouteModel) {
    return axiosClient.put('/scheduled-routes/scheduled-route-type-branch-to-charity-unit/', payload)
  },

  cancelDeliveryRequest(id: string, reason: string) {
    return axiosClient.delete('/delivery-requests/' + id, {
      params: {
        canceledReason: reason
      }
    })
  },

  getStatisticalsOfAllStatus(params: { startDate?: string; endDate?: string }) {
    return axiosClient.get('delivery-requests/statistics/all-status', {
      params: {
        ...params
      }
    })
  },
  
  getDetialOfDeliveryRequest(deliveryId: string) {
    return axiosClient.get('/delivery-requests/' + deliveryId)
  }
}
