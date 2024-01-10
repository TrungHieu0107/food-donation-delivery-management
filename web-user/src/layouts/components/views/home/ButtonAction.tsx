import VolunteerActivismOutlinedIcon from '@mui/icons-material/VolunteerActivismOutlined'
import Diversity1OutlinedIcon from '@mui/icons-material/Diversity1Outlined'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
import { Avatar, Box, Button, Stack } from '@mui/material'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { KEY } from 'src/common/Keys'
import { UserAPI } from 'src/api-client'
import { useEffect, useState } from 'react'
import { UserModel, CommonRepsonseModel } from 'src/models'

export default function ButtonAction() {
	const router = useRouter()
	const { data: session, status } = useSession()
	const [userLogin, setUserLogin] = useState<UserModel>()
	useEffect(() => {
		const fetchDataUserLogin = async () => {
			try {
				const data = await UserAPI.getProfileLogin()
				const commonDataResponse = new CommonRepsonseModel<UserModel>(data)
				setUserLogin(commonDataResponse.data)
			} catch (error) {
				console.log(error)
			}
		}

		if (status === 'authenticated') fetchDataUserLogin()
	}, [status])

	return (
		<Box sx={{ pt: 10, bgcolor: '#fff', pb: 20 }}>
			<Typography align='center' variant='h5'>
				Hãy bắt đầu hành trình chân ái
			</Typography>
			<div
				style={{
					width: '200px',
					margin: 'auto',
					height: '7px',
					borderRadius: '20px',
					backgroundColor: '#FF7754'
				}}
			></div>
			<Typography align='center'>Chắp cánh những ước mơ và mở ra tương lai tươi sáng</Typography>
			<Grid container spacing={5} sx={{ p: 10 }} alignItems={'top'}>
				<Grid
					item
					xs={12}
					md={4}
					sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}
				>
					<Box
					
						sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'top'
						}}
					>
						<Box>
							<Avatar
								sx={{ width: '80px', height: '80px', bgcolor: 'rgb(47, 221, 240, 0.7)', mb: 5 }}
							>
								<Diversity1OutlinedIcon sx={{ fontSize: '35px', color: '#FFF' }} />
							</Avatar>
						</Box>
						<Stack direction={'column'} alignItems={'center'}>
							<Typography variant='h6'>Đồng hành cùng chúng tôi</Typography>
							<Typography variant='caption' align='center'>
								Hãy trở thành người bạn đồng hành giúp đỡ tin cậy của chúng tôi trên con đường lan
								tỏa yêu thương và đem đến sự ấm no cho mọi nhà
							</Typography>
							{!userLogin?.collaboratorStatus && session?.user?.role === KEY.ROLE.CONTRIBUTOR && (
								<Button
									color='info'
									variant='contained'
									size='small'
									sx={{ borderRadius: '20px', mt: 7 }}
									onClick={() => {
										router.push('/dang-ky-cong-tac-vien')
									}}
								>
									Đăng kí hỗ trợ vận chuyển
								</Button>
							)}
						</Stack>
					</Box>
				</Grid>

				<Grid
					item
					xs={12}
					md={4}
					sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}
				>
					<Box
					
						sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'top'
						}}
					>
						<Box>
							<Avatar
								sx={{ width: '80px', height: '80px', bgcolor: 'rgb(47, 221, 240, 0.7)', mb: 5 }}
							>
								<FavoriteBorderOutlinedIcon sx={{ fontSize: '35px', color: '#FFF' }} />
							</Avatar>
						</Box>
						<Stack direction={'column'} alignItems={'center'}>
							<Typography variant='h6'>Chúng tôi luôn lắng nghe</Typography>
							<Typography variant='caption' align='center'>
								Chúng tôi luôn chờ đợi và lắng nghe bất cứ mong muốn giúp đỡ từ tất cả mọi người
								đang gặp khó khăn để sẵn sàng giúp đỡ bạn kịp thời
							</Typography>
							{session?.user?.role === KEY.ROLE.CHARITY && (
								<Button
									color='info'
									variant='contained'
									size='small'
									sx={{ borderRadius: '20px', mt: 5 }}
									onClick={() => {
										router.push('/tao-yeu-cau-ho-tro')
									}}
								>
									Kêu gọi giúp đỡ
								</Button>
							)}
						</Stack>
					</Box>
				</Grid>
				<Grid
					item
					xs={12}
					md={4}
					sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}
				>
					<Box
					
						sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'top'
						}}
					>
						<Box>
							<Avatar
								sx={{ width: '80px', height: '80px', bgcolor: 'rgb(47, 221, 240, 0.7)', mb: 5 }}
							>
								<VolunteerActivismOutlinedIcon sx={{ fontSize: '35px', color: '#FFF' }} />
							</Avatar>
						</Box>

						<Stack direction={'column'} alignItems={'center'}>
							<Typography variant='h6'>Cùng nhau sẻ chia</Typography>
							<Typography variant='caption' align='center'>
								Hãy lan tỏa lòng yêu thương rộng lớn của bạn đến với tất cả mọi người xung quanh để
								mọi người có thể cảm nhận được tình yêu thương từ tâm bạn
							</Typography>
							{session?.user?.role === KEY.ROLE.CONTRIBUTOR && (
								<Button
									color='info'
									variant='contained'
									size='small'
									sx={{ borderRadius: '20px', mt: 4 }}
									onClick={() => {
										router.push('/tao-yeu-cau-quyen-gop')
									}}
								>
									Quyên góp
								</Button>
							)}
						</Stack>
					</Box>
				</Grid>
			</Grid>
		</Box>
	)
}
