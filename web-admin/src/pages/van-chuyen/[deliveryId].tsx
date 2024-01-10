import DeliveryRequestPage from '.'
import { useRouter } from 'next/router'
import { ReactNode, useEffect, useState } from 'react'
import { DeliveryRequestAPI } from 'src/api-client/DeliveryRequest'
import UserLayout from 'src/layouts/UserLayout'
import { DeliveryRequestDetailModel } from 'src/models/DeliveryRequest'
import { CommonRepsonseModel } from 'src/models/common/CommonResponseModel'

export default function DeliveryRequestPageWithDetail() {
  const router = useRouter()
  const { deliveryId } = router.query
  const [currentSelectedDetail, setCurrentSelectedDetail] = useState<DeliveryRequestDetailModel>(
    new DeliveryRequestDetailModel({})
  )
  const [isFetchingDetail, setIsFetchingDetail] = useState<boolean>(true)

  useEffect(() => {
    const fetchDetail = async (id: string) => {
      try {
        setIsFetchingDetail(true)
        const response = await DeliveryRequestAPI.getDetailOfDeliveryRequest(id || '')
        setCurrentSelectedDetail(
          new CommonRepsonseModel<DeliveryRequestDetailModel>(response).data || new DeliveryRequestDetailModel({})
        )
      } catch (error) {
        console.log(error)
        router.push('/van-chuyen')
      } finally {
        setIsFetchingDetail(false)
      }
    }

    if (deliveryId) fetchDetail(deliveryId as string)
  }, [deliveryId, router])

  const getType = (deliveryType: string | undefined) => {
    let url = ''
    switch (deliveryType) {
      case 'IMPORT':
        url = 'DONATED_REQUEST_TO_BRANCH'
        break
      case 'EXPORT':
        url = 'BRANCH_TO_AID_REQUEST'
        break

      default:
        break
    }

    return url
  }

  return (
    <DeliveryRequestPage
      detail={currentSelectedDetail}
      isFetchingDetail={isFetchingDetail}
      type={getType(currentSelectedDetail?.deliveryType)}
    />
  )
}

DeliveryRequestPageWithDetail.getLayout = (page: ReactNode) => (
  <UserLayout pageTile='Danh sách vận chuyển 🚑'>{page}</UserLayout>
)
