import { Card, Checkbox, Chip, Grid, Typography } from '@mui/material'
import * as React from 'react'
import { formateDateDDMMYYYYHHMM } from 'src/@core/layouts/utils'
import { customColor } from 'src/@core/theme/color'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { AidRequestListModel } from 'src/models'

const StatusChips: {
	[key: string]: React.ReactNode
} = {
	PENDING: <Chip label='Đang chờ xử lý' color='info' />,
	ACCEPTED: <Chip label='Đã chấp nhận' color='success' />,
	REJECTED: <Chip label='Bị từ chối' color='error' />,
	CANCELED: <Chip label='Đã hủy' color='secondary' />,
	EXPIRED: <Chip label='Hết hạn' color='warning' />,
	PROCESSING: <Chip label='Đang xử lý' color='primary' />,
	SELF_SHIPPING: <Chip label='Tự vận chuyển' style={{ backgroundColor: 'lightblue' }} />,
	REPORTED: <Chip label='Đã báo cáo' style={{ backgroundColor: 'pink' }} />,
	FINISHED: <Chip label='Đã hoàn thành' style={{ backgroundColor: 'lightgreen' }} />
}

export interface IAidRequestSimpleInfoTagProps {
	data: AidRequestListModel
	isSelected: boolean
	setCurrentSelected: (value: AidRequestListModel) => void
}

export default function AidRequestSimpleInfoTag(props: IAidRequestSimpleInfoTagProps) {
	const { data = {} as AidRequestListModel, isSelected, setCurrentSelected } = props

	return (
		<Card
			sx={{
				minHeight: '100px',
				padding: '10px',
				cursor: 'pointer',
				...(isSelected && {
					backgroundImage:
						'radial-gradient(circle, #ffc169, #ffbf65, #ffbd61, #ffbb5c, #ffb958, #ffb551, #ffb24a, #ffae43, #ffa837, #ffa12a, #ff9b1a, #ff9400) !important',
					'& .text-active': {
						color: customColor.secondary
					}
				}),
				':hover': {
					backgroundColor: hexToRGBA(customColor.primary, 0.1)
				}
			}}
			onClick={() => {
				setCurrentSelected(data)
			}}
		>
			<Grid container justifyContent={'space-between'}>
				<Grid item display={'flex'} flexDirection={'column'}>
					<Typography variant='body1' fontWeight={600} className='text-active'>
						{`Ngày ${formateDateDDMMYYYYHHMM(data.createdDate)}`}
					</Typography>
					{data.acceptedDate && data.status !== 'PENDING' && (
						<Typography
							className='text-active'
							variant='caption'
							fontWeight={550}
						>{`Chấp nhận vào ${formateDateDDMMYYYYHHMM(data.acceptedDate)}`}</Typography>
					)}
				</Grid>
				<Grid item>{StatusChips[data.status || '']}</Grid>
			</Grid>
			<Grid container flexDirection={'row'} spacing={2} alignItems={'center'}>
				<Grid item>
					<Typography>Tự đến nhận</Typography>
				</Grid>
				<Grid item>
					<Checkbox color='secondary' checked={data.isSelfShipping} disabled/>
				</Grid>
			</Grid>
		</Card>
	)
}
