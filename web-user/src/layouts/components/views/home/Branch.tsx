import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	CardHeader,
	Grid,
	Skeleton,
	Typography,
	useMediaQuery
} from '@mui/material'
import { MagnifyMinusOutline } from 'mdi-material-ui'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { BranchResponseModel } from 'src/models/Activity'
import { CommonRepsonseModel } from 'src/models/common/CommonResponseModel'
import Carousel from 'react-material-ui-carousel'
import { BranchAPI } from 'src/api-client/Branch'
import { QueryBranchModel } from 'src/models/Branch'

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
							router.push(`chi-nhanh-he-thong/chi-tiet/${branch.id}`)
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

const GenerateBranches = ({
	branches,
	isLargerMd,
	isSmallerSm
}: {
	branches: BranchResponseModel[]
	isLargerMd: boolean
	isSmallerSm: boolean
}) => {
	if (isLargerMd) {
		const newArrayBranch: BranchResponseModel[][] = []
		for (let i = 0; i < branches.length; i += 4) {
			const group = branches.slice(i, i + 4)
			newArrayBranch.push(group)
		}
		console.log(newArrayBranch)

		return (
      
			// <Carousel
			//   sx={{ margin: 'auto', border: 'none', width: '100%' }}
			//   animation='slide'
			//   autoPlay={false}
			//   cycleNavigation

			//   // indicatorContainerProps={{
			//   //   style: {
			//   //     zIndex: 1,
			//   //     marginTop: '-32px',
			//   //     position: 'relative'
			//   //   }
			//   // }}
			// >
			<Box sx={{ margin: 'auto', border: 'none', width: '100%' }}>
				{newArrayBranch.map((value, i) => {
					return (
						<Grid
							container
							key={i}
							spacing={3}
							width={'100%'}
							flexDirection={'row'}

							// sx={{
							// 	minHeight: '400px'
							// }}
						>
							{value.map((item, index) => {
								return (
									<Grid key={index} item md={3} display={'flex'}>
										<BranchTag branch={item} />
									</Grid>
								)
							})}
						</Grid>
					)
				})}
				{/* </Carousel> */}
			</Box>
		)
	}

	if (isSmallerSm) {
		return (
			<Carousel
				sx={{ margin: 'auto', border: 'none', width: '100%', minHeight: '440px' }}
				animation='slide'
				autoPlay={false}
				cycleNavigation
			>
				{branches.map((value, index) => {
					return <BranchTag key={index} branch={value} />
				})}
			</Carousel>
		)
	}

	const newArrayBranch: BranchResponseModel[][] = []
	for (let i = 0; i < branches.length; i += 2) {
		const group = branches.slice(i, i + 2)
		newArrayBranch.push(group)
	}

	return (
		<Carousel
			sx={{ margin: 'auto', border: 'none', width: '100%' }}
			animation='slide'
			autoPlay={false}
			cycleNavigation
		>
			{newArrayBranch.map((value, i) => {
				return (
					<Grid container key={i} spacing={3} width={'100%'} flexDirection={'row'}>
						{value.map((item, index) => {
							return (
								<Grid
									key={index}
									item
									xs={6}
									sm={6}
									md={6}
									lg={6}
									xl={6}
									height={'100%'}
									sx={{
										minHeight: '450px',
										display: 'flex',
										flexDirection: 'row'
									}}
								>
									<BranchTag branch={item} />
								</Grid>
							)
						})}
					</Grid>
				)
			})}
		</Carousel>
	)
}

export default function Branch() {
	const [branches, setBranches] = useState<BranchResponseModel[]>([])
	const router = useRouter()

	const [loading, setLoading] = useState(true)

	const isLargerMd = useMediaQuery((theme) => (theme as any)?.breakpoints?.up('md'))
	const isSmallerSm = useMediaQuery((theme) => (theme as any)?.breakpoints?.down('sm'))

	useEffect(() => {
		fetchDataBranchesAPI()
	}, [])

	const fetchDataBranchesAPI = async () => {
		setLoading(true)
		BranchAPI.getBranches(new QueryBranchModel())
			.then((result) => {
				const newData = new CommonRepsonseModel<BranchResponseModel[]>(result)
				setBranches(newData.data ?? ([] as BranchResponseModel[]))
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
				Các chi nhánh của Từ Tâm
			</Typography>
			<Box sx={{ pt: (theme) => `${theme.spacing(3)} !important` }}>
				{!loading ? (
					branches.length > 0 ? (
						<GenerateBranches
							branches={branches}
							isLargerMd={isLargerMd}
							isSmallerSm={isSmallerSm}
						/>
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
						router.push('/chi-nhanh-he-thong')
					}}
					fullWidth
					sx={{
						mt: 7

						//pt: "7px"
						//borderBottom: theme => `7px solid ${theme.palette.primary[theme.palette.mode]}`
					}}
				>
					Xem tất cả
				</Button>
			</Box>
		</Box>
	)
}
