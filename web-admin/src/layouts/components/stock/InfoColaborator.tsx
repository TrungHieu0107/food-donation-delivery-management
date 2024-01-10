import { Avatar, Skeleton, Typography, Box, Grid } from '@mui/material'
import * as React from 'react'

export interface IInfoColaboratorProps {
  data: {
    name: string | undefined
    phone: string | undefined
    avatar: string | undefined
  }
  isLoading: boolean
}

export default function InfoColaborator(props: IInfoColaboratorProps) {
  const {
    data = {
      name: '',
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
        
      </Grid>
    </Box>
  )
}
