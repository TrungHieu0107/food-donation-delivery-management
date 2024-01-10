import * as React from 'react'
import { DeliveryRequestCreatingModel } from './ChooseItemDelivery'
import {
  Box,
  CardMedia,
  Chip,
  FormHelperText,
  Grid,
  IconButton,
  TextField,
  Typography,
  TypographyProps,
  styled
} from '@mui/material'
import { formateDateDDMMYYYY, isNumber } from 'src/@core/layouts/utils'
import { Minus, Plus } from 'mdi-material-ui'

export interface ICreateDeliveryRequestItemProps {
  deliveryRequest: DeliveryRequestCreatingModel
  indexDelivery: number
  handleChangeDeliveryRequest: (value: DeliveryRequestCreatingModel) => void
  error: {
    [key: number]: string | undefined
  }
}

const Label = styled(Typography)<TypographyProps>(() => ({
  textAlign: 'left',
  fontWeight: 550,
  whiteSpace: 'nowrap',
  paddingRight: '5px'
}))

export default function CreateDeliveryRequestItem(props: ICreateDeliveryRequestItemProps) {
  const {
    indexDelivery = 0,
    error = {},
    deliveryRequest = { items: {}, sameDelivery: 1 } as DeliveryRequestCreatingModel,
    handleChangeDeliveryRequest
  } = props
  console.log({ error })
  const handleChangeQuantity = (value: any, key: string) => {
    if (!value) {
      deliveryRequest.items[key].quantity = 0

      handleChangeDeliveryRequest(deliveryRequest)
    }

    if (!isNumber(value)) return

    if (+value > (deliveryRequest.items[key].item.itemTemplateResponse?.maximumTransportVolume || 0)) return
    deliveryRequest.items[key].quantity = +value

    handleChangeDeliveryRequest(deliveryRequest)
  }

  return (
    <Box display={'flex'} flexDirection={'column'}>
      <Box display={'flex'} flexDirection={'column'}>
        <Typography fontWeight={600}>Loại vận chuyển {indexDelivery + 1}</Typography>
        {Object.entries(deliveryRequest.items).map(([key, deliveryItem]) => {
          return (
            <Grid
              key={key}
              container
              sx={{
                padding: '3px',
                paddingLeft: '10px',
                position: 'relative',
                borderBottom: '1px solid',
                borderColor: theme => theme.palette.grey[300]
              }}
              alignItems={'center'}
              flexWrap={'nowrap'}
              columnSpacing={1}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  flexWrap: 'nowrap',
                  position: 'absolute',
                  bottom: 5,
                  right: 5,
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <Typography>Số lượng:</Typography>
                <IconButton
                  size='small'
                  onClick={() => {
                    if (deliveryItem.quantity === 0) return
                    handleChangeQuantity(deliveryItem.quantity - 1, key)
                  }}
                >
                  <Minus />
                </IconButton>
                <TextField
                  autoComplete='off'
                  value={deliveryItem.quantity || 0}
                  inputProps={{
                    style: {
                      textAlign: 'center',
                      height: '100%'
                    },
                    min: 0,
                    onWheel: e => {
                      e.preventDefault()
                    },
                    onScroll: e => {
                      e.preventDefault()
                    }
                  }}
                  fullWidth
                  onScroll={e => {
                    e.preventDefault()
                    e.currentTarget.blur()
                  }}
                  onChange={e => {
                    handleChangeQuantity(e.target.value, key)
                  }}
                  size='small'
                  sx={{
                    width: '60px'
                  }}
                  error={!!error[indexDelivery]}
                />
                <IconButton
                  size='small'
                  onClick={() => {
                    handleChangeQuantity(deliveryItem.quantity + 1, key)
                  }}
                >
                  <Plus />
                </IconButton>
                <Typography> ({deliveryItem.item.itemTemplateResponse?.unit})</Typography>
              </Box>

              <Grid
                item
                sx={{
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <Box
                  sx={{
                    borderRadius: '5px'
                  }}
                >
                  <CardMedia
                    image={deliveryItem?.item?.itemTemplateResponse?.image}
                    component={'img'}
                    sx={{
                      maxWidth: '180px',
                      maxHeight: '150px',
                      borderRadius: '5px'
                    }}
                  />
                </Box>
              </Grid>
              <Grid item container flexDirection={'column'}>
                <Grid item display={'flex'}>
                  <Typography
                    variant='body1'
                    sx={{
                      verticalAlign: 'middle'
                    }}
                    fontWeight={700}
                  >
                    {deliveryItem?.item?.itemTemplateResponse?.name}
                  </Typography>
                </Grid>
                <Grid item display={'flex'} gap={2}>
                  {deliveryItem?.item?.itemTemplateResponse?.attributeValues &&
                    deliveryItem?.item?.itemTemplateResponse?.attributeValues.length > 0 &&
                    deliveryItem?.item?.itemTemplateResponse.attributeValues.map((item, index) => (
                      <Chip
                        key={index}
                        label={item}
                        color='success'
                        size='small'
                        sx={{
                          minWidth: '50px'
                        }}
                      ></Chip>
                    ))}
                </Grid>
                <Grid item display={'flex'}>
                  <Label variant='body2'>Vận chuyển tối đa</Label>
                  <Typography
                    variant='body2'
                    sx={{
                      verticalAlign: 'middle'
                    }}
                  >
                    {`${deliveryItem?.item?.itemTemplateResponse?.maximumTransportVolume} (${deliveryItem?.item?.itemTemplateResponse?.unit})`}
                  </Typography>
                </Grid>
                <Grid item display={'flex'}>
                  <Label variant='body2'>Hạn sử dụng</Label>
                  <Typography
                    variant='body2'
                    sx={{
                      verticalAlign: 'middle'
                    }}
                  >
                    {formateDateDDMMYYYY(deliveryItem?.item?.initialExpirationDate || '')}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          )

          // return (
          //   <Box key={key} display={'flex'} gap={3} alignItems={'center'}>
          //     <Typography fontWeight={500}>{deliveryItem.item.itemTemplateResponse?.name || '_'}</Typography>
          //     <Box display={'flex'} alignItems={'center'}>
          //       <Typography >Số lượng: {deliveryItem.quantity || 0}</Typography>
          //     </Box>
          //   </Box>
          // )
        })}
      </Box>
      <Box display={'flex'} flexDirection={'column'}>
        {!!error[indexDelivery] && <FormHelperText error>{error[indexDelivery]}</FormHelperText>}
      </Box>
    </Box>
  )
}
