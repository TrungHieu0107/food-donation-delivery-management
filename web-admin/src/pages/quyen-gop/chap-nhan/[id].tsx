import { AxiosError } from 'axios'
import { useRouter } from 'next/router'
import * as React from 'react'
import { Fragment, ReactNode, useEffect, useRef, useState } from 'react'
import { DonatedRequestAPI } from 'src/api-client/DonatedRequest'
import { DonatedItemResponseModel, DonatedRequestDetailModel } from 'src/models/DonatedRequest'
import { CommonRepsonseModel } from 'src/models/common/CommonResponseModel'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Typography,
  TypographyProps,
  styled
} from '@mui/material'
import { KEY } from 'src/common/Keys'
import TransferSelectedDonatedItem from './TransferSelectedDonatedItem'
import { toast } from 'react-toastify'
import DisplayScheduledTime from 'src/@core/layouts/scheduled-time/DisplayScheduledTime'
import UserLayout from 'src/layouts/UserLayout'
import { LatLngTuple } from 'leaflet'
import { formateDateDDMMYYYYHHMM } from 'src/@core/layouts/utils'
import { DonatedRequestStatusChip } from '../TableDataDonatedRequest'
import dynamic from 'next/dynamic'
import DialogInputReason from './DialogInputReason'
import BackDrop from 'src/layouts/components/loading/BackDrop'

const Label = styled(Typography)<TypographyProps>(({ theme }) => ({
  textAlign: 'left',
  fontWeight: 700,
  whiteSpace: 'nowrap',
  color: theme.palette.secondary.light
}))

const Map = dynamic(() => import('src/layouts/components/map/DisplayLocationOnMap'), { ssr: false })

const DevideHeader = (props: { title: string }) => {
  return (
    <Grid container flexWrap={'nowrap'} alignItems={'center'} spacing={2}>
      <Grid item>
        <Typography
          whiteSpace={'nowrap'}
          fontSize={17}
          fontWeight={600}
          sx={{
            color: theme => theme.palette.secondary.light
          }}
        >
          {props.title}
        </Typography>
      </Grid>
      <Grid item lg md sm xs>
        <Divider
          sx={{
            width: '100%',
            borderColor: 'rgb(58 53 65 / 10%) !important'
          }}
        />
      </Grid>
    </Grid>
  )
}

