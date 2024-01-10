import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'
import ContactEmergencyOutlinedIcon from '@mui/icons-material/ContactEmergencyOutlined'
import ContactMailOutlinedIcon from '@mui/icons-material/ContactMailOutlined'
import ContactPhoneOutlinedIcon from '@mui/icons-material/ContactPhoneOutlined'
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined'
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import { Avatar, Card, CardContent, Chip, CircularProgress, Grid, Stack, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import axiosClient from 'src/api-client/ApiClient'
import { KEY } from 'src/common/Keys'
import UserLayout from 'src/layouts/UserLayout'

const DetailUser = () => {
  const router = useRouter()
  const { slug } = router.query
  const [data, setData] = useState<any>()
  useEffect(() => {
    const fetchData = async () => {
      const res = await axiosClient.get(`/users/${slug}`)
      setData(res.data || {})
    }
    if (slug) fetchData()
  }, [slug])

  if (data) {
    return (
      <Card sx={{height:"100%", width:"85%", m:"auto", color:"#00b0ff"}}>
        <CardContent>
          <Grid container spacing={5} sx={{ mb: 5 }}>
            <Grid item xs={12} md={6} lg={4}>
              <Avatar alt='avatar' src={data.avatar} sx={{ width: '250px', height: '250px', ml: 10, mt: 3 }} />
            </Grid>
            <Grid item xs={12} md={6} lg={8}>
              <Stack direction={'row'} alignItems={'center'} spacing={2}>
                <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mt: 5, mb: 5 }}>
                  <AccountCircleOutlinedIcon />
                  <Typography variant='body1' sx={{ mb: 3, fontWeight: 700 }}>
                    Họ và tên:
                  </Typography>
                </Stack>
                <Typography variant='body1'>{data.fullName}</Typography>
              </Stack>

              <Stack direction={'row'} alignItems={'center'} spacing={2}>
                <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mt: 5, mb: 5 }}>
                  <ContactMailOutlinedIcon />
                  <Typography variant='body1' sx={{ mb: 3, fontWeight: 700 }}>
                    Email:
                  </Typography>
                </Stack>
                <Typography variant='body1'>{data.email}</Typography>
              </Stack>

              <Stack direction={'row'} alignItems={'center'} spacing={2}>
                <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mt: 5, mb: 5 }}>
                  <ContactPhoneOutlinedIcon />
                  <Typography variant='body1' sx={{ mb: 3, fontWeight: 700 }}>
                    Số điện thoại:
                  </Typography>
                </Stack>
                <Typography variant='body1'>{data.phone}</Typography>
              </Stack>
              {data.status === 'ACTIVE' && (
                <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mt: 5, mb: 5 }}>
                  <FactCheckOutlinedIcon />
                  <Typography variant='body1' sx={{ fontWeight: 700 }}>
                    Trạng thái:{' '}
                  </Typography>
                  <Chip
          
                    color='success'
                    sx={{
                      color: '#FFFFFF',
                      fontWeight: 600,
                
                    }}
                    label={'ĐANG HOẠT ĐỘNG'}
                  icon={<CheckCircleOutlineOutlinedIcon/>}
                  />
                </Stack>
              )}
              {data.status === 'INACTIVE' && (
                <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mt: 5, mb: 5 }}>
                  <FactCheckOutlinedIcon />
                  <Typography variant='body1' sx={{ fontWeight: 700 }}>
                    Trạng thái:{' '}
                  </Typography>
                  <Chip
                    color='error'
                    sx={{
                      color: '#FFFFFF',
                      fontWeight: 600
                    }}
                    label={'NGƯNG HOẠT ĐỘNG'}
                    icon={<CancelOutlinedIcon/>}
                  />
                </Stack>
              )}
            </Grid>
          </Grid>
          {data.address && (
            <Stack direction={'row'} alignItems={'center'} spacing={2}>
              <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mt: 5, mb: 5 }}>
                <LocationOnOutlinedIcon />
                <Typography variant='body1' sx={{ mb: 3, fontWeight: 700 }}>
                  Địa chỉ:
                </Typography>
              </Stack>
              <Typography variant='body1'>{data.address}</Typography>
            </Stack>
          )}
         
            <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mb: 5 }}>
              <EditNoteOutlinedIcon />
              <Typography variant='body1' sx={{ mb: 3, fontWeight: 700 }}>
                Mô tả của người dùng:
              </Typography>
            </Stack>
            <Typography variant='body1' sx={{border:"2px solid", p:3, borderRadius:"20px"}}>{data.description ? data.description : "Không"}</Typography>        

        
            <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mt: 5, mb: 5 }}>
              <ContactEmergencyOutlinedIcon />
              <Typography variant='body1' sx={{ mb: 3, fontWeight: 700 }}>
                Các thông tin liên lạc khác:
              </Typography>
            </Stack>
            <Typography sx={{border:"2px solid", p:3, borderRadius:"20px"}} variant='body1'>{data.otherContacts ? data.otherContacts : "Không"}</Typography>

        </CardContent>
      </Card>
    )
  } else {
    return   (
    <Stack
    sx={{ height: '50vh', width:"100%"}}
    direction={'row'}
    justifyContent={'center'}
    alignItems={'center'}
    spacing={3}
  >
    <CircularProgress color='info' />
    <Typography>Đang tải dữ liệu.....</Typography>
  </Stack>
    )
  }
}

export default DetailUser

DetailUser.auth = {
  role: [KEY.ROLE.SYSTEM_ADMIN]
}
DetailUser.getLayout = (page: React.ReactNode) => (
  <UserLayout pageTile='Chi tiết thông tin người dùng'>{page}</UserLayout>
)