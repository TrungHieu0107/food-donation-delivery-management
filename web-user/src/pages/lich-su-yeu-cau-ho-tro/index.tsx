import { Box, Button, Divider, Pagination, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { AidRequestAPI } from 'src/api-client/AidRequest'
import { AidRequestListModel, FilterAidRequestModel } from 'src/models/AidRequest'
import { CommonRepsonseModel, PaginationModel } from '../../models/common/CommonResponseModel'
import FilterHistoryAidRequest from './FilterHistoryAidRequest'
import AidRequestDetailTag from './AidRequestDetailTag'
import { customColor } from 'src/@core/theme/color'
import AidRequestSimpleInfoTag from './AidRequestSimpleInfoTag'
import { useRouter } from 'next/router'

export default function HistoryOfAidPage() {
	const [data, setData] = useState<AidRequestListModel[]>([])
	const [filterObject, setFilterObject] = useState<FilterAidRequestModel>()
	const [pagination, setPagination] = useState<PaginationModel>(new PaginationModel())
	const [currentSelected, setCurrentSelected] = useState<AidRequestListModel>()

	const router = useRouter()
	const { yeu_cau_ho_tro } = router.query

	useEffect(() => {
		fetchData()
	}, [filterObject])

	useEffect(() => {
		if (!!yeu_cau_ho_tro) {
			setCurrentSelected(
				new AidRequestListModel({
					id: yeu_cau_ho_tro as string
				})
			)
		}
	}, [yeu_cau_ho_tro])

	const fetchData = async () => {
		try {
			const response = await AidRequestAPI.getListAidRequest(filterObject || {})
			const commonResponse = new CommonRepsonseModel<AidRequestListModel[]>(response)
			setData(commonResponse.data || [])
			setPagination(commonResponse.pagination)
		} catch (error) {
			console.log(error)
		}
	}

	const handleChangeFilter = (value: FilterAidRequestModel | undefined) => {
		setFilterObject(value)
	}

	const calculateCount = () => {
		const total = pagination.total || 0
		const pageSize = pagination.pageSize || 10

		return Math.ceil(total / pageSize)
	}

	return (
		<Stack
			sx={{
				gap: 3,
				paddingX: '100px',
				justifyContent: 'center'
			}}
		>
			<Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
				<Typography variant='h5' fontWeight={700} sx={{ mt: 5, color: customColor.secondary }}>
					Lịch sử yêu cầu hỗ trợ
				</Typography>
				<Button
					variant='contained'
					onClick={() => {
						router.push('/tao-yeu-cau-ho-tro')
					}}
				>
					Kêu gọi giúp đỡ
				</Button>
			</Box>
			<Box
				sx={{
					width: '100%'
				}}
			>
				<FilterHistoryAidRequest
					filterObject={filterObject}
					handleChangeFilter={handleChangeFilter}
				/>
			</Box>
			<Stack
				gap={2}
				alignItems={'stretch'}
				flexDirection={'row'}
				width={'100%'}
				divider={<Divider orientation='vertical' />}
			>
				<Box
					sx={{
						width: '400px',
						display: 'flex',
						gap: 3,
						flexDirection: 'column',
						alignItems: 'center'
					}}
				>
					<Typography
						fontWeight={600}
						padding={1}
						variant='caption'
						textAlign={'left'}
						width={'100%'}
					>
						Kết quả tìm kiếm : {pagination.total}
					</Typography>
					{data.map((item) => (
						<Box key={item.id}>
							{item && (
								<AidRequestSimpleInfoTag
									data={item}
									isSelected={item.id === currentSelected?.id}
									setCurrentSelected={setCurrentSelected}
								/>
							)}
						</Box>
					))}
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
						siblingCount={0}
					/>
				</Box>

				<Box
					sx={{
						display: 'flex',
						gap: 1,
						width: '100%',
						flexDirection: 'column'
					}}
				>
					<Typography fontWeight={600} padding={1} variant='h6'>
						Thông tin chi tiết
					</Typography>
					<AidRequestDetailTag data={currentSelected} />
				</Box>
			</Stack>
		</Stack>
	)
}