export default function AcceptDonatedRequestPage() {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [data, setData] = useState<DonatedRequestDetailModel>()
  const [donatedItemLeft, setDonatedItemLeft] = useState<DonatedItemResponseModel[]>([])
  const [donatedItemRight, setDonatedItemRight] = useState<DonatedItemResponseModel[]>([])
  const [inputReason, setInputReason] = useState<boolean>(false)
  const [isSubmtting, setIsSubmitting] = useState<boolean>(false)
  const router = useRouter()
  const { id } = router.query

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
    const fetchData = () => {
      DonatedRequestAPI.getById(id as string)
        .then(data => {
          const dataResponse = new CommonRepsonseModel<DonatedRequestDetailModel>(data)
          setData(dataResponse.data)
          setDonatedItemLeft(dataResponse.data?.donatedItemResponses ?? [])
        })
        .catch(error => {
          const x: any = (error as AxiosError).response?.data
          const dataResponse = new CommonRepsonseModel<any>(x)
          if (dataResponse.status === 403) {
            router.push('/401')
          }
          console.log(error)
        })
    }

    setIsLoading(true)
    try {
      if (!id) return

      fetchData()
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }, [id, router])

  

  const handleChangeItemSelected = (value: DonatedItemResponseModel[], isAdding: boolean) => {
    if (isAdding) {
      const newItemSelected: DonatedItemResponseModel[] = donatedItemRight ?? []
      const newItemUnSelected: DonatedItemResponseModel[] = []
      donatedItemLeft.map(item => {
        const itemSelected = value.filter(i => item.id === i.id).at(0)
        if (itemSelected) {
          newItemSelected.push(item)
        } else {
          newItemUnSelected.push(item)
        }
      })

      setDonatedItemRight([...newItemSelected])
      setDonatedItemLeft([...newItemUnSelected])
    } else {
      const newItemSelected: DonatedItemResponseModel[] = []
      const newItemUnSelected: DonatedItemResponseModel[] = donatedItemLeft

      donatedItemRight.map(item => {
        const itemSelected = value.filter(i => item.id === i.id).at(0)
        if (itemSelected) {
          newItemUnSelected.push(item)
        } else {
          newItemSelected.push(item)
        }
      })
      setDonatedItemRight([...newItemSelected])
      setDonatedItemLeft([...newItemUnSelected])
    }
  }

  const handleSubmit = async (reason?: string) => {
    setIsSubmitting(true)
    try {
      const payload = {
        id: data?.id ?? '',
        donatedItemIds: donatedItemRight.map(item => item.id ?? '') ?? []
      }

      if (payload.donatedItemIds.length === 0) {
        toast.error('Phải chọn ít nhất 1 vật phẩm')

        return
      }

      if (donatedItemRight.length !== data?.donatedItemResponses?.length && !reason) {
        setInputReason(true)

        return
      }

      const response = await DonatedRequestAPI.acceptDonatedRequest(
        !!reason ? { ...payload, rejectingReason: reason  } : payload
      )
      const commonRepsonse = new CommonRepsonseModel<any>(response)
      router.push('/quyen-gop')
      toast.success(commonRepsonse.message)
    } catch (error) {
      console.log(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Fragment>
      {!isLoading && data ? (
        <Stack direction={'column'} spacing={2}>
          <Grid container gap={3}>
            <Grid item ref={gridRef} container spacing={3} flexDirection={'column'} xl lg md={12} sm={12} xs={12}>
              <Grid item>
                {/* Thông tin người cho */}
                <Card>
                  <CardHeader title={<DevideHeader title='🧍 Thông tin người quyên góp' />} />
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
                            src={data?.simpleUserResponse?.avatar ?? ''}
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
                              {data?.simpleUserResponse?.fullName}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                          <Grid item>
                            <Label>Số điện thoại: </Label>
                          </Grid>
                          <Grid item>
                            <Typography>{data?.simpleUserResponse?.phone}</Typography>
                          </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                          <Grid item>
                            <Label>Vai trò :</Label>
                          </Grid>
                          <Grid item>
                            <Typography>{data?.simpleUserResponse?.role}</Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item>
                <Card>
                  <CardHeader title={<DevideHeader title='ℹ️ Thông tin yêu cầu quyên góp' />} />
                  <CardContent>
                    <Grid container flexDirection={'column'} spacing={1}>
                      <Grid item display={'flex'} gap={2}>
                        <Typography
                          fontWeight={600}
                          sx={{
                            whiteSpace: 'nowrap'
                          }}
                        >
                          Địa chỉ quyên góp:
                        </Typography>
                        <Typography>{data?.address}</Typography>
                      </Grid>
                      <Grid item display={'flex'} gap={2}>
                        <Typography
                          fontWeight={600}
                          sx={{
                            whiteSpace: 'nowrap'
                          }}
                        >
                          Trạng thái:
                        </Typography>
                        <Typography>{DonatedRequestStatusChip[data?.status || '']}</Typography>
                      </Grid>
                      <Grid item display={'flex'} gap={2}>
                        <Typography
                          fontWeight={600}
                          sx={{
                            whiteSpace: 'nowrap'
                          }}
                        >
                          Ngày tạo:
                        </Typography>
                        <Typography>{formateDateDDMMYYYYHHMM(data?.createdDate || '')}</Typography>
                      </Grid>
                      <Grid item display={'flex'} gap={2}>
                        <Typography
                          fontWeight={600}
                          sx={{
                            whiteSpace: 'nowrap'
                          }}
                        >
                          Ghi chú:
                        </Typography>
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
                <CardHeader title={<DevideHeader title='🍄 Vị trí bản đồ' />} />
                <CardContent>
                  {data?.location && (
                    <Map
                      waypoints={[
                        {
                          location: data?.location as LatLngTuple,
                          address: data?.address || ''
                        }
                      ]}
                      height={height}
                    />
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Card>
            <CardHeader title={<DevideHeader title='🖼️ Hình ảnh quyên góp' />} />
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

          <Card>
            <CardHeader title={<DevideHeader title='🕔  ' />} />
            <CardContent>
              {/* Thời gian nhận */}

              <Grid container spacing={3} flexDirection={'column'} pl={5}>
                <DisplayScheduledTime data={data?.scheduledTimes || []} />
              </Grid>
            </CardContent>
          </Card>

          {/* thông tin vật phẩm quyên góp */}
          <DevideHeader title='Thông tin vật phẩm quyên góp' />
          {data?.simpleActivityResponse && (
            <Typography
              sx={{
                color: KEY.COLOR.SECONDARY
              }}
            >{`Các vật phẩm được quyên góp cho hoạt động ${data?.simpleActivityResponse.name}`}</Typography>
          )}
          <Grid container spacing={3} flexDirection={'row'}>
            <TransferSelectedDonatedItem
              donatedItemLeft={donatedItemLeft}
              donatedItemRight={donatedItemRight}
              handleChangeItemSelected={handleChangeItemSelected}
              donatedItems={data?.donatedItemResponses ?? []}
            />
          </Grid>

          {/* Button */}
          <Grid container justifyContent={'center'} spacing={3}>
            <Grid item>
              <Button
                color='secondary'
                onClick={() => {
                  router.push('/quyen-gop')
                }}
              >
                Quay lại
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant='contained'
                color='secondary'
                onClick={() => {
                  handleSubmit()
                }}
                disabled={isSubmtting}
              >
                Xác nhận
              </Button>
            </Grid>
          </Grid>
        </Stack>
      ) : (
        <Box display={'flex'} height={450} justifyContent={'center'} alignItems={'center'}>
          <CircularProgress color='secondary' />
        </Box>
      )}
      <DialogInputReason
        open={inputReason}
        handleClose={() => {
          setInputReason(false)
        }}
        donatedItems={donatedItemLeft}
        handleSubmit={handleSubmit}
      />
      {isSubmtting || (isLoading && <BackDrop open={true} />)}
    </Fragment>
  )
}

AcceptDonatedRequestPage.auth = [KEY.ROLE.BRANCH_ADMIN]

AcceptDonatedRequestPage.getLayout = (page: ReactNode) => (
  <UserLayout pageTile='Chấp nhận yêu cầu quyên góp 💁'>{page}</UserLayout>
)
