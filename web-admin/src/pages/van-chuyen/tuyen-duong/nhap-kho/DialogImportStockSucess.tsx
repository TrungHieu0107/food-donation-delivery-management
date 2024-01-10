import { Box, Button, Card, CardMedia, Divider, Grid, Stack, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { Fragment, useEffect, useState } from 'react'
import DialogCustom from 'src/@core/layouts/components/shared-components/Dialog'
import { formateDateDDMMYYYY } from 'src/@core/layouts/utils'
import { customColor } from 'src/@core/theme/color'
import { DeliveryRequestAPI } from 'src/api-client/DeliveryRequest'
import { ScheduleRouteDetail, ScheduledRouteDeliveryRequestDetail } from 'src/models/DeliveryRequest'
import { CommonRepsonseModel } from 'src/models/common/CommonResponseModel'

export interface IDialogImportStockSucessProps {
  scheduledRouteId: string
  open: boolean
}

export default function DialogImportStockSucess(props: IDialogImportStockSucessProps) {
  const { scheduledRouteId, open = false } = props
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [scheduledRouteImportedList, setScheduledRouteImportedList] = useState<ScheduledRouteDeliveryRequestDetail[]>(
    []
  )

  useEffect(() => {
    if (!scheduledRouteId || !open) return

    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await DeliveryRequestAPI.getScheduledRouteDetail(scheduledRouteId as string)
        const commonResponse = new CommonRepsonseModel<ScheduleRouteDetail>(response)
        const list: ScheduledRouteDeliveryRequestDetail[] =
          commonResponse.data?.orderedDeliveryRequests?.reduce(
            (result, deliveryItem) => result?.concat(deliveryItem || []),
            [] as ScheduledRouteDeliveryRequestDetail[]
          ) || ([] as ScheduledRouteDeliveryRequestDetail[])

        setScheduledRouteImportedList(list)
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [scheduledRouteId, open])

  const handleClose = () => {
    if (isLoading) return

    router.push('/van-chuyen/tuyen-duong')
  }

  return (
    <Fragment>
      <DialogCustom
        content={
          <Stack
            display={'flex'}
            flexDirection={'column'}
            gap={1}
            divider={<Divider orientation='horizontal' />}
            sx={{
              padding: '10px'
            }}
          >
            {scheduledRouteImportedList.map((scheduledRouteImported, index) => {
              if (!scheduledRouteImported.deliveryItems) return

              if (!(scheduledRouteImported.status === 'DELIVERED' || scheduledRouteImported.status === 'FINISHED')) return

                return (
                  <Box key={index} display={'flex'} flexDirection={'column'}>
                    <Typography
                      sx={{
                        width: '100%',
                        paddingY: '10px'
                      }}
                    >
                      Vật phẩm nhận tại
                      <Typography component={'span'} fontWeight={600} px={2} sx={{ color: customColor.primary }}>
                        {scheduledRouteImported.address}
                      </Typography>{' '}
                      được quyên góp bởi{' '}
                      <Typography component={'span'} fontWeight={600} px={2} sx={{ color: customColor.primary }}>
                        {scheduledRouteImported.name}
                      </Typography>
                    </Typography>
                    {scheduledRouteImported.deliveryItems?.map((item, index) => {
                      return (
                        <Box key={index} display={'flex'} flexDirection={'row'} gap={2} flexWrap={'wrap'}>
                          {scheduledRouteImported.deliveryItems?.map((item, index) => {
                            return (
                              <Card
                                key={index}
                                sx={{
                                  padding: '5px',
                                  width: '400px'
                                }}
                              >
                                <Grid container flexWrap={'nowrap'} alignItems={'center'} spacing={3}>
                                  <Grid item xl={3} lg={3} md={3} xs={3} sm={3}>
                                    <CardMedia component={'img'} alt={item.name} src={item.image} />
                                  </Grid>
                                  <Grid item display={'flex'} flexDirection={'column'}>
                                    <Typography fontWeight={500}>{item.stocks?.at(0)?.stockCode}</Typography>
                                    <Typography fontWeight={800} variant='body2'>{`${item.name}`}</Typography>
                                    <Typography fontWeight={500} variant='body2'>
                                      Số lượng nhận/vận chuyển:
                                      <Typography component={'span'} variant='body2'>
                                        {item.stocks?.at(0)?.quantity}/{item.quantity} ({item.unit})
                                      </Typography>
                                    </Typography>
                                    <Typography fontWeight={500} variant='body2'>
                                      Hạn sử dụng:
                                      <Typography component={'span'} variant='body2' px={2}>
                                        {formateDateDDMMYYYY(item.stocks?.at(0)?.expirationDate || '')}
                                      </Typography>
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </Card>
                            )
                          })}
                        </Box>
                      )
                    })}
                  </Box>
                )
            })}
            <Button size='small' onClick={handleClose} variant='contained'>
              {' '}
              Xác nhận
            </Button>
          </Stack>
        }
        width={900}
        handleClose={handleClose}
        open={open && !isLoading}
        title={'Danh sách vật phẩm đã được nhập kho'}
      />
    </Fragment>
  )
}
