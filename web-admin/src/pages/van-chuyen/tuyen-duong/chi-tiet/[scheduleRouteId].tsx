import { Avatar, Box, Button, Card, CardContent, CardHeader, Grid, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import * as React from 'react'
import {
  formateDateDDMMYYYY,
  formateDateDDMMYYYYHHMM,
  roundToOneDecimalPlace,
  secondsToHoursMinutes
} from 'src/@core/layouts/utils'
import { DeliveryRequestAPI } from 'src/api-client/DeliveryRequest'
import { ScheduleRouteDetail } from 'src/models/DeliveryRequest'
import { CommonRepsonseModel } from 'src/models/common/CommonResponseModel'
import { BulkyChip, ScheduledRouteStatus } from '../TableDataScheduleRoute'
import { KEY } from 'src/common/Keys'
import UserLayout from 'src/layouts/UserLayout'
import { ReactNode } from 'react'
import TableListScheduleRouteItem from './TableListScheduleRouteItem'
import dynamic from 'next/dynamic'
import { LatLngTuple } from 'leaflet'
import RouteIcon from '@mui/icons-material/Route'
import CancelDeliveryRequestDialog from '../../CancelDeliveryRequest'

const Map = dynamic(() => import('src/layouts/components/map/DisplayLocationOnMap'), { ssr: false })

export default function DetailOfScheduledRoutePage() {
  const router = useRouter()
  const { scheduleRouteId } = router.query
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [data, setData] = React.useState<ScheduleRouteDetail>()



  React.useEffect(() => {
    if (!scheduleRouteId) return
    
  const fetchData = async () => {
    try {
      setIsLoading(true)
      const response = await DeliveryRequestAPI.getScheduledRouteDetail(scheduleRouteId as string)
      const commonResponse = new CommonRepsonseModel<ScheduleRouteDetail>(response)
      setData(commonResponse.data)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }
    fetchData()
  }, [scheduleRouteId, router])

  const getListLocation = () => {
    const result: { location: LatLngTuple; address: string }[] = []

    if (data?.orderedDeliveryRequests) {
      for (const item of data?.orderedDeliveryRequests) {
        result.push({
          location: [item.location?.at(0), item.location?.at(1)] as LatLngTuple,
          address: item.address || '_'
        })
      }
    }

    return result
  }

  return (
    <Grid container flexDirection={'column'} spacing={5}>
      <Grid item container xl={12} lg={12} spacing={5}>
        <Grid item xl lg md sm xs>
          <Card>
            <CardHeader
              title={
                <Typography variant='h6' fontWeight={600} color={'secondary'}>
                  🔍 Thông tin cơ bản
                </Typography>
              }
            />
            <CardContent>
              <Grid container>
                <Grid item xl lg md sm xs>
                  <Box component={'div'} display={'flex'} gap={2}>
                    <Typography fontWeight={550}>Ngày thực hiện: </Typography>
                    <Typography>{formateDateDDMMYYYY(data?.scheduledTime?.day || '')}</Typography>
                  </Box>
                  <Box component={'div'} display={'flex'} gap={2}>
                    <Typography fontWeight={550}>Thời gian: </Typography>
                    <Typography>{`Từ ${data?.scheduledTime?.startTime} đến ${data?.scheduledTime?.endTime}`}</Typography>
                  </Box>
                  <Box component={'div'} display={'flex'} gap={2}>
                    <Typography fontWeight={550}>Quảng đường: </Typography>
                    <Typography>{`${roundToOneDecimalPlace((data?.totalDistanceAsMeters || 0) / 1000)} Km`}</Typography>
                  </Box>
                  <Box component={'div'} display={'flex'} gap={2}>
                    <Typography fontWeight={550}>Thời gian: </Typography>
                    <Typography>{secondsToHoursMinutes(data?.totalTimeAsSeconds || 0)}</Typography>
                  </Box>
                  {data?.finishedDate && (
                    <Box component={'div'} display={'flex'} gap={2}>
                      <Typography
                        fontWeight={550}
                        sx={{
                          whiteSpace: 'nowrap'
                        }}
                      >
                        Thời gian hoàn thành:
                      </Typography>
                      <Typography
                        sx={{
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {formateDateDDMMYYYYHHMM(data?.finishedDate || '')}
                      </Typography>
                    </Box>
                  )}
                </Grid>
                <Grid item xl lg md sm xs display={'flex'} flexDirection={'column'} gap={2}>
                  <Box display={'flex'} justifyContent={'flex-end'}>
                    {ScheduledRouteStatus[data?.status || '']}
                  </Box>
                  <Box display={'flex'} justifyContent={'flex-end'}>
                    {BulkyChip[data?.bulkyLevel || '']}
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xl lg md sm xs>
          <Card>
            <CardHeader
              title={
                <Typography variant='h6' fontWeight={600} color={'secondary'}>
                  👨🏻‍🦱 Người thực hiện
                </Typography>
              }
            />
            <CardContent>
              {data?.acceptedUser ? (
                <Grid container spacing={5}>
                  <Grid item>
                    <Avatar
                      src={data?.acceptedUser?.avatar}
                      alt={data?.acceptedUser?.fullName}
                      sx={{
                        height: 90,
                        width: 90
                      }}
                    />
                  </Grid>
                  <Grid item xl lg md sm xs display={'flex'} flexDirection={'column'} gap={2}>
                    <Typography fontWeight={550} variant='h6'>
                      {data?.acceptedUser?.fullName || KEY.DEFAULT_VALUE}
                    </Typography>
                    <Box component={'div'} display={'flex'} gap={2}>
                      <Typography fontWeight={550}>Email: </Typography>
                      <Typography>{data?.acceptedUser.email}</Typography>
                    </Box>
                    <Box component={'div'} display={'flex'} gap={2}>
                      <Typography fontWeight={550}>SĐT: </Typography>
                      <Typography>{data?.acceptedUser.phone}</Typography>
                    </Box>
                  </Grid>
                </Grid>
              ) : (
                <Typography fontWeight={550}>Đang tìm kiếm người vận chuyển thực hiện</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid
        item
        container
        spacing={5}
        flexDirection={{
          xl: 'row',
          lg: 'row',
          md: 'column',
          sm: 'column',
          xs: 'column'
        }}
      >
        <Grid item xl={6} lg={6} style={{ height: '100%' }}>
          <Card style={{ height: '100%' }}>
            <CardHeader
              title={
                <Box display={'flex'} justifyContent={'space-between'}>
                  <Box display={'flex'} gap={2} alignItems={'center'}>
                    <RouteIcon color={'secondary'} />
                    <Typography variant='h6' fontWeight={600} color={'secondary'}>
                      Danh sách điểm đi
                    </Typography>
                  </Box>
                  {(data?.orderedDeliveryRequests?.at(1)?.status === 'COLLECTED' ||
                    data?.orderedDeliveryRequests?.at(1)?.status === 'ARRIVED_PICKUP' ||
                    data?.orderedDeliveryRequests?.at(1)?.status === 'ARRIVED_DELIVERY') && (
                      <CancelDeliveryRequestDialog
                        id={data?.orderedDeliveryRequests?.at(1)?.id || ''}
                        fetchDetail={function (): void {
                          return
                        }}
                        fetchData={function (): void {
                          router.push('/van-chuyen/tuyen-duong')
                        }}
                      />
                    )}
                  {data?.status === 'PROCESSING' && data?.type === 'IMPORT' && (
                    <Button
                      variant='contained'
                      color='secondary'
                      onClick={() => {
                        router.push('/van-chuyen/tuyen-duong/nhap-kho/' + scheduleRouteId)
                      }}
                    >
                      Nhập kho
                    </Button>
                  )}
                  {data?.status === 'PROCESSING' && data?.type === 'EXPORT' && (
                    <Button
                      variant='contained'
                      color='secondary'
                      onClick={() => {
                        router.push('/van-chuyen/tuyen-duong/xuat-kho/' + scheduleRouteId)
                      }}
                    >
                      Xuất kho
                    </Button>
                  )}
                </Box>
              }
            />
            <CardContent
              sx={{
                display: 'flex',
                height: '100%'
              }}
            >
              <TableListScheduleRouteItem
                data={data?.orderedDeliveryRequests || []}
                isLoading={isLoading}
                type={data?.type || ''}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xl={6} lg={6} container flexDirection={'column'} spacing={5}>
          <Grid item>
            <Card>
              <CardHeader
                title={
                  <Typography variant='h6' fontWeight={600} color={'secondary'}>
                    Tuyến đường
                  </Typography>
                }
              />
              <CardContent
                sx={{
                  display: 'flex'
                }}
              >
                <Map waypoints={getListLocation()} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

DetailOfScheduledRoutePage.getLayout = (page: ReactNode) => (
  <UserLayout pageTile='Chi tiết lịch trình 🚑'>{page}</UserLayout>
)

DetailOfScheduledRoutePage.auth = [KEY.ROLE.SYSTEM_ADMIN, KEY.ROLE.BRANCH_ADMIN]
