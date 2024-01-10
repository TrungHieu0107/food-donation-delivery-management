import { Card, Grid, CardMedia, Typography, Box, IconButton, Tooltip } from '@mui/material'
import { PencilOutline, TrashCan } from 'mdi-material-ui'
import { useState } from 'react'
import { customColor } from 'src/@core/theme/color'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { KEY } from 'src/common/Keys'
import { DeliveryItemModel } from 'src/models/DeliveryRequest'

export interface IItemDeliveryTagProps {
  deliveryItem: DeliveryItemModel
  hanleUpdateItem: (itemId: string) => void
  handleDeleteItem: (itemId: string) => void
}

export default function ItemDeliveryTag(props: IItemDeliveryTagProps) {
  const { deliveryItem } = props
  const [hover, setHover] = useState<boolean>(false)

  return (
    <Card
      sx={{
        backgroundColor: customColor.itemTagColor,
        padding: '5px',
        position: 'relative'
      }}
      onMouseOver={() => {
        setHover(true)
      }}
      onMouseLeave={() => {
        setHover(false)
      }}
    >
      <Grid container spacing={3}>
        <Grid item display={'flex'} alignItems={'center'}>
          <Box
            sx={{
              padding: '5px',
              borderRadius: '5px',
              width: '100px',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: theme => theme.palette.background.paper
            }}
          >
            <CardMedia
              component={'img'}
              image={deliveryItem?.itemTemplateResponse?.image || KEY.DEFAULT_IMAGE}
              alt={deliveryItem?.itemTemplateResponse?.name || KEY.DEFAULT_VALUE}
            />
          </Box>
        </Grid>
        <Grid item xl lg md sm xs container flexDirection={'column'} justifyContent={'center'}>
          <Grid item display={'flex'} gap={3}>
            <Typography fontWeight={550}>Tên:</Typography>
            <Typography>{deliveryItem?.itemTemplateResponse?.name || KEY.DEFAULT_VALUE}</Typography>
          </Grid>
          <Grid item display={'flex'} gap={3}>
            <Typography fontWeight={550}>Đơn vị:</Typography>
            <Typography>{`${deliveryItem?.itemTemplateResponse?.unit}`}</Typography>
          </Grid>
          <Grid item display={'flex'} gap={3}>
            <Typography fontWeight={550}>Số lượng:</Typography>
            <Typography>
              {`${deliveryItem?.quantity || 0}`}
              <Typography component={'span'}>
                {deliveryItem?.itemTemplateResponse?.unit || KEY.DEFAULT_VALUE}
              </Typography>
            </Typography>
          </Grid>
          <Grid item display={'flex'} gap={3}>
            <Typography fontWeight={550}>Vận chuyển tối đa:</Typography>
            <Typography>
              {deliveryItem?.itemTemplateResponse?.maximumTransportVolume || KEY.DEFAULT_VALUE}
              <Typography component={'span'}>
                {deliveryItem?.itemTemplateResponse?.unit || KEY.DEFAULT_VALUE}
              </Typography>
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: hover ? 'flex' : 'none',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme => hexToRGBA(theme.palette.grey[400], 0.5)
        }}
      >
        <Tooltip title='Chỉnh sửa'>
          <IconButton
            className='update-button'
            onClick={() => {
              props.hanleUpdateItem(props.deliveryItem?.itemTemplateResponse?.id || '')
            }}
          >
            <PencilOutline />
          </IconButton>
        </Tooltip>
        <Tooltip title='Xóa'>
          <IconButton
            className='delete-button'
            onClick={() => {
              props.handleDeleteItem(props.deliveryItem?.itemTemplateResponse?.id || '')
            }}
          >
            <TrashCan />
          </IconButton>
        </Tooltip>
      </Box>
    </Card>
  )
}
