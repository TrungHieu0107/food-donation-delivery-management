import { Button, CardMedia, Grid, Stack, TextField, Typography } from '@mui/material'
import { Fragment, useEffect, useState } from 'react'
import DialogCustom from 'src/@core/layouts/components/shared-components/Dialog'
import { KEY } from 'src/common/Keys'
import { DeliveryItemModel } from 'src/models/DeliveryRequest'
import { ItemAvaliableInStockModel } from 'src/models/Item'

export interface IChooseItemDeliveryForAidRequestProps {
  dialogAddOpen: boolean
  handleClose: () => void
  itemStock: ItemAvaliableInStockModel | undefined
  handleAddNewItem: (quantity: number) => void
  handleUpdateItem: (quantity: number) => void
  oldItem: DeliveryItemModel | undefined
}

export default function ChooseItemDeliveryForAidRequest(props: IChooseItemDeliveryForAidRequestProps) {
  const [quantity, setQuantity] = useState<number>(0)

  useEffect(() => {
    console.log(props.oldItem)
    
    if (props.oldItem) {
      setQuantity(props.oldItem?.quantity || 0)
    }
  }, [props.oldItem])

  return (
    <Fragment>
      <DialogCustom
        content={
          <Stack direction={'column'} gap={3} paddingX={5}>
            <Grid container flexDirection={'row'} spacing={3} flexWrap={'nowrap'} alignItems={'stretch'}>
              <Grid
                item
                display={'flex'}
                justifyContent={'center'}
                flexDirection={'column'}
                sx={{
                  height: '100%'
                }}
              >
                <CardMedia
                  component={'img'}
                  alt={props.itemStock?.name || KEY.DEFAULT_VALUE}
                  image={props.itemStock?.image || KEY.DEFAULT_IMAGE}
                  sx={{
                    width: '200px',
                    borderRadius: '5px'
                  }}
                />
              </Grid>
              <Grid item display={'flex'} flexDirection={'column'}>
                <Typography
                  fontWeight={600}
                  sx={{
                    whiteSpace: 'nowrap'
                  }}
                >
                  Tên:
                  <Typography ml={1} component={'span'}>
                    {props.itemStock?.name || KEY.DEFAULT_VALUE}
                  </Typography>
                </Typography>
                <Typography
                  fontWeight={600}
                  sx={{
                    whiteSpace: 'nowrap'
                  }}
                >
                  Đơn vị:
                  <Typography ml={1} component={'span'}>
                    {props.itemStock?.unit || KEY.DEFAULT_VALUE}
                  </Typography>
                </Typography>
                <Typography
                  fontWeight={600}
                  sx={{
                    whiteSpace: 'nowrap'
                  }}
                >
                  SL còn lại:
                  <Typography ml={1} component={'span'}>
                    {props.itemStock?.totalStock || KEY.DEFAULT_VALUE}
                  </Typography>
                </Typography>
                <Typography
                  fontWeight={600}
                  sx={{
                    whiteSpace: 'nowrap'
                  }}
                >
                  Vận chuyển tối đa:
                  <Typography ml={1} component={'span'}>
                    {props.itemStock?.maximumTransportVolume || KEY.DEFAULT_VALUE}
                    <Typography component={'span'}>({props.itemStock?.unit})</Typography>
                  </Typography>
                </Typography>

                <Typography
                  fontWeight={600}
                  sx={{
                    maxWidth: '400px'
                  }}
                >
                  Ghi chú:
                  <Typography ml={1} component={'span'}>
                    {props.itemStock?.note || KEY.DEFAULT_VALUE}
                  </Typography>
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid
                item
                display={'flex'}
                alignItems={'center'}
                sx={{
                  width: '200px'
                }}
                justifyContent={'flex-end'}
              >
                <Typography fontWeight={600}>Nhập số lượng:</Typography>
              </Grid>
              <Grid item>
                <TextField
                  type='number'
                  value={quantity}
                  onChange={e => {
                    if (+e.target.value <= (props.itemStock?.totalStock || 0)) setQuantity(+e.target.value)
                  }}
                  fullWidth
                  error={quantity > (props.itemStock?.totalStock || 0)}
                  helperText={
                    quantity > (props.itemStock?.totalStock || 0)
                      ? 'Số lượng không được vượt quá số lượng hàng trong kho.'
                      : ''
                  }
                />
              </Grid>
            </Grid>
          </Stack>
        }
        handleClose={props.handleClose}
        open={props.dialogAddOpen}
        title={props.oldItem ? 'Chỉnh sửa thông tin đồ' : 'Nhập thông tin gửi đồ'}
        actionDialog={
          <Grid container justifyContent={'center'} spacing={3}>
            <Grid item>
              <Button color='secondary' onClick={props.handleClose}>
                Đóng
              </Button>
            </Grid>
            <Grid item>
              <Button
                color='primary'
                variant='contained'
                disabled={quantity === 0}
                onClick={() => {
                  if (props.oldItem) {
                    props.handleUpdateItem(quantity)
                    setQuantity(0)
                  } else {
                    props.handleAddNewItem(quantity)
                    setQuantity(0)
                  }

                  
                }}
              >
                {props.oldItem ? 'Chỉnh sửa' : 'Thêm'}
              </Button>
            </Grid>
          </Grid>
        }
      />
    </Fragment>
  )
}
