import {  Card, CardContent, CardHeader, Grid, Typography } from '@mui/material'
import {  useEffect, useState } from 'react'
import CharityUnitDetail from './GeneralTab'
import axiosClient from 'src/api-client/ApiClient'
import { useRouter } from 'next/router'
import CharityUnitHistoryStock from './HistoryCharityUnit'

const DetailBranch = () => {
	const [dataCharityUnit, setDataCharityUnit] = useState<any>(null)
	const router = useRouter()
	const { unitId } = router.query
	useEffect(() => {
		const fetchData = async () => {
			try {
				const response: any = await axiosClient.get(`/charity-units/${unitId}`)
				console.log(response.data)
				setDataCharityUnit(response.data)
			} catch (error) {
				setDataCharityUnit(null)
				console.log(error)
			}
		}
		if (unitId) fetchData()
	}, [unitId])

	return (
		<Grid container spacing={4} padding={5} flexWrap={'wrap'}>
			<Grid item xl={7} lg={7} md={12} sm={12} xs={12}>
				<Card>
					<CardHeader
						title={
							<Typography color={'primary'} variant='h6' fontWeight={600}>
								Thông tin đơn vị từ thiện
							</Typography>
						}
					/>
					<CardContent>
						{dataCharityUnit ? (
							<CharityUnitDetail charityUnit={dataCharityUnit} />
						) : (
							<Typography align='center' sx={{ fontSize: '24px', fontWeight: 700 }}>
								Không có dữ liệu
							</Typography>
						)}
					</CardContent>
				</Card>
			</Grid>
			<Grid item xl lg md sm xs>
				<Card>
					<CardHeader
						title={
							<Typography color={'primary'} variant='h6' fontWeight={600}>
								Thông tin nhận hỗ trợ
							</Typography>
						}
					/>
					<CharityUnitHistoryStock />
				</Card>
			</Grid>
		</Grid>
	)
}

export default DetailBranch
