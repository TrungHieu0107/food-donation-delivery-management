import {
	Avatar,
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	CardHeader,
	Chip,
	Divider,
	Grid,
	LinearProgress,
	Pagination,
	Skeleton,
	Stack,
	Tooltip,
	Typography
} from '@mui/material'
import { ChangeEvent, ReactNode, useEffect, useState } from 'react'
import { KEY } from 'src/common/Keys'
import UserLayout from 'src/layouts/UserLayout'

// import LinearProgressWithLabel from 'src/layouts/components/loading/LinearProgressWithLabel'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'
import { MagnifyMinusOutline } from 'mdi-material-ui'
import moment from 'moment'
import { useRouter } from 'next/router'
import Carousel from 'react-material-ui-carousel'
import { ActivityAPI } from 'src/api-client/Activity'
import { AddressAPI } from 'src/api-client/Address'
import { BranchAPI } from 'src/api-client/Branch'
import ActivitySearchDrawer from 'src/layouts/components/views/activity/ActivitySearchDrawer'
import {
	ActivityResponseModel,
	ActivityType,
	BranchResponseModel,
	QueryActivityListModel
} from 'src/models/Activity'
import { BranchModel, QueryBranchModel } from 'src/models/Branch'
import { AddressModel, DistrictModel, ProvinceModel, WardModel } from 'src/models/common/Address'
import { CommonRepsonseModel, PaginationModel } from 'src/models/common/CommonResponseModel'
import { useSession } from 'next-auth/react'

export const GenerateDescription = ({
	value,
	HandleClickViewDetail
}: {
	value: ActivityResponseModel
	HandleClickViewDetail: () => void
}) => {
	const [showButton, setShowButton] = useState(false)

	const handleTypographyRef = (node: any) => {
		if (node) {
			// Kiểm tra chiều cao của Typography khi nó đã được hiển thị trong DOM
			if (node.clientHeight > 145) {
				setShowButton(true)
			} else {
				setShowButton(false)
			}
		}
	}

	return (
		<>
			<Typography
				ref={handleTypographyRef}
				sx={{ height: 100 }}
				textOverflow={'ellipsis'}
				overflow={'hidden'}
				whiteSpace={'break-spaces'}
			>
				{value.description}
			</Typography>

			{showButton && (
				<Button
					size='small'
					sx={{
						textTransform: 'none'
					}}
					onClick={() => {
						HandleClickViewDetail()
					}}
				>
					Xem thêm
				</Button>
			)}
		</>
	)
}

export const StatusActivity: any = {
	NOT_STARTED: () => {
		return (
			<Chip
				sx={{
					pt: 3,
					pb: 3
				}}
				size='small'
				label='Chưa bắt đầu'
				variant='outlined'
				color='default'
			/>
		)
	},
	STARTED: () => {
		return (
			<Chip
				sx={{
					pt: 3,
					pb: 3
				}}
				size='small'
				label='Đang tiến hành'
				variant='outlined'
				color='info'
			/>
		)
	},
	ENDED: () => {
		return (
			<Chip
				sx={{
					pt: 3,
					pb: 3
				}}
				size='small'
				label='Đã kết thúc'
				variant='outlined'
				color='success'
			/>
		)
	},
	INACTIVE: () => {
		return (
			<Chip
				sx={{
					pt: 3,
					pb: 3
				}}
				size='small'
				label='Đã xóa'
				variant='filled'
				color='error'
			/>
		)
	}
}

