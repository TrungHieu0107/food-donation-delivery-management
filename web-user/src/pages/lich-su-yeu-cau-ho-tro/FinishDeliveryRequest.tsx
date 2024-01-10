import {
	Accordion,
	AccordionSummary,
	Typography,
	AccordionDetails,
	Box,
	CircularProgress,
	CardMedia,
	Card,
	Skeleton,
	Divider,
	Avatar,
	Pagination
} from '@mui/material'
import { useEffect, useState } from 'react'
import { AidRequestAPI } from 'src/api-client'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
	CommonRepsonseModel,
	HistoryDetailRecieveAidRequestModel,
	HistoryRecieveAidRequestModel,
	PaginationModel
} from 'src/models'
import { formateDateDDMMYYYY, formateDateDDMMYYYYHHMM } from 'src/@core/layouts/utils'
import { customColor } from 'src/@core/theme/color'
import { StockAPI } from 'src/api-client/Stock'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import ReportDialog from 'src/layouts/components/views/report/ReportDialog'
import {
	HistoryDeliveryRequestDetailModel,
	HistoryDeliveryRequestModel
} from 'src/models/DeliveryRequest'
import { DeleiveryRequestAPI } from 'src/api-client/DeliveryRequest'

export interface IFinishDeliveryRequestProps {
	currentId: string
	isSelfShipping: boolean
}

