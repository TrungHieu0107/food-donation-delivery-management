import { Box, CardMedia, Chip, Grid, Typography, TypographyProps, styled } from '@mui/material'
import * as React from 'react'
import { customColor } from 'src/@core/theme/color'
import { AidItemResponseModel } from 'src/models/AidRequest'

export interface IAidItemTagProps {
  aidItem?: AidItemResponseModel
  isFindingStock?: boolean
  stock?: number
}

const Label = styled(Typography)<TypographyProps>(() => ({
  textAlign: 'left',
  fontWeight: 550,
  whiteSpace: 'nowrap',
  paddingRight: '5px'
}))

export const StatusAidItemChip: {
  [key: string]: React.ReactNode
} = {
  WAITING: <Chip label='Đang chờ' color='info' size='small' />,
  ACCEPTED: <Chip label='Đã chấp nhận' color='success' size='small' />,
  REJECTED: <Chip label='Từ chối' color='error' size='small' />,
  APPLIED_TO_ACTIVITY: <Chip label='Đã thêm yêu cầu' color='success' size='small' />,
  TIME_OUT_TO_AID: <Chip label='Hết hạn' color='error' size='small' />,
  REPLACED: <Chip label='Vật phẩm thay thế' color='warning' size='small' />
}

export default function AidItemTag({ aidItem, isFindingStock, stock }: IAidItemTagProps) {
  
  const checkStock = () => {
    if ((stock || 0) >= (aidItem?.quantity || 0) - (aidItem?.exportedQuantity || 0))
      return (
        <Chip
          label='Đủ hàng'
          color='success'
          size='small'
          sx={{
            ml: 1
          }}
        />
      )

    return (
      <Chip
        label='Thiếu hàng'
        color='error'
        size='small'
        sx={{
          ml: 1
        }}
      />
    )
  }

  return (
    <Grid
      item
      container
      sx={{
        width: '450px',
        height: '115px',
        padding: '3px',
        borderRadius: '5px',
        backgroundColor: customColor.itemTagColor,
        position: 'relative'
      }}
      alignItems={'center'}
      className='shadow'
      columnSpacing={1}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          right: 8
        }}
      >
        {StatusAidItemChip[aidItem?.status || '']}
      </Box>
      <Grid
        item
        md={3}
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          paddingY: '4px'
        }}
      >
        <Box
          sx={{
            borderRadius: '5px',
            backgroundColor: theme => theme.palette.background.paper,
            height: '100%',
            display: 'flex'
          }}
        >
          <CardMedia
            image={aidItem?.itemResponse?.image}
            component={'img'}
            sx={{
              maxWidth: 100,
              borderRadius: '5px'
            }}
          />
        </Box>
      </Grid>
      <Grid
        item
        container
        md={9}
        flexDirection={'column'}
        sx={{
          height: 'auto'
        }}
      >
        <Grid item display={'flex'}>
          <Typography
            variant='body1'
            sx={{
              verticalAlign: 'bottom'
            }}
            fontWeight={700}
          >
            {aidItem?.itemResponse?.name}
          </Typography>
        </Grid>
        <Grid item display={'flex'} gap={2}>
          {aidItem?.itemResponse?.attributeValues &&
            aidItem?.itemResponse?.attributeValues.length > 0 &&
            aidItem?.itemResponse.attributeValues.map((item, index) => (
              <Chip
                key={index}
                label={item}
                color='secondary'
                size='small'
                sx={{
                  minWidth: '50px'
                }}
              ></Chip>
            ))}
        </Grid>
        <Grid item display={'flex'}>
          <Label variant='body2'>Cần hỗ trợ</Label>
          <Typography
            variant='body2'
            sx={{
              verticalAlign: 'bottom'
            }}
          >
            {`${aidItem?.quantity}`}
            <Typography px={1} component={'span'}>{`(${aidItem?.itemResponse?.unit})`}</Typography>
          </Typography>
        </Grid>
        <Grid item display={'flex'}>
          <Label variant='body2'>Đã hỗ trợ</Label>
          <Typography
            variant='body2'
            sx={{
              verticalAlign: 'bottom'
            }}
          >
            {`${aidItem?.exportedQuantity} `}
            <Typography px={1} component={'span'}>{`(${aidItem?.itemResponse?.unit})`}</Typography>
          </Typography>
        </Grid>
        <Grid item display={'flex'}>
          <Label variant='body2'>Tồn kho</Label>
          <Typography
            variant='body2'
            sx={{
              verticalAlign: 'bottom'
            }}
          >
            {isFindingStock ? 'Đang tìm...' : stock}
            {!isFindingStock && <Typography px={1} component={'span'}>{`(${aidItem?.itemResponse?.unit})`}</Typography>}
          </Typography>
          {!isFindingStock && checkStock()}
        </Grid>
      </Grid>
    </Grid>
  )
}
