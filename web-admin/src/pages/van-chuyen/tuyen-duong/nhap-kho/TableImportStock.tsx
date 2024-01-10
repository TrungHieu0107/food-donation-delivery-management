import {
  TableContainer,
  TableHead,
  TableCell,
  Skeleton,
  TableBody,
  Typography,
  Table,
  TableRow,
  Box,
  Avatar,
  TextField,
  CardMedia,
  Button
} from '@mui/material'
import * as React from 'react'
import { customColor } from 'src/@core/theme/color'
import {
  ItemRouteDeliveryRequestDetail,
  ObjectImportStockDeliveryRequest,
  ScheduledRouteDeliveryRequestDetail
} from 'src/models/DeliveryRequest'
import dynamic from 'next/dynamic'
import { registerLocale } from 'react-datepicker'
import moment from 'moment'
import vi from 'date-fns/locale/vi'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { DeliveryRequestAPI } from 'src/api-client/DeliveryRequest'
import { toast } from 'react-toastify'
import { CommonRepsonseModel } from 'src/models/common/CommonResponseModel'
import BackDrop from 'src/layouts/components/loading/BackDrop'
import DialogImportStockSucess from './DialogImportStockSucess'

registerLocale('vi', vi)
const DatePicker = dynamic(() => import('react-datepicker'), { ssr: false })

// const deliveryDoneStatusList = ['COLLECTED', 'ARRIVED_DELIVERY', 'DELIVERED', 'FINISHED', 'REPORTED']

// Convert the array to a Set for faster lookup
// const deliveryDoneStatusSet = new Set(deliveryDoneStatusList)

