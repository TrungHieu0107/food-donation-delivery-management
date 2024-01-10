import { Avatar, Box, Button, Card, CardContent, CardHeader, Grid, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import * as React from 'react'
import { formateDateDDMMYYYY, roundToOneDecimalPlace, secondsToHoursMinutes } from 'src/@core/layouts/utils'
import { DeliveryRequestAPI } from 'src/api-client/DeliveryRequest'
import {
  ConfirmExportStockScheduleRouteModel,
  NoteStockUpdateHistoryModel,
  ScheduleRouteDetail
} from 'src/models/DeliveryRequest'
import { CommonRepsonseModel } from 'src/models/common/CommonResponseModel'
import { BulkyChip, ScheduledRouteStatus } from '../TableDataScheduleRoute'
import { KEY } from 'src/common/Keys'
import UserLayout from 'src/layouts/UserLayout'
import { ReactNode, useState } from 'react'
import { toast } from 'react-toastify'
import StockExportInfo from './StockExportInfo'
import BackDrop from 'src/layouts/components/loading/BackDrop'

export default function ExportStockPage() {
  const router = useRouter()
  const { scheduleRouteId } = router.query
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [data, setData] = React.useState<ScheduleRouteDetail>()
  const [dataConfirm, setDataConfirm] = React.useState<ConfirmExportStockScheduleRouteModel>()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [stocks, setStocks] = useState<{ [key: string]: NoteStockUpdateHistoryModel }>({})

  React.useEffect(() => {
    if (!scheduleRouteId) return

    const getSampleExportStock = async () => {
      try {
        setIsLoading(true)
        const response = await DeliveryRequestAPI.getSampleITemStockByScheduledRoute(scheduleRouteId as string)
        const commonResponse = new CommonRepsonseModel<ScheduleRouteDetail>(response)
        if (commonResponse.data?.status !== 'DELIVERIED' && commonResponse.data?.type === 'IMPORT') {
          toast.error('Tuyến đường chưa hoàn thành. Bạn không thể thực hiện nhập kho cho tuyến đường này')
          router.push('/van-chuyen/tuyen-duong')

          return
        }

        if (commonResponse.data?.status !== 'PROCESSING' && commonResponse.data?.type === 'EXPORT') {
          toast.error('Tuyến đường đang chuyển bị hoặc đã hoàn thành. Không thể xuất kho cho tuyến đường này.')
          router.push('/van-chuyen/tuyen-duong')

          return
        }

        setData(commonResponse.data)

        const stocks = commonResponse.data?.orderedDeliveryRequests
          ?.at(1)
          ?.deliveryItems?.map(deliveryItem => {
            return deliveryItem.stocks
          })
          .reduce((result, deliveryItem) => result?.concat(deliveryItem || []), [])

        if (stocks) {
          const data = {
            scheduledRouteId: scheduleRouteId as string,
            notesOfStockUpdatedHistoryDetails: stocks.map(item => {
              return new NoteStockUpdateHistoryModel({
                stockId: item.stockId || '',
                note: ''
              })
            })
          }

          const stockMap: { [key: string]: NoteStockUpdateHistoryModel } = {}

          for (const element of data.notesOfStockUpdatedHistoryDetails) {
            stockMap[element.stockId] = element
          }
          setStocks(stockMap)
          setDataConfirm(data)
        } else {
          setDataConfirm(
            new ConfirmExportStockScheduleRouteModel({
              scheduledRouteId: scheduleRouteId as string,
              notesOfStockUpdatedHistoryDetails: []
            })
          )
        }
      } catch (error) {
        router.push(('/van-chuyen/tuyen-duong/chi-tiet/' + scheduleRouteId) as string)
        console.log(error)
      }
    }

    const fetchData = async () => {
      try {
        await getSampleExportStock()
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [router, scheduleRouteId])

  const handleSubmit = async () => {
    try {
      const payload = {
        ...dataConfirm,
        notesOfStockUpdatedHistoryDetails: Object.entries(stocks).map(([key, value]) => {
          return new NoteStockUpdateHistoryModel({
            stockId: key,
            note: value.note
          })
        })
      } as ConfirmExportStockScheduleRouteModel

      setIsSubmitting(true)
      const response = await DeliveryRequestAPI.confirmExportStockForScheduledRoute(payload)
      toast.success(new CommonRepsonseModel<any>(response).message)
      router.push(('/van-chuyen/tuyen-duong/chi-tiet/' + scheduleRouteId) as string)
    } catch (error) {
    } finally {
      setIsSubmitting(false)
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
      {!!dataConfirm && (
        <StockExportInfo
          data={data?.orderedDeliveryRequests || []}
          isLoading={isLoading}
          dataConfirm={dataConfirm}
          handleChangeDataConfirm={setDataConfirm}
          handleChangeStock={function (value: { [key: string]: NoteStockUpdateHistoryModel }): void {
            setStocks({
              ...stocks,
              ...value
            })
          }}
          stocks={stocks}
        />
      )}
      <Box display={'flex'} gap={10} justifyContent={'center'}>
        <Button>Quay lại</Button>
        <Button variant='contained' onClick={handleSubmit} disabled={isSubmitting}>
          Xác nhận
        </Button>
      </Box>
      {isSubmitting && <BackDrop open={true} />}
    </Grid>
  )
}

ExportStockPage.getLayout = (page: ReactNode) => <UserLayout pageTile='Xuất kho vật phẩm 🚑'>{page}</UserLayout>

ExportStockPage.auth = [KEY.ROLE.SYSTEM_ADMIN, KEY.ROLE.BRANCH_ADMIN]
