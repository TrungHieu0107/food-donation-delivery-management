'use client'

import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Grid,
  Paper,
  Step,
  StepConnector,
  StepIconProps,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  TypographyProps,
  stepConnectorClasses,
  styled
} from '@mui/material'
import { useRouter } from 'next/router'
import { ReactNode, useEffect, useRef, useState } from 'react'
import MyLocationIcon from '@mui/icons-material/MyLocation'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { DataLoading } from 'src/pages/to-chuc-tu-thien/chi-tiet/[id]'
import ChooseDeliveryRequestItemForDonated from './ChooseItemDelivery'
import {
  DataForDeliveryRequestModel,
  DeliveryItemsForDeliveryModel,
  DeliveryRequestCreateDataModel,
  DeliveryType
} from 'src/models/DeliveryRequest'
import { DeliveryRequestAPI } from 'src/api-client/DeliveryRequest'
import { KEY } from 'src/common/Keys'
import { ScheduledTime } from 'src/models/DonatedRequest'
import { toast } from 'react-toastify'
import { CommonRepsonseModel } from 'src/models/common/CommonResponseModel'
import BackDrop from 'src/layouts/components/loading/BackDrop'
import { DeliveryRequestCreateDataBranchtoCharityModel } from '../../../models/DeliveryRequest'
import { customColor } from 'src/@core/theme/color'
import DisplayScheduledTime from 'src/@core/layouts/scheduled-time/DisplayScheduledTime'
import UserLayout from 'src/layouts/UserLayout'
import { LatLngTuple } from 'leaflet'
import { formateDateDDMMYYYYHHMM } from 'src/@core/layouts/utils'
import { DonatedRequestStatusChip } from 'src/pages/quyen-gop/TableDataDonatedRequest'
import dynamic from 'next/dynamic'

const Label = styled(Typography)<TypographyProps>(({ theme }) => ({
  textAlign: 'left',
  fontWeight: 700,
  whiteSpace: 'nowrap',
  color: theme.palette.secondary.light
}))

export const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 18
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: `linear-gradient( 95deg, ${theme.palette.primary[theme.palette.mode]}, ${customColor.tertiary})`
    }
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: `linear-gradient( 95deg, ${theme.palette.primary[theme.palette.mode]}, ${customColor.tertiary})`
    }
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderRadius: 1
  }
}))

export const ColorlibStepIconRoot = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean }
}>(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 40,
  height: 40,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && {
    backgroundImage: `linear-gradient( 136deg, ${theme.palette.primary[theme.palette.mode]}, ${customColor.tertiary})`,
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)'
  }),
  ...(ownerState.completed && {
    backgroundImage: `linear-gradient( 136deg, ${theme.palette.primary[theme.palette.mode]}, ${customColor.tertiary})`
  })
}))

export function ColorlibStepIcon(props: StepIconProps) {
  const { active, completed, className } = props

  const icons: { [index: string]: React.ReactElement } = {
    1: <LocationOnIcon />,
    2: <MyLocationIcon />
  }

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  )
}

const Map = dynamic(() => import('src/layouts/components/map/RoadMap'), { ssr: false })