export default function FinishDeliveryRequest(props: IFinishDeliveryRequestProps) {
	const { currentId, isSelfShipping } = props

	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [historySelfShipping, setHistorySelfShipping] = useState<HistoryRecieveAidRequestModel[]>(
		[]
	)
	const [historyDeliveryRequest, setHistoryDeliveryRequest] = useState<
		HistoryDeliveryRequestModel[]
	>([])
	const [historyDeliveryDetial, setHistoryDeliveryDetail] =
		useState<HistoryDeliveryRequestDetailModel>(new HistoryDeliveryRequestDetailModel({}))
	const [dataDetail, setDataDetail] = useState<HistoryDetailRecieveAidRequestModel>(
		new HistoryDetailRecieveAidRequestModel({})
	)
	const [expanded, setExpanded] = useState<string>('')

	const [isFetching, setIsFetching] = useState<boolean>(false)
	const [pagination, setPagination] = useState<PaginationModel>(
		new PaginationModel({
			currentPage: 1
		})
	)
	const [page, setPage] = useState<number>(0)

	useEffect(() => {
		setPage(1)
		setHistoryDeliveryDetail(new HistoryDeliveryRequestDetailModel({}))
		setDataDetail(new HistoryDetailRecieveAidRequestModel({}))
		setHistoryDeliveryRequest([])
		setExpanded('')

		return () => {
			setPage(0)
		}
	}, [currentId, isSelfShipping])

	useEffect(() => {
		if (currentId && page !== 0) {
			const fetchDataDetailSelfShipping = async () => {
				try {
					setIsLoading(true)
					const response = await AidRequestAPI.getFinishDeliveryRequest(currentId, page)
					setPagination(new CommonRepsonseModel<any>(response).pagination)
					if (isSelfShipping) {
						setHistorySelfShipping(
							new CommonRepsonseModel<HistoryRecieveAidRequestModel[]>(response).data || []
						)
					} else {
						setHistoryDeliveryRequest(
							new CommonRepsonseModel<HistoryDeliveryRequestModel[]>(response).data || []
						)
					}
				} catch (error) {
					console.log(error)
				} finally {
					setIsLoading(false)
				}
			}
			const fetchData = async () => {
				await fetchDataDetailSelfShipping()
			}

			fetchData()
		}
	}, [page, currentId])

	const handleChange = async (id: string, isSelfShippingFlag: boolean) => {

		if (expanded === id) {
			return
		}

		if (dataDetail.id === id) {
			setExpanded(id)

			return
		}
		if (isFetching) return

		setExpanded(id)
		try {
			setIsFetching(true)
			if (isSelfShippingFlag) {
				const response = await StockAPI.getStockUpdateHistoryById(id)

				setDataDetail(
					new CommonRepsonseModel<HistoryDetailRecieveAidRequestModel>(response).data ||
						new HistoryDetailRecieveAidRequestModel({})
				)
			} else {
				const response = await DeleiveryRequestAPI.getDetialOfDeliveryRequest(id)
				setHistoryDeliveryDetail(
					new CommonRepsonseModel<HistoryDeliveryRequestDetailModel>(response).data ||
						new HistoryDeliveryRequestDetailModel({})
				)
			}
		} catch (error) {
			console.log(error)
		} finally {
			setIsFetching(false)
		}
	}

	return (
		<div>
			{!isLoading ? (
				isSelfShipping ? (
					historySelfShipping.map((history, index) => {
						return (
							<Accordion
								key={index}
								expanded={expanded === history.id && !isFetching}
								onClick={() => handleChange(history.id, !history.finishedDate)}
							>
								<AccordionSummary
									expandIcon={
										isFetching ? (
											expanded === history.id ? (
												<CircularProgress />
											) : (
												<ExpandMoreIcon />
											)
										) : (
											<ExpandMoreIcon />
										)
									}
									aria-controls='panel1a-content'
									id='panel1a-header'
									sx={{
										...(expanded === history.id && {
											borderBottom: '1px solid',
											borderColor: (theme) => theme.palette.divider,
											backgroundColor: hexToRGBA(customColor.primary, 0.5)
										})
									}}
								>
									<Box
										sx={{
											display: 'flex',
											flexDirection: 'column',
											alignItems: 'start'
										}}
									>
										<Typography fontWeight={500}>{`Nhận ${formateDateDDMMYYYYHHMM(
											!!history.finishedDate ? history.finishedDate : history.exportedDate
										)}`}</Typography>
										<Typography
											fontWeight={600}
											sx={{
												color: customColor.secondary
											}}
										>
											Ghi chú :
											<Typography component={'span'} ml={1}>
												{history.exportNote}
											</Typography>
										</Typography>
									</Box>
								</AccordionSummary>
								<AccordionDetails
									sx={{
										backgroundColor: hexToRGBA(customColor.secondary, 0.1)
									}}
								>
									<Typography
										fontWeight={600}
										sx={{
											color: customColor.secondary,
											padding: '10px'
										}}
									>
										Vật phẩm nhận
									</Typography>
									<Box display={'flex'} gap={2} flexWrap={'wrap'} alignContent={'stretch'}>
										{dataDetail.exportedItems.map((item, index) => {
											return (
												<Card
													key={index}
													sx={{
														height: '100%',
														padding: '5px',
														backgroundColor: customColor.itemTagColor,
														width: '45%'
													}}
												>
													<Box key={index} display={'flex'} gap={1}>
														<Box
															sx={{
																width: '100px',
																height: '100px'
															}}
														>
															<CardMedia
																component={'img'}
																src={item.image}
																sx={{
																	borderRadius: '5px'
																}}
															/>
														</Box>
														<Box display={'flex'} gap={1} flexDirection={'column'}>
															<Typography fontWeight={550}>{item.name}</Typography>
															<Typography fontWeight={550}>
																Hạn sử dụng:
																<Typography component={'span'}>
																	{formateDateDDMMYYYY(item.confirmedExpirationDate)}
																</Typography>
															</Typography>
															<Typography fontWeight={550}>
																Số lượng:
																<Typography component={'span'}>
																	{item.exportedQuantity}({item.unit})
																</Typography>
															</Typography>
														</Box>
													</Box>
												</Card>
											)
										})}
									</Box>
									<Box display={'flex'} justifyContent={'center'} paddingTop={3}>
										<ReportDialog id={history.id} />
									</Box>
								</AccordionDetails>
							</Accordion>
						)
					})
				) : (
					historyDeliveryRequest.map((history, index) => {
						return (
							<Accordion
								key={index}
								expanded={expanded === history.id && !isFetching}
								onClick={() => handleChange(history.id, !history.finishedDate)}
							>
								<AccordionSummary
									expandIcon={
										isFetching ? (
											expanded === history.id ? (
												<CircularProgress />
											) : (
												<ExpandMoreIcon />
											)
										) : (
											<ExpandMoreIcon />
										)
									}
									aria-controls='panel1a-content'
									id='panel1a-header'
									sx={{
										...(expanded === history.id && {
											borderBottom: '1px solid',
											borderColor: (theme) => theme.palette.divider,
											backgroundColor: customColor.primary,
											'& .text-white': {
												color: 'white'
											}
										})
									}}
								>
									<Box
										sx={{
											display: 'flex',
											flexDirection: 'column',
											alignItems: 'start'
										}}
									>
										<Typography
											className='text-white'
											fontWeight={500}
										>{`Nhận ${formateDateDDMMYYYYHHMM(
											!!history.finishedDate ? history.finishedDate : history.exportedDate
										)}`}</Typography>
										<Typography
											className='text-white'
											fontWeight={600}
											sx={{
												color: customColor.secondary
											}}
										>
											Ghi chú :
											<Typography component={'span'} ml={1} className='text-white'>
												{history.exportNote}
											</Typography>
										</Typography>
									</Box>
								</AccordionSummary>
								<AccordionDetails
									sx={{
										backgroundColor: hexToRGBA(customColor.secondary, 0.1)
									}}
								>
									{!!history.finishedDate && (
										<Box
											sx={{
												display: 'flex',
												flexDirection: 'column',
												width: '100%'
											}}
										>
											<Typography
												fontWeight={550}
												sx={{
													color: customColor.secondary
												}}
											>
												Người vận chuyển
											</Typography>
											<Box display={'flex'} flexDirection={'row'} gap={2}>
												<Avatar
													src={history.avatar}
													alt={history.name}
													sx={{
														width: '75px',
														height: '75px'
													}}
												/>
												<Box display={'flex'} flexDirection={'column'}>
													<Typography fontWeight={500}>{history.name}</Typography>
													<Typography>{history.phone}</Typography>
												</Box>
											</Box>
										</Box>
									)}
									{!!history.finishedDate && (
										<Box>
											<Divider />
											<Typography
												fontWeight={600}
												sx={{
													color: customColor.secondary,
													mt: 2
												}}
											>
												Hình ảnh xác thực
											</Typography>
											<Box
												sx={{
													height: '150px'
												}}
											>
												<CardMedia
													component={'img'}
													src={history.proofImage}
													sx={{
														maxHeight: '150px',
														width: 'auto'
													}}
												/>
											</Box>
										</Box>
									)}
									<Typography
										fontWeight={600}
										sx={{
											color: customColor.secondary,
											mt: 2
										}}
									>
										Vật phẩm nhận
									</Typography>
									{!history.finishedDate && (
										<Typography
											fontWeight={500}
											sx={{
												color: customColor.primary,
												mt: 2
											}}
										>
											Nhận trước tiếp tại chi nhánh
										</Typography>
									)}
									{!history.finishedDate && (
										<Box display={'flex'} gap={2} flexWrap={'wrap'} alignContent={'stretch'}>
											{dataDetail.exportedItems.map((item, index) => {
												return (
													<Card
														key={index}
														sx={{
															height: '100%',
															padding: '5px',
															backgroundColor: customColor.itemTagColor,
															width: '45%'
														}}
													>
														<Box key={index} display={'flex'} gap={1}>
															<Box
																sx={{
																	width: '100px',
																	height: '100px'
																}}
															>
																<CardMedia
																	component={'img'}
																	src={item.image}
																	sx={{
																		borderRadius: '5px'
																	}}
																/>
															</Box>
															<Box display={'flex'} gap={1} flexDirection={'column'}>
																<Typography fontWeight={550}>{item.name}</Typography>
																<Typography fontWeight={550}>
																	Hạn sử dụng:
																	<Typography component={'span'}>
																		{formateDateDDMMYYYY(item.confirmedExpirationDate)}
																	</Typography>
																</Typography>
																<Typography fontWeight={550}>
																	Số lượng:
																	<Typography component={'span'}>
																		{item.exportedQuantity}({item.unit})
																	</Typography>
																</Typography>
															</Box>
														</Box>
													</Card>
												)
											})}
										</Box>
									)}
									<Box display={'flex'} gap={2} flexWrap={'wrap'} alignContent={'stretch'}>
										{historyDeliveryDetial.deliveryItems.map((item) => {
											return item.stocks.map((stock, index) => {
												return (
													<Card
														key={index}
														sx={{
															height: '100%',
															padding: '5px',
															backgroundColor: customColor.itemTagColor,
															width: '45%'
														}}
													>
														<Box key={index} display={'flex'} gap={1}>
															<Box
																sx={{
																	width: '100px',
																	height: '100px'
																}}
															>
																<CardMedia
																	component={'img'}
																	src={item.image}
																	sx={{
																		borderRadius: '5px'
																	}}
																/>
															</Box>
															<Box display={'flex'} gap={1} flexDirection={'column'}>
																<Typography fontWeight={550}>{item.name}</Typography>
																<Typography fontWeight={550} variant='body2'>
																	Hạn sử dụng:
																	<Typography component={'span'} variant='body2'>
																		{formateDateDDMMYYYY(stock.expirationDate)}
																	</Typography>
																</Typography>
																<Typography fontWeight={550} variant='body2'>
																	Số lượng:
																	<Typography component={'span'} variant='body2'>
																		{stock.quantity}({item.unit})
																	</Typography>
																</Typography>
															</Box>
														</Box>
													</Card>
												)
											})
										})}
									</Box>
									{!historyDeliveryDetial.isReported ? (
										<Box display={'flex'} justifyContent={'center'} paddingTop={3}>
											<ReportDialog id={history.id} />
										</Box>
									) : (
										<Box display={'flex'} flexDirection={'column'} mt={2}>
											<Typography
												fontWeight={600}
												sx={{
													color: (theme) => theme.palette.warning.dark,
													mt: 2
												}}
											>
												Chú ý: Bạn đã báo cáo yêu cầu vận chuyển này!
											</Typography>
											<Box
												sx={{
													padding: '5px',
													borderRadius: '10px',
													border: '1px solid',
													borderColor: (theme) => theme.palette.divider
												}}
											>
												<Typography fontWeight={600}>
													Ngày tạo :
													<Typography component={'span'} ml={2}>
														{formateDateDDMMYYYYHHMM(historyDeliveryDetial.report.createdDate)}
													</Typography>
												</Typography>
												<Typography fontWeight={600}>
													Tiêu đề :
													<Typography component={'span'} ml={2}>
														{historyDeliveryDetial.report.title}
													</Typography>
												</Typography>

												<Typography fontWeight={600}>
													Nội dung :
													<Typography component={'span'} ml={2}>
														{historyDeliveryDetial.report.content}
													</Typography>
												</Typography>
											</Box>
										</Box>
									)}
								</AccordionDetails>
							</Accordion>
						)
					})
				)
			) : (
				<Box display={'flex'} flexDirection={'column'} gap={1}>
					<Skeleton key={1} width={'100%'} height={'40px'} />
					<Skeleton key={2} width={'100%'} height={'40px'} />
				</Box>
			)}
			{pagination.total > 10 && (
				<Box display={'flex'} justifyContent={'center'} mt={2}>
					<Pagination
						count={Math.ceil(pagination.total / 10)}
						color='primary'
						onChange={(e, page) => {
							setPage(page)
						}}
					/>
				</Box>
			)}
		</div>
	)
}
