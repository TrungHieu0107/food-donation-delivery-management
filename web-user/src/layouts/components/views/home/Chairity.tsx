import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	CardHeader,
	Grid,
	Skeleton,
	Typography
} from '@mui/material'
import { MagnifyMinusOutline } from 'mdi-material-ui'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import axiosClient from 'src/api-client/ApiClient'
import { BranchResponseModel } from 'src/models/Activity'

export const BranchTag = ({ branch }: { branch: BranchResponseModel }) => {
	const router = useRouter()

	return (
		<Card
			sx={{
				width: '100%',
				display: 'flex',
				justifyContent: 'space-between',
				flexDirection: 'column',
				'& .MuiCardHeader-root': {
					padding: '0px !important'
				}
			}}
		>
			<div>
				<CardHeader
					title={
						<Box display={'flex'} flexDirection={'column'}>
							<Box
								sx={{
									backgroundImage: `url(${branch.image})`,
									backgroundSize: 'cover',
									height: '200px !important',
									width: '100%'
								}}
							></Box>

							<Box p={3}>
								<Box display={'flex'} justifyContent={'center'} height={'60px'} overflow={'hidden'}>
									<Typography variant='body1' fontSize={20} fontWeight={700} align='center'>
										{branch.name}
									</Typography>
								</Box>
							</Box>
						</Box>
					}
				></CardHeader>
				<CardContent>
					<Typography sx={{ height: '100px' }}>
						<span style={{ fontWeight: 550 }}>Địa chỉ</span>: {branch.address}
					</Typography>
					{/* <Typography sx={{height:"100px"}} variant='body1'>{branch.address}</Typography> */}
				</CardContent>
				<CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
					<Button
						variant='contained'
						size='small'
						fullWidth
						onClick={() => {
							router.push(`chi-nhanh/chi-tiet/${branch.id}`)
						}}
					>
						Chi tiết
					</Button>
				</CardActions>
			</div>
			<div></div>
		</Card>
	)
}

const GenerateCharity = ({ branches }: any) => {
	const router = useRouter()

	return (
		<Box sx={{ margin: 'auto', border: 'none', width: '100%' }}>		
					<Grid container spacing={3} width={'100%'} flexDirection={'row'}>
						{branches?.map((item: any, index: any) => {
							return (
								<Grid key={index} item xs={12} sm={6} md={3} lg={3} display={'flex'}>
									<Card
										sx={{
                                            minWidth:200,
											width: '100%',
											display: 'flex',
											justifyContent: 'space-between',
											flexDirection: 'column',
											'& .MuiCardHeader-root': {
												padding: '0px !important'
											}
										}}
									>
										<div>
											<CardHeader
												title={
													<Box display={'flex'} flexDirection={'column'}>
														<Box
															sx={{
																backgroundImage: `url(${item?.logo})`,
																backgroundSize: 'cover',
																height: '200px !important',
																width: '100%'
															}}
														></Box>

														<Box p={3}>
															<Box
																display={'flex'}
																justifyContent={'center'}
																height={'60px'}
																overflow={'hidden'}
															>
																<Typography
																	variant='body1'
																	fontSize={20}
																	fontWeight={700}
																	align='center'
																>
																	{item?.name}
																</Typography>
															</Box>
														</Box>
													</Box>
												}
											></CardHeader>
											<CardContent>
												<Typography sx={{ height: '100px', overflow:"hidden" }}>
													<span style={{ fontWeight: 550 }}>Mô tả</span>: {item?.description}
												</Typography>						
											</CardContent>
											<CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
												<Button
													variant='contained'
													size='small'
													fullWidth
													onClick={() => {
														router.push(`to-chuc-tu-thien/chi-tiet/${item?.id}`)
													}}
												>
													Chi tiết
												</Button>
											</CardActions>
										</div>
										<div></div>
									</Card>
								</Grid>
							)
						})}
					</Grid>
			
			
			{/* </Carousel> */}
		</Box>
	)
}

export default function Chairity() {
	const [branches, setBranches] = useState<any>([])
	const router = useRouter()
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true)
			try {
				const apiUrl = `/charities?page=1&pageSize=4&charityStatus=1`
				const response: any = await axiosClient.get(apiUrl)
				console.log(response.data)
				setBranches(response.data)
			} catch (error) {
				console.log(error)
			} finally {
				setLoading(false)
			}
		}
		fetchData()
	}, [])

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
				Các tổ chức từ thiện tham gia
			</Typography>
			<Box sx={{ pt: (theme) => `${theme.spacing(3)} !important` }}>
				{!loading ? (
					branches.length > 0 ? (
						<GenerateCharity branches={branches} />
					) : (
						<Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
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
					<Grid container spacing={3}>
						{[1, 2, 3, 4].map((item) => (
							<Grid
								item
								xs={12}
								sm={6}
								md={3}
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
													height={'50px'}
												/>
											</Typography>
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
						))}
					</Grid>
				)}
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
					color='info'
					variant='contained'
					onClick={() => {
						router.push('/to-chuc-tu-thien/danh-sach')
					}}
					fullWidth
					sx={{
						mt: 7
					}}
				>
					Xem tất cả
				</Button>
			</Box>
		</Box>
	)
}
