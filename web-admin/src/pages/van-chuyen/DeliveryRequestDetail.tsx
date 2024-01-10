'use client'

import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Grid,
  Step,
  StepLabel,
  Stepper,
  Typography
} from '@mui/material'
import { LatLngTuple } from 'leaflet'
import dynamic from 'next/dynamic'
import * as React from 'react'
import { DataLoading } from '../to-chuc-tu-thien/chi-tiet/[id]'
import { ColorlibConnector, ColorlibStepIcon } from './tao-moi/[...slug]'
import CircleIcon from '@mui/icons-material/Circle'
import { KEY } from 'src/common/Keys'
import { DeliveryRequestDetailModel } from 'src/models/DeliveryRequest'
import ListReportOfDeliveryRequest from './ListReportOfDeliveryRequest'
import CancelDeliveryRequestDialog from './CancelDeliveryRequest'

export interface IDeliveryRequestDetailProps {
  data: DeliveryRequestDetailModel | undefined
  isFetchingDetail: boolean
  fetchDetail: () => void
  fetchData: () => void
}

const Map = dynamic(() => import('src/layouts/components/map/RoadMap'), { ssr: false })

export default function DeliveryRequestDetail(props: IDeliveryRequestDetailProps) {
  const [pickupMarker, setPickupMarker] = React.useState<LatLngTuple>()
  const [deliveryMarker, setDeliveryMarker] = React.useState<LatLngTuple>()

  React.useEffect(() => {
    if (!props.data?.deliveryPointResponse?.location || !props.data?.pickUpPoint?.location) {
      return
    }

    const pickup = props.data?.pickUpPoint.location?.toString().split(',')
    const delivery = props.data?.deliveryPointResponse.location?.toString().split(',')

    setPickupMarker([Number.parseFloat(pickup[0]), Number.parseFloat(pickup[1])] as LatLngTuple)
    setDeliveryMarker([Number.parseFloat(delivery[0]), Number.parseFloat(delivery[1])] as LatLngTuple)
  }, [props])

  return (
    <Box display={'flex'} flexDirection={'column'} gap={3}>
      <Map end={(deliveryMarker || undefined) as LatLngTuple} start={(pickupMarker || undefined) as LatLngTuple} />

      <Card>
        <CardHeader
          title={
            <Box display={'flex'} justifyContent={'space-between'}>
              <Typography variant='h6' fontWeight={600}>
                Chi tiết vận chuyển
              </Typography>
              {(props.data?.status === 'ACCEPTED' || props.data?.status === 'PENDING') && (
                <CancelDeliveryRequestDialog
                  id={props.data?.id || ''}
                  fetchDetail={props.fetchDetail}
                  fetchData={props.fetchData}
                />
              )}
            </Box>
          }
        />
        <CardContent>
          <Grid container direction={'column'}>
            <Grid item>
              <Stepper alternativeLabel activeStep={1} connector={<ColorlibConnector />}>
                <Step>
                  <StepLabel StepIconComponent={ColorlibStepIcon}>
                    <DataLoading isLoading={!props.isFetchingDetail && !!props.data} height={50} width={200}>
                      <Typography>{props.data?.pickUpPoint?.address}</Typography>
                      <Typography>({props.data?.pickUpPoint?.name})</Typography>
                    </DataLoading>
                  </StepLabel>
                </Step>
                <Step>
                  <StepLabel StepIconComponent={ColorlibStepIcon}>
                    <DataLoading isLoading={!props.isFetchingDetail && !!props.data} height={50} width={200}>
                      <Typography>{props.data?.deliveryPointResponse?.address}</Typography>
                      <Typography>({props.data?.deliveryPointResponse?.name})</Typography>
                    </DataLoading>
                  </StepLabel>
                </Step>
              </Stepper>
            </Grid>
            <Box my={3}>
              <Typography fontWeight={600}>Thông tin người vận chuyển</Typography>

              {!!props.data?.collaborator ? (
                <Box display={'flex'} flexDirection={'row'} flexWrap={'nowrap'} gap={2} ml={3}>
                  <Avatar
                    src={props.data?.collaborator?.avatar}
                    alt={props.data?.collaborator?.fullName}
                    sx={{
                      width: '100px',
                      height: '100px'
                    }}
                  />
                  <Box display={'flex'} flexDirection={'column'} flexWrap={'nowrap'} justifyContent={'center'}>
                    <Typography fontWeight={550}>{props.data?.collaborator?.fullName}</Typography>
                    <Typography fontWeight={550}>
                      Email:
                      <Typography component={'span'} px={1}>
                        {props.data?.collaborator?.email}
                      </Typography>
                    </Typography>
                    <Typography fontWeight={550}>
                      Số điện thoại:
                      <Typography component={'span'} px={1}>
                        {props.data?.collaborator?.phone}
                      </Typography>
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Typography ml={3}>Đang tìm kiếm người vận chuyển thực hiện</Typography>
              )}
            </Box>
            <Grid item container justifyContent={'space-between'}>
              <Grid item xl lg md sm xs display={'flex'} flexDirection={'column'}>
                <Typography fontWeight={550}>Vật phẩm</Typography>
                <Grid container flexWrap={'nowrap'} flexDirection={'column'} spacing={3}>
                  {props.data?.itemResponses?.map(item => {
                    return (
                      <Grid
                        item
                        key={item.id}
                        display={'flex'}
                        flexDirection={'row'}
                        flexWrap={'nowrap'}
                        gap={2}
                        alignItems={'center'}
                      >
                        <CircleIcon
                          sx={{
                            '&.MuiSvgIcon-root': {
                              fontSize: '13px'
                            }
                          }}
                        />
                        <Grid item xl={3}>
                          <CardMedia component={'img'} image={item.image || KEY.DEFAULT_IMAGE} />
                        </Grid>
                        <Grid item xl={9}>
                          <Typography>{`${item.name} ${
                            item.attributeValues && item.attributeValues?.length > 0
                              ? '-' + item.attributeValues?.join('-')
                              : ''
                          }`}</Typography>
                          <Typography>
                            Nhận:{' '}
                            <Typography component={'span'}>{`${`${item.receivedQuantity || 0} / ${item.quantity} (${
                              item.unit
                            })`}`}</Typography>
                          </Typography>
                        </Grid>
                      </Grid>
                    )
                  })}
                </Grid>
              </Grid>
              <Grid item xl lg md sm xs display={'flex'} flexDirection={'column'}>
                <Typography fontWeight={550}>Khung giờ</Typography>
                <Grid container flexDirection={'column'} spacing={3}>
                  {props.data?.scheduledTimes?.map(item => {
                    return (
                      <Grid
                        item
                        key={item.day}
                        display={'flex'}
                        flexDirection={'row'}
                        flexWrap={'nowrap'}
                        gap={2}
                        alignItems={'center'}
                      >
                        <CircleIcon
                          sx={{
                            '&.MuiSvgIcon-root': {
                              fontSize: '13px'
                            }
                          }}
                        />
                        <Typography>{`${item.day} ${item.startTime}-${item.endTime}`}</Typography>
                      </Grid>
                    )
                  })}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
        <ListReportOfDeliveryRequest id={props?.data?.id} />
      </Card>
    </Box>
  )
}
