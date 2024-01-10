import { Box, Card, CardMedia, Chip, Grid, Stack, Typography } from '@mui/material'
import React from 'react'
import AddRoadOutlinedIcon from '@mui/icons-material/AddRoadOutlined'
import BallotOutlinedIcon from '@mui/icons-material/BallotOutlined'
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined'

function ItemTargetTab({data}: any) {

  return (
    <Box sx={{p: 5}}>  
    {data?.targetProcessResponses.length === 0 &&  <Box sx={{height:"40px", width:"100%", display:"flex", justifyContent:"center", alignItems:"center"}}>
      <Typography variant='h5' fontWeight={600} align='center'>
        Không có vật phẩm
      </Typography>
      </Box>}
   {data?.targetProcessResponses.length > 0 && 
   <Box sx={{height:"40px", mb: 10, width:"100%", display:"flex", justifyContent:"center", alignItems:"center"}}>
      <Typography variant='h5' fontWeight={600} align='center'>
        Danh sách các vật phẩm hỗ trợ cho hoạt động
      </Typography>
      </Box>}
      <Grid container spacing={2}>
      {data?.targetProcessResponses.length > 0 &&
            data?.targetProcessResponses?.map((b: any, index: any) => (
              <Grid item xs={12} md={6} key={index}>
              <Grid container columnSpacing={5} sx={{ mb: 10 }}>
                <Grid item xs={12} sm={6}>
                  <Card>
                    <CardMedia component='img' height='200' image={b.itemTemplateResponse.image} alt='img' />
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant='h5'>{b.itemTemplateResponse.name}</Typography>
                 {b.itemTemplateResponse.attributeValues. length> 0 && 
                 <Stack direction='row' alignItems={'center'} spacing={3} sx={{mt: 4}}>
                 <BallotOutlinedIcon />
                 <Typography sx={{ mt: 3, fontSize: 14 }} variant='body1'>
                   Các thuộc tính: </Typography> {b.itemTemplateResponse.attributeValues.map((a: any)=> 
                   (<Chip key={a} label={a} color='info' sx={{ml: 2}}/>))}
                
               </Stack>
                 } 
                  <Stack direction='row' alignItems={'center'} spacing={3} sx={{ mb: 5, mt: 5 }}>
                    <InventoryOutlinedIcon />
                    <Typography sx={{ mt: 3, fontSize: 14 }} variant='body1'>
                      Mục tiêu: {b.target} {b.itemTemplateResponse.unit}
                    </Typography>
                  </Stack>
                  <Stack direction='row' alignItems={'center'} spacing={3} sx={{ mb: 5, mt: 5 }}>
                    <AddRoadOutlinedIcon />
                    <Typography sx={{ mt: 3, fontSize: 14 }} variant='body1'>
                      Tiến độ: {b.process} {b.itemTemplateResponse.unit}
                    </Typography>
                  </Stack>

                 
                </Grid>
              </Grid>
              </Grid>
            ))}
            </Grid>
            </Box>
  )
}

export default ItemTargetTab