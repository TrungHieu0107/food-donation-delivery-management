import {
  Box,
  CardMedia,
  IconButton,
  Tooltip,
  Typography,
  Chip,
  Grid,
  TypographyProps,
  styled,
  Checkbox
} from '@mui/material'
import { PencilOutline } from 'mdi-material-ui'
import { Fragment, useState } from 'react'
import { DeliveryRequestCreatingModel, DeliveryRequestItemModel } from './ChooseItemDelivery'
import DialogCustom from 'src/@core/layouts/components/shared-components/Dialog'
import { formateDateDDMMYYYY } from 'src/@core/layouts/utils'
import { DeliveryItemModel } from 'src/models/DeliveryRequest'

export interface IChooseItemDeliveryForDonatedRequestProps {
  deliveryRequest: DeliveryRequestCreatingModel
  indexDelivery: number
  items: DeliveryItemModel[]
  handleChangeDeliveryRequest: (value: DeliveryRequestCreatingModel) => void
}
const Label = styled(Typography)<TypographyProps>(() => ({
  textAlign: 'left',
  fontWeight: 550,
  whiteSpace: 'nowrap',
  paddingRight: '5px'
}))

export default function ChooseItemDeliveryForDonatedRequest(props: IChooseItemDeliveryForDonatedRequestProps) {
  const {
    deliveryRequest = { items: {}, sameDelivery: 1 } as DeliveryRequestCreatingModel,
    items = [],
    handleChangeDeliveryRequest
  } = props

  const [open, setOpen] = useState<boolean>(false)

  const isSelected = (itemId: string) => {
    console.log({ deliveryRequest, items }, deliveryRequest.items[itemId])

    const result = deliveryRequest.items[itemId]

    return !!result
  }

  return (
    <Fragment>
      <Tooltip title='Điều chỉnh'>
        <IconButton
          sx={{
            width: '50px',
            height: '50px'
          }}
          onClick={() => {
            setOpen(true)
          }}
        >
          <PencilOutline color='info' />
        </IconButton>
      </Tooltip>
      <DialogCustom
        width={600}
        content={
          <Box>
            {items.map((deliveryItem, key) => {
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
                  <Grid item display={'flex'} alignItems={'center'}>
                    <Checkbox
                      onChange={e => {
                        if (e.target.checked) {
                          const newValue = {
                            ...deliveryRequest,
                            items: {
                              ...deliveryRequest.items,
                              [deliveryItem.itemTemplateResponse?.id || '']: {
                                item: deliveryItem,
                                itemId: deliveryItem?.itemTemplateResponse?.id || '',
                                quantity: 1
                              } as DeliveryRequestItemModel
                            }
                          } as DeliveryRequestCreatingModel
                          handleChangeDeliveryRequest(newValue)
                        } else {
                          const newItems = deliveryRequest.items
                          delete newItems[deliveryItem.itemTemplateResponse?.id || '']

                          handleChangeDeliveryRequest({
                            ...deliveryRequest,
                            items: {
                              ...newItems
                            }
                          })
                        }
                      }}
                      checked={isSelected(deliveryItem.itemTemplateResponse?.id || '')}
                    />
                  </Grid>
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
                        image={deliveryItem?.itemTemplateResponse?.image}
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
                        {deliveryItem?.itemTemplateResponse?.name}
                      </Typography>
                    </Grid>
                    <Grid item display={'flex'} gap={2}>
                      {deliveryItem.itemTemplateResponse?.attributeValues &&
                        deliveryItem.itemTemplateResponse?.attributeValues.length > 0 &&
                        deliveryItem.itemTemplateResponse.attributeValues.map((item, index) => (
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
                        {`${deliveryItem?.itemTemplateResponse?.maximumTransportVolume} (${deliveryItem?.itemTemplateResponse?.unit})`}
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
                        {formateDateDDMMYYYY(deliveryItem?.initialExpirationDate || '')}
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
        }
        handleClose={() => {
          setOpen(false)
        }}
        open={open}
        title={'Chọn vật phầm vận chuyển'}
      />
    </Fragment>
  )
}
