import { Avatar, Box, Card, CardContent, CardHeader, Grid, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import * as React from 'react'
import { formateDateDDMMYYYY, roundToOneDecimalPlace, secondsToHoursMinutes } from 'src/@core/layouts/utils'
import { DeliveryRequestAPI } from 'src/api-client/DeliveryRequest'
import { ScheduleRouteDetail } from 'src/models/DeliveryRequest'
import { CommonRepsonseModel } from 'src/models/common/CommonResponseModel'
import { BulkyChip, ScheduledRouteStatus } from '../TableDataScheduleRoute'
import { KEY } from 'src/common/Keys'
import UserLayout from 'src/layouts/UserLayout'
import { ReactNode } from 'react'
import TableListScheduleRouteItem from './TableImportStock'
import RouteIcon from '@mui/icons-material/Route'
import { toast } from 'react-toastify'

export default function ImportStockPage() {
  const router = useRouter()
  const { scheduleRouteId } = router.query
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [data, setData] = React.useState<ScheduleRouteDetail>()

  React.useEffect(() => {
    if (!scheduleRouteId) return

    fetchData()
  }, [scheduleRouteId])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const response = await DeliveryRequestAPI.getScheduledRouteDetail(scheduleRouteId as string)
      const commonResponse = new CommonRepsonseModel<ScheduleRouteDetail>(response)
      if (commonResponse.data?.status !== 'PROCESSING') {
        toast.error('Tuyến đường chưa hoàn thành. Bạn không thể thực hiện nhập kho cho tuyến đường này')
        router.push('/van-chuyen/tuyen-duong')

        return
      }
      setData(commonResponse.data)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Grid container flexDirection={'column'} spacing={5}>
      <Grid item container xl={12} lg={12} spacing={5}>
        <Grid item xl lg md sm xs>
          <Card>
            <CardHeader
              title={
                <Typography variant='h6' fontWeight={600}>
                  Thông tin cơ bản
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
                <Typography variant='h6' fontWeight={600}>
                  Người thực hiện
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
                <Typography fontWeight={550}>Đang tìm kiếm cộng tác viên thực hiện</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card style={{ height: '100%', margin: '20px' }}>
        <CardHeader
          title={
            <Box display={'flex'} justifyContent={'space-between'}>
              <Box display={'flex'} gap={2} alignItems={'center'}>
                <RouteIcon color={'secondary'} />
                <Typography variant='h6' fontWeight={600} color={'secondary'}>
                  Danh sách điểm đi
                </Typography>
              </Box>
            </Box>
          }
        />
        <CardContent
          sx={{
            display: 'flex',
            height: '100%'
          }}
        >
          {
            <TableListScheduleRouteItem
              data={data?.orderedDeliveryRequests || []}
              isLoading={isLoading}
              scheduledRouteId={scheduleRouteId as string}
            />
          }
        </CardContent>
      </Card>
    </Grid>
  )
}

ImportStockPage.getLayout = (page: ReactNode) => <UserLayout pageTile='Nhập kho hàng 🚑'>{page}</UserLayout>

ImportStockPage.auth = [KEY.ROLE.SYSTEM_ADMIN, KEY.ROLE.BRANCH_ADMIN]