export default function CreateDeliveryRequestPage() {
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true)
  const [isFetchingData, setIsFetchingData] = useState<boolean>(false)
  const [data, setData] = useState<DataForDeliveryRequestModel>()
  const [itemSelected, setItemSelected] = useState<ScheduledTime[]>([])
  const [note, setNote] = useState<string>('')
  const [error, setError] = useState<{
    [key: string]: string
  }>({})
  const [deliveryItemsForDeliveryModel, setDeliveryItemsForDeliveryModel] = useState<DeliveryItemsForDeliveryModel[][]>(
    []
  )

  const router = useRouter()
  const { slug } = router.query

  const [type, id] = (slug as string[]) || ['', '']

  const [height, setHeight] = useState(350)
  const gridRef = useRef(null)

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        setHeight(entry.contentRect.height - 66)
      }
    })

    if (gridRef.current) {
      resizeObserver.observe(gridRef.current)
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  useEffect(() => {
    setIsLoadingData(true)
    try {
      if (slug && !data) {
        if (slug.length !== 2) throw new Error(`Invalid slug`)

        if (type === 'ho-tro' || type === DeliveryType.DONATE) {
          fetchData()
        } else {
          throw new Error(`Invalid slug`)
        }
      }
    } catch (error) {
      console.log(error)
      router.push('/404')
    } finally {
      setIsLoadingData(false)
    }
  }, [slug])

  const fetchData = async () => {
    try {
      const dataResponse = await DeliveryRequestAPI.getDataDetail(id, type)
      console.log(dataResponse.pickUpLocation)

      if (
        dataResponse.pickUpLocation.name === KEY.DEFAULT_VALUE ||
        dataResponse.pickUpLocation.address === KEY.DEFAULT_VALUE
      ) {
        if (type === DeliveryType.DONATE) {
          toast.error('Một số lỗi xảy ra với hệ thống.')
        } else if (type === 'ho-tro') {
          toast.error('Bạn không có quyền thực hiện hành động này.')
        }

        router.push('/danh-sach-yeu-cau-ho-tro')

        return
      }
      setData(dataResponse)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoadingData(false)
    }
  }

  const handleSubmit = async () => {
    try {
      if (itemSelected.length === 0) {
        const newError = error
        newError.ScheduledTime = 'Hãy chọn ít nhất 1 ngày để tạo yêu cầu vận chuyện'
        setError(newError)
        toast.error('Hãy chọn ít nhất 1 ngày để tạo yêu cầu vận chuyện')

        return
      }
      if (Object.entries(error).length > 0) {
        console.log(error)
        Object.entries(error).map(([, value]) => {
          toast.error(value)
        })

        return
      }

      setIsLoadingData(true)

      if (type === 'ho-tro') {
        const payload = new DeliveryRequestCreateDataBranchtoCharityModel({
          aidRequestId: id,
          note: note,
          deliveryItemsForDeliveries: deliveryItemsForDeliveryModel,
          scheduledTimes: itemSelected
        })

        const response = await DeliveryRequestAPI.createDeliveryRequestBranchToCharity(payload)
        toast.success(new CommonRepsonseModel<any>(response).message)
      } else if (type === DeliveryType.DONATE) {
        const payload = new DeliveryRequestCreateDataModel({
          donatedRequestId: id,
          note: note,
          deliveryItemsForDeliveries: deliveryItemsForDeliveryModel.map(deliveryItems =>
            deliveryItems.filter(item => item.quantity > 0)
          ),
          scheduledTimes: itemSelected
        })

        const response = await DeliveryRequestAPI.createDeliveryRequestDonatedToBranch(payload)
        toast.success(new CommonRepsonseModel<any>(response).message)
      }

      router.push('/van-chuyen')
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoadingData(false)
    }
  }

  const handleUpdateDeliveryItems = (value: DeliveryItemsForDeliveryModel[][]) => {
    setDeliveryItemsForDeliveryModel(value)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        padding: 5
      }}
    >
      <Paper
        elevation={4}
        sx={{
          paddingY: '20px'
        }}
      >
        <Stepper alternativeLabel activeStep={1} connector={<ColorlibConnector />}>
          <Step>
            <StepLabel StepIconComponent={ColorlibStepIcon}>
              <DataLoading isLoading={!isLoadingData && !!data} height={50} width={200}>
                <Typography fontWeight={600}>{data?.pickUpLocation.address}</Typography>
                <Typography>({data?.pickUpLocation.name})</Typography>
              </DataLoading>
            </StepLabel>
          </Step>
          <Step>
            <StepLabel StepIconComponent={ColorlibStepIcon}>
              <DataLoading isLoading={!isLoadingData && !!data} height={50} width={200}>
                <Typography fontWeight={600}>{data?.deliveryLocation.address}</Typography>
                <Typography>({data?.deliveryLocation.name})</Typography>
              </DataLoading>
            </StepLabel>
          </Step>
        </Stepper>
      </Paper>
      <Grid container gap={3}>
        <Grid item ref={gridRef} container spacing={3} flexDirection={'column'} xl lg md={12} sm={12} xs={12}>
          <Grid item>
            {/* Thông tin người cho */}
            <Card>
              <CardHeader
                title={
                  <Typography fontWeight={600} variant='h6'>
                    {type === DeliveryType.DONATE ? '🧍 Thông tin người quyên góp' : '🧍 Thông tin người nhận hỗ trợ'}
                  </Typography>
                }
              />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item sm={'auto'}>
                    <Box
                      sx={{
                        padding: '1px',
                        borderRadius: '50%',
                        border: '1px solid',
                        borderColor: theme => theme.palette.grey[400],
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <Avatar
                        src={
                          type === DeliveryType.DONATE ? data?.pickUpLocation?.avatar : data?.deliveryLocation.avatar
                        }
                        variant='circular'
                        sx={{
                          height: '130px',
                          width: '130px',
                          border: '1px solid',
                          borderColor: theme => theme.palette.grey[400]
                        }}
                      ></Avatar>
                    </Box>
                  </Grid>
                  <Grid
                    item
                    sm
                    md
                    xs
                    display={'flex'}
                    flexDirection={'column'}
                    justifyContent={'center'}
                    alignItems={'center'}
                  >
                    <Grid container spacing={3}>
                      <Grid item>
                        <Typography fontWeight={600} variant='h6'>
                          {type === DeliveryType.DONATE ? data?.pickUpLocation?.name : data?.deliveryLocation.name}
                        </Typography>
                      </Grid>
                    </Grid>
                    {type === DeliveryType.AID && (
                      <Grid container spacing={3}>
                        <Grid item>
                          <Label>Thuộc tổ chức: </Label>
                        </Grid>
                        <Grid item>
                          <Typography>
                            {data?.deliveryLocation.charityName}
                          </Typography>
                        </Grid>
                      </Grid>
                    )}
                    <Grid container spacing={3}>
                      <Grid item>
                        <Label>Số điện thoại: </Label>
                      </Grid>
                      <Grid item>
                        <Typography>
                          {type === DeliveryType.DONATE ? data?.pickUpLocation?.phone : data?.deliveryLocation.phone}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item>
            <Card>
              <CardHeader
                title={
                  <Typography fontWeight={600} variant='h6'>
                    {type === DeliveryType.DONATE ? 'ℹ️ Thông tin yêu cầu quyên góp' : ' ℹ️ Thông tin yêu cầu hỗ trợ'}
                  </Typography>
                }
              />
              <CardContent>
                <Grid container flexDirection={'column'} spacing={1}>
                  <Grid item display={'flex'} gap={2}>
                    <Label>{type === DeliveryType.DONATE ? 'Địa chỉ quyên góp:' : 'Địa chỉ yêu cầu hỗ trợ'}</Label>
                    <Typography>
                      {type === DeliveryType.DONATE ? data?.pickUpLocation.address : data?.deliveryLocation.address}
                    </Typography>
                  </Grid>
                  <Grid item display={'flex'} gap={2}>
                    <Label>Trạng thái:</Label>
                    <Typography>{DonatedRequestStatusChip[data?.status || '']}</Typography>
                  </Grid>
                  <Grid item display={'flex'} gap={2}>
                    <Label>Ngày tạo:</Label>
                    <Typography>{formateDateDDMMYYYYHHMM(data?.createdDate || '')}</Typography>
                  </Grid>
                  <Grid item display={'flex'} gap={2}>
                    <Label>Ghi chú:</Label>
                    <Typography>{data?.note}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Grid item xl lg md={12} sm={12} xs={12}>
          <Card
            sx={{
              height: '100%'
            }}
          >
            <CardHeader
              title={
                <Typography fontWeight={600} variant='h6'>
                  🍄 Vị trí bản đồ
                </Typography>
              }
            />

            <CardContent>
              {data?.pickUpLocation.location && data.deliveryLocation.location && (
                <Map
                  start={data?.pickUpLocation.location as LatLngTuple}
                  end={data?.deliveryLocation.location as LatLngTuple}
                  waypoints={[
                    {
                      location: data?.pickUpLocation.location as LatLngTuple,
                      address: data?.pickUpLocation.address || ''
                    },
                    {
                      location: data?.deliveryLocation.location as LatLngTuple,
                      address: data?.deliveryLocation?.address || ''
                    }
                  ]}
                  height={height}
                />
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {type === DeliveryType.DONATE && (
        <Card>
          <CardHeader
            title={
              <Typography fontWeight={600} variant='h6'>
                🖼️ Hình ảnh quyên góp
              </Typography>
            }
          />
          <CardContent>
            {/* Thời gian nhận */}

            <Box display={'flex'} gap={2} mt={1}>
              {data?.images?.map((item, index) => {
                return (
                  <Box key={index} width={'200px'} height={'100px'}>
                    <Card
                      sx={{
                        width: '200px',
                        height: '100px'
                      }}
                    >
                      <CardMedia
                        component={'img'}
                        image={item}
                        sx={{
                          maxWidth: '200px',
                          maxHeight: '100px',
                          borderRadius: '5px'
                        }}
                      />
                    </Card>
                  </Box>
                )
              })}
            </Box>
          </CardContent>
        </Card>
      )}
      <Card
        sx={{
          mt: 3
        }}
      >
        <CardHeader
          title={
            <Typography variant='h6' fontWeight={550}>
              Thời gian vận chuyển
            </Typography>
          }
        />
        <CardContent>
          <DisplayScheduledTime
            data={data?.scheduleTime || []}
            handleClickSchedule={(value: ScheduledTime[]) => {
              const newError = error
              if (value.length === 0) {
                newError.ScheduledTime = 'Hãy chọn ít nhất 1 ngày để tạo yêu cầu vận chuyện'
              } else {
                delete newError['ScheduledTime']
              }
              setError(newError)
              setItemSelected(value)
            }}
          />
        </CardContent>
      </Card>
      <Box display={'flex'} flexDirection={'column'} gap={3} mt={3}>
        {data?.deliveryItems && (
          <ChooseDeliveryRequestItemForDonated
            items={data?.deliveryItems}
            isLoading={isLoadingData}
            updateDeliveryItems={handleUpdateDeliveryItems}
            type={data.type}
            scheduleTimes={itemSelected}
            toogleLoading={setIsFetchingData}
            handleChangeError={(value: { [key: string]: string }) => {
              setError({
                ...(itemSelected.length === 0 && {
                  ScheduledTime: 'Hãy chọn ít nhất 1 ngày để tạo yêu cầu vận chuyện'
                }),
                ...value
              })
            }}
          />
        )}
      </Box>
      <Card>
        <CardHeader
          title={
            <Typography variant='h6' fontWeight={550}>
              Ghi chú
            </Typography>
          }
        />
        <CardContent>
          <TextField
            multiline
            fullWidth
            minRows={3}
            value={note}
            onChange={e => {
              setNote(e.target.value)
            }}
          />
        </CardContent>
      </Card>
      <Grid container spacing={3} justifyContent={'center'}>
        <Grid item md={3} sm={4}>
          <Button
            fullWidth
            onClick={() => {
              router.back()
            }}
            color='secondary'
          >
            Quay lại
          </Button>
        </Grid>
        <Grid item md={3} sm={4}>
          <Button fullWidth variant='contained' onClick={handleSubmit}>
            Tạo yêu cầu
          </Button>
        </Grid>
      </Grid>
      {(isLoadingData || isFetchingData) && <BackDrop open={true} />}
    </Box>
  )
}

CreateDeliveryRequestPage.auth = [KEY.ROLE.SYSTEM_ADMIN, KEY.ROLE.BRANCH_ADMIN]

CreateDeliveryRequestPage.getLayout = (children: ReactNode) => {
  return <UserLayout pageTile='Tạo yêu cầu vận chuyển ⛓️'>{children}</UserLayout>
}
