import { CardMedia, Chip, Grid, Typography, TypographyProps, styled } from '@mui/material'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { formateDateDDMMYYYY } from 'src/@core/layouts/utils'
import { customColor } from 'src/@core/theme/color'
import { TransferItemListObject } from 'src/models/common/CommonResponseModel'

export class ItemTagModel extends TransferItemListObject {
  constructor(values: Partial<ItemTagModel>) {
    super(values)
  }
}

export interface IItemTagProps {
  itemData?: TransferItemListObject
}

const Label = styled(Typography)<TypographyProps>(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: 'left',
  fontWeight: 550,
  whiteSpace: 'nowrap'
}))

export default function ItemTag({ itemData = new ItemTagModel({}) }: IItemTagProps) {
  const [data, setData] = useState<ItemTagModel>(new ItemTagModel(itemData))

  useEffect(() => {
    setData(itemData)
  }, [itemData])

  return (
    <Grid
      item
      container
      sx={{
        width: '400px',
        padding: 3,
        borderRadius: '14px',
        backgroundColor: customColor.itemTagColor
      }}
      alignItems={'center'}
      className='shadow'
    >
      <Grid item md={3}>
        <CardMedia
          image={data?.image}
          component={'img'}
          style={{
            maxWidth: 75,
            height: 65,
            width: 'auto',
            maxHeight: 75
          }}
        />
      </Grid>
      <Grid item container md={9} flexDirection={'column'}>
        <Grid item display={'flex'}>
          <Typography
            variant='body1'
            fontWeight={600}
            sx={{
              verticalAlign: 'middle'
            }}
          >
            {data?.name}
          </Typography>
        </Grid>
        <Grid item display={'flex'} gap={1}>
          {data?.attributes?.map((item, index) => (
            <Chip color='secondary' size='small' key={index} label={item} />
          ))}
        </Grid>
        <Grid item display={'flex'} gap={1}>
          <Label>Số lượng: </Label>
          <Typography
            variant='body2'
            sx={{
              verticalAlign: 'middle'
            }}
          >
            {`${data?.quantity}(${data?.unit})`}
          </Typography>
        </Grid>
        {!!data?.outOfDate && (
          <Grid item display={'flex'}>
            <Label>Hạn sử dụng</Label>
            <Typography
              variant='body2'
              sx={{
                verticalAlign: 'middle'
              }}
            >
              {formateDateDDMMYYYY(data?.outOfDate || '')}
            </Typography>
          </Grid>
        )}
      </Grid>
    </Grid>
  )
}
