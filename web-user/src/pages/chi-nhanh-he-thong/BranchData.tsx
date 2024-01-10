import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	CardHeader,
	Grid,
	Typography
} from '@mui/material'
import { useRouter } from 'next/router'
import React from 'react'

function BranchData({ branch }: any) {
	const router = useRouter()

	return (
		<Grid item xs={12} sm={6} md={4} lg={3}>
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
							<Box display={'flex'} flexDirection={'column'} gap={2}>
								<Box
									sx={{
										backgroundImage: `url(${branch?.image})`,
										backgroundSize: 'cover',
										height: '200px !important',
										width: '100%'
									}}
								></Box>
								<Box p={3}>
									<Box display={'flex'} justifyContent={'center'}>
										<Typography sx={{height:"60px", overflow:"hidden"}} variant='h6' fontSize={20} fontWeight={700} align='center'>
											{branch?.name}
										</Typography>
									</Box>
								</Box>
							</Box>
						}
					></CardHeader>
					<CardContent>
						<Box sx={{ height: '100px' }}>
							<Typography>
								<span style={{ fontWeight: 700 }}>Địa chỉ</span> : {branch?.address}
							</Typography>

							<Typography sx={{ height: '100px' }} variant='body1'></Typography>
						</Box>
					</CardContent>
					<CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
						<Button
							variant='contained'
							onClick={() => {
								router.push(`chi-nhanh-he-thong/chi-tiet/${branch?.id}`)
							}}
							size='small'
							fullWidth
							sx={{ mt: 3 }}
						>
							Chi tiết
						</Button>
					</CardActions>
				</div>
				<div></div>
			</Card>
		</Grid>
	)
}

export default BranchData

