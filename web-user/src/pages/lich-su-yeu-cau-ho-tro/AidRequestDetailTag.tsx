import {
	Box,
	Card,
	CardContent,
	CardHeader,
	CardMedia,
	Chip,
	Grid,
	Skeleton,
	Typography
} from '@mui/material'
import { useRouter } from 'next/router'
import * as React from 'react'
import { AidRequestAPI } from '../../api-client/AidRequest'
import { AidRequestDetailModel, AidRequestListModel } from '../../models/AidRequest'
import { CommonRepsonseModel } from '../../models/common/CommonResponseModel'
import { customColor } from 'src/@core/theme/color'
import DisplayScheduledTime from 'src/layouts/scheduled-time/DisplayScheduledTime'
import { formateDateDDMMYYYYHHMM } from 'src/@core/layouts/utils'
import FinishDeliveryRequest from './FinishDeliveryRequest'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

const StatusChips: {
	[key: string]: React.ReactNode
} = {
	PENDING: <Chip label='Đang chờ xử lý' color='default' />,
	ACCEPTED: <Chip label='Đã chấp nhận' color='success' />,
	REJECTED: <Chip label='Bị từ chối' color='error' />,
	CANCELED: <Chip label='Đã hủy' color='secondary' />,
	EXPIRED: <Chip label='Hết hạn' color='warning' />,
	PROCESSING: <Chip label='Đang xử lý' color='primary' />,
	SELF_SHIPPING: <Chip label='Tự vận chuyển' style={{ backgroundColor: 'lightblue' }} />,
	REPORTED: <Chip label='Đã báo cáo' style={{ backgroundColor: 'pink' }} />,
	FINISHED: <Chip label='Đã hoàn thành' style={{ backgroundColor: 'lightgreen' }} />
}

export interface IAidRequestDetailTagProps {
	data: AidRequestListModel | undefined
}

