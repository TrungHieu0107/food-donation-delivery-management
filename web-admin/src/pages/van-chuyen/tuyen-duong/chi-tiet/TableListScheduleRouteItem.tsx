import {
  TableContainer,
  TableHead,
  TableCell,
  Skeleton,
  TableBody,
  Typography,
  Table,
  TableRow,
  Button,
  Grid,
  Box,
  Avatar,
  Divider,
  Stack,
  CardMedia,
  Card
} from '@mui/material'
import * as React from 'react'
import DialogCustom from 'src/@core/layouts/components/shared-components/Dialog'
import { customColor } from 'src/@core/theme/color'
import TableHeader from 'src/layouts/components/table/TableHeader'
import { ScheduledRouteDeliveryRequestDetail } from 'src/models/DeliveryRequest'
import { HeadCell } from 'src/models/common/CommonModel'
import { DeliveryStatusChip } from '../..'
  import { formateDateDDMMYYYY } from 'src/@core/layouts/utils'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

const headerCells: HeadCell<ScheduledRouteDeliveryRequestDetail>[] = [
  {
    id: 'name',
    label: 'Tên'
  },
  {
    id: 'phone',
    label: 'Số điện thoại'
  },
  {
    id: 'address',
    label: 'Địa chỉ'
  },
  {
    id: 'status',
    label: 'Trạng thái',
    format(val) {
      return <DeliveryStatusChip status={val.status || ''} />
    }
  }
]

const deliveryDoneStatusList = ['COLLECTED', 'ARRIVED_DELIVERY', 'DELIVERED', 'FINISHED', 'REPORTED']

// Convert the array to a Set for faster lookup
const deliveryDoneStatusSet = new Set(deliveryDoneStatusList)