const GenerateBody = (props: {
  data: ScheduledRouteDeliveryRequestDetail[]
  isLoading: boolean
  handleChangeImportStock: (value: {
    [key: string]: {
      [key: string]: ItemRouteDeliveryRequestDetail
    }
  }) => void
}) => {
  const { data = [], isLoading } = props

  const [deliveryRequests, setDeliveryRequests] = useState<{
    [key: string]: {
      [key: string]: ItemRouteDeliveryRequestDetail
    }
  }>({})

  useEffect(() => {
    if (isLoading) return
    const newDeliveryRequests = convertData(data)
    console.log(newDeliveryRequests)

    setDeliveryRequests(newDeliveryRequests)
    props.handleChangeImportStock(newDeliveryRequests)
  }, [])

  const convertData = (
    data: ScheduledRouteDeliveryRequestDetail[]
  ): Record<string, Record<string, ItemRouteDeliveryRequestDetail>> => {
    const result: Record<string, Record<string, ItemRouteDeliveryRequestDetail>> = {}

    for (const item of data) {
      if (!item.id || !item.deliveryItems) continue

      const deliveryItemsMap: Record<string, ItemRouteDeliveryRequestDetail> = {}
      for (const deliveryItem of item.deliveryItems) {
        deliveryItemsMap[deliveryItem.deliveryItemId || ''] = deliveryItem
      }

      result[item.id] = deliveryItemsMap
    }

    return result
  }

  if (isLoading || Object.entries(deliveryRequests).length === 0) {
    return (
      <TableBody
        sx={{
          ...(data.length === 0 && { height: '400px' })
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(item => {
          return (
            <TableRow key={item}>
              <TableCell>
                <Skeleton variant='rectangular' />
              </TableCell>
              <TableCell>
                <Skeleton variant='rectangular' />
              </TableCell>
              <TableCell>
                <Skeleton variant='rectangular' />
              </TableCell>
              <TableCell>
                <Skeleton variant='rectangular' />
              </TableCell>
              <TableCell>
                <Skeleton variant='rectangular' />
              </TableCell>
              <TableCell>
                <Skeleton variant='rectangular' />
              </TableCell>
              <TableCell>
                <Skeleton variant='rectangular' />
              </TableCell>
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
            <TableCell colSpan={7}>
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
        <TableBody>
          {[...data].map((item, deliveryIndex) => {
            return item.deliveryItems?.map((deliveryItem, index) => {
              const tmp = deliveryRequests[item.id || '']

              const deliveryRequestItem = tmp[deliveryItem.deliveryItemId || '']

              return (
                <TableRow key={`${item.id}_${deliveryItem.deliveryItemId}`}>
                  {index === 0 && (
                    <TableCell
                      sx={{
                        width: '20px'
                      }}
                      rowSpan={item.deliveryItems?.length || 1}
                    >
                      <Typography fontWeight={800}>{deliveryIndex + 1}</Typography>
                    </TableCell>
                  )}
                  {index === 0 && (
                    <TableCell
                      rowSpan={item.deliveryItems?.length || 1}
                      sx={{
                        width: '350px'
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <Box display={'flex'} alignItems={'center'} gap={2}>
                          <Avatar src={item?.avatar} />
                          <Typography variant='body1' fontWeight={800}>
                            {item?.name}
                          </Typography>
                        </Box>
                        <Box display={'flex'} gap={2} alignItems={'top'}>
                          <Typography
                            fontWeight={700}
                            sx={{
                              whiteSpace: 'nowrap'
                            }}
                          >
                            SĐT:{' '}
                          </Typography>
                          <Typography variant='body2'>{item?.phone}</Typography>
                        </Box>
                        <Box display={'flex'} gap={2} alignItems={'top'}>
                          <Typography
                            fontWeight={700}
                            sx={{
                              whiteSpace: 'nowrap'
                            }}
                          >
                            Địa chỉ:{' '}
                          </Typography>
                          <Typography variant='body2'>{item?.address}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                  )}
                  <TableCell>
                    <Box display={'flex'} gap={2} alignItems={'center'}>
                      <Box width={100} height={50}>
                        <CardMedia
                          component={'img'}
                          image={deliveryRequestItem?.image}
                          sx={{
                            maxWidth: 100,
                            maxHeight: 50
                          }}
                        />
                      </Box>
                      <Box display={'flex'} flexDirection={'column'} justifyContent={'center'}>
                        <Typography fontWeight={600}>{deliveryRequestItem.name}</Typography>
                        <Typography>
                          <Typography component={'span'} fontWeight={600}>
                            Đơn vị:{' '}
                          </Typography>
                          {deliveryRequestItem.unit}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: 'right',
                      width: 160
                    }}
                  >
                    {deliveryRequestItem.quantity}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: 'right',
                      width: 160
                    }}
                  >
                    <DatePicker
                      locale={'vi'}
                      name='receivingDateStart'
                      autoComplete='off'
                      placeholderText='Ngày-Tháng-Năm'
                      minDate={moment().startOf('day').toDate()}
                      selected={moment(deliveryRequestItem.initialExpirationDate).startOf('day').toDate()}
                      customInput={
                        <TextField
                          autoComplete='off'
                          variant='outlined'
                          fullWidth
                          size='small'
                          sx={{
                            '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                              border: 'none'
                            },
                            '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                              border: '1px solid rgba(0, 0, 0, 0.23)' // Adjust color and width as needed
                            },
                            '& .Mui-focused': {
                              border: '1px solid rgba(0, 0, 0, 0.23) !important' // Adjust color and width as needed
                            }
                          }}
                          inputProps={{
                            style: {
                              textAlign: 'center'
                            }
                          }}
                        />
                      }
                      dateFormat={'dd-MM-yyyy'}
                      onChange={(date: Date | null) => {
                        if (date) {
                          const tmp = deliveryRequests[item.id || '']
                          const deliveryRequestItem = tmp[deliveryItem.deliveryItemId || '']
                          deliveryRequestItem.initialExpirationDate = date?.toISOString()

                          setDeliveryRequests({
                            ...deliveryRequests,
                            [item.id || '']: tmp
                          })
                          props.handleChangeImportStock({
                            ...deliveryRequests,
                            [item.id || '']: tmp
                          })
                        }
                      }}
                    />
                  </TableCell>

                  <TableCell
                    sx={{
                      textAlign: 'right',
                      width: 160
                    }}
                  >
                    <TextField
                      autoComplete='off'
                      value={deliveryRequestItem.receivedQuantity || 0}
                      variant='outlined'
                      fullWidth
                      size='small'
                      sx={{
                        '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                          border: 'none'
                        },
                        '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                          border: '1px solid rgba(0, 0, 0, 0.23)' // Adjust color and width as needed
                        },
                        '& .Mui-focused': {
                          border: '1px solid rgba(0, 0, 0, 0.23) !important' // Adjust color and width as needed
                        }
                      }}
                      inputProps={{
                        style: {
                          textAlign: 'center'
                        }
                      }}
                      onChange={e => {
                        const tmp = deliveryRequests[item.id || '']

                        const deliveryRequestItem = tmp[deliveryItem.deliveryItemId || '']
                        deliveryRequestItem.receivedQuantity = +e.target.value || 0

                        setDeliveryRequests({
                          ...deliveryRequests,
                          [item.id || '']: tmp
                        })
                        props.handleChangeImportStock({
                          ...deliveryRequests,
                          [item.id || '']: tmp
                        })
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      placeholder='Ghi chú'
                      autoComplete='off'
                      value={deliveryItem.note}
                      variant='outlined'
                      fullWidth
                      size='small'
                      sx={{
                        '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                          border: 'none'
                        },
                        '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                          border: '1px solid rgba(0, 0, 0, 0.23)' // Adjust color and width as needed
                        },
                        '& .Mui-focused': {
                          border: '1px solid rgba(0, 0, 0, 0.23) !important' // Adjust color and width as needed
                        }
                      }}
                      multiline
                      onChange={e => {
                        const tmp = deliveryRequests[item.id || '']

                        const deliveryRequestItem = tmp[deliveryItem.deliveryItemId || '']
                        deliveryRequestItem.note = e.target.value

                        setDeliveryRequests({
                          ...deliveryRequests,
                          [item.id || '']: tmp
                        })
                        props.handleChangeImportStock({
                          ...deliveryRequests,
                          [item.id || '']: tmp
                        })
                      }}
                    />
                  </TableCell>
                </TableRow>
              )
            })
          })}
        </TableBody>
      )
    }
  }
}

