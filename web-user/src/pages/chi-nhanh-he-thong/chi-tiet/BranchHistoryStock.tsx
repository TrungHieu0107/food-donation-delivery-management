import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Button,
	CircularProgress,
	Grid,
	Pagination,
	Stack,
	Typography
} from '@mui/material'
import moment from 'moment'
import { useRouter } from 'next/router'
import { SyntheticEvent, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import axiosClient from 'src/api-client/ApiClient'
import Calendar from 'src/layouts/components/calendar/Calendar'

interface filter {
	startDate: string
	endDate: string
	page: number
	pageSize: number
}

function BranchHistoryStock() {
	const [data, setData] = useState<any>([])
	const [loading, setLoading] = useState<boolean>(false)
	const [dataStockPagination, setDataStockPagination] = useState<any>()
	const [expanded, setExpanded] = useState<string | false>(false)
	const [filterObject, setFilterObject] = useState<filter>({
		startDate: '2023-1-1',
		endDate: '2024-12-12',
		page: 1,
		pageSize: 10
	})
	const router = useRouter()
	const { slug } = router.query

	const handleChange = (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
		setExpanded(isExpanded ? panel : false)
	}
	useEffect(() => {
		const fetchData = async () => {
			setLoading(true)
			try {
				const res: any = await axiosClient.get(`/stock-updated-history-details/branch/${slug}`, {
					params: filterObject,
					paramsSerializer: {
						indexes: null
					}
				})
				console.log(res.data)
				setData(res.data || [])
				setDataStockPagination(res.pagination)
			} catch (error) {
				console.log(error)
				setData([])
			} finally {
				setLoading(false)
			}
		}
		if (slug) {
			fetchData()
		}
	}, [slug, filterObject])
	const handlePageStockChange = (event: any, page: any) => {
		setFilterObject({ ...filterObject, page: page })
	}
	const handleDownload = async () => {
		const isConfirmed = window.confirm('Bạn có muốn tải về bản sao kê của chi nhánh này?')
		if (isConfirmed) {
			try {
				const response: any = await axiosClient.get(
					`/stock-updated-history-details/branch/${slug}/file?startDate=${filterObject.startDate}&endDate=${filterObject.endDate}`
				)
				if (response?.data) {
					const url = response.data
					const a = document.createElement('a')
					a.style.display = 'none'
					a.href = url
					a.download = 'ThongKeHoatDong.xlsx'
					document.body.appendChild(a)
					a.click()
					window.URL.revokeObjectURL(url)
					toast.success('Tải bản sao kê thành công')
				}
			} catch (error) {
				console.log('error', error)
				toast.error('Tải bản sao kê không thành công')
			}
		}
	}

	return (
		<Box sx={{minHeight:"70vh"}}>
			<Box sx={{ mb: 5, mt: 10, ml: { md: 10, xs: 0 }, width: { md: '70%' } }}>
				<Grid container spacing={3} sx={{ m: 'auto' }}>
					<Grid item xs={6} md={5}>
						<Calendar
							label='Ngày bắt đầu'
							filterObject={filterObject}
							setFilterObject={setFilterObject}
						/>
					</Grid>
					<Grid item xs={6} md={5}>
						<Calendar
							label='Ngày kết thúc'
							filterObject={filterObject}
							setFilterObject={setFilterObject}
						/>
					</Grid>
					{data.length > 0 && (
						<Grid item xs={6} md={2}>
							<Button variant='contained' color='primary' onClick={handleDownload}>
								Lưu về máy
							</Button>
						</Grid>
					)}
				</Grid>
			</Box>
			<Grid container spacing={5} sx={{ p: 5 }}>
				{loading && (
					<Stack
						sx={{ height: '50vh', width:"100%" }}
						direction={'column'}
						justifyContent={'center'}
						alignItems={'center'}
					>
						<CircularProgress color='secondary' />
						<Typography>Đang tải dữ liệu.....</Typography>
					</Stack>
				)}
				{data?.length === 0 && (
					<Box
						sx={{
							height: '40px',
							mb: 5,
							mt: 5,
							width: '100%',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center'
						}}
					>
						<Typography variant='h5' fontWeight={600}>
							Hiện chưa có lịch sử xuất/nhập kho cho chi nhánh này
						</Typography>
					</Box>
				)}
				{data?.length > 0 &&
					data?.map((d: any, index: any) => (
						<Box sx={{ width: '80%', m: 'auto', mb: 5 }} key={d.id}>
							<Accordion
								sx={{ bgcolor: '#E3FAF5' }}
								expanded={expanded === `panel${index}`}
								onChange={handleChange(`panel${index}`)}
							>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
									aria-controls={`panel${index}bh-content`}
									id={`panel${index}bh-header`}
								>
									{(d.type === 'IMPORT' && d.donorName !== null) && (
										<Stack direction={'column'}>
											<Typography>
												<span style={{ fontWeight: 600, color: '#00c853' }}>
													+{d.quantity} {d.unit} {d.name}
												</span>
												, quyên góp từ nhà hảo tâm{' '}
												<span style={{ fontWeight: 600, color: '#0288d1' }}>{d.donorName}</span>{' '}
												{d.activityName && (
													<>
														<span>thông qua hoạt động</span>{' '}
													</>
												)}
												<span style={{ fontWeight: 600, color: '#0288d1' }}>{d.activityName}</span>{' '}
											</Typography>
											<Typography>{moment(d.createdDate).format('DD/MM/YYYY')}</Typography>
										</Stack>
									)}
									{(d.type === 'IMPORT' && d.donorName === null && d.deliveryPoint === null) && (
										<Stack direction={'column'}>
											<Typography>
												<span style={{ fontWeight: 600, color: '#00c853' }}>
													+{d.quantity} {d.unit} {d.name}
												</span>
												{/* , nhận từ{' '}
												<span style={{ fontWeight: 600, color: '#0288d1' }}>{d.pickUpPoint}</span> */}
											</Typography>
											<Typography>{moment(d.createdDate).format('DD/MM/YYYY')}</Typography>
										</Stack>
									)}
									{(d.type === 'EXPORT' &&  d.deliveryPoint === null) && (
										<Stack direction={'column'}>
											<Typography>
												<span style={{ fontWeight: 600, color: '#f44336' }}>
													-{d.quantity} {d.unit} {d.name}
												</span>
												{/* , vận chuyển từ{' '}
												<span style={{ fontWeight: 600, color: '#0288d1' }}>{d.pickUpPoint}</span>{' '} */}
											</Typography>
											<Typography>{moment(d.createdDate).format('DD/MM/YYYY')}</Typography>
										</Stack>
									)}
									{(d.type === 'EXPORT' && d.deliveryPoint !== null) && (
										<Stack direction={'column'}>
											<Typography>
												<span style={{ fontWeight: 600, color: '#f44336' }}>
													-{d.quantity} {d.unit} {d.name}
												</span>
												, quyên góp cho{' '}
												<span style={{ fontWeight: 600, color: '#0288d1' }}>{d.deliveryPoint}</span>
												{d.donorName && (
													<>
														<span>, được quyên góp bởi</span>{' '}
													</>
												)}
												<span style={{ fontWeight: 600, color: '#0288d1' }}>{d.donorName}</span>
												{d.activityName && (
													<>
														<span>, thông qua hoạt động</span>{' '}
													</>
												)}
												<span style={{ fontWeight: 600, color: '#0288d1' }}>{d.activityName}</span>{' '}
											</Typography>
											<Typography>{moment(d.createdDate).format('DD/MM/YYYY')}</Typography>
										</Stack>
									)}
								</AccordionSummary>
								<AccordionDetails>
									<Typography>Ghi chú: {d.note ? d.note : 'Không có ghi chú'}</Typography>
								</AccordionDetails>
							</Accordion>
						</Box>
					))}
			</Grid>
			{data?.length > 0 && (
				<Box
					justifyContent={'center'}
					alignItems='center'
					display={'flex'}
					width={'100%'}
					sx={{ mb: 10, mt: 5 }}
				>
					<Pagination
						color='primary'
						count={Math.ceil(dataStockPagination?.total ? dataStockPagination?.total / 10 : 0)}
						onChange={handlePageStockChange}
						page={dataStockPagination?.currentPage ? dataStockPagination?.currentPage : 0}
					/>
				</Box>
			)}
		</Box>
	)
}

export default BranchHistoryStock
