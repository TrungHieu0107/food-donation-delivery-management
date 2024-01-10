import * as React from 'react'
import UserLayout from 'src/layouts/UserLayout'
import DeliveryRequestPage from '..'

export default function DeliveryRequestListPage() {
  return <DeliveryRequestPage />
}

DeliveryRequestListPage.getLayout = (page: React.ReactNode) => (
  <UserLayout pageTile='Danh sách yêu cầu vận chuyển 🚑'>{page}</UserLayout>
)