const GenerateBody = (props: {
  data: ScheduledRouteDeliveryRequestDetail[]
  type: string
  isLoading: boolean
  setOpenDialog: (value: boolean) => void
  setCurrentSelected: (value: ScheduledRouteDeliveryRequestDetail) => void
}) => {
  const data = props.data || []

  const getTextIndexDelivery = (index: number): string => {
    if (props.type === 'IMPORT') {
      return `${index + 1 === data.length ? 'Kết thúc' : index + 1}`
    }
    if (props.type === 'EXPORT') {
      return `${index === 0 ? 'Bắt đầu' : index}`
    }

    return ''
  }

  const isClickable = (index: number): boolean => {
    if (props.type === 'IMPORT' && index === data.length - 1) return false
    if (props.type === 'EXPORT' && index === 0) return false

    return true
  }

  if (props.isLoading) {
    return (
      <TableBody
        sx={{
          ...(data.length === 0 && { height: '400px' })
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(item => {
          return (
            <TableRow key={item} hover>
              <TableCell></TableCell>
              {headerCells.map((headerCell, index) => (
                <TableCell key={index}>
                  <Skeleton variant='rectangular' />
                </TableCell>
              ))}
              <TableCell></TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    )
  } else {
    if (data.length === 0) {
      return (
        <TableBody
          sx={{
            ...(data.length === 0 && { height: '400px' })
          }}
        >
          <TableRow>
            <TableCell colSpan={headerCells.length + 2}>
              <Typography
                textAlign={'center'}
                fontWeight={550}
                variant='h6'
                sx={{
                  color: customColor.secondary
                }}
              >
                Không có dữ liệu! 👋🏻
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      )
    } else {
      return (
        <TableBody
          sx={{
            ...(data.length === 0 && { height: '400px' })
          }}
        >
          {data.map((item: any, index: number) => (
            <TableRow
              key={index}
              hover
              sx={{
                ...(isClickable(index)
                  ? {
                      cursor: 'pointer',
                      ':hover': {
                        backgroundColor: `${hexToRGBA(customColor.primary, 0.1)}  !important`
                      }
                    }
                  : {
                      ':hover': {
                        backgroundColor: `#FFFFFF !important`
                      }
                    })
              }}
              {...(isClickable(index) && {
                onClick: () => {
                  props.setOpenDialog(true)
                  props.setCurrentSelected(item)
                }
              })}
            >
              <TableCell
                sx={{
                  textAlign: 'center'
                }}
              >
                {getTextIndexDelivery(index)}
              </TableCell>
              {headerCells.map((cell, i) =>
                cell.format ? (
                  <TableCell
                    key={i}
                    sx={{
                      maxWidth: cell.width,
                      minWidth: cell.width,
                      width: cell.width
                    }}
                  >
                    {cell.format(item)}
                  </TableCell>
                ) : (
                  <TableCell key={i}>{item[cell.id]}</TableCell>
                )
              )}
            </TableRow>
          ))}
        </TableBody>
      )
    }
  }
}

export interface ITableListScheduleRouteItemProps {
  data: ScheduledRouteDeliveryRequestDetail[]
  isLoading: boolean
  type: string
}

export default function TableListScheduleRouteItem(props: ITableListScheduleRouteItemProps) {
  const [openDialog, setOpenDialog] = React.useState<boolean>(false)
  const [currentSelect, setCurrentSelected] = React.useState<ScheduledRouteDeliveryRequestDetail>()

  React.useEffect(() => {
    !openDialog && setCurrentSelected(undefined)
  }, [openDialog])

  const handleClose = () => {
    setOpenDialog(false)
  }

  return (
    <React.Fragment>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              {headerCells.map((headerCell, index) => {
                return <TableHeader key={index} headCell={headerCell} />
              })}
            </TableRow>
          </TableHead>
          <GenerateBody
            type={props.type}
            data={props.data}
            isLoading={props.isLoading}
            setOpenDialog={setOpenDialog}
            setCurrentSelected={setCurrentSelected}
          />
        </Table>
      </TableContainer>
      <DialogCustom
        width={1200}
        content={
          <Stack
            divider={<Divider orientation='vertical' />}
            flexDirection={'row'}
            spacing={3}
            sx={{
              padding: '10px'
            }}
            justifyContent={'space-between'}
            alignItems={'stretch'}
          >
            <Box display={'flex'} width={'60%'} flexDirection={'column'} flexWrap={'nowrap'}>
              <Grid container spacing={2} flexDirection={'column'}>
                <Grid item display={'flex'} gap={2}>
                  <Typography
                    fontWeight={550}
                    sx={{
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {props.type === 'IMPORT' ? 'Địa chỉ nhận: ' : 'Địa chỉ giao: '}
                  </Typography>
                  <Typography>{currentSelect?.address}</Typography>
                </Grid>
                <Grid item display={'flex'} gap={2}>
                  <Typography
                    fontWeight={550}
                    sx={{
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Trạng thái:
                  </Typography>
                  <DeliveryStatusChip status={currentSelect?.status || ''} />
                </Grid>
                <Grid item display={'flex'} gap={3}>
                  <Typography
                    fontWeight={550}
                    sx={{
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {props.type === 'IMPORT' ? 'Người quyên góp: ' : 'Tổ chức nhận: '}
                  </Typography>
                  <Box display={'flex'}>
                    <Avatar
                      src={currentSelect?.avatar}
                      sx={{
                        height: 100,
                        width: 100
                      }}
                    />
                  </Box>
                  <Box display={'flex'} gap={2} flexDirection={'column'}>
                    <Box display={'flex'} gap={2}>
                      <Typography fontWeight={550}>{currentSelect?.name}</Typography>
                    </Box>

                    <Box display={'flex'} gap={2}>
                      <Typography fontWeight={550}>{'SĐT: '}</Typography>
                      <Typography>{currentSelect?.phone}</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item display={'flex'} gap={2}>
                  <Typography
                    fontWeight={550}
                    sx={{
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Thời gian nhận:
                  </Typography>
                  <Typography>{`Ngày ${formateDateDDMMYYYY(currentSelect?.currentScheduledTime?.day || '')} từ ${
                    currentSelect?.currentScheduledTime?.startTime
                  } đến ${currentSelect?.currentScheduledTime?.endTime}`}</Typography>
                </Grid>
              </Grid>
              {deliveryDoneStatusSet.has(currentSelect?.status || '') ? (
                <Grid container flexDirection={'column'}>
                  <Grid item>
                    <Divider />
                    <Typography fontWeight={600} variant='h6'>
                      Thông tin nhận
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography fontWeight={550}>Ảnh hoàn thành</Typography>
                    <Box
                      sx={{
                        height: '200px',
                        width: '200px'
                      }}
                    >
                      <CardMedia
                        component={'img'}
                        alt='done image'
                        image={currentSelect?.proofImage}
                      />
                    </Box>
                  </Grid>
                  {currentSelect?.status === 'REPORTED' && (
                    <Grid item>
                      <Typography fontWeight={550}>Ghi chú </Typography>
                      <Box padding={5}>{currentSelect?.status}</Box>
                    </Grid>
                  )}
                </Grid>
              ) : null}
            </Box>

            <Box
              display={'flex'}
              width={'35%'}
              flexDirection={'column'}
              justifyContent={'flex-start'}
              gap={2}
              sx={{
                height: '100%'
              }}
            >
              <Typography
                fontWeight={600}
                sx={{
                  whiteSpace: 'nowrap'
                }}
              >
                Danh sách vật phẩm
              </Typography>
              {currentSelect?.deliveryItems?.map((item, index) => {
                return (
                  <Card
                    key={index}
                    sx={{
                      padding: '5px'
                    }}
                  >
                    {currentSelect.status === 'FINISHED' ? (
                      <Grid container flexWrap={'nowrap'} alignItems={'center'} spacing={3}>
                        <Grid item xl={3} lg={3} md={3} xs={3} sm={3}>
                          <CardMedia component={'img'} alt={item.name} src={item.image} />
                        </Grid>
                        <Grid item display={'flex'} flexDirection={'column'}>
                          <Typography fontWeight={500}>{item.stocks?.at(0)?.stockCode}</Typography>
                          <Typography fontWeight={800} variant='body2'>{`${item.name}`}</Typography>
                          <Typography fontWeight={500} variant='body2'>
                            {props.type === 'IMPORT' ? 'Số lượng nhận/vận chuyển:' : 'Số lượng vận chuyển:'}
                            <Typography component={'span'} variant='body2'>
                              {item.stocks?.at(0)?.quantity}/{item.quantity} ({item.unit})
                            </Typography>
                          </Typography>
                          <Typography fontWeight={500} variant='body2'>
                            Hạn sử dụng:
                            <Typography component={'span'} variant='body2'>
                              {formateDateDDMMYYYY(item.stocks?.at(0)?.expirationDate || '')}
                            </Typography>
                          </Typography>
                        </Grid>
                      </Grid>
                    ) : currentSelect.status === 'DELIVERED' ? (
                      <Grid container flexWrap={'nowrap'} alignItems={'center'} spacing={3}>
                        <Grid item xl={3} lg={3} md={3} xs={3} sm={3}>
                          <CardMedia component={'img'} alt={item.name} src={item.image} />
                        </Grid>
                        <Grid item display={'flex'} flexDirection={'column'}>
                          <Typography fontWeight={800} variant='body2'>{`${item.name}`}</Typography>
                          <Typography fontWeight={500} variant='body2'>
                            Số vận chuyển:
                            <Typography component={'span'} variant='body2'>
                              {item.receivedQuantity} ({item.unit})
                            </Typography>
                          </Typography>
                        </Grid>
                      </Grid>
                    ) : (
                      <Grid container flexWrap={'nowrap'} alignItems={'center'} spacing={3}>
                        <Grid item xl={3} lg={3} md={3} xs={3} sm={3}>
                          <CardMedia component={'img'} alt={item.name} src={item.image} />
                        </Grid>
                        <Grid item display={'flex'} flexDirection={'column'}>
                          <Typography fontWeight={800} variant='body2'>{`${item.name}`}</Typography>
                          <Typography fontWeight={500} variant='body2'>
                            Số vận chuyển:
                            <Typography component={'span'} variant='body2'>
                              {item.quantity} ({item.unit})
                            </Typography>
                          </Typography>
                        </Grid>
                      </Grid>
                    )}
                  </Card>
                )
              })}
            </Box>
          </Stack>
        }
        handleClose={handleClose}
        open={openDialog}
        title={'Chi tiết vận chuyển'}
        actionDialog={<Button onClick={handleClose}>Đóng</Button>}
      />
    </React.Fragment>
  )
}
