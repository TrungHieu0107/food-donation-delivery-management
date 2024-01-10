'use client'

import { Box, Button, Stack, Typography, useTheme, Chip } from '@mui/material'
import { Theme } from '@mui/system'
import FilterDeliveryRequest from './FilterDeliveryRequest'
import { KEY } from 'src/common/Keys'
import { ReactNode, useEffect, useState } from 'react'
import { CommonRepsonseModel, PaginationModel } from 'src/models/common/CommonResponseModel'
import { DeliveryRequestAPI } from 'src/api-client/DeliveryRequest'
import {
  DeliveryRequestDetailModel,
  DeliveryRequestModelForList,
  FilterDeliveryRequestList
} from 'src/models/DeliveryRequest'
import { DELIVERY_TYPE } from 'src/common/delivery-status'
import UserLayout from 'src/layouts/UserLayout'
import EqualizerIcon from '@mui/icons-material/Equalizer'
import { customColor } from 'src/@core/theme/color'
import ListDeliveryRequestTag from './ListDeliveryRequestTag'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import ReportProblemIcon from '@mui/icons-material/ReportProblem'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import BackDrop from 'src/layouts/components/loading/BackDrop'
import { toast } from 'react-toastify'
import useSession from 'src/@core/hooks/useSession'
import { useRouter } from 'next/router'

type StatusChipModel = {
  [key: string]: {
    backgroundColor: string | ((theme: Theme) => string)
    textColor: string | ((theme: Theme) => string)
    label: string
    icon: ReactNode
  }
}

export const statusDeliveryMap: StatusChipModel = {
  PENDING: {
    backgroundColor: theme => theme.palette.primary[theme.palette.mode],
    textColor: theme => theme.palette.primary.contrastText,
    label: 'Đang chờ',
    icon: <HourglassEmptyIcon />
  },
  ACCEPTED: {
    backgroundColor: theme => theme.palette.primary[theme.palette.mode],
    textColor: theme => theme.palette.primary.contrastText,
    label: 'Đã chấp nhận',
    icon: <CheckCircleOutlineIcon />
  },
  SHIPPING: {
    backgroundColor: theme => theme.palette.info[theme.palette.mode],
    textColor: theme => theme.palette.primary.contrastText,
    label: 'Đang vận chuyển',
    icon: <LocalShippingIcon />
  },
  ARRIVED_PICKUP: {
    backgroundColor: theme => theme.palette.info[theme.palette.mode],
    textColor: theme => theme.palette.primary.contrastText,
    label: 'Đã đến điểm lấy hàng',
    icon: <LocationOnIcon />
  },
  REPORTED: {
    backgroundColor: theme => theme.palette.warning[theme.palette.mode],
    textColor: theme => theme.palette.primary.contrastText,
    label: 'Đã báo cáo',
    icon: <ReportProblemIcon />
  },
  COLLECTED: {
    backgroundColor: theme => theme.palette.success[theme.palette.mode],
    textColor: theme => theme.palette.primary.contrastText,
    label: 'Đã lấy hàng',
    icon: <DoneAllIcon />
  },
  ARRIVED_DELIVERY: {
    backgroundColor: theme => theme.palette.info[theme.palette.mode],
    textColor: theme => theme.palette.primary.contrastText,
    label: 'Đã đến điểm giao hàng',
    icon: <LocationOnIcon />
  },
  DELIVERED: {
    backgroundColor: theme => theme.palette.success[theme.palette.mode],
    textColor: theme => theme.palette.primary.contrastText,
    label: 'Đã giao hàng',
    icon: <DoneAllIcon />
  },
  FINISHED: {
    backgroundColor: theme => theme.palette.success[theme.palette.mode],
    textColor: theme => theme.palette.primary.contrastText,
    label: 'Hoàn thành',
    icon: <DoneAllIcon />
  },
  EXPIRED: {
    backgroundColor: theme => theme.palette.error[theme.palette.mode],
    textColor: theme => theme.palette.primary.contrastText,
    label: 'Đã hết hạn',
    icon: <ErrorOutlineIcon />
  },
  CANCELED: {
    backgroundColor: theme => theme.palette.error[theme.palette.mode],
    textColor: theme => theme.palette.primary.contrastText,
    label: 'Đã bị hủy',
    icon: <ErrorOutlineIcon />
  }
}

export const DeliveryStatusChip = ({ status }: { status: string }) => {
  try {
    const theme = useTheme()
    const backgroundColor = statusDeliveryMap[status].backgroundColor || theme.palette.text.primary
    const textColor = statusDeliveryMap[status].textColor || theme.palette.common.white
    const chipLabel = statusDeliveryMap[status].label || '_'

    return (
      <Chip
        label={chipLabel}
        sx={{
          backgroundColor: backgroundColor,
          color: textColor
        }}
      />
    )
  } catch (error) {
    return <Typography>_</Typography>
  }
}

const listOfTabNameDeliveryRequest = {
  [KEY.DELIVERY_TYPE.BRANCH_TO_AID_REQUEST]: 'Hỗ trợ',
  [KEY.DELIVERY_TYPE.DONATED_REQUEST_TO_BRANCH]: 'Quyên góp'

  // [KEY.DELIVERY_TYPE.BRANCH_TO_BRANCH]: 'Đóng góp chi nhánh'
}

