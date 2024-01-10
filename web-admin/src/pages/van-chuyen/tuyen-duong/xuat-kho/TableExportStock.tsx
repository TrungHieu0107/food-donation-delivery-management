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
  TextField,
  CardMedia
} from '@mui/material'
import * as React from 'react'
import { customColor } from 'src/@core/theme/color'
import { NoteStockUpdateHistoryModel, ScheduledRouteDeliveryRequestDetail } from 'src/models/DeliveryRequest'
import { registerLocale } from 'react-datepicker'
import vi from 'date-fns/locale/vi'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { formateDateDDMMYYYY } from 'src/@core/layouts/utils'

registerLocale('vi', vi)

const GenerateBody = (props: {
  data: ScheduledRouteDeliveryRequestDetail
  isLoading: boolean
  handleChangeStockNote: (value: { [key: string]: NoteStockUpdateHistoryModel }) => void
  stocks: { [key: string]: NoteStockUpdateHistoryModel }
}) => {
  const { stocks, data = {} } = props

  console.log(data)

  if (props.isLoading) {
    return (
      <TableBody
        sx={{
          ...(data.deliveryItems?.length === 0 && { height: '400px' })
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
    if (data.deliveryItems?.length === 0) {
      return (
        <TableBody
          sx={{
            height: '400px'
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
          {data.deliveryItems?.map((deliveryItem, deliveryIndex) => {
            return deliveryItem.stocks?.map((stockItem, stockIndex) => {
              return (
                <TableRow key={`${stockItem.stockId}_${deliveryItem.deliveryItemId}_${stockIndex}`}>
                  {stockIndex === 0 && (
                    <TableCell
                      rowSpan={deliveryItem.stocks?.length || 1}
                      sx={{
                        width: '50px'
                      }}
                    >
                      {deliveryIndex + 1}
                    </TableCell>
                  )}
                  {stockIndex === 0 && (
                    <TableCell
                      rowSpan={deliveryItem.stocks?.length || 1}
                      sx={{
                        width: '150px'
                      }}
                    >
                      <Box display={'flex'} gap={2} alignItems={'center'}>
                        <Box width={100} height={50}>
                          <CardMedia
                            component={'img'}
                            image={deliveryItem?.image}
                            sx={{
                              maxWidth: 100,
                              maxHeight: 50
                            }}
                          />
                        </Box>
                        <Box display={'flex'} flexDirection={'column'} justifyContent={'center'}>
                          <Typography
                            fontWeight={600}
                            sx={{
                              width: '250px'
                            }}
                          >
                            {deliveryItem.name}
                          </Typography>
                          <Typography>
                            <Typography component={'span'} fontWeight={600}>
                              Đơn vị:
                            </Typography>
                            {deliveryItem.unit}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                  )}

                  <TableCell
                    sx={{
                      textAlign: 'left',
                      width: 160,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {stockItem.stockCode || ''}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: 'center'
                    }}
                  >
                    {stockItem.quantity}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: 'center',
                      width: 160
                    }}
                  >
                    {formateDateDDMMYYYY(stockItem.expirationDate || '')}
                  </TableCell>

                  <TableCell>
                    <TextField
                      placeholder='Ghi chú'
                      autoComplete='off'
                      value={stocks[stockItem.stockId || '']?.note}
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
                        const tmp = {
                          ...stocks[stockItem.stockId || ''],
                          note: e.target.value
                        }
                        props.handleChangeStockNote({
                          ...stocks,
                          [stockItem.stockId || '']: {
                            ...tmp
                          }
                        })
                      }}
                    />
                  </TableCell>
                  {stockIndex === 0 && (
                    <TableCell
                      sx={{
                        textAlign: 'center'
                      }}
                      rowSpan={deliveryItem.stocks?.length || 1}
                    >
                      {deliveryItem.quantity}
                    </TableCell>
                  )}
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
  data: ScheduledRouteDeliveryRequestDetail
  isLoading: boolean
  handleChangeStockNote: (value: { [key: string]: NoteStockUpdateHistoryModel }) => void
  stocks: { [key: string]: NoteStockUpdateHistoryModel }
}

export default function TableImportStock(props: ITableImportStockProps) {
  const { data = {} } = props

  return (
    <DatePickerWrapper>
      <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    width: '50px'
                  }}
                ></TableCell>
                <TableCell>Thông tin vật phẩm</TableCell>

                <TableCell
                  sx={{
                    textAlign: 'center'
                  }}
                >
                  Mã kho
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: 'center'
                  }}
                >
                  Tồn kho
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: 'center'
                  }}
                >
                  Ngày hết hạn
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: 'center'
                  }}
                >
                  Ghi chú
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: 'center'
                  }}
                >
                  Tổng
                </TableCell>
              </TableRow>
            </TableHead>

            <GenerateBody
              data={data}
              isLoading={props.isLoading}
              handleChangeStockNote={props.handleChangeStockNote}
              stocks={props.stocks}
            />
          </Table>
        </TableContainer>
      </Box>
    </DatePickerWrapper>
  )
}
