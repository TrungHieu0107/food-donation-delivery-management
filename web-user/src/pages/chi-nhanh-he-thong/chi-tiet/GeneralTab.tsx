
import BeenhereOutlinedIcon from '@mui/icons-material/BeenhereOutlined'

// import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
// import ContactMailOutlinedIcon from '@mui/icons-material/ContactMailOutlined'
// import ContactPhoneOutlinedIcon from '@mui/icons-material/ContactPhoneOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import { Box, Button, CardMedia, Chip, CircularProgress, Grid, Stack, Typography } from '@mui/material'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import axiosClient from 'src/api-client/ApiClient'

const DetailBranchTab = () => {
  const router = useRouter()
  const { slug } = router.query
  const [data, setData] = useState<any>()

  // const [listMembers, setListMembers] = useState<any>([])
  const [location, setLocation] = useState<any>()
  const DetailLocation = dynamic(() => import('src/layouts/components/map/DetailLocationActivity'), { ssr: false })
  useEffect(() => {
    const fetchData = async () => {
      const listBranchesAPI = await axiosClient.get(`/branches/${slug}`)

      // const listBranchMembersAPI = await axiosClient.get(`/branches/${slug}/members`)
      // console.log('Data chi tiết: ', listBranchesAPI.data, listBranchMembersAPI.data)
      // setListMembers(listBranchMembersAPI.data.filter((member: any) => member.status === "ACTIVE"))
      setData(listBranchesAPI.data)
      if (listBranchesAPI.data.location) {
        const locationGetFromAPI = listBranchesAPI.data.location.split(',')
        setLocation([locationGetFromAPI[0], locationGetFromAPI[1]])
      }
    }
    if (slug) fetchData()
  }, [slug])

  if (data) {
    return (
			<Box sx={{ mt: 5 }}>
				<Grid container columnSpacing={3} sx={{ mb: 5 }}>
					<Grid item xs={12} md={4}>
						<CardMedia
							component='img'
							height='300'
							image={data.image}
							alt='img'
							sx={{ objectFit: 'contain' }}
						/>
					</Grid>
					<Grid item xs={12} md={8}>
						{/* name */}
						<Typography
							gutterBottom
							variant='h4'
							component='div'
							textAlign={'center'}
							sx={{ mb: 3 }}
						>
							{data.name}
						</Typography>
						{/* <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mb: 3 }}>
              <Stack direction={'row'} alignItems={'center'} spacing={2}>
                <AccountCircleOutlinedIcon />
                <Typography variant='body1' sx={{ fontWeight: 700 }}>
                  Tên quản trị viên:
                </Typography>
              </Stack>
              <Typography variant='body1'>{data.branchAdminResponses?.memberName}</Typography>
            </Stack>

            <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mb: 3 }}>
              <Stack direction={'row'} alignItems={'center'} spacing={2}>
                <ContactMailOutlinedIcon />
                <Typography variant='body1' sx={{ fontWeight: 700 }}>
                  Email:
                </Typography>
              </Stack>
              <Typography variant='body1'>{data.branchAdminResponses?.email}</Typography>
            </Stack>

            <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mb: 3 }}>
              <Stack direction={'row'} alignItems={'center'} spacing={2}>
                <ContactPhoneOutlinedIcon />
                <Typography variant='body1' sx={{ fontWeight: 700 }}>
                  Số điện thoại:
                </Typography>
              </Stack>
              <Typography variant='body1'>{data.branchAdminResponses?.phone}</Typography>
            </Stack> */}
						{data.status === 'ACTIVE' && (
							<Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mb: 3 }}>
								<BeenhereOutlinedIcon />
								<Typography variant='body1' sx={{ fontWeight: 700 }}>
									Trạng thái:
								</Typography>
								<Chip
									color='primary'
									sx={{
										color: '#FFFFFF',
										fontWeight: 'bold'
									}}
									label={'ĐANG HOẠT ĐỘNG'}
								/>
							</Stack>
						)}
						{data.status === 'INACTIVE' && (
							<Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mb: 3 }}>
								<BeenhereOutlinedIcon />
								<Typography variant='body1' sx={{ fontWeight: 700 }}>
									Trạng thái:
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
									<Typography variant='body1' sx={{ mb: 3, fontWeight: 700 }}>
										Địa chỉ chi nhánh:
									</Typography>
								</Stack>
								<Typography variant='body1'>{data.address}</Typography>
							</Box>
						)}
						<Button
							variant='outlined'
							sx={{ mt: 5 }}
							onClick={() => {
								router.back()
							}}
						>
							Quay về
						</Button>
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
							variant='h6'
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
			</Box>
		)
  } else {
    return (
      <Stack
        sx={{ height: '80vh', mt: '50vh', ml: '50vw' }}
        direction={'column'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <CircularProgress color='secondary' />
        <Typography> Đang tải data.....</Typography>
      </Stack>
    )
  }
}

export default DetailBranchTab

