import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import BeenhereOutlinedIcon from '@mui/icons-material/BeenhereOutlined'
import ContactMailOutlinedIcon from '@mui/icons-material/ContactMailOutlined'
import ContactPhoneOutlinedIcon from '@mui/icons-material/ContactPhoneOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import { Box, Card, CardMedia, Chip, CircularProgress, Grid, Stack, Typography } from '@mui/material'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import axiosClient from 'src/api-client/ApiClient'
import { KEY } from 'src/common/Keys'
import UserLayout from 'src/layouts/UserLayout'

const MyBranchDetail = () => {
  const [data, setData] = useState<any>()
  const [location, setLocation] = useState<any>()
  const DetailLocation = dynamic(() => import('src/layouts/components/map/DetailLocationActivity'), { ssr: false })
  useEffect(() => {
    const fetchData = async () => {
      const response: any = await axiosClient.get(`/branches/profile`)
      setData(response.data || {})
      if (response.data?.location) {
        const locationGetFromAPI = response.data.location.split(',')
        setLocation([locationGetFromAPI[0], locationGetFromAPI[1]])
      }
    }
    fetchData()
  }, [])

  if (data) {
    return (
      <Box sx={{ mt: 5 }}>
        <Card sx={{ mb: 10, p: 5, color: '#03a9f4' }}>
          <Grid container columnSpacing={3} sx={{ mb: 5, mt: 5, p: 3 }}>
            <Grid item xs={12} md={4}>
              <CardMedia
                component='img'
                height='340'
                image={data.image}
                alt='img'
                sx={{ objectFit: 'cover', border: '3px solid #ff4081', borderRadius: '10px' }}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              {/* name */}
              <Typography gutterBottom variant='h5' textAlign={'center'} sx={{ mb: 3 }}>
                {data.name}
              </Typography>
              <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mb: 5 }}>
                <Stack direction={'row'} alignItems={'center'} spacing={2}>
                  <AccountCircleOutlinedIcon />
                  <Typography variant='body1' sx={{ fontWeight: 700 }}>
                    Tên quản trị viên:
                  </Typography>
                </Stack>
                <Typography variant='body1'>{data.branchAdminResponses.memberName}</Typography>
              </Stack>

              <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mb: 5 }}>
                <Stack direction={'row'} alignItems={'center'} spacing={2}>
                  <ContactMailOutlinedIcon />
                  <Typography variant='body1' sx={{ fontWeight: 700 }}>
                    Email:
                  </Typography>
                </Stack>
                <Typography variant='body1'>{data.branchAdminResponses.email}</Typography>
              </Stack>

              <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mb: 5 }}>
                <Stack direction={'row'} alignItems={'center'} spacing={2}>
                  <ContactPhoneOutlinedIcon />
                  <Typography variant='body1' sx={{ fontWeight: 700 }}>
                    Số điện thoại:
                  </Typography>
                </Stack>
                <Typography variant='body1'>{data.branchAdminResponses.phone}</Typography>
              </Stack>
              {data.status === 'ACTIVE' && (
                <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mb: 5 }}>
                  <BeenhereOutlinedIcon />
                  <Typography variant='body1' sx={{ fontWeight: 700 }}>
                    Trạng thái:{' '}
                  </Typography>
                  <Chip
                    color='info'
                    sx={{
                      color: '#FFFFFF',
                      fontWeight: 'bold'
                    }}
                    label={'ĐANG HOẠT ĐỘNG'}
                  />
                </Stack>
              )}
              {data.status === 'INACTIVE' && (
                <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mb: 5 }}>
                  <BeenhereOutlinedIcon />
                  <Typography variant='body1' sx={{ fontWeight: 700 }}>
                    Trạng thái:{' '}
                  </Typography>
                  <Chip
                    color='error'
                    sx={{
                      color: '#FFFFFF',
                      fontWeight: 'bold'
                    }}
                    label={'NGƯNG HOẠT ĐỘNG'}
                  />
                </Stack>
              )}
              {data.address && (
                <Box>
                  <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mb: 3 }}>
                    <LocationOnOutlinedIcon />
                    <Typography variant='body1' sx={{ mb: 3 }}>
                      <span style={{ fontWeight: 700, marginRight: '10px' }}>Địa chỉ chi nhánh:</span>
                      {data.address}
                    </Typography>
                  </Stack>
                </Box>
              )}
            </Grid>
          </Grid>
          {data.description && (
            <>
              <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mb: 5, mt: 10 }}>
                <DescriptionOutlinedIcon />
                <Typography variant='body1' sx={{ fontWeight: 700 }}>
                  Mô tả về chi nhánh:
                </Typography>
              </Stack>
              <Typography
                variant='body1'
                component={'p'}
                sx={{
                  border: '1px solid',
                  p: 3,
                  borderRadius: '20px',
                  mb: 5,
                  whiteSpace: 'pre-wrap !important'
                }}
              >
                {data.description}
              </Typography>
            </>
          )}
          <Box>{location && <DetailLocation selectedPosition={location} />}</Box>
        </Card>
      </Box>
    )
  } else {
    return (
      <Stack
        sx={{ height: '50vh', width: '100%' }}
        direction={'column'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <CircularProgress color='info' />
        <Typography>Đang tải dữ liệu...</Typography>
      </Stack>
    )
  }
}

export default MyBranchDetail

MyBranchDetail.auth = {
  role: [KEY.ROLE.BRANCH_ADMIN]
}
MyBranchDetail.getLayout = (page: React.ReactNode) => (
  <UserLayout pageTile='Thông tin chi nhánh của tôi'>{page}</UserLayout>
)