export default function DeliveryRequestPage(props: {
  detail?: DeliveryRequestDetailModel
  type?: string
  isFetchingDetail?: boolean
}) {
  const [currentTab, setCurrentTab] = useState<keyof typeof listOfTabNameDeliveryRequest>('DONATED_REQUEST_TO_BRANCH')
  const [currentSelected, setCurrentSelected] = useState<DeliveryRequestModelForList>()
  const [currentSelectedDetail, setCurrentSelectedDetail] = useState<DeliveryRequestDetailModel>()
  const [filterObject, setFilterObject] = useState<FilterDeliveryRequestList>(
    new FilterDeliveryRequestList({
      deliveryType: 0
    })
  )
  const [isFetching, setIsFetching] = useState<boolean>(true)
  const [pagination, setPagination] = useState<PaginationModel>(
    new PaginationModel({
      currentPage: 1,
      pageSize: 10
    })
  )
  const [data, setData] = useState<DeliveryRequestModelForList[]>([])
  const [isFetchingDetail, setIsFetchingDetail] = useState<boolean>(false)
  const { session }: any = useSession()
  const router = useRouter()
  const { deliveryId } = router.query

  useEffect(() => {
    setIsFetching(!!props.isFetchingDetail)
    if (props.detail) {
      setCurrentSelectedDetail(props.detail)
      setCurrentSelected(
        new DeliveryRequestModelForList({
          id: props.detail.id
        })
      )
    }
  }, [props])

  useEffect(() => {
    fetchData()
  }, [filterObject])
  useEffect(() => {
    fetchDetail()
  }, [currentSelected])

  const generateListTab = () => {
    const result: React.ReactNode[] = []

    for (const [key, value] of Object.entries(listOfTabNameDeliveryRequest)) {
      result.push(
        <Button
          variant={currentTab === key ? 'contained' : 'outlined'}
          key={key}
          onClick={() => {
            setCurrentTab(key)
            setFilterObject({
              deliveryType: DELIVERY_TYPE[key]
            })
          }}
          sx={{
            borderRadius: '50px'
          }}
        >
          {value}
        </Button>
      )
    }

    return result
  }

  const fetchData = async () => {
    setIsFetching(true)
    setData([])
    setCurrentSelected(undefined)
    setCurrentSelectedDetail(undefined)
    try {
      const response = await DeliveryRequestAPI.getListDeliveryRequest(filterObject)
      const commonResponse = new CommonRepsonseModel<DeliveryRequestModelForList[]>(response)
      setData(commonResponse.data || [])
      setPagination(commonResponse.pagination)
      if (!deliveryId) {
        setCurrentSelected(commonResponse.data?.at(0))
       props.type && setCurrentTab(props.type)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsFetching(false)
    }
  }

  const fetchDetail = async () => {
    try {
      setIsFetchingDetail(true)
      const response = await DeliveryRequestAPI.getDetailOfDeliveryRequest(currentSelected?.id || '')
      setCurrentSelectedDetail(new CommonRepsonseModel<DeliveryRequestDetailModel>(response).data)
    } catch (error) {
      console.log(error)
    } finally {
      setIsFetchingDetail(false)
    }
  }

  const handleClickCreateScheduledRoute = async () => {
    try {
      DeliveryRequestAPI.createScheduleRoute(filterObject.deliveryType).then(response => {
        const commonResponse = new CommonRepsonseModel<any>(response)
        toast.success(commonResponse.message)
      })
      toast.success('Đã gửi yêu cầu tạo lịch vận chuyển. Vui lòng chờ đợi trong ít phút')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Box>
      <Stack
        sx={{
          padding: '20px'
        }}
        flexDirection={'column'}
        spacing={3}
      >
        <Box display={'flex'} gap={3}>
          {generateListTab()}
        </Box>
        <Box
          sx={{
            marginTop: '10px',
            display: 'flex',
            gap: 3,
            flexDirection: 'column'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <Typography
              component={'a'}
              variant='h6'
              fontWeight={600}
              id='danh-sach'
              href='#danh-sach'
              sx={{
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                color: customColor.secondary
              }}
            >
              <EqualizerIcon />
              Tìm kiếm
            </Typography>
            {session?.user?.role === KEY.ROLE.BRANCH_ADMIN && (
              <Button onClick={handleClickCreateScheduledRoute} variant='contained'>
                Tạo lịch
              </Button>
            )}
          </Box>
          <FilterDeliveryRequest
            setFilterObject={setFilterObject}
            filterObject={filterObject}
            type={currentTab.toString()}
          />
          <ListDeliveryRequestTag
            isFetching={isFetching}
            toggleFetching={setIsFetching}
            data={data || []}
            pagination={pagination}
            filterObject={filterObject}
            handleChangeFilterObject={setFilterObject}
            currentSelected={currentSelected}
            setCurrentSelected={setCurrentSelected}
            currentSelectedDetail={currentSelectedDetail}
            fetchDetail={fetchDetail}
            fetchData={fetchData}
          />
        </Box>
      </Stack>
      {isFetchingDetail && <BackDrop open={true} />}
    </Box>
  )
}

DeliveryRequestPage.getLayout = (page: ReactNode) => <UserLayout pageTile='Danh sách vận chuyển 🚑'>{page}</UserLayout>
