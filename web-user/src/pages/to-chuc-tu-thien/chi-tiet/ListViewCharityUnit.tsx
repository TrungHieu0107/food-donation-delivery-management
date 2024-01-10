import { Box, Button, Grid, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import axiosClient from 'src/api-client/ApiClient'
import { CharityUnitModel } from 'src/models/Charity'
import CharityUnitDetailDialog from './CharityUnitDetailDialog'
import { useRouter } from 'next/router'

export interface IListViewCharityUnitProps {
	id: string
}

export default function ListViewCharityUnit(props: IListViewCharityUnitProps) {
	const { id } = props
	const [charityUnits, setCharityUnits] = useState<any>([])
	const [currentCharityUnitSelected, setCurrentCharityUnitSelected] = useState<any>()
	const [dialogDetialOpen, setDialogDetialOpen] = useState<boolean>(false)
    const router = useRouter()
	useEffect(() => {
		if (id) {
			fetchCharityUnits()
		}
	}, [id])

	const fetchCharityUnits = async () => {
		try {
			if (id) {
				const response = await axiosClient.get(`/charities/${id}/charity-units`)
				setCharityUnits(response.data || [])
			}
		} catch (err) {
			setCharityUnits([])
			console.log(err)
		}
	}

	// const handleShowDetailDialog = () => {
	// 	setDialogDetialOpen(true)
	// }

	return (
		<>
			<Grid container spacing={3} padding={10}>
				{charityUnits?.map((c: any) => (
					<Grid container item xs={12} md={6} key={c.id} sx={{ mb: 10 }}>
						<Grid item xs={4}>
							<img
								src={c.image}
								alt='image'
								width={'100%'}
								height={'100%'}
								style={{ objectFit: 'cover' }}
							/>
						</Grid>
						<Grid item xs={8}>
							<Box
								display={'flex'}
								flexDirection={'column'}
								alignItems={'flex-start'}
								sx={{ pl: 5 }}
							>
								<Typography sx={{ mb: 3, textAlign:"left" }}>Tên chi nhánh: {c.name}</Typography>
								<Typography sx={{ mb: 3 }}>Email: {c.email}</Typography>
								<Typography sx={{ mb: 3 }}>Số điện thoại: {c.phone}</Typography>
								<Button
									variant='outlined'
									onClick={() => {
										// setCurrentCharityUnitSelected(c)
										// handleShowDetailDialog()
										router.push(`chi-nhanh-tu-thien/${c.id}`)
									}}
								>
									Chi tiết
								</Button>
							</Box>
						</Grid>
					</Grid>
				))}
			</Grid>
			<CharityUnitDetailDialog
				charityUnit={currentCharityUnitSelected || new CharityUnitModel({})}
				open={dialogDetialOpen && !!currentCharityUnitSelected}
				handleClose={function (): void {
					setDialogDetialOpen(false)
					setCurrentCharityUnitSelected(undefined)
				}}
			/>
		</>
	)
}
