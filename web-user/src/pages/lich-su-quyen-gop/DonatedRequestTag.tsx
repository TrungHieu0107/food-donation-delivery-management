import {
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	CardMedia,
	Chip,
	Collapse,
	Grid,
	Typography
} from '@mui/material'
import moment from 'moment'
import * as React from 'react'
import { DonatedRequestAPI } from '../../api-client/DonatedRequest'
import { KEY } from '../../common/Keys'
import { DonatedRequestDetailModel, DonatedRequestModel } from '../../models/DonatedRequest'
import { CommonRepsonseModel } from '../../models/common/CommonResponseModel'
import { useRouter } from 'next/router'

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

export interface IDonatedRequestTagProps {
	data: DonatedRequestModel
}

export default function DonatedRequestTag(props: IDonatedRequestTagProps) {
	const { data = new DonatedRequestModel({}) } = props
	const [dataDetail, setDataDetail] = React.useState<DonatedRequestDetailModel>()
	const [isLoading, setIsLoading] = React.useState<boolean>(false)
	const [isViewDetail, setIsViewDetail] = React.useState<boolean>(false)
    const router = useRouter()
	const handleFetchDetail = async () => {
		try {
			setIsLoading(true)
			const response = await DonatedRequestAPI.getDetailDonatedRequest(data.id || '')
			const commonResponseModel = new CommonRepsonseModel<DonatedRequestDetailModel>(response)
			setDataDetail(commonResponseModel.data)
			setIsViewDetail(true)
		} catch (error) {
			console.log(error)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Card>
			<CardHeader
				title={
					<Grid container justifyContent={'space-between'}>
						<Grid item display={'flex'} flexDirection={'column'}>
							<Typography variant='body1' fontWeight={600}>
								{`Ngày tạo: ${moment(data.createdDate).format(KEY.FORMAT_DATE_Y_M_D_H_M)}`}
							</Typography>
							{data.acceptedDate && data.status !== 'PENDING' && (
								<Typography variant='caption' fontWeight={550}>{`Chấp nhận vào lúc ${moment(
									data.acceptedDate
								).format(KEY.FORMAT_DATE_Y_M_D_H_M)}`}</Typography>
							)}
						</Grid>
						<Grid item>{StatusChips[data.status || '']}</Grid>
					</Grid>
				}
				sx={{
					borderBottom: '1px solid',
					borderColor: (theme) => theme.palette.divider
				}}
			/>
			<CardContent
				sx={{
					display: 'flex',
					flexDirection: 'column',
					'&.MuiCardContent-root': {
						paddingTop: '10px'
					}
				}}
			>
				{data.status === 'PENDING' && <Typography>Đang đợi chấp nhận yêu cầu...</Typography>}
				{data.status !== 'PENDING' && !!data.simpleBranchResponse && (
					<Grid container>
						<Grid item xs={12}>
							<Typography fontWeight={550} sx={{pl: 3}}>Chi nhánh nhận</Typography>
						</Grid>
						<Grid item xs={12} sm={6}>
							<Box
								sx={{
									paddingLeft: '10px',
									display: 'flex',
									flexDirection: 'row',
									gap: 3,
									alignItems: 'center',
									':hover': {
										textDecoration: 'underline',
										cursor: 'pointer'
									},
									width: 'fit-content',
									mt: 3
								}}
								onClick={() => {
									router.push(`/chi-nhanh-he-thong/chi-tiet/${data?.simpleBranchResponse?.id}`)
								}}
							>
								<img
									src={data?.simpleBranchResponse?.image}
									alt={data?.simpleBranchResponse?.name}
									style={{										
										height: 100,
										width: 100
									}}
								/>
								<Typography fontWeight={550}>{data?.simpleBranchResponse?.name}</Typography>
							</Box>
						</Grid>
						{data?.simpleActivityResponse && <Grid item xs={12} sm={6}>
							<Typography sx={{pl: 3}}>Đã đóng góp cho hoạt động thiện nguyện</Typography>
							<Typography fontWeight={550} sx={{pl: 3, mt: 3, ':hover': {
										textDecoration: 'underline',
										cursor: 'pointer'
									}}}
									onClick={() => {
										router.push(`/hoat-dong/chi-tiet/${data?.simpleActivityResponse?.id}`)
									}}	
									>{data?.simpleActivityResponse?.name}
							</Typography>
						</Grid> }
					</Grid>
				)}
				<Collapse in={isViewDetail && !!dataDetail} timeout='auto' unmountOnExit>
					<Grid container sx={{mt: 5}}>
						<Grid item xs={12} md={7}>
						
								<Typography fontWeight={600} mt={5} mb={7} align='center'>
									Danh sách vật phẩm quyên góp
								</Typography>
								<Grid container gap={7} sx={{mb: 7}}>
									{dataDetail?.donatedItemResponses?.map((item) => {
										return (
											<Grid container key={item.id} spacing={3}>
												<Grid item md={4}>
													<CardMedia
														component={'img'}
														alt={item.itemTemplateResponse?.name}
														image={item.itemTemplateResponse?.image}
														sx={{
															height: "100%",
															width: "100%"
														}}
													/>
												</Grid>
												<Grid item md={8}>
													<Typography
														fontWeight={550}
														sx={{mb: 3}}
													>
														{item.itemTemplateResponse?.name}
													</Typography>
													{item?.itemTemplateResponse?.attributeValues && (
														<Box sx={{mb: 2}}>
															Thuộc tính:
															{item?.itemTemplateResponse?.attributeValues?.map((i, index) => (
																<Chip label={i} key={index} color='secondary' sx={{ ml: 2 }} />
															))}
														</Box>
													)}
													<Typography
														sx={{mb: 2}}
													>
														Số lượng quyên góp: {item?.quantity} {item?.itemTemplateResponse?.unit}
													</Typography>
													<Typography
														
													>
														Số lượng đã nhận được ở chi nhánh: {item?.importedQuantity} {item?.itemTemplateResponse?.unit}
													</Typography>
												</Grid>
											</Grid>
										)
									})}
								</Grid>
							
						</Grid>
						{/* <Grid item md={1} padding={5}>
							<Divider orientation='vertical' />
						</Grid> */}
						<Grid item  md={5} xs={12} sx={{borderLeft: {md:"1px solid"}} }>
						 
							<Box display={'flex'} flexDirection={'column'} gap={2} sx={{pl: 3}}>
								<Typography fontWeight={600} mt={5} mb={5} align='center'>
									Thời gian nhận
								</Typography>
								<Grid container gap={2} justifyContent={"center"}>
									{dataDetail?.scheduledTimes?.map((item) => {
										return (
											<Grid key={item.day} item>
												<Chip label={`${item.startTime}-${item.endTime} ${item.day} `}></Chip>
											</Grid>
										)
									})}
								</Grid>
							</Box>
						</Grid>
					</Grid>
					{dataDetail?.rejectingBranchResponses && <Typography align='center'  fontWeight={650} sx={{mt: 5, mb: 5}}>Các chi nhánh từ chối</Typography>}
					{dataDetail?.rejectingBranchResponses?.map((b)=>(	
					<Grid container spacing={3} key={b.id}>					
					<Grid item xs={12} sm={12} md={3} >
					 <Box><img src={b.image} alt={b.name} width={"100%"}/></Box>					
					 </Grid>
					 <Grid item xs={12} sm={12} md={9} >				
					 <Typography fontWeight={550} sx={{pt: 2}}>{b.name}</Typography>
					 <Typography sx={{mt: 3}}>Địa chỉ: {b.address}</Typography>
					 <Typography sx={{mt: 3}}><span style={{fontWeight:600}}>Lí do từ chối</span>: {b.rejectingReason}</Typography>
					 {b.createdDate &&  (
								<Typography sx={{mt: 3}}>{`Thời gian từ chối: ${moment(
									b.createdDate
								).format(KEY.FORMAT_DATE_Y_M_D_H_M)}`}</Typography>
							)}
					 </Grid>
					 </Grid>
					))}                     
					
				</Collapse>
				<Box width={'100%'} sx={{mt: 7}} display={'flex'} justifyContent={'center'}>
					<Button
						size='small'
						variant='text'
						sx={{
							textTransform: 'none'
						}}
						onClick={() => {
							isViewDetail ? setIsViewDetail(false) : handleFetchDetail()
						}}
						disabled={isLoading}
					>
						{isViewDetail ? 'Thu gọn' : 'Xem chi tiết'}
					</Button>
				</Box>
			</CardContent>
		</Card>
	)
}
