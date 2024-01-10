'use client'

import { Button, Card, CardMedia, Grid, Typography, useMediaQuery, useTheme } from '@mui/material'

// import { useSession } from 'next-auth/react'
// import { useRouter } from 'next/router'

// import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
//import { KEY } from 'src/common/Keys'

export default function MoreAction() {
  // const { data: session } = useSession()
  // const router = useRouter()

  // const styles: SxProps = {
  //   width: '25%',
  //   height: {
  //     xs: 270,
  //     sm: 300,
  //     md: 400,
  //     lg: 400,
  //     xl: 500
  //   }
  // }
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.up('md'))

  return (
		<Card
			sx={{
				backgroundColor: (theme) => theme.palette.customColors.main,
				width: '100%',
				position: 'relative',
				borderRadius: 0
			}}
		>
			<CardMedia
				component='img'
				sx={{ objectFit: 'cover', height: '90vh' }}
				image='/images/img_landing_page.png'
				alt='background image'
			/>
			{/* <Box display={'flex'}>
        <CardMedia component={'img'} image='/images/pages/photo.png' sx={styles} />
        <CardMedia component={'img'} image='/images/pages/image-2.jpg' sx={styles} />
        <CardMedia component={'img'} image='/images/pages/photo.png' sx={styles} />
        <CardMedia component={'img'} image='/images/pages/photo.png' sx={styles} />
      </Box> */}
			<Grid
				container
				flexDirection={'column'}
				justifyContent={'center'}
				flexWrap={'nowrap'}
				spacing={5}
				p={0}
				sx={{
					position: 'absolute',
					top: 0,
					bottom: 0,
					left: 0,
					right: 0,
					backgroundColor: 'rgba(0,0,0,0.3)'

					// theme => hexToRGBA(theme.palette.primary[theme.palette.mode], 0.4)
				}}
			>
				<Grid item>
					<Typography
						textAlign={'center'}
						sx={{ fontSize: '40px', fontWeight: 600, m: 'auto', mb: 10 }}
						color={'white'}
					>
						Tham gia cùng chúng tôi
					</Typography>
					<Typography
						color={'white'}
						sx={{
							width: { md: '65vw' },
							p: '20px',
							textAlign: 'center',
							m: 'auto',
							fontSize: '22px',
							fontWeight: 500
						}}
					>
						Chúng tôi tin rằng chỉ một hành động xuất phát từ ý nghĩ thiện lành của bạn sẽ giúp đỡ
						được rất nhiều người đang gặp khó khăn trên hành tinh tươi đẹp của chúng ta
					</Typography>
				</Grid>
				<Grid
					item
					container
					flexDirection={'row'}
					justifyContent={'center'}
					alignItems={'center'}
					spacing={5}
					p={5}
				>
					<Grid item lg={3} md={4} sm={6} xs={12}>
						<Button
							variant='contained'
							color='info'
							sx={{ borderRadius: '20px' }}
							fullWidth
							size={matches ? 'medium' : 'small'}
							onClick={() => {
								window.scrollTo({
									top: 600,
									behavior: 'smooth' // Cuộn mượt
								})
							}}
						>
							Tìm hiểu thêm
						</Button>
					</Grid>
					{/* {session?.user?.role === KEY.ROLE.CHARITY ? (
            <Grid item lg={3} md={4} sm={6} xs={12}>
              <Button
                color='secondary'
                variant='contained'
                onClick={() => {
                  router.push('/tao-yeu-cau-ho-tro')
                }}
                fullWidth
              >
              Yêu cầu hỗ trợ
              </Button>
            </Grid>
          ) : session?.user?.role === KEY.ROLE.CONTRIBUTOR ? (
            <>
              <Grid item lg={3} md={4} sm={6} xs={12}>
                <Button
                  color='secondary'
                  variant='contained'
                  onClick={() => {
                    router.push('/tao-yeu-cau-quyen-gop')
                  }}
                  fullWidth
                >
                  Quyên góp
                </Button>
              </Grid>
              <Grid item lg={3} md={4} sm={6} xs={12}>
                <Button
                  variant='contained'
                  color='secondary'
                  fullWidth
                  size={matches ? 'medium' : 'small'}
                  onClick={() => {
                    router.push('/dang-ky-cong-tac-vien')
                  }}
                >
                  Đăng kí hỗ trợ vận chuyển
                </Button>
              </Grid>
            </>
          ) : session?.user?.role === KEY.ROLE.COLABORATOR ? (
            <>
              <Grid item lg={3} md={4} sm={6} xs={12}>
                <Button
                  color='secondary'
                  variant='contained'
                  onClick={() => {
                    router.push('/tao-yeu-cau-quyen-gop')
                  }}
                  fullWidth
                >
                  Quyên góp
                </Button>
              </Grid>
            </>
          ) : null} */}
				</Grid>
			</Grid>
		</Card>
	)
}