export interface ITableImportStockProps {
  data: ScheduledRouteDeliveryRequestDetail[]
  isLoading: boolean
  scheduledRouteId: string
}

export default function TableImportStock(props: ITableImportStockProps) {
  const [dataStock, setDataStock] = useState<{
    [key: string]: {
      [key: string]: ItemRouteDeliveryRequestDetail // id of delivery item
    }
  }>({})
  const [isSubmmitting, setIsSubmitting] = useState<boolean>(false)
  const [importSuccess, setImportSuccess] = useState<boolean>(false)

  const router = useRouter()

  const handleSubmit = async () => {
    if (isSubmmitting) return

    setIsSubmitting(true)

    try {
      const result: {
        deliveryRequestId: string
        receivedDeliveryItemRequests: {
          deliveryItemId: string
          quantity: number
          expirationDate: string | undefined
          note: string
        }[]
      }[] = []

      for (const [deliveryRequestId, value] of Object.entries(dataStock)) {
        const receivedDeliveryItemRequests: {
          deliveryItemId: string
          quantity: number
          expirationDate: string
          note: string
        }[] = []

        for (const [deliveryItemId, delivertyItemData] of Object.entries(value)) {
          receivedDeliveryItemRequests.push({
            deliveryItemId: deliveryItemId,
            quantity: delivertyItemData.receivedQuantity || 0,
            expirationDate:
              moment(delivertyItemData.initialExpirationDate).format('YYYY-MM-DD') + 'T00:00:00' ||
              moment().startOf('day').toISOString(),
            note: delivertyItemData.note || ''
          })
        }

        result.push({
          deliveryRequestId: deliveryRequestId,
          receivedDeliveryItemRequests: receivedDeliveryItemRequests
        })
      }

      const response = await DeliveryRequestAPI.importStock({
        scheduledRouteId: props.scheduledRouteId,
        deliveryRequests: result
      } as ObjectImportStockDeliveryRequest)

      if (result) {
        toast.success(new CommonRepsonseModel<any>(response).message)
        setImportSuccess(true)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DatePickerWrapper>
      <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Thông tin</TableCell>
                <TableCell>Tên vật phẩm</TableCell>
                <TableCell>Quyên góp</TableCell>
                <TableCell>Ngày hết hạn</TableCell>
                <TableCell>Nhận</TableCell>
                <TableCell>Ghi chú</TableCell>
              </TableRow>
            </TableHead>

            {/* <GenerateBody data={props.data} isLoading={props.isLoading} handleChangeImportStock={setDataStock} /> */}
            {!props.isLoading && (
              <GenerateBody
                data={props.data?.filter(item => item.status === 'DELIVERED')}
                isLoading={props.isLoading}
                handleChangeImportStock={setDataStock}
              />
            )}
          </Table>
        </TableContainer>
        <Box display={'flex'} gap={10} justifyContent={'center'} mt={5}>
          <Button
            onClick={() => {
              router.push('/van-chuyen/tuyen-duong')
            }}
          >
            Quay lại
          </Button>
          <Button
            onClick={handleSubmit}
            variant='contained'
            color='secondary'
            disabled={props.isLoading || isSubmmitting}
          >
            Xác nhận
          </Button>
        </Box>
        {isSubmmitting && <BackDrop open={true} />}
      </Box>
      <DialogImportStockSucess scheduledRouteId={props.scheduledRouteId} open={importSuccess} />
    </DatePickerWrapper>
  )
}