const ActivityListPage = () => {
	const [activities, setActivities] = useState<ActivityResponseModel[]>([])
	const [branches, setBranches] = useState<BranchResponseModel[]>([])
	const [activityTypes, setActivityTypes] = useState<ActivityType[]>([])
	const [queryActivityListModel, setQueryActivityListModel] = useState<QueryActivityListModel>(
		new QueryActivityListModel()
	)
	const [pagination, setPagination] = useState<PaginationModel>(new PaginationModel())
	const router = useRouter()
	const query = router.query
	const { data: session } = useSession()

	const [loading, setLoading] = useState(true)
	const [provinces, setProvinces] = useState<ProvinceModel[]>([])
	const [districts, setDistricts] = useState<DistrictModel[]>([])
	const [wards, setWards] = useState<WardModel[]>([])
	const [addressSearching, setAddressSearching] = useState<AddressModel>(new AddressModel())

	useEffect(() => {
		const fetchDataActivities = async () => {
			setLoading(true)
			const payload = new QueryActivityListModel(query)
			ActivityAPI.getAll(payload)
				.then((result) => {
					const newData = new CommonRepsonseModel<ActivityResponseModel[]>(result)
					setActivities(newData.data ?? ([] as ActivityResponseModel[]))
					setPagination(newData.pagination)
				})
				.catch((err) => {
					console.error(err)
				})
				.finally(() => {
					setLoading(false)
				})
		}

		fetchDataActivities()
	}, [router])

	useEffect(() => {
		const getAllProvince = async () => {
			setProvinces(await AddressAPI.getAllProvince())
		}
		getAllProvince()
		fetchDataBranch()
		fetchDataActivityTypes()
	}, [])

	const fetchDataBranch = async () => {
		BranchAPI.getBranches(new QueryBranchModel())
			.then((dataBranchesResponse) => {
				const dataBranches = new CommonRepsonseModel<BranchModel[]>(dataBranchesResponse)
				setBranches(dataBranches.data ?? [])
			})
			.catch((err) => {
				console.error(err)
			})
	}

	const fetchDataActivityTypes = () => {
		ActivityAPI.getAllType()
			.then((activityTypes) => {
				const data = new CommonRepsonseModel<ActivityType[]>(activityTypes)
				setActivityTypes(data.data ?? [])
			})
			.catch((err) => {
				console.error(err)
			})
	}

	const getDistrictOfProvince = async (province: ProvinceModel) => {
		province?.code && setDistricts(await AddressAPI.getDistrictOfProvince(province?.code))
	}

	const getWardsOfDistrict = async (district: DistrictModel) => {
		district?.code && setWards(await AddressAPI.getWardsOfDistrict(district?.code))
	}

	const handleChangeQuery = (query: QueryActivityListModel) => {
		setLoading(true)
		router
			.push({
				pathname: '/hoat-dong',
				query: { ...query }
			})
			.then(() => {
				setLoading(false)
			})
	}

	return (
		<Box
			sx={{
				width: '90vw',
				display: 'flex',
				flexDirection: 'column',
				m: 'auto'
			}}
		>
			<Typography variant='h5' fontWeight={600} sx={{ mt: 5, mb: 5, textAlign: 'center' }}>
				Danh sách các hoạt động thiện nguyện
			</Typography>
			{/* {activities.length > 0 ? (
        <> */}
			<Stack direction={'row'} spacing={1}>
				<Grid container flex={0.25}>
					<ActivitySearchDrawer
						queryActivityListModel={queryActivityListModel}
						setQueryActivityListModel={setQueryActivityListModel}
						handleChangeQuery={handleChangeQuery}
						activityTypes={activityTypes}
						provinces={provinces}
						districts={districts}
						wards={wards}
						addressSearching={addressSearching}
						setAddressSearching={setAddressSearching}
						getDistrictOfProvince={getDistrictOfProvince}
						getWardsOfDistrict={getWardsOfDistrict}
						branches={branches}
					/>
				</Grid>

				<Grid container flex={0.8} spacing={{ xs: 2, sm: 3, md: 4, lg: 4 }}>
					{!loading ? (
						activities.length > 0 ? (
							activities.map((value, index) => {
								return (
									<Grid
										item
										xs={12}
										sm={6}
										md={6}
										lg={4}
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
															<Box sx={{ position: 'relative' }}>
																{value?.isJoined && (
																	<Chip
																		icon={<CheckCircleOutlineOutlinedIcon />}
																		label='Đã tham gia'
																		color='info'
																		sx={{ position: 'absolute', top: 0, zIndex: 100 }}
																	/>
																)}
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
															</Box>
															<Box p={3}>
																<Box display={'flex'} justifyContent={'center'} height={'45px'}>
																	<Typography
																		variant='body1'
																		sx={{ overflow: 'hidden' }}
																		fontSize={16}
																		align='center'
																		fontWeight={600}
																	>
																		{value.name}
																	</Typography>
																</Box>

																<Stack
																	direction={'column'}
																	flexWrap={'wrap'}
																	sx={{ ml: 2, mb: 1, mt: 1 }}
																	spacing={2}
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
																		columnSpacing={3}
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
															<Typography variant='body1' fontWeight={600}>
																Tiến độ
															</Typography>

															<Grid container spacing={2} alignItems={'center'} sx={{pr: 3}}>
																<Grid item xs={11}>
																	<LinearProgress
																		color='info'
																		sx={{ height: '10px', borderRadius: '10px' }}
																		variant='determinate'
																		value={value.totalTargetProcessPercentage}
																	/>
																</Grid>

																<Grid item xs={1}>
																	<Typography
																		variant='body2'
																		color='text.secondary'
																	>{`${value.totalTargetProcessPercentage}%`}</Typography>
																</Grid>
															</Grid>
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
												{session?.user.role === "CONTRIBUTOR" && value.status === "STARTED" && (
								<Button
									variant='contained'
									size='small'
									disabled={(value.targetProcessResponses && value.targetProcessResponses.length === 0)}
									color='primary'
									onClick={() => {
										router.push('/tao-yeu-cau-quyen-gop?hoat_dong=' + value.id)
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
							<Box
								display={'flex'}
								justifyContent={'center'}
								alignItems={'center'}
								sx={{
									width: '100%'
								}}
							>
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
						[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
							<Grid
								item
								xs={12}
								sm={6}
								md={6}
								lg={4}
								key={item}
								sx={{
									'&.MuiGrid-item': {
										paddingTop: '0 !important',
										paddingBottom: '1rem !important'
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
														<Divider
															sx={{
																transform: 'rotate(90deg)',
																width: '20px !important',
																borderColor: '#adadad'
															}}
														/>
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
					<Grid item width={'100%'} display={'flex'} justifyContent={'center'} mt={5}>
						<Pagination
							count={Math.ceil(pagination.total / 9)}
							color='primary'
							onChange={(event: ChangeEvent<unknown>, page: number) => {
								const newQuery = new QueryActivityListModel({
									...queryActivityListModel,
									page: page
								})
								setQueryActivityListModel(newQuery)
								handleChangeQuery(newQuery)
							}}
						/>
					</Grid>
				</Grid>
			</Stack>
		</Box>
	)
}

ActivityListPage.getLayout = (page: ReactNode) => <UserLayout>{page}</UserLayout>

ActivityListPage.auth = {
	role: [KEY.ROLE.CONTRIBUTOR, KEY.ROLE.CHARITY, KEY.ROLE.GUEST]
}

export default ActivityListPage
