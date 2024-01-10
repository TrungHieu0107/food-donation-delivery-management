import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined'
import AccessibilityNewOutlinedIcon from '@mui/icons-material/AccessibilityNewOutlined'

// import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined'
// import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
// import ContactMailOutlinedIcon from '@mui/icons-material/ContactMailOutlined'
// import ContactPhoneOutlinedIcon from '@mui/icons-material/ContactPhoneOutlined'
// import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined'
import BeenhereOutlinedIcon from '@mui/icons-material/BeenhereOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import Diversity1RoundedIcon from '@mui/icons-material/Diversity1Rounded'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined'
import InputOutlinedIcon from '@mui/icons-material/InputOutlined'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import MapOutlinedIcon from '@mui/icons-material/MapOutlined'
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined'
import VolunteerActivismOutlinedIcon from '@mui/icons-material/VolunteerActivismOutlined'
import DoneOutlineIcon from '@mui/icons-material/DoneOutline'
import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	CardMedia,
	Chip,
	CircularProgress,
	Grid,
	LinearProgress,

	//Grid,
	Stack,
	Typography
} from '@mui/material'
import { format } from 'date-fns'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Carousel from 'react-material-ui-carousel'
import { KEY } from 'src/common/Keys'
import JoinActivity from './JoinActivity'
import { useSession } from 'next-auth/react'
import FeedbackActivity from './Feedback'

