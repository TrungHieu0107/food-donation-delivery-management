import {
	Avatar,
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	CardHeader,
	CardMedia,
	Grid,
	LinearProgress,
	Skeleton,
	Stack,
	Tooltip,
	Typography
} from '@mui/material'
import { MagnifyMinusOutline } from 'mdi-material-ui'
import moment from 'moment'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Carousel from 'react-material-ui-carousel'
import { formateDateDDMMYYYY } from 'src/@core/layouts/utils'
import { ActivityAPI } from 'src/api-client/Activity'
import { KEY } from 'src/common/Keys'
import { ActivityResponseModel, QueryActivityListModel } from 'src/models/Activity'
import { CommonRepsonseModel } from 'src/models/common/CommonResponseModel'
import { GenerateDescription } from 'src/pages/hoat-dong'

export default function Activity() {
	const [activities, setActivities] = useState<ActivityResponseModel[]>([])
	const router = useRouter()
	const [loading, setLoading] = useState(true)
	const { data: session } = useSession()
	useEffect(() => {
		fetchDataActivities()
	}, [])

	const fetchDataActivities = async () => {
		setLoading(true)
		const payload = new QueryActivityListModel({
			status: 1,
			page: 0,
			pageSize: 5
		})
		ActivityAPI.getAll(payload)
			.then((result) => {
				const newData = new CommonRepsonseModel<ActivityResponseModel[]>(result)
				setActivities(newData.data ?? ([] as ActivityResponseModel[]))
				console.log(newData)
			})
			.catch((err) => {
				console.error(err)
			})
			.finally(() => {
				setLoading(false)
			})
	}

	return (
		<Box
			sx={{
				backgroundColor: 'none !important',
				p: 5,
				width: '80vw',
				m: 'auto'
			}}
		>
			<Typography
				textAlign={'left'}
				variant='h5'
				fontWeight={600}
				my={5}
				py={2}
				sx={{
					borderBottom: (theme) => `1px solid ${theme.palette.grey[400]}`
				}}
			>
				Hoạt động đang diễn ra
			</Typography>

			<Box sx={{ pt: (theme) => `${theme.spacing(3)} !important` }}>
				{activities.length > 0 && (
					<Card sx={{ mb: 15 }}>
						<Grid container>
							<Grid item xs={12} md={4}>
								<Carousel
									indicatorContainerProps={{
										style: {
											zIndex: 1,
											marginTop: '-24px',
											position: 'relative'
										}
									}}
									sx={{ margin: 'auto', border: 'none', width: '100%' }}
								>
									{activities[0]?.images?.map((image, index) => (
										<CardMedia
											key={index}
											component='img'
											height={395}
											sx={{ objectFit: 'cover' }}
											image={image}
											alt='alt text'
										/>
									))}
								</Carousel>
							</Grid>
							<Grid item xs={12} md={8}>
								<Box p={3}>
									<Box height={'50px'} sx={{ ml: 2 }}>
										<Typography
											variant='h5'
											sx={{ overflow: 'hidden' }}
											fontSize={18}
											fontWeight={700}
										>
											{activities[0]?.name}
										</Typography>
									</Box>

									<Stack
										direction={'row'}
										flexWrap={'wrap'}
										justifyContent={'flex-start'}
										sx={{ ml: 2, mb: 5, mt: 1 }}
									>
										<Typography fontWeight={600}>
											{`Từ ${
												activities[0]?.startDate
													? formateDateDDMMYYYY(activities[0]?.startDate)
													: formateDateDDMMYYYY(activities[0]?.estimatedStartDate || '')
											} (dự kiến) `}
										</Typography>
										<Typography fontWeight={600} sx={{ ml: { md: 10, xs: 0 } }}>
											{`Đến ${
												activities[0]?.endDate
													? formateDateDDMMYYYY(activities[0]?.endDate || '')
													: formateDateDDMMYYYY(activities[0]?.estimatedEndDate || '')
											} (dự kiến) `}
										</Typography>
									</Stack>
									<Grid
										container
										flexDirection={'row'}
										justifyContent={'flex-start'}
										alignItems={'start'}
									>
										<Grid
											item
											container
											display={'flex'}
											flexDirection={'row'}
											columnSpacing={2}
											alignItems={'center'}
											gap={1}
											sx={{ ml: 2 }}
										>
											<Typography sx={{ fontWeight: 550 }}>Loại hoạt động: </Typography>
											{activities[0]?.activityTypeComponents?.map((item, index) => (
												<Grid key={index} item>
													{item === 'Lao động tình nguyện' && (
														<Tooltip title='Lao động tình nguyện'>
															<Avatar
																alt='Remy Sharp'
																src='https://cdn-icons-png.flaticon.com/512/4994/4994354.png'
																sx={{ width: '27px', height: '27px' }}
															/>
														</Tooltip>
													)}
													{item === 'Hỗ trợ phát đồ' && (
														<Tooltip title='Hỗ trợ phát đồ'>
															<Avatar
																alt='Remy Sharp'
																sx={{ border: '1px solid', width: '27px', height: '27px' }}
																src='https://thumbs.dreamstime.com/b/vector-illustrations-red-heart-blue-color-hand-icon-isolated-white-background-red-heart-hand-icon-272457682.jpg'
															/>
														</Tooltip>
													)}
													{item === 'Quyên góp' && (
														<Tooltip title='Quyên góp'>
															<Avatar
																sx={{ width: '27px', height: '27px' }}
																alt='Remy Sharp'
																src='https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Heart_coraz%C3%B3n.svg/768px-Heart_coraz%C3%B3n.svg.png'
															/>
														</Tooltip>
													)}
												</Grid>
											))}
										</Grid>
									</Grid>
								</Box>
								<CardContent
									sx={{
										pb: 0
									}}
								>
									{/* <GenerateDescription
										value={activities[0]}
										HandleClickViewDetail={() => {
											router.push(`/hoat-dong/chi-tiet/${activities[0]?.id}`)
										}}
									/> */}
									<Typography sx={{ height: '50px', overflow: 'hidden' }}>
										{activities[0]?.description}
									</Typography>
									{activities[0]?.targetProcessResponses ? (
										<Box mt={5}>
											<Typography variant='body1' fontWeight={500}>
												Tiến độ
											</Typography>
											<Stack direction={'row'} alignItems={'center'} spacing={3}>
												<LinearProgress
													color='info'
													sx={{ height: '10px', borderRadius: '10px', width: '100%' }}
													variant='determinate'
													value={activities[0]?.totalTargetProcessPercentage}
												/>
												<Typography>{activities[0]?.totalTargetProcessPercentage}%</Typography>
											</Stack>
										</Box>
									) : null}
								</CardContent>
								<CardActions
									sx={{
										display: 'flex',
										flexDirection: 'row',
										justifyContent: 'flex-end',
										mt: 10
									}}
								>
									<Button
										color='secondary'
										sx={{
											fontWeight: '800'
										}}
										onClick={() => {
											router.push(`/hoat-dong/chi-tiet/${activities[0]?.id}`)
										}}
									>
										Chi tiết
									</Button>
									{session?.user.role === 'CONTRIBUTOR' && activities[0]?.status === 'STARTED' && (
										<Button
											variant='contained'
											color='primary'
											disabled={
												activities[0]?.targetProcessResponses &&
												activities[0]?.targetProcessResponses.length === 0
											}
											sx={{
												fontWeight: '800'
											}}
											onClick={() => {
												router.push(`/tao-yeu-cau-quyen-gop/?hoat_dong=${activities[0]?.id}`)
											}}
										>
											Quyên góp
										</Button>
									)}
								</CardActions>
							</Grid>
						</Grid>
					</Card>
				)}

				<Grid
					container
					columnSpacing={{ xs: 2, sm: 3, md: 5, lg: 5 }}
					justifyContent={'flex-start'}
				>
					{!loading ? (
						activities.length > 0 ? (
							activities.slice(1, activities.length).map((value, index) => {
								return (
									<Grid
										item
										xs={12}
										sm={6}
										md={3}
										lg={3}
										key={index}
										sx={{
											'&.MuiGrid-item': {
												paddingTop: '0px !important',
												paddingBottom: '1rem !important'
											}
										}}
									>
										<Card
											sx={{
												height: '100%',
												display: 'flex',
												justifyContent: 'space-between',
												flexDirection: 'column',
												'& .MuiCardHeader-root': {
													padding: '0px !important'
												}
											}}
										>
											<Box>
												<CardHeader
													title={
														<Box display={'flex'} flexDirection={'column'} gap={2}>
															<Carousel
																sx={{ margin: 'auto', border: 'none', width: '100%' }}
																indicatorContainerProps={{
																	style: {
																		zIndex: 1,
																		marginTop: '-24px',
																		position: 'relative'
																	}
																}}
															>
																{value.images?.map((image, index) => (
																	<Box
																		key={index}
																		sx={{
																			backgroundImage: `url(${image})`,
																			backgroundSize: 'cover',
																			height: '250px !important',
																			width: '100%'
																		}}
																	></Box>
																))}
															</Carousel>

															<Box p={3}>
																<Box display={'flex'} justifyContent={'center'} height={'50px'}>
																	<Typography
																		variant='body1'
																		sx={{ overflow: 'hidden' }}
																		fontSize={18}
																		align='center'
																		fontWeight={700}
																	>
																		{value.name}
																	</Typography>
																</Box>

																<Stack
																	direction={'row'}
																	flexWrap={'wrap'}
																	justifyContent={'flex-start'}
																	sx={{ ml: 2, mb: 1, mt: 1 }}
																>
																	<Typography variant='body2' fontWeight={600}>
																		{`Từ ${
																			value.startDate
																				? moment(value.startDate).format(KEY.FORMAT_DATE_d_m_y_H_M)
																				: moment(value.estimatedStartDate).format(
																						KEY.FORMAT_DATE_d_m_y_H_M
																				  )
																		} (dự kiến) `}
																	</Typography>
																	<Typography variant='body2' fontWeight={600}>
																		{`Đến ${
																			value.endDate
																				? moment(value.endDate).format(KEY.FORMAT_DATE_d_m_y_H_M)
																				: moment(value.estimatedEndDate).format(
																						KEY.FORMAT_DATE_d_m_y_H_M
																				  )
																		} (dự kiến) `}
																	</Typography>
																</Stack>
																<Grid
																	container
																	flexDirection={'row'}
																	justifyContent={'flex-start'}
																	alignItems={'start'}
																	sx={{ mt: 3 }}
																>
																	<Grid
																		item
																		container
																		display={'flex'}
																		flexDirection={'row'}
																		columnSpacing={2}
																		alignItems={'center'}
																		gap={1}
																		sx={{ ml: 2 }}
																	>
																		<Typography sx={{ fontWeight: 550 }}>Thể loại: </Typography>
																		{value.activityTypeComponents?.map((item, index) => (
																			<Grid key={index} item>
																				{item === 'Lao động tình nguyện' && (
																					<Tooltip title='Lao động tình nguyện'>
																						<Avatar
																							sx={{ width: '27px', height: '27px' }}
																							alt='Remy Sharp'
																							src='https://cdn-icons-png.flaticon.com/512/4994/4994354.png'
																						/>
																					</Tooltip>
																				)}
																				{item === 'Hỗ trợ phát đồ' && (
																					<Tooltip title='Hỗ trợ phát đồ'>
																						<Avatar
																							alt='Remy Sharp'
																							sx={{
																								border: '1px solid',
																								width: '27px',
																								height: '27px'
																							}}
																							src='https://thumbs.dreamstime.com/b/vector-illustrations-red-heart-blue-color-hand-icon-isolated-white-background-red-heart-hand-icon-272457682.jpg'
																						/>
																					</Tooltip>
																				)}
																				{item === 'Quyên góp' && (
																					<Tooltip title='Quyên góp'>
																						<Avatar
																							sx={{ width: '27px', height: '27px' }}
																							alt='Remy Sharp'
																							src='https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Heart_coraz%C3%B3n.svg/768px-Heart_coraz%C3%B3n.svg.png'
																						/>
																					</Tooltip>
																				)}
																			</Grid>
																		))}
																	</Grid>
																</Grid>
																{/* <Grid item>{StatusActivity[value.status ?? '_']()}</Grid> */}
															</Box>
														</Box>
													}
												></CardHeader>
												<CardContent
													sx={{
														pb: 0
													}}
												>
													<GenerateDescription
														value={value}
														HandleClickViewDetail={() => {
															router.push(`/hoat-dong/chi-tiet/${value.id}`)
														}}
													/>
													{value.targetProcessResponses ? (
														<Box mt={5}>
															<Typography variant='body1' fontWeight={500}>
																Tiến độ
															</Typography>

															<Stack direction={'row'} alignItems={'center'} spacing={3}>
																<LinearProgress
																	color='info'
																	sx={{ height: '10px', borderRadius: '10px', width: '100%' }}
																	variant='determinate'
																	value={value?.totalTargetProcessPercentage}
																/>
																<Typography>{value?.totalTargetProcessPercentage}%</Typography>
															</Stack>
														</Box>
													) : null}
												</CardContent>
											</Box>
											<CardActions
												sx={{
													display: 'flex',
													flexDirection: 'row',
													justifyContent: 'flex-end'
												}}
											>
												<Button
													size='small'
													color='secondary'
													sx={{
														fontWeight: '800'
													}}
													onClick={() => {
														router.push(`/hoat-dong/chi-tiet/${value.id}`)
													}}
												>
													Chi tiết
												</Button>
												{session?.user.role === 'CONTRIBUTOR' && value.status === 'STARTED' && (
													<Button
														variant='contained'
														color='primary'
														size='small'
														sx={{
															fontWeight: '800'
														}}
														disabled={
															value.targetProcessResponses &&
															value.targetProcessResponses.length === 0
														}
														onClick={() => {
															if (!value.activityTypeComponents?.find((x) => x === 'Quyên góp'))
																return
															router.push(`/tao-yeu-cau-quyen-gop/?hoat_dong=${value.id}`)
														}}
													>
														Quyên góp
													</Button>
												)}
											</CardActions>
										</Card>
									</Grid>
								)
							})
						) : (
							<Box display={'flex'} justifyContent={'center'} alignItems={'center'} width={'100%'}>
								<Box
									sx={{
										width: '100px'
									}}
								>
									<MagnifyMinusOutline
										sx={{
											fontSize: '100px'
										}}
									/>
								</Box>
								<Typography fontWeight={600} variant='h5'>
									Không tìm thấy dữ liệu!
								</Typography>
							</Box>
						)
					) : (
						[1, 2, 3, 4].map((item) => (
							<Grid
								item
								xs={12}
								sm={6}
								md={6}
								lg={3}
								key={item}
								sx={{
									'&.MuiGrid-item': {
										paddingTop: '0 !important'
									}
								}}
							>
								<Card
									sx={{
										height: '100%',
										display: 'flex',
										justifyContent: 'space-between',
										flexDirection: 'column'
									}}
								>
									<Box>
										<CardHeader
											title={
												<Box display={'flex'} flexDirection={'column'} gap={2}>
													<Box
														sx={{
															backgroundSize: 'cover',
															height: '150px !important'
														}}
													>
														<Skeleton
															animation='wave'
															variant='rectangular'
															width={'100%'}
															height={'100%'}
														/>
													</Box>
													<Typography variant='body1' fontWeight={700}>
														<Skeleton
															animation='wave'
															variant='rectangular'
															width={'100%'}
															height={'100%'}
														/>
													</Typography>
													<Grid
														container
														flexDirection={'row'}
														justifyContent={'flex-start'}
														width={'100%'}
													>
														<Grid item display={'flex'} gap={3}>
															<Skeleton
																animation='wave'
																variant='rectangular'
																width={'100px'}
																height={'100%'}
															/>
														</Grid>
														<Grid item>
															<Skeleton
																animation='wave'
																variant='rectangular'
																width={'100px'}
																height={'100%'}
															/>
														</Grid>
													</Grid>
													<Typography variant='caption'>
														<Skeleton
															animation='wave'
															variant='rectangular'
															width={'100px'}
															height={'100%'}
														/>
													</Typography>
												</Box>
											}
										></CardHeader>
										<CardContent
											sx={{
												pb: 0
											}}
										>
											<Typography
												maxHeight={146}
												textOverflow={'ellipsis'}
												overflow={'hidden'}
												whiteSpace={'break-spaces'}
											>
												<Skeleton
													animation='wave'
													variant='rectangular'
													width={'100%'}
													height={'100px'}
												/>
											</Typography>

											<Skeleton
												animation='wave'
												variant='rectangular'
												width={'100%'}
												height={'50'}
											/>
										</CardContent>
									</Box>
									<CardActions
										sx={{
											display: 'flex',
											flexDirection: 'row',
											justifyContent: 'flex-end',
											gap: '5'
										}}
									>
										<Skeleton
											animation='wave'
											variant='rectangular'
											width={'100px'}
											height={'30px'}
										/>
										<Skeleton
											animation='wave'
											variant='rectangular'
											width={'100px'}
											height={'30px'}
										/>
									</CardActions>
								</Card>
							</Grid>
						))
					)}
				</Grid>
			</Box>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					pt: 0
				}}
			>
				<Button
					size='small'
					variant='contained'
					color='info'
					onClick={() => {
						router.push('/hoat-dong')
					}}
					fullWidth
					sx={{
						pt: '7px',
						mt: 5

						//borderBottom: theme => `7px solid ${theme.palette.primary[theme.palette.mode]}`
					}}
				>
					Xem thêm
				</Button>
			</Box>
		</Box>
	)
}
