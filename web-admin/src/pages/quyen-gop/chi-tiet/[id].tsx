import { AxiosError } from 'axios'
import { useRouter } from 'next/router'
import * as React from 'react'
import { useEffect, useRef, useState } from 'react'
import { DonatedRequestAPI } from 'src/api-client/DonatedRequest'
import { DonatedRequestDetailModel } from 'src/models/DonatedRequest'
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TypographyProps,
  styled
} from '@mui/material'
import DonatedItemTag from './DonatedItemTag'
import { KEY } from 'src/common/Keys'
import RejectDialog from './RejectDialog'
import DisplayScheduledTime from 'src/@core/layouts/scheduled-time/DisplayScheduledTime'
import UserLayout from 'src/layouts/UserLayout'
import { formateDateDDMMYYYYHHMM } from '../../../@core/layouts/utils'
import { DonatedRequestStatusChip } from '../TableDataDonatedRequest'
import dynamic from 'next/dynamic'
import { LatLngTuple } from 'leaflet'
import useSession from 'src/@core/hooks/useSession'

const Label = styled(Typography)<TypographyProps>(() => ({
  textAlign: 'left',
  fontWeight: 550,
  whiteSpace: 'nowrap'
}))

const Map = dynamic(() => import('src/layouts/components/map/DisplayLocationOnMap'), { ssr: false })

const DevideHeader = (props: { title: string }) => {
  return (
    <Grid container flexWrap={'nowrap'} alignItems={'center'} spacing={2}>
      <Grid item>
        <Typography
          whiteSpace={'nowrap'}
          fontSize={17}
          fontWeight={550}
          sx={{
            color: theme => theme.palette.secondary[theme.palette.mode]
          }}
        >
          {props.title}
        </Typography>
      </Grid>
      <Grid item width={'100%'}>
        <Divider
          sx={{
            width: '100%',
            borderColor: 'rgb(58 53 65 / 25%) !important'
          }}
        />
      </Grid>
    </Grid>
  )
}

export default function DonatedReuqestDetialPage() {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [data, setData] = useState<DonatedRequestDetailModel>()
  const router = useRouter()
  const { id } = router.query

  const [height, setHeight] = useState(350)
  const gridRef = useRef(null)
  const { context } = useSession()

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
    setIsLoading(true)
    try {
      if (!id) return

      fetchData()
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }, [id])

  const fetchData = () => {
    DonatedRequestAPI.getById(id as string)
      .then(data => {
        const dataResponse = new CommonRepsonseModel<DonatedRequestDetailModel>(data)
        setData(dataResponse.data)
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

  return (
    <React.Fragment>
      {!isLoading ? (
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
            <CardHeader title={<DevideHeader title='🍄 Vật phẩm quyên góp' />} />
            <CardContent
              sx={{
                alignItems: 'stretch'
              }}
            >
              {/* thông tin vật phẩm quyên góp */}

              {data?.simpleActivityResponse && (
                <Typography
                  sx={{
                    color: KEY.COLOR.SECONDARY
                  }}
                >{`Các vật phẩm được quyên góp cho hoạt động ${data?.simpleActivityResponse.name}`}</Typography>
              )}
              <Grid container spacing={3} flexDirection={'row'} mb={3}>
                {data?.donatedItemResponses?.map((donatedItem, index) => {
                  return (
                    <Grid key={index} item>
                      <DonatedItemTag donatedItem={donatedItem} />
                    </Grid>
                  )
                })}
              </Grid>
              {/* Thời gian nhận */}
              <DevideHeader title='🖼️ Hình ảnh quyên góp' />
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

          {/* Thời gian nhận */}
          <Card>
            <CardHeader title={<DevideHeader title='🕔 Thời gian có thể nhận' />} />
            <CardContent>
              {data?.scheduledTimes && data?.scheduledTimes.length > 0 && (
                <DisplayScheduledTime data={data.scheduledTimes} />
              )}
            </CardContent>
          </Card>

          {/* Chi nhánh nhận */}
          {data?.acceptedBranch && context.user.role === KEY.ROLE.SYSTEM_ADMIN && (
            <>
              <DevideHeader title='Chi nhánh nhận' />
              <Grid container spacing={3}>
                <Grid item sm={'auto'}>
                  <Avatar
                    src={data?.acceptedBranch?.image ?? ''}
                    variant='circular'
                    sx={{
                      height: '160px',
                      width: '160px',
                      border: '1px solid #d1d1d1'
                    }}
                  ></Avatar>
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
                      <Label>Tên</Label>
                    </Grid>
                    <Grid item>
                      <Typography>{data?.acceptedBranch?.name}</Typography>
                    </Grid>
                  </Grid>
                  <Grid container spacing={3}>
                    <Grid item>
                      <Label>Địa chỉ</Label>
                    </Grid>
                    <Grid item>
                      <Typography>{data?.acceptedBranch?.address}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </>
          )}

          {data?.rejectingBranchResponses && data?.rejectingBranchResponses.length > 0 && (
            <>
              <DevideHeader title='Chi nhánh từ chối' />
              <Grid container spacing={3}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>STT</TableCell>
                        <TableCell>Chi nhánh</TableCell>
                        <TableCell>Lí do</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.rejectingBranchResponses.map((item, index) => {
                        return (
                          <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.rejectingReason}</TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </>
          )}

          {/* Button */}
          <Grid container justifyContent={'center'} spacing={3}>
            <Grid item xl={3} lg={3} md={3} sm={4} xs={6}>
              <Button
                color='secondary'
                variant='outlined'
                onClick={() => {
                  router.push('/quyen-gop')
                }}
                fullWidth
              >
                Quay lại
              </Button>
            </Grid>
            {data?.status === 'ACCEPTED' && (
              <Grid item xl={3} lg={3} md={3} sm={4} xs={6}>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={() => {
                    router.push('/van-chuyen/tao-moi/quyen-gop/' + data.id)
                  }}
                  fullWidth
                >
                  Tạo yêu cầu vận chuyển
                </Button>
              </Grid>
            )}
            {data?.isConfirmable && !data?.acceptedBranch && data?.status === 'PENDING' && (
              <>
                <Grid item xl={3} lg={3} md={3} sm={4} xs={6}>
                  <Button
                    variant='contained'
                    color='secondary'
                    onClick={() => {
                      router.push('/quyen-gop/chap-nhan/' + data.id)
                    }}
                    fullWidth
                  >
                    Xác nhận
                  </Button>
                </Grid>
                <Grid item xl={3} lg={3} md={3} sm={4} xs={6}>
                  <RejectDialog variant='contained' color='secondary' fullWidth donatedId={data.id ?? ''} />
                </Grid>
              </>
            )}
          </Grid>
        </Stack>
      ) : (
        <CircularProgress color='secondary' />
      )}
    </React.Fragment>
  )
}

DonatedReuqestDetialPage.auth = [KEY.ROLE.SYSTEM_ADMIN, KEY.ROLE.BRANCH_ADMIN]
DonatedReuqestDetialPage.getLayout = (page: React.ReactNode) => (
  <UserLayout pageTile='Thông tin chi tiết quyên góp 💁'>{page}</UserLayout>
)
