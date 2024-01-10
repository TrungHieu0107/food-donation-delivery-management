import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined'
import BeenhereOutlinedIcon from '@mui/icons-material/BeenhereOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'

// import DoneOutlineOutlinedIcon from '@mui/icons-material/DoneOutlineOutlined'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import VolunteerActivismOutlinedIcon from '@mui/icons-material/VolunteerActivismOutlined'
import YardOutlinedIcon from '@mui/icons-material/YardOutlined'
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
  Button,
  CardActions,
  Select,
  MenuItem
} from '@mui/material'
import useSession from 'src/@core/hooks/useSession'
import { useRouter } from 'next/router'
import React, { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import axiosClient from 'src/api-client/ApiClient'
import { KEY } from 'src/common/Keys'
import { GiftLoading } from 'src/layouts/components/loading/BackDrop'
import RejectAidRequestDialog from '../RejectDialog'
import DisplayScheduledTime from 'src/@core/layouts/scheduled-time/DisplayScheduledTime'
import AidItemTag from './AidItemTag'
import UserLayout from 'src/layouts/UserLayout'
import DeliveryDiningOutlinedIcon from '@mui/icons-material/DeliveryDiningOutlined'
import { formateDateDDMMYYYY, formateDateDDMMYYYYHHMM, sortScheduledTimes } from 'src/@core/layouts/utils'
import { Note } from 'mdi-material-ui'
import FinishAidRequestDialog from './FinishAidRequestDialog'
import moment from 'moment'
import { ItemAPI } from 'src/api-client/Item'
import { ScheduledTime } from 'src/models/DonatedRequest'
import { CommonRepsonseModel } from 'src/models/common/CommonResponseModel'
import { MapItemAvaiableStock } from 'src/pages/van-chuyen/tao-moi/ChooseItemDelivery'
import { ItemAvaliableInStockModel } from 'src/models/Item'
import { UserContextModel } from 'src/models/User'
import FinishDeliveryRequest from './FinishDeliveryRequest'

const DetailAidRequest = () => {
  const { context, session } = useSession()
  const router = useRouter()
  const { slug } = router.query
  const [data, setDataAPI] = useState<any>()
  const [dialogRejectOpen, setDialogRejectOpen] = React.useState(false)
  const [currentCheckSheduledTime, setCurrentCheckSheduledTime] = useState<string>('')
  const [stockAvailable, setStockAvaiable] = useState<MapItemAvaiableStock>(new Map())
  const [isFindingStock, setIsFindingStock] = useState<boolean>(false)
  const handleAccept = (id: string) => {
    router.push('/danh-sach-yeu-cau-ho-tro/chi-tiet-yeu-cau-ho-tro/phe-duyet/' + id ?? '')
  }
  const handleCancelConfirm = () => {
    setDialogRejectOpen(true)
  }

  useEffect(() => {
    const fetchDataAPI = async () => {
      try {
        const res: any = await axiosClient.get(`/aid-requests/${slug}`)
        setDataAPI(res.data)
        const dateCheck =
          sortScheduledTimes(res.data.scheduledTimes)
            .filter(item => moment().isBefore(item.day))
            .at(0)?.day || ''

        console.log(dateCheck)

        setCurrentCheckSheduledTime(dateCheck)
      } catch (error) {
        console.log(error)
      }
    }
    if (slug) fetchDataAPI()
  }, [slug])

  useEffect(() => {
    const checkStockAvaiable = async () => {
      try {
        setIsFindingStock(true)
        const itemIdList = data.aidItemResponses?.map(
          (item: { itemResponse: { id: any } }) => item?.itemResponse?.id || ('' as string)
        )

        const response = await ItemAPI.getListStockAvaiableByListItemId(
          itemIdList,
          [
            new ScheduledTime({
              day: currentCheckSheduledTime,
              endTime: '23:59',
              startTime: '00:00'
            })
          ],
          new UserContextModel(context).user.role === KEY.ROLE.SYSTEM_ADMIN
            ? data.acceptedBranches?.at(0).id
            : undefined
        )

        const commonResponseModel = new CommonRepsonseModel<ItemAvaliableInStockModel[]>(response)

        const mapFromList: MapItemAvaiableStock = new Map()

        for (const obj of commonResponseModel.data || []) {
          mapFromList.set(obj.item?.id || '', obj)
        }

        console.log({ mapFromList })

        setStockAvaiable(mapFromList)
      } catch (error) {
        console.log(error)
      } finally {
        setIsFindingStock(false)
      }
    }

    checkStockAvaiable()
  }, [currentCheckSheduledTime])

  if (data) {
    return (
      <Box>
        <Card>
          <CardMedia
            component='img'
            height='300'
            image={data.charityUnitResponse?.image}
            alt='img'
            onError={({ currentTarget }: any) => {
              currentTarget.onerror = null
              currentTarget.src = '/images/cards/paypal.png'
            }}

            // sx={{ objectFit: 'contain' }}
          />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={5} lg={4} display={'flex'} justifyContent={'center'}>
                <Avatar src={data.charityUnitResponse?.charityLogo} sx={{ width: '250px', height: '250px' }} />
              </Grid>
              {/* name */}
              <Grid item xs={12} md={7} lg={8}>
                <Stack direction={'column'}>
                  <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mt: 10, mb: 2 }}>
                    <YardOutlinedIcon />
                    <Typography variant='body1' sx={{ mb: 3, fontWeight: 700 }}>
                      Tên chi nhánh:
                    </Typography>
                    <Typography variant='body1'>{data.charityUnitResponse.name}</Typography>
                  </Stack>

                  <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mt: 2, mb: 2 }}>
                    <VolunteerActivismOutlinedIcon />
                    <Typography variant='body1' sx={{ mb: 3, fontWeight: 700 }}>
                      Thuộc tổ chức:
                    </Typography>
                    <Typography variant='body1'>{data.charityUnitResponse.charityName}</Typography>
                  </Stack>

                  <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mt: 2, mb: 2 }}>
                    <LocationOnOutlinedIcon />
                    <Typography variant='body1' sx={{ mb: 3, fontWeight: 700 }}>
                      Địa chỉ:
                    </Typography>
                    <Typography variant='body1'>{data.charityUnitResponse.address}</Typography>
                  </Stack>
                  <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mt: 2, mb: 2 }}>
                    <BeenhereOutlinedIcon />
                    <Typography variant='body1' sx={{ mb: 3, fontWeight: 700 }}>
                      Trạng thái:
                    </Typography>
                    <Typography variant='body1'>
                      {data.charityUnitResponse.status === 'ACTIVE' ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>
            </Grid>

            {/* start time */}
            <Grid container spacing={3} sx={{ mt: 10 }}>
              <Grid item xs={12} md={6}>
                {' '}
                <Stack direction={'row'} justifyContent={'center'} alignItems={'center'} spacing={2}>
                  <AccessTimeOutlinedIcon />
                  <Typography sx={{ fontWeight: 700 }}>Ngày tạo yêu cầu hỗ trợ: </Typography>
                  <Typography variant='body1'>{formateDateDDMMYYYYHHMM(data.createdDate || '')}</Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack direction={'row'} justifyContent={'center'} alignItems={'center'} spacing={2}>
                  <AccessTimeOutlinedIcon />
                  <Typography sx={{ fontWeight: 700 }}>Ngày phê duyệt yêu cầu hỗ trợ: </Typography>
                  <Typography>{formateDateDDMMYYYYHHMM(data.acceptedDate || '')}</Typography>
                </Stack>
              </Grid>
            </Grid>

            {/* note */}
            <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mb: 5, mt: 10 }}>
              <DescriptionOutlinedIcon />
              <Typography variant='body1' sx={{ fontWeight: 700 }}>
                Ghi chú:
              </Typography>
            </Stack>
            <Typography
              variant='body1'
              sx={{ border: '1px solid', p: 3, borderRadius: '10px', borderColor: theme => theme.palette.grey[500] }}
            >
              {data.note}
            </Typography>
            {data.status === 'PENDING' && (
              <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mt: 5, mb: 5 }}>
                <BeenhereOutlinedIcon />
                <Typography variant='body1' sx={{ fontWeight: 700 }}>
                  Trạng thái:{' '}
                </Typography>
                <Chip
                  color='info'
                  sx={{
                    color: '#FFFFFF',
                    fontWeight: 'bold'
                  }}
                  label={'ĐANG ĐỢI XỬ LÝ'}
                />
              </Stack>
            )}
            {data.status === 'ACCEPTED' && (
              <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mt: 5, mb: 5 }}>
                <BeenhereOutlinedIcon />
                <Typography variant='body1' sx={{ fontWeight: 700 }}>
                  Trạng thái:{' '}
                </Typography>
                <Chip
                  color='success'
                  sx={{
                    color: '#FFFFFF',
                    fontWeight: 'bold'
                  }}
                  label={'ĐÃ ĐƯỢC CHẤP NHẬN'}
                />
              </Stack>
            )}
            {data.status === 'REJECTED' && (
              <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mt: 5, mb: 5 }}>
                <BeenhereOutlinedIcon />
                <Typography variant='body1' sx={{ fontWeight: 700 }}>
                  Trạng thái:{' '}
                </Typography>
                <Chip
                  color='error'
                  sx={{
                    color: '#FFFFFF',
                    fontWeight: 'bold'
                  }}
                  label={'ĐÃ BỊ TỪ CHỐI'}
                />
              </Stack>
            )}
            {data.status === 'CANCELED' && (
              <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mt: 5, mb: 5 }}>
                <BeenhereOutlinedIcon />
                <Typography variant='body1' sx={{ fontWeight: 700 }}>
                  Trạng thái:{' '}
                </Typography>
                <Chip
                  color='success'
                  sx={{
                    color: '#FFFFFF',
                    fontWeight: 'bold'
                  }}
                  label={'ĐÃ BỊ HỦY'}
                />
              </Stack>
            )}
            {data.status === 'EXPIRED' && (
              <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mt: 5, mb: 5 }}>
                <BeenhereOutlinedIcon />
                <Typography variant='body1' sx={{ fontWeight: 700 }}>
                  Trạng thái:{' '}
                </Typography>
                <Chip
                  color='warning'
                  sx={{
                    color: '#FFFFFF',
                    fontWeight: 'bold'
                  }}
                  label={'ĐÃ QUÁ HẠN'}
                />
              </Stack>
            )}
            {data.status === 'PROCESSING' && (
              <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mt: 5, mb: 5 }}>
                <BeenhereOutlinedIcon />
                <Typography variant='body1' sx={{ fontWeight: 700 }}>
                  Trạng thái:{' '}
                </Typography>
                <Chip
                  color='info'
                  sx={{
                    color: '#FFFFFF',
                    fontWeight: 'bold'
                  }}
                  label={'ĐANG XỬ LÝ'}
                />
              </Stack>
            )}
            {data.status === 'SELF_SHIPPING' && (
              <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mt: 5, mb: 5 }}>
                <BeenhereOutlinedIcon />
                <Typography variant='body1' sx={{ fontWeight: 700 }}>
                  Trạng thái:{' '}
                </Typography>
                <Chip
                  color='info'
                  sx={{
                    color: '#FFFFFF',
                    fontWeight: 'bold'
                  }}
                  label={'TỰ LẤY VẬT PHẨM'}
                />
              </Stack>
            )}
            {data.status === 'REPORTED' && (
              <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mt: 5, mb: 5 }}>
                <BeenhereOutlinedIcon />
                <Typography variant='body1' sx={{ fontWeight: 700 }}>
                  Trạng thái:{' '}
                </Typography>
                <Chip
                  color='warning'
                  sx={{
                    color: '#FFFFFF',
                    fontWeight: 'bold'
                  }}
                  label={'ĐÃ ĐƯỢC BÁO CÁO'}
                />
              </Stack>
            )}
            {data.status === 'FINISHED' && (
              <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mt: 5, mb: 5 }}>
                <BeenhereOutlinedIcon />
                <Typography variant='body1' sx={{ fontWeight: 700 }}>
                  Trạng thái:{' '}
                </Typography>
                <Chip
                  color='info'
                  sx={{
                    color: '#FFFFFF',
                    fontWeight: 'bold'
                  }}
                  label={'ĐÃ KẾT THÚC'}
                />
              </Stack>
            )}
            {data.address && (
              <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mt: 5, mb: 5 }}>
                <LocationOnOutlinedIcon />
                <Typography variant='body1' sx={{ mb: 3, fontWeight: 700 }}>
                  Địa điểm: <Typography component={'span'}>{data.address}</Typography>
                </Typography>
              </Stack>
            )}
            {data.scheduledTimes.length > 0 && (
              <Divider sx={{ mb: 5, mt: 5 }}>
                <Chip label='Thời gian nhận' color='info' sx={{ pt: 3, pb: 3, pl: 2, pr: 2, fontSize: '18px' }} />
              </Divider>
            )}
            {data.scheduledTimes.length > 0 && <DisplayScheduledTime data={data.scheduledTimes} />}
            {data.rejectingBranchResponses && data.rejectingBranchResponses.length > 0 && (
              <Divider sx={{ mb: 5, mt: 5 }}>
                <Chip
                  label='Danh sách các chi nhánh từ chối hỗ trợ'
                  color='info'
                  sx={{ pt: 3, pb: 3, pl: 2, pr: 2, fontSize: '18px' }}
                />
              </Divider>
            )}
            {data.rejectingBranchResponses &&
              data.rejectingBranchResponses.length > 0 &&
              data.rejectingBranchResponses.map((i: any) => (
                <Grid container columnSpacing={5} key={i.id} sx={{ mb: 10 }}>
                  <Grid item xs={3}>
                    <Card>
                      <CardMedia component='img' height='200' image={i.image} alt='img' />
                    </Card>
                  </Grid>
                  <Grid item xs={8} display={'flex'} flexDirection={'column'} gap={2}>
                    <Typography variant='h5'>{i.name}</Typography>
                    <Stack direction='row' alignItems={'center'} spacing={3}>
                      <LocationOnOutlinedIcon />
                      <Typography sx={{ fontWeight: 700 }} variant='body1'>
                        Địa chỉ:
                      </Typography>
                      <Typography variant='body1'>{i.address}</Typography>
                    </Stack>
                    <Stack direction='row' alignItems={'center'} spacing={3}>
                      <Note />
                      <Typography sx={{ fontWeight: 700 }} variant='body1'>
                        Lí do:
                      </Typography>
                      <Typography variant='body1'>{i.rejectingReason}</Typography>
                    </Stack>
                  </Grid>
                </Grid>
              ))}
            {data.acceptedBranches && data.acceptedBranches.length > 0 && (
              <Divider sx={{ mb: 5, mt: 5 }}>
                <Chip
                  label='Chi nhánh đồng ý hỗ trợ'
                  color='info'
                  sx={{ pt: 3, pb: 3, pl: 2, pr: 2, fontSize: '18px' }}
                />
              </Divider>
            )}
            {data.acceptedBranches &&
              data.acceptedBranches.length > 0 &&
              data.acceptedBranches.map((i: any) => (
                <Grid container columnSpacing={5} key={i.id} sx={{ mb: 10 }}>
                  <Grid
                    item
                    sx={{
                      height: '200px !important',
                      width: '200px !important'
                    }}
                  >
                    <Card
                      sx={{
                        maxHeight: '200px',
                        maxWidth: '200px'
                      }}
                    >
                      <CardMedia component='img' image={i.image} alt='img' />
                    </Card>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant='h5'>{i.name}</Typography>
                    <Stack direction='row' alignItems={'center'} spacing={3} sx={{ mb: 5, mt: 5 }}>
                      <LocationOnOutlinedIcon />
                      <Typography sx={{ fontWeight: 700 }} variant='body1'>
                        Địa chỉ:
                      </Typography>
                      <Typography variant='body1'>{i.address}</Typography>
                    </Stack>

                    <Stack direction='row' alignItems={'center'} spacing={3}>
                      <BeenhereOutlinedIcon />
                      <Typography sx={{ fontWeight: 700 }} variant='body1'>
                        Trạng thái:
                      </Typography>
                      <Typography variant='body1'>
                        {i.status === 'ACTIVE' ? 'Đang hoạt động' : 'Ngưng hoạt động'}
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              ))}

            {data.aidItemResponses && (
              <Divider sx={{ mb: 4, mt: 3 }}>
                <Chip
                  label='Danh sách các vật phẩm hỗ trợ'
                  color='info'
                  sx={{ pt: 3, pb: 3, pl: 2, pr: 2, fontSize: '18px' }}
                />
              </Divider>
            )}
            {data.scheduledTimes && (
              <Box
                m={2}
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 3,
                  alignItems: 'center'
                }}
              >
                <Typography fontWeight={500}>Kiểm tra vật phẩm trong kho có thể sử dụng đến ngày:</Typography>
                <Select
                  value={currentCheckSheduledTime}
                  variant='standard'
                  sx={{
                    width: '200px',
                    textAlign: 'center'
                  }}
                  onChange={e => {
                    setCurrentCheckSheduledTime(e.target.value)
                  }}
                >
                  {sortScheduledTimes(data.scheduledTimes)
                    .filter(item => moment().isBefore(item.day))
                    .map(sheduledTime => {
                      return (
                        <MenuItem value={sheduledTime.day} key={sheduledTime.day}>
                          {formateDateDDMMYYYY(sheduledTime.day || '')}
                        </MenuItem>
                      )
                    })}
                </Select>
              </Box>
            )}
            <Grid container sx={{ mb: 10 }} spacing={3}>
              {data.aidItemResponses &&
                data.aidItemResponses.map((i: any) => (
                  <Grid item key={i.id}>
                    <AidItemTag
                      aidItem={i}
                      isFindingStock={isFindingStock}
                      stock={stockAvailable.get((i.itemResponse?.id as string) || '')?.quantity || 0}
                    />
                  </Grid>
                ))}
            </Grid>
            {(data.status === 'PROCESSING' || data.status === 'FINISHED' || data.status === 'ACCEPTED') && (
              <Divider sx={{ mb: 5, mt: 5 }}>
                <Chip
                  label='Lịch sử hỗ trợ vật phẩm'
                  color='info'
                  sx={{ pt: 3, pb: 3, pl: 2, pr: 2, fontSize: '18px' }}
                />
              </Divider>
            )}
            {(data.status === 'PROCESSING' || data.status === 'FINISHED' || data.status === 'ACCEPTED') && (
              <FinishDeliveryRequest currentId={data.id || ''} isSelfShipping={data.isSelfShipping} />
            )}
          </CardContent>
          <CardActions
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 3
            }}
          >
            <Button
              color='info'
              onClick={() => {
                router.push('/danh-sach-yeu-cau-ho-tro')
              }}
            >
              {' '}
              Quay lại
            </Button>
            {(data?.status === 'PROCESSING' || data?.status === 'ACCEPTED') && !data?.isSelfShipping && (
              <Button
                variant='contained'
                onClick={() => {
                  router.push('/van-chuyen/tao-moi/ho-tro/' + data?.id)
                }}
              >
                Tạo yêu cầu vận chuyển
              </Button>
            )}
            {(data?.status === 'PROCESSING' || data?.status === 'ACCEPTED') && <FinishAidRequestDialog id={data?.id} />}
            {data.isConfirmable &&
              session?.user.role === 'BRANCH_ADMIN' && [
                <Button key={'accept'} color='info' variant='contained' onClick={() => handleAccept(data.id)}>
                  Chấp nhận
                </Button>,
                <Button key={'reject'} color='error' variant='outlined' onClick={handleCancelConfirm}>
                  Từ chối
                </Button>
              ]}
            {session?.user.role === 'BRANCH_ADMIN' && (data?.status === 'PROCESSING' || data?.status === 'ACCEPTED') && (
              <Button
                variant='contained'
                sx={{ mt: 3, mb: 5, width: '180px' }}
                color='success'
                startIcon={<DeliveryDiningOutlinedIcon />}
                onClick={() => {
                  router.push(`/danh-sach-yeu-cau-ho-tro/chi-tiet-yeu-cau-ho-tro/xuat-kho/${slug}`)
                }}
              >
                Xuất kho
              </Button>
            )}
          </CardActions>
        </Card>
        <RejectAidRequestDialog
          open={dialogRejectOpen}
          aidRequestId={data?.id || ''}
          handleClose={setDialogRejectOpen}
        />
      </Box>
    )
  } else {
    return (
      <Box display={'flex'} justifyContent={'center'} alignItems={'center'} minHeight={500}>
        <GiftLoading />
      </Box>
    )
  }
}

export default DetailAidRequest

DetailAidRequest.auth = {
  role: [KEY.ROLE.BRANCH_ADMIN, KEY.ROLE.SYSTEM_ADMIN]
}

DetailAidRequest.getLayout = (children: ReactNode) => {
  return <UserLayout pageTile='Chi tiết yêu cầu hỗ trợ 🍎'>{children}</UserLayout>
}
