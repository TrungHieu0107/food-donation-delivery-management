import { Avatar, Skeleton, Typography, Box, Grid } from '@mui/material'
import * as React from 'react'

export interface IImportStockInfoProps {
  data: {
    name: string | undefined
    address: string | undefined
    phone: string | undefined
    avatar: string | undefined
  }
  isLoading: boolean
}

export default function ImportStockInfo(props: IImportStockInfoProps) {
  const {
    data = {
      name: '',
      address: '',
      phone: '',
      avatar: ''
    },
    isLoading
  } = props

  return (
    <Box display={'flex'} gap={2} mt={2}>
      {!isLoading ? (
        <Avatar
          src={data.avatar}
          sx={{
            height: 100,
            width: 100
          }}
        />
      ) : (
        <Skeleton variant='circular' />
      )}
      <Grid container flexDirection={'column'} spacing={1}>
        <Grid item display={'flex'} gap={3}>
          <Typography fontWeight={700}>Tên: </Typography>
          <Typography fontWeight={500}>{data.name}</Typography>
        </Grid>
        <Grid item display={'flex'} gap={3}>
          <Typography fontWeight={700}>SĐT: </Typography>
          <Typography fontWeight={500}>{data.phone}</Typography>
        </Grid>
        <Grid item display={'flex'} gap={3}>
          <Typography
            fontWeight={700}
            sx={{
              whiteSpace: 'nowrap'
            }}
          >
            Địc chỉ:
          </Typography>
          <Typography fontWeight={500}>{data.address}</Typography>
        </Grid>
      </Grid>
    </Box>
  )
}
