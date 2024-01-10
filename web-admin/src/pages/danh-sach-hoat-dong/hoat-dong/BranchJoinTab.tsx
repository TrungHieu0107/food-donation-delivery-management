'use client'

import { Box, Card, CardMedia, Grid, Stack, Typography } from '@mui/material'
import React from 'react'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import BeenhereOutlinedIcon from '@mui/icons-material/BeenhereOutlined'

function BranchJoinTab({data}: any) {
  return (
    
      <Box sx={{p: 5}}>
         {data?.branchResponses?.length === 0 && 
        <Box sx={{height:"40px", mb: 10, width:"100%", display:"flex", justifyContent:"center", alignItems:"center"}}>
      <Typography variant='h5' fontWeight={600}>
       Hiện chưa có chi nhánh tham gia hoạt động này
      </Typography>

      </Box>}
         {data?.branchResponses?.length > 0 && 
        <Box sx={{height:"40px", mb: 10, width:"100%", display:"flex", justifyContent:"center", alignItems:"center"}}>
      <Typography variant='h5' fontWeight={600}>
        Danh sách các chi nhánh tham gia hoạt động
      </Typography>

      </Box>}

       {data?.branchResponses &&
      data?.branchResponses?.map((b: any) => (
        <Grid container columnSpacing={5} key={b.id} sx={{ mb: 10 }}>
          <Grid item xs={3}>
            <Card>
              <CardMedia component='img' height='200' image={b.image} alt='img' />
            </Card>
          </Grid>
          <Grid item xs={8}>
            <Typography variant='h5'>{b.name}</Typography>
            <Stack direction='row' alignItems={'center'} spacing={3} sx={{ mb: 5, mt: 5 }}>
              <LocationOnOutlinedIcon />
              <Typography sx={{ mt: 3, fontSize: 14 }} variant='body1'>
                Địa chỉ: {b.address}
              </Typography>
            </Stack>

            <Stack direction='row' alignItems={'center'} spacing={3}>
              <BeenhereOutlinedIcon />
              <Typography sx={{ mt: 3, fontSize: 14 }} variant='body1'>
                Trạng thái: {b.status === 'ACTIVE' ? 'Đang hoạt động' : 'Ngưng hoạt động'}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      ))}</Box>
  )
}

export default BranchJoinTab