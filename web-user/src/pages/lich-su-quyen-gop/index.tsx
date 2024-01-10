import { Box, Divider, Grid, Pagination, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { CommonRepsonseModel, PaginationModel } from '../../models/common/CommonResponseModel'
import FilterHistoryAidRequest from './FilterHistoryAidRequest'
import { DonatedRequestAPI } from 'src/api-client/DonatedRequest'
import { DonatedRequestModel } from 'src/models/DonatedRequest'
import DonatedRequestTag from './DonatedRequestTag'
import { customColor } from 'src/@core/theme/color'

export default function HistoryOfAidPage() {
	const [data, setData] = useState<DonatedRequestModel[]>([])
	const [filterObject, setFilterObject] =
		useState<{ page?: number; startDate?: string; endDate?: string }>()
	const [pagination, setPagination] = useState<PaginationModel>(new PaginationModel())

	useEffect(() => {
		fetchData()
	}, [filterObject])

	const fetchData = async () => {
		try {
			const response = await DonatedRequestAPI.getListDonatedRequest(filterObject || {})
			const commonResponse = new CommonRepsonseModel<DonatedRequestModel[]>(response)
			setData(commonResponse.data || [])
			setPagination(commonResponse.pagination)
		} catch (error) {
			console.log(error)
		}
	}

	const handleChangeFilter = (
		value: { page?: number; startDate?: string; endDate?: string } | undefined
	) => {
		setFilterObject(value)
	}

	const calculateCount = () => {
		const total = pagination.total || 0
		const pageSize = pagination.pageSize || 10

		return Math.ceil(total / pageSize)
	}

	return (
		<Box display={'flex'} justifyContent={'center'}>
			<Stack
				divider={<Divider />}
				sx={{
					width: '70vw',
					justifyContent: 'center',
					alignItems: 'center'
				}}
			>
				<Typography variant='h5' fontWeight={700} sx={{ mt: 10, color: customColor.secondary }}>
					Lịch sử yêu cầu quyên góp
				</Typography>
				<Grid container mt={5} spacing={3} flexDirection={'column'}>
					<Grid item>
						<FilterHistoryAidRequest
							filterObject={filterObject}
							handleChangeFilter={handleChangeFilter}
						/>
					</Grid>
					<Grid item>
						<Typography
							variant='caption'
							fontWeight={450}
						>{`Tìm được ${pagination.total} kết quả`}</Typography>
					</Grid>

					<Grid item container spacing={3} flexDirection={'column'}>
						{data.map((item) => (
							<Grid item key={item.id}>
								{item && <DonatedRequestTag data={item} />}
							</Grid>
						))}
					</Grid>
					<Grid item display={'flex'} justifyContent={'center'}>
						<Pagination
							count={calculateCount()}
							color='primary'
							page={pagination.currentPage || 1}
							onChange={(e, page) => {
								setFilterObject({
									...filterObject,
									page: page
								})
							}}
							showFirstButton
							showLastButton
						/>
					</Grid>
				</Grid>
			</Stack>
		</Box>
	)
}
