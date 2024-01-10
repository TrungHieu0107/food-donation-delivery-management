import { Avatar, Box, Card, CardContent, CardHeader, TextField, Typography } from '@mui/material'
import { Fragment } from 'react'
import { customColor } from 'src/@core/theme/color'
import {
  ConfirmExportStockScheduleRouteModel,
  NoteStockUpdateHistoryModel,
  ScheduledRouteDeliveryRequestDetail
} from 'src/models/DeliveryRequest'
import TableImportStock from './TableExportStock'

export interface IStockExportInfoProps {
  data: ScheduledRouteDeliveryRequestDetail[]
  isLoading: boolean
  dataConfirm: ConfirmExportStockScheduleRouteModel
  handleChangeDataConfirm: (value: ConfirmExportStockScheduleRouteModel) => void
  handleChangeStock: (value: { [key: string]: NoteStockUpdateHistoryModel }) => void
  stocks: { [key: string]: NoteStockUpdateHistoryModel }
}

export default function StockExportInfo(props: IStockExportInfoProps) {
  const { data = [], isLoading, dataConfirm, handleChangeDataConfirm, handleChangeStock, stocks } = props

  return (
    <Fragment>
      <Card sx={{ height: '100%', margin: '20px' }}>
        <CardHeader
          title={
            <Typography variant='h6' fontWeight={600} color={'secondary'}>
              Thông tin hỗ trợ
            </Typography>
          }
        />
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: 3
            }}
          >
            <Box display={'flex'} alignItems={'center'} gap={2}>
              <Avatar
                src={data[1]?.avatar}
                sx={{
                  width: '125px',
                  height: '125px',
                  border: '2px solid',
                  borderColor: customColor.primary
                }}
              />
            </Box>
            <Box display={'flex'} flexDirection={'column'} paddingTop={'10px'}>
              <Typography variant='h6' fontWeight={800}>
                {data[1]?.name}
              </Typography>
              <Box display={'flex'} gap={2} alignItems={'top'}>
                <Typography
                  fontWeight={700}
                  sx={{
                    whiteSpace: 'nowrap'
                  }}
                >
                  SĐT:{' '}
                </Typography>
                <Typography variant='body2'>{data[1]?.phone}</Typography>
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
                <Typography variant='body2'>{data[1]?.address}</Typography>
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              mt: 2
            }}
          >
            <Typography variant='h6' fontWeight={600} color={'secondary'}>
              Thông tin vật phẩm
            </Typography>
            <TableImportStock
              data={data[1] || {}}
              isLoading={isLoading}
              handleChangeStockNote={function (value: { [key: string]: NoteStockUpdateHistoryModel }): void {
                handleChangeStock(value)
              }}
              stocks={stocks}
            />
          </Box>
          <Box
            sx={{
              mt: 3
            }}
          >
            <Typography variant='h6' fontWeight={600} color={'secondary'}>
              Ghi chú
            </Typography>
            <TextField
              multiline
              minRows={3}
              maxRows={5}
              label='Ghi chú'
              fullWidth
              onChange={e => {
                handleChangeDataConfirm({
                  ...dataConfirm,
                  note: e.target.value
                })
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </Fragment>
  )
}
