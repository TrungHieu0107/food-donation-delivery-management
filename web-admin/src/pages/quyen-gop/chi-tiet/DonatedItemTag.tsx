import { Box, CardMedia, Chip, Grid, Typography, TypographyProps, styled } from '@mui/material'
import * as React from 'react'
import { formateDateDDMMYYYY } from 'src/@core/layouts/utils'
import { customColor } from 'src/@core/theme/color'
import { DonatedItemResponseModel } from 'src/models/DonatedRequest'

export interface IDonatedItemTagProps {
  donatedItem?: DonatedItemResponseModel
}

const Label = styled(Typography)<TypographyProps>(() => ({
  textAlign: 'left',
  fontWeight: 550,
  whiteSpace: 'nowrap',
  paddingRight: '5px'
}))

export default function DonatedItemTag({ donatedItem }: IDonatedItemTagProps) {
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
      {donatedItem?.status === 'REJECTED' && (
        <Chip
          color='error'
          label={
            <Typography
              fontWeight={600}
              variant='body2'
              sx={{
                color: theme => theme.palette.common.white
              }}
            >
              Từ chối
            </Typography>
          }
          size='small'
          sx={{
            position: 'absolute',
            top: 8,
            right: 12
          }}
        />
      )}
      {donatedItem?.status === 'ACCEPTED' && (
        <Chip
          color='success'
          label={
            <Typography
              fontWeight={600}
              variant='body2'
              sx={{
                color: theme => theme.palette.common.white
              }}
            >
              Chấp nhận
            </Typography>
          }
          size='small'
          sx={{
            position: 'absolute',
            top: 8,
            right: 12
          }}
        />
      )}
      <Grid
        item
        md={3}
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
            image={donatedItem?.itemTemplateResponse?.image}
            component={'img'}
            sx={{
              maxWidth: 100,
              borderRadius: '5px'
            }}
          />
        </Box>
      </Grid>
      <Grid item container md={9} flexDirection={'column'}>
        <Grid item display={'flex'}>
          <Typography
            variant='body1'
            sx={{
              verticalAlign: 'middle'
            }}
            fontWeight={700}
          >
            {donatedItem?.itemTemplateResponse?.name}
          </Typography>
        </Grid>
        <Grid item display={'flex'} gap={2}>
          {donatedItem?.itemTemplateResponse?.attributeValues &&
            donatedItem?.itemTemplateResponse?.attributeValues.length > 0 &&
            donatedItem?.itemTemplateResponse.attributeValues.map((item, index) => (
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
          <Label variant='body2'>Số lượng quyên góp</Label>
          <Typography
            variant='body2'
            sx={{
              verticalAlign: 'middle'
            }}
          >
            {`${donatedItem?.quantity} (${donatedItem?.itemTemplateResponse?.unit})`}
          </Typography>
        </Grid>
        {donatedItem?.status === 'ACCEPTED' && (
          <Grid item display={'flex'}>
            <Label variant='body2'>Số lượng đã nhận</Label>
            <Typography
              variant='body2'
              sx={{
                verticalAlign: 'middle'
              }}
            >
              {`${donatedItem?.importedQuantity} (${donatedItem?.itemTemplateResponse?.unit})`}
            </Typography>
          </Grid>
        )}
        <Grid item display={'flex'}>
          <Label variant='body2'>Hạn sử dụng</Label>
          <Typography
            variant='body2'
            sx={{
              verticalAlign: 'middle'
            }}
          >
            {formateDateDDMMYYYY(donatedItem?.initialExpirationDate || '')}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  )
}
