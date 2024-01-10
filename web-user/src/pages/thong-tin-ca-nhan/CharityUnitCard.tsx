import { Box, CardMedia, Paper, Tooltip, Typography } from '@mui/material'
import { Domain } from 'mdi-material-ui'
import * as React from 'react'
import { CharityUnitModel } from 'src/models/Charity'

export interface ICharityUnitCardProps {
	charityUnit: CharityUnitModel
}

export default function CharityUnitCard({ charityUnit }: ICharityUnitCardProps) {
	return (
		<Paper
			elevation={1}
			sx={{
				display: 'flex',
				flexDirection: 'column',
				height: '100%',
				position: 'relative'
			}}
		>
			<CardMedia
				image={(charityUnit?.image as string) || '/images/cards/background-user.png'}
				sx={{
					height: 220,
					width: 200
				}}
				component='img'
				onError={(e: any) => {
					e.currentTarget.src = '/images/cards/background-user.png'
				}}
			/>
			<Typography fontWeight={550} mt={1} width={200} padding={2} whiteSpace={'pre-wrap'}>
				{charityUnit?.name}
			</Typography>
			{charityUnit?.isHeadquarter && (
				<Tooltip title='Chi nhánh chính'>
					<Box
						sx={{
							position: 'absolute',
							top: 10,
							left: 10,
							borderRadius: '50%',
							backgroundColor: 'white',
							width: '30px',
							height: '30px',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center'
						}}
					>
						<Domain color='error' />
					</Box>
				</Tooltip>
			)}
		</Paper>
	)
}
