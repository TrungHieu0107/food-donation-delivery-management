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

function CharityView({ charity }: any) {
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
										backgroundImage: `url(${charity?.logo})`,
										backgroundSize: 'cover',
										height: '200px !important',
										width: '100%'
									}}
								></Box>

								<Box p={3} sx={{mb: 3}}>
									<Box display={'flex'} justifyContent={"center"}>
										<Typography sx={{height:"60px", overflow:"hidden"}} variant='h6' fontSize={20} fontWeight={700} align='center'>
											{charity?.name}
										</Typography>
									</Box>
								</Box>
							</Box>
						}
					></CardHeader>
					<CardContent>
						<Box sx={{ height: '100px' }}>
							<Typography sx={{ height: '100px',overflow:"hidden" }}>
								<span style={{ fontWeight: 700 }}>Mô tả</span> : {charity?.description}
							</Typography>

							
						</Box>
					</CardContent>
					<CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
						<Button
							variant='contained'
							onClick={() => {
								router.push(`/to-chuc-tu-thien/chi-tiet/${charity?.id}`)
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

export default CharityView