const GeneralInformationActivity = ({ data, location }: any) => {
	const router = useRouter()
	const { slug } = router.query
	const { data: session } = useSession()

	// const [data, setData] = useState<any>()
	// const [location, setLocation] = useState<any>()
	const DetailLocation = dynamic(
		() => import('src/layouts/components/map/DetailLocationActivity'),
		{ ssr: false }
	)
	console.log(slug)
	useEffect(() => {
		// const fetchData = async () => {
		//   try {
		//     const res = await axiosClient.get(`/activities/${slug}`)
		//     console.log('Data chi tiết: ', res)
		//     setData(res.data)
		//     if(res.data.location){
		//       const locationGetFromAPI = res.data.location.split(',');
		//       setLocation([locationGetFromAPI[0], locationGetFromAPI[1]])
		//     }
		//   } catch (error) {
		//     console.log(error);
		//   }

		// }

		if (slug) console.log(slug)
	}, [slug])

	if (data) {
		return (
			<Box>
				<Carousel
					sx={{ margin: 'auto', border: 'none' }}
					indicatorContainerProps={{
						style: {
							zIndex: 1,
							marginTop: '-24px',
							position: 'relative'
						}
					}}
				>
					{data.images &&
						data.images.map((i: any, index: any) => (
							<Box
								key={index}
								display={'flex'}
								justifyContent={'center'}
								width={'100%'}
								sx={{
									backgroundColor: (theme) => theme.palette.grey[400],
									height: '550px'
								}}
							>
								<Card
									sx={{
										maxHeight: '550px'
									}}
								>
									<CardMedia component='img' image={i} alt='img' height={'550px'} width={'auto'} />
								</Card>
							</Box>
						))}
				</Carousel>
				<Card sx={{ width: '80vw', m: 'auto', mb: 20, mt: 2 }} elevation={0}>
					<CardContent>
						<Typography
							sx={{ mt: 10 }}
							gutterBottom
							variant='h4'
							component='div'
							textAlign={'center'}
						>
							{data.name}
						</Typography>

						{/* start time */}
						<Stack
							direction={'row'}
							justifyContent={'space-between'}
							alignItems={'center'}
							sx={{ mb: 5, mt: 5, ml: '10vw', mr: '10vw' }}
						>
							<Stack direction={'row'} alignItems={'center'} spacing={2}>
								<AccessTimeOutlinedIcon />
								{data.estimatedStartDate ? (
									<Typography>
										Ngày bắt đầu (dự kiến):{' '}
										{format(new Date(data.estimatedStartDate), 'dd/MM/yyyy')}
									</Typography>
								) : (
									<Typography>Ngày bắt đầu (dự kiến): Chưa cập nhật</Typography>
								)}
							</Stack>
							<Stack direction={'row'} alignItems={'center'} spacing={2}>
								<AccessTimeOutlinedIcon />
								{data.startDate ? (
									<Typography>
										Ngày bắt đầu: {format(new Date(data.startDate), 'dd/MM/yyyy')}
									</Typography>
								) : (
									<Typography>Ngày bắt đầu: Chưa cập nhật</Typography>
								)}
							</Stack>
						</Stack>

						{/* end time */}
						<Stack
							direction={'row'}
							justifyContent={'space-between'}
							alignItems={'center'}
							spacing={2}
							sx={{ mb: 5, mt: 5, ml: '10vw', mr: '10vw' }}
						>
							<Stack direction={'row'} alignItems={'center'} spacing={2}>
								<AccessTimeOutlinedIcon />
								{data.estimatedEndDate ? (
									<Typography>
										Ngày kết thúc (dự kiến): {format(new Date(data.estimatedEndDate), 'dd/MM/yyyy')}
									</Typography>
								) : (
									<Typography>Ngày kết thúc (dự kiến): Chưa cập nhật</Typography>
								)}
							</Stack>
							<Stack direction={'row'} alignItems={'center'} spacing={2}>
								<AccessTimeOutlinedIcon />
								{data.endDate ? (
									<Typography>
										Ngày kết thúc: {format(new Date(data.endDate), 'dd/MM/yyyy')}
									</Typography>
								) : (
									<Typography>Ngày kết thúc: Chưa cập nhật</Typography>
								)}
							</Stack>
						</Stack>

						{/* delivery time */}
						<Stack
							direction={'row'}
							alignItems={'center'}
							justifyContent={'center'}
							spacing={2}
							sx={{ mb: 5, mt: 5, ml: '10vw', mr: '10vw' }}
						>
							<AccessTimeOutlinedIcon />
							{data.deliveringDate ? (
								<Typography>
									Ngày giao đồ: {format(new Date(data.deliveringDate), 'dd/MM/yyyy')}
								</Typography>
							) : (
								<Typography>Ngày giao đồ: Chưa cập nhật</Typography>
							)}
						</Stack>

						{/* description */}
						<Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mb: 5, mt: 10 }}>
							<DescriptionOutlinedIcon />
							<Typography variant='body1' sx={{ fontWeight: 700 }}>
								Mô tả chi tiết hoạt động:
							</Typography>
						</Stack>
						<Typography
							variant='body1'
							sx={{
								border: '3px',
								borderStyle: 'solid',
								borderColor: '#2FDDF0',
								p: 3,
								borderRadius: '20px'
							}}
						>
							{data.description}
						</Typography>
						<Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mt: 5 }}>
							<GroupAddOutlinedIcon />
							<Typography variant='body1' sx={{ fontWeight: 700 }}>
								Số người tham gia:
							</Typography>
							<Typography variant='body1'>
								{data.numberOfParticipants} {data.isJoined && '(Có bạn tham gia)'}
							</Typography>
						</Stack>
						<Stack direction={'row'} justifyContent={'space-between'} spacing={5}>
							{data.scope === 'PUBLIC' ? (
								<Stack direction={'row'} alignItems={'center'} spacing={3} sx={{ mt: 5, mb: 5 }}>
									<Stack direction={'row'} alignItems={'center'} spacing={2}>
										<MapOutlinedIcon />
										<Typography variant='body1' sx={{ fontWeight: 700 }}>
											Phạm vi:
										</Typography>
									</Stack>
									<Chip
										label='Cộng đồng'
										icon={<PublicOutlinedIcon />}
										color='info'
										sx={{ p: 2 }}
									/>
								</Stack>
							) : (
								<Stack direction={'row'} alignItems={'center'} spacing={3} sx={{ mt: 5, mb: 5 }}>
									<Stack direction={'row'} alignItems={'center'} spacing={2}>
										<MapOutlinedIcon />
										<Typography variant='body1' sx={{ fontWeight: 700 }}>
											Phạm vi:
										</Typography>
									</Stack>

									<Chip
										label='Nội bộ'
										icon={<InputOutlinedIcon />}
										color='warning'
										sx={{ p: 2, color: 'black' }}
									/>
								</Stack>
							)}

							{data.status === 'NOT_STARTED' && (
								<Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mt: 5, mb: 5 }}>
									<BeenhereOutlinedIcon />
									<Typography variant='body1' sx={{ fontWeight: 700 }}>
										Trạng thái:
									</Typography>
									<Chip
										color='info'
										sx={{
											color: '#FFFFFF',
											fontWeight: 'bold'
										}}
										label={'CHƯA BẮT ĐẦU'}
									/>
								</Stack>
							)}
							{data.status === 'STARTED' && (
								<Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mt: 5, mb: 5 }}>
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
							{data.status === 'ENDED' && (
								<Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mt: 5, mb: 5 }}>
									<BeenhereOutlinedIcon />
									<Typography variant='body1' sx={{ fontWeight: 700 }}>
										Trạng thái:
									</Typography>
									<Chip
										color='success'
										sx={{
											color: '#FFFFFF',
											fontWeight: 'bold'
										}}
										label={'ĐÃ KẾT THÚC'}
									/>
								</Stack>
							)}
							{data.status === 'INACTIVE' && (
								<Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mt: 5, mb: 5 }}>
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

							<Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mt: 5, mb: 5 }}>
								<AccessibilityNewOutlinedIcon />
								<Typography variant='body1' sx={{ fontWeight: 700 }}>
									Loại hoạt động:
								</Typography>
								{data.activityTypeComponents.map((t: any) => (
									<Box key={t}>
										{t === 'Lao động tình nguyện' && (
											<Chip
												label='Lao động tình nguyện'
												color='success'
												icon={<Diversity1RoundedIcon />}
												sx={{ p: 2 }}
											></Chip>
										)}
										{t === 'Hỗ trợ phát đồ' && (
											<Chip
												label='Hỗ trợ'
												color='secondary'
												icon={<VolunteerActivismOutlinedIcon />}
												sx={{ p: 2 }}
											></Chip>
										)}
										{t === 'Quyên góp' && (
											<Chip
												label='Quyên góp'
												color='info'
												icon={<FavoriteBorderOutlinedIcon />}
												sx={{ p: 2 }}
											></Chip>
										)}
									</Box>
								))}
							</Stack>
						</Stack>
						{data?.targetProcessResponses && (
							<Stack direction={'row'} spacing={2} alignItems={'center'} sx={{ width: '30vw' }}>
								<DoneOutlineIcon />
								<Typography
									variant='body1'
									sx={{ width: '100px', fontWeight: 700 }}
									fontWeight={500}
								>
									Tiến độ
								</Typography>
								<Grid container spacing={2} alignItems={'center'}>
									<Grid item xs={11}>
										<LinearProgress
											color='info'
											sx={{ height: '10px', borderRadius: '10px' }}
											variant='determinate'
											value={data?.totalTargetProcessPercentage || 0}
										/>
									</Grid>

									<Grid item xs={1}>
										<Typography variant='body2' color='text.secondary'>{`${
											data?.totalTargetProcessPercentage || 0
										}%`}</Typography>
									</Grid>
								</Grid>
							</Stack>
						)}
						{data.address && (
							<Stack direction={'row'} alignItems={'center'} spacing={2}>
								<Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mt: 5, mb: 5 }}>
									<LocationOnOutlinedIcon />
									<Typography variant='body1' sx={{ mb: 3, fontWeight: 700 }}>
										Địa điểm:
									</Typography>
								</Stack>
								<Typography variant='body1'>{data.address}</Typography>
							</Stack>
						)}
						<Box>{location && <DetailLocation selectedPosition={location} />}</Box>
						{!session?.user && (
							<Typography sx={{ mt: 5, mb: 5 }}>
								Vui lòng đăng nhập để Quyên góp/Tham gia vào hoạt động
							</Typography>
						)}
					</CardContent>
					<CardActions
						sx={{
							display: 'flex',
							justifyContent: 'center',
							gap: 3
						}}
					>
						{(session?.user.role === 'CONTRIBUTOR') &&
						data.isJoined === false && <JoinActivity />}
						{session?.user.role === "CONTRIBUTOR" && data.status === "STARTED" &&(
								<Button
									variant='contained'
									disabled={data.targetProcessResponses && data.targetProcessResponses.length === 0}
									color='primary'
									onClick={() => {
										router.push('/tao-yeu-cau-quyen-gop?hoat_dong=' + data.id)
									}}
								>
									Quyên góp
								</Button>
							)}
						{session?.user.role === 'CONTRIBUTOR' && <FeedbackActivity />}
						<Button
							variant='outlined'
							onClick={() => {
								router.back()
							}}
						>
							Quay về
						</Button>
					</CardActions>
				</Card>
			</Box>
		)
	} else {
		return (
			<Stack
				sx={{ height: '50vh', mt: '20vh', ml: '45vw' }}
				direction={'column'}
				justifyContent={'center'}
				alignItems={'center'}
			>
				<CircularProgress color='secondary' />
				<Typography>Đang tải dữ liệu...</Typography>
			</Stack>
		)
	}
}

export default GeneralInformationActivity

GeneralInformationActivity.auth = {
	role: [KEY.ROLE.BRANCH_ADMIN, KEY.ROLE.SYSTEM_ADMIN]
}