export default function AidRequestDetailTag(props: IAidRequestDetailTagProps) {
	const { data = new AidRequestListModel({}) } = props
	const [dataDetail, setDataDetail] = React.useState<AidRequestDetailModel>()
	const [isLoading, setIsLoading] = React.useState<boolean>(false)
	const router = useRouter()

	React.useEffect(() => {
		const handleFetchDetail = async () => {
			try {
				setIsLoading(true)
				const response = await AidRequestAPI.getDetail(data.id || '')
				const commonResponseModel = new CommonRepsonseModel<AidRequestDetailModel>(response)
				setDataDetail(commonResponseModel.data)
			} catch (error) {
				console.log(error)
			} finally {
				setIsLoading(false)
			}
		}

		if (!data.id) {
			setDataDetail(undefined)

			return
		}

		handleFetchDetail()
	}, [data])

	if (dataDetail && !isLoading) {
		return (
			<Box display={'flex'} flexDirection={'column'} gap={2}>
				<Card>
					<CardContent>
						<Grid container justifyContent={'space-between'}>
							<Grid item display={'flex'} flexDirection={'column'}>
								{!isLoading ? (
									<Typography variant='body1' fontWeight={600}>
										{`Kêu gọi vào ngày ${formateDateDDMMYYYYHHMM(dataDetail.createdDate || '')}`}
									</Typography>
								) : (
									<Skeleton height={'30px'} />
								)}
								{dataDetail.acceptedDate && dataDetail.status !== 'PENDING' && (
									<Typography
										variant='caption'
										fontWeight={550}
									>{`Chấp nhận vào ${formateDateDDMMYYYYHHMM(
										dataDetail.acceptedDate
									)}`}</Typography>
								)}
							</Grid>
							<Grid item>
								{!isLoading ? (
									StatusChips[dataDetail.status || '']
								) : (
									<Skeleton height={'30px'} width={'100px'} />
								)}
							</Grid>
						</Grid>

						<Typography
							fontWeight={550}
							sx={{
								color: customColor.secondary,
								mt: 1
							}}
						>
							Ghi chú:
							<Typography component={'span'} ml={1}>
								{dataDetail?.note}
							</Typography>
						</Typography>
					</CardContent>
				</Card>

				<Card>
					<CardHeader
						title={
							<Typography
								fontWeight={550}
								sx={{
									color: customColor.secondary
								}}
							>
								Chi nhánh thực hiện 🏣
							</Typography>
						}
					/>
					<CardContent>
						{isLoading && (
							<Box display={'flex'} flexDirection={'row'} gap={2} alignItems={'center'}>
								<Box height={'150px'} width={'100px'}>
									<Skeleton height={'100%'} width={'100%'} />
								</Box>

								<Box display={'flex'} flexDirection={'column'}>
									<Skeleton height={'30px'} width={'200px'} />
									<Skeleton height={'30px'} width={'100px'} />
								</Box>
							</Box>
						)}
						{dataDetail.status === 'PENDING' && (
							<Typography>Đang đợi chấp nhận yêu cầu... 😍 </Typography>
						)}
						{dataDetail.status !== 'PENDING' && !!dataDetail.acceptedBranches
							? dataDetail.acceptedBranches?.map((item, index) => (
									<Grid container key={index} flexDirection={'column'}>
										<Grid item>
											<Box
												sx={{
													paddingLeft: '10px',
													display: 'flex',
													flexDirection: 'row',
													gap: 3,
													alignItems: 'stretch',

													mt: 3
												}}
											>
												<CardMedia
													component={'img'}
													src={item.image}
													alt={item.name}
													style={{
														height: 100,
														width: 100,
														borderRadius: '5px'
													}}
												/>
												<Box display={'flex'} flexDirection={'column'} height={'100%'}>
													<Typography
														fontWeight={550}
														className='name-charity'
														variant='h6'
														onClick={() => {
															router.push(`/chi-nhanh-he-thong/chi-tiet/${item.id}`)
														}}
														sx={{
															':hover': {
																textDecoration: 'underline',
																cursor: 'pointer'
															}
														}}
													>
														{item.name}
													</Typography>
													<Box display={'flex'} flexDirection={'row'} gap={2}>
														<Typography fontWeight={550} variant='body2'>
															Địa chỉ :
														</Typography>
														<Typography variant='body2'>{item.address}</Typography>
													</Box>
													{/* <Box display={'flex'} flexDirection={'row'} gap={2}>
														<Typography fontWeight={550} variant='body2'>
															Số điện thoại :
														</Typography>
														<Typography variant='body2'>{item.address}</Typography>
													</Box> */}
													<Box display={'flex'} flexDirection={'row'} gap={2}>
														<Typography fontWeight={550} variant='body2'>
															Email :
														</Typography>
														<Typography variant='body2'>{item.name}</Typography>
													</Box>
												</Box>
											</Box>
										</Grid>
									</Grid>
							  ))
							: null}
					</CardContent>
				</Card>

				<Card>
					<CardHeader
						title={
							<Typography
								fontWeight={600}
								align='left'
								sx={{
									color: customColor.secondary
								}}
							>
								Danh sách vật phẩm cần hỗ trợ 🍎
							</Typography>
						}
					/>
					<CardContent>
						<Box display={'flex'} flexDirection={'row'} flexWrap={'wrap'} alignItems={'stretch'}>
							{dataDetail?.aidItemResponses?.map((item, index) => {
								return (
									<Box
										key={index}
										sx={{
											width: '475px',
											padding: '5px',
											height: '100%'
										}}
									>
										<Card
											sx={{
												display: 'flex',
												flexDirection: 'row',
												gap: 1,
												padding: '5px',
												backgroundColor: customColor.itemTagColor,
												height: '100%'
											}}
										>
											<Box width={'100px'} height={'100px'}>
												<CardMedia
													component={'img'}
													alt={item.itemResponse?.name}
													image={item.itemResponse?.image}
													sx={{
														borderRadius: '5px'
													}}
												/>
											</Box>

											<Box>
												<Typography fontWeight={550}>{item.itemResponse?.name}</Typography>
												{item?.itemResponse?.attributeValues && (
													<Box display={'flex'} gap={1} alignItems={'bottom'}>
														<Typography>Thuộc tính:</Typography>
														{item?.itemResponse?.attributeValues.length === 0 && (
															<Typography variant='body2'>Không có</Typography>
														)}
														{item?.itemResponse?.attributeValues?.map((i, index) => (
															<Chip label={i} key={index} color='secondary' sx={{ ml: 2 }} />
														))}
													</Box>
												)}
												<Typography>
													Cần hỗ trợ: {item?.quantity}{' '}
													<Typography component={'span'}>({item?.itemResponse?.unit})</Typography>
												</Typography>
												<Typography>
													Số lượng đã nhận: {item?.exportedQuantity}{' '}
													<Typography component={'span'}>({item?.itemResponse?.unit})</Typography>
												</Typography>
											</Box>
										</Card>
									</Box>
								)
							})}
						</Box>
					</CardContent>
				</Card>
				{dataDetail && (
					<Card>
						<CardHeader
							title={
								<Typography
									fontWeight={600}
									align='left'
									sx={{
										color: customColor.secondary
									}}
								>
									Lịch sử nhận hỗ trợ
								</Typography>
							}
						/>
						<CardContent>
							<FinishDeliveryRequest
								isSelfShipping={dataDetail?.isSelfShipping || false}
								currentId={dataDetail.id || ''}
							/>
						</CardContent>
					</Card>
				)}
				<Card>
					<CardHeader
						title={
							<Typography
								fontWeight={600}
								align='left'
								sx={{
									color: customColor.secondary
								}}
							>
								Thời gian nhận
							</Typography>
						}
					/>
					<CardContent>
						<DisplayScheduledTime data={dataDetail.scheduledTimes || []} />
					</CardContent>
				</Card>

				{dataDetail?.rejectingBranchResponses && (
					<Card>
						<CardHeader
							title={
								<Typography
									fontWeight={600}
									align='left'
									sx={{
										color: customColor.secondary
									}}
								>
									Lí do từ chối
								</Typography>
							}
						/>
						<CardContent>
							<Box display={'flex'} flexDirection={'column'} gap={2}>
								{dataDetail?.rejectingBranchResponses?.map((b) => (
									<Grid container spacing={3} key={b.id}>
										<Grid item>
											<Box
												sx={{
													width: '75px',
													height: '75px',
													display: 'flex',
													alignItems: 'center'
												}}
											>
												<Card>
													<CardMedia component={'img'} image={b.image} />
												</Card>
											</Box>
										</Grid>
										<Grid item xs={12} sm={12} md={9}>
											<Typography fontWeight={550} sx={{ pt: 2 }}>
												{b.name} -
												{b.createdDate && (
													<Typography ml={1} component={'span'} fontWeight={600} variant='caption'>
														{formateDateDDMMYYYYHHMM(b.createdDate)}
													</Typography>
												)}
											</Typography>

											<Typography
												sx={{
													whiteSpace: 'pre-line'
												}}
											>
												<span style={{ fontWeight: 600 }}>Lí do từ chối</span>: {b.rejectingReason}
											</Typography>
										</Grid>
									</Grid>
								))}
							</Box>
						</CardContent>
					</Card>
				)}
			</Box>
		)
	} 

	if(isLoading) {
		return (
			<Box
				display={'flex'}
				height={'100%'}
				flexDirection={'column'}
				gap={5}
				sx={{
					borderRadius: '10px',
					alignItems: 'center'
				}}
			>
				<Skeleton
					variant='rectangular'
					width={'100%'}
					height={75}
					sx={{
						borderRadius: '8px'
					}}
				/>
				<Skeleton
					variant='rectangular'
					width={'100%'}
					height={150}
					sx={{
						borderRadius: '8px'
					}}
				/>
				<Skeleton
					variant='rectangular'
					width={'100%'}
					height={150}
					sx={{
						borderRadius: '8px'
					}}
				/>
				<Skeleton
					variant='rectangular'
					width={'100%'}
					height={75}
					sx={{
						borderRadius: '8px'
					}}
				/>
			</Box>
		)
	}

	return (
		<Box
			display={'flex'}
			height={'100%'}
			sx={{
				backgroundColor: hexToRGBA(customColor.primary, 0.1),
				borderRadius: '10px',
				alignItems: 'center',
				justifyContent: 'center'
			}}
		>
			<Typography textAlign={'center'} fontWeight={700} variant='h6'>
				🔍 Chọn 1 lịch sử để hiện chi tiết
			</Typography>
		</Box>
	)
}
