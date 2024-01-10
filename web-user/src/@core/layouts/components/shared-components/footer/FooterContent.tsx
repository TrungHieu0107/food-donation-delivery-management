// ** MUI Imports
import { Avatar, Grid, Paper, Stack } from '@mui/material'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import { Theme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined'
import YouTubeIcon from '@mui/icons-material/YouTube'
import InstagramIcon from '@mui/icons-material/Instagram'
import CallIcon from '@mui/icons-material/Call'

const FooterContent = () => {
	// ** Var
	const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

	return (
		<Box
			sx={{
				display: 'flex',
				flexWrap: 'wrap',
				alignItems: 'center',
				justifyContent: 'space-between'
			}}
		>
			<Grid container spacing={2} sx={{ mt: 10, mb: 10, p: 10, bgcolor: '#5EDFFF' }}>
				<Grid item xs={12} md={6}>
					<Box>
						<Box sx={{ mb: 3, display:"flex", alignItems:"center" }}>
							<img src='/images/logos/logo.png' alt='logo' style={{ width: '200px' }} />
							<Typography variant='h3' sx={{color: '#F45726'}}>Từ Tâm</Typography>
						</Box>
						<Box>
							<Typography sx={{ fontWeight: 500, fontSize: '20px', color: '#003D58' }}>
								Thắp sáng bởi ngọn lửa của tình thương vô điều kiện, Từ Tâm ấp ủ khát vọng cùng sứ
								mệnh mang tới sự ấm no và tương lai tốt đẹp nhất cho mọi người trên mọi miền đất
								Việt.
							</Typography>
							<Stack direction={'row'} spacing={2} sx={{ mt: 5, mb: 5 }}>
								<Avatar sx={{ width: '50px', height: '50px', bgcolor: '#2FDDF0', mb: 5, cursor:"pointer" }}>
									<FacebookOutlinedIcon sx={{ fontSize: '35px', color: '#FFF' }} />
								</Avatar>
								<Avatar sx={{ width: '50px', height: '50px', bgcolor: '#2FDDF0', mb: 5, cursor:"pointer"  }}>
									<YouTubeIcon sx={{ fontSize: '35px', color: '#FFF' }} />
								</Avatar>
								<Avatar sx={{ width: '50px', height: '50px', bgcolor: '#2FDDF0', mb: 5, cursor:"pointer"  }}>
									<InstagramIcon sx={{ fontSize: '35px', color: '#FFF' }} />
								</Avatar>
							</Stack>
						</Box>
					</Box>
				</Grid>

				<Grid item xs={12} md={6}>
					<Paper
						sx={{
							height: '300px',
							width: { md: '80%' },
							m: 'auto',
							display: 'flex',
							alignItems: 'center',
							borderRadius: '20px'
						}}
					>
						<Stack direction={'row'}>
							<div
								style={{
									width: '7px',
									height: '250px',
									borderRadius: '20px',
									backgroundColor: '#FF7754',
									marginRight: '20px'
								}}
							></div>
							<Box>
								<Typography sx={{ mt: 10, mb: 5, fontWeight: 700 }}>Thông Tin Liên Hệ</Typography>
								<Stack direction={'row'} alignItems={'center'} spacing={2}>
									<CallIcon color='primary' sx={{ fontSize: '35px' }} />
									<a
										href='tel:1234567890'
										style={{
											textDecoration: 'none',
											color: '#00BFC0',
											fontSize: '20px',
											fontWeight: 'bold'
										}}
									>
										0888.666.888
									</a>
								</Stack>
								<Typography sx={{ mt: 3, mb: 3 }} variant='body2'>
									Tổ chức Từ Tâm | Lô E2a-7, Đường D1, Đ. D1, Long Thạnh Mỹ, Thành Phố Thủ Đức,
									Thành phố Hồ Chí Minh | Việt Nam
								</Typography>
								<Typography>Yêu thương lan tỏa, chia sẻ ấm no</Typography>
							</Box>
						</Stack>
					</Paper>
				</Grid>
			</Grid>
			<Typography sx={{ mr: 2, pl: 3 }}>
				{`© ${new Date().getFullYear()}, Liên hệ  `}
				<Box component='span' sx={{ color: 'error.main' }}>
					❤️
				</Box>
				{` với `}
				<Link target='_blank' sx={{color: '#FF7754', fontWeight:700}} href='https://tu-tam.vercel.app'>
					Tu Tam
				</Link>
			</Typography>
			{hidden ? null : (
				<Box
					sx={{
						pr: 3,
						display: 'flex',
						flexWrap: 'wrap',
						alignItems: 'center',
						'& :not(:last-child)': { mr: 4 }
					}}
				>
					<Typography sx={{color: '#003D58'}}>
					FALL2023 - CAPSTONE PROJECT - GFA23SE11 - FA23SE007
					</Typography>
					{/* <Link sx={{color: '#003D58'}} target='_blank' href='https://google.com'>
						Privacy Policy
					</Link>
					<Link sx={{color: '#003D58'}} target='_blank' href='https://google.com'>
						Cookies
					</Link>
					<Link sx={{color: '#003D58'}} target='_blank' href='https://google.com'>
						Support
					</Link> */}
				</Box>
			)}
			<div
				style={{
          marginTop:"7px",
					width: '100vw',
					height: '7px',
					borderRadius: '20px',
					backgroundColor: '#2FDDF0'
				}}
			></div>
		</Box>
	)
}

export default FooterContent
