import { Typography, Grid, Box, Card, BoxProps, styled } from '@mui/material'
import { useEffect, useState } from 'react'
import moment from 'moment'
import { customColor } from 'src/@core/theme/color'
import HideSourceIcon from '@mui/icons-material/HideSource'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import BeenhereIcon from '@mui/icons-material/Beenhere'
import { sortScheduledTimes, groupByMonth, compareWithCurrentTime } from 'src/@core/layouts/utils'
import { ScheduledTime } from 'src/models'

export interface IDisplayScheduledTimeProps {
	data: ScheduledTime[]
	handleClickSchedule?: (values: ScheduledTime[]) => void
}

const days = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7']

const DateBox = styled(Box)<BoxProps>(({ theme }) => ({
	width: '85px',
	height: '50px',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	border: '1px solid',
	borderColor: theme.palette.grey[500],
	borderRadius: '4px',
	backgroundColor: theme.palette.common.white
}))

export default function DisplayScheduledTime(props: IDisplayScheduledTimeProps) {
	const { data = [], handleClickSchedule } = props
	const [scheduleTimeGroupedByMonth, setScheduleTimeGroupedByMonth] = useState<
		Record<string, ScheduledTime[]>
	>({})
	const [listScelected, setListSelected] = useState<Record<string, ScheduledTime>>({})

	useEffect(() => {
		const scheduledTimeOrdered = sortScheduledTimes(data as ScheduledTime[])

		setScheduleTimeGroupedByMonth(groupByMonth(scheduledTimeOrdered))
		setListSelected({})
	}, [data])

	return (
		<Grid
			container
			gap={3}
			justifyContent={'center'}
			flexDirection={'row'}
		>
			{Object.entries(scheduleTimeGroupedByMonth).map(([key, value]) => {
				const list: JSX.Element[] = []

				for (let index = 1; index <= moment(key).daysInMonth(); index++) {
					const firstDate = `${key}-${index}`
					if (index === 1) {
						const indexOfDate = moment(key).startOf('month').get('day')

						for (let i = indexOfDate; i > 0; i--) {
							const date = moment(key).get('dates') - i
							list.push(
								<DateBox
									key={`${firstDate}_${i}`}
									sx={{
										border: 'none',
										backgroundColor: () => hexToRGBA(customColor.primary, 0)
									}}
								>
									{date > 0 ? (
										<Typography fontWeight={550} textAlign={'center'}>
											{date}
										</Typography>
									) : (
										<Typography fontWeight={550}></Typography>
									)}
								</DateBox>
							)
						}
					}
					const date = value.filter((item) => moment(item.day).get('date') === index)?.at(0)

					const isAfterNow = !compareWithCurrentTime(date?.day || '', date?.startTime || '')

					if (date) {
						list.push(
							<DateBox
								key={date.day}
								sx={{
									position: 'relative',
									'& .content': {
										color: customColor.secondary
									},
									...(isAfterNow
										? {
												':hover': {
													backgroundColor: '#FFC169'
												},
												cursor: 'pointer'
										  }
										: {
												cursor: 'not-allowed',
												backgroundColor: (theme) => theme.palette.grey[400]
										  })
								}}
								{...(isAfterNow && {
									onClick: () => {
										if (!handleClickSchedule) return
										const newData = listScelected
										if (!listScelected[date.day || '']) {
											newData[date.day || ''] = date
										} else {
											delete newData[date.day || '']
										}

										handleClickSchedule(Object.entries(listScelected).map(([, value]) => value))

										setListSelected({ ...newData })
									}
								})}
							>
								<Typography className='content' fontWeight={550}>
									{moment(date.day).get('dates')}
								</Typography>
								<Typography
									className='content'
									variant='caption'
									fontWeight={500}
									sx={{
										whiteSpace: 'nowrap'
									}}
								>
									{date.startTime}-{date.endTime}
								</Typography>
								{!!listScelected[date.day || ''] && (
									<BeenhereIcon
										color='success'
										sx={{
											position: 'absolute',
											top: 3,
											right: 3,
											'&.MuiSvgIcon-root': {
												fontSize: '16px'
											}
										}}
									/>
								)}
							</DateBox>
						)
					} else {
						list.push(
							<DateBox
								key={`no_${index}_${key}`}
								sx={{
									cursor: 'not-allowed'
								}}
							>
								<HideSourceIcon color='error' />
							</DateBox>
						)
					}
				}

				return (
					<Grid key={key} item>
						<Card
							sx={{
								border: '1px solid',
								borderColor: (theme) => theme.palette.divider,
								borderRadius: '8px',
								width: '630px',
								height: '390px',
								display: 'flex',
								flexDirection: 'column',
								backgroundImage: customColor.secondaryGradient
							}}
						>
							<Box
								sx={{
									// backgroundColor: theme => theme.palette.primary[theme.palette.mode],
									width: '630px',
									display: 'flex',
									justifyContent: 'center',
									borderTopLeftRadius: '8px',
									borderTopRightRadius: '8px',
									alignItems: 'center',
									paddingY: '5px'
								}}
							>
								<Typography
									fontWeight={600}
									sx={{
										color: (theme) => theme.palette.primary.contrastText
									}}
								>
									{`Tháng ${moment(key).get('month') + 1}/${moment(key).get('year')}`}
								</Typography>
							</Box>
							<Box
								display={'flex'}
								height={'60px'}
								sx={{
									width: '630px',
									borderLeft: '1px solid',
									borderRight: '1px solid',
									borderColor: (theme) => theme.palette.divider
								}}
								justifyContent={'center'}
								flexWrap={'wrap'}
								gap={1}
							>
								{days.map((day, index) => (
									<Box
										key={`day_${index}`}
										display={'flex'}
										alignItems={'center'}
										width={'85px'}
										justifyContent={'center'}
									>
										<Typography
											variant='caption'
											textAlign='center'
											sx={{
												color: (theme) => theme.palette.common.white
											}}
											fontWeight={800}
										>
											{day}
										</Typography>
									</Box>
								))}
							</Box>
							<Box
								display={'flex'}
								sx={{
									width: '620px'
								}}
								justifyContent={'flex-start'}
								flexWrap={'wrap'}
								gap={1}
								ml={1}
								py={2}
							>
								{[...list]}
							</Box>
						</Card>
					</Grid>
				)
			})}
		</Grid>
	)
}
