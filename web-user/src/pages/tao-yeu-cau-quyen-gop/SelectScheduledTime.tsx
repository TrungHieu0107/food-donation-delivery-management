'use client'

import {
	Stack,
	Divider,
	FormControl,
	FormControlLabel,
	Typography,
	TextField,
	TableContainer,
	TableHead,
	Checkbox,
	TableBody,
	TablePagination,
	Grid,
	Table,
	Paper,
	Box,
	Switch,
	TableCell,
	TableRow
} from '@mui/material'
import { FormikProps } from 'formik'
import { RefObject, useState } from 'react'
import { registerLocale } from 'react-datepicker'
import moment from 'moment'
import vi from 'date-fns/locale/vi'
import { ScheduledTimes } from '.'
import { daysOfWeek } from 'src/common/Keys'
import { calculateDiffs, formateDateDDMMYYYY } from 'src/@core/layouts/utils'
import dynamic from 'next/dynamic'

const DatePicker = dynamic(() => import('react-datepicker'), { ssr: false })

registerLocale('vi', vi)

export interface ISelectScheduledTimeProps {
	scheduledTimes: ScheduledTimes[]
	setScheduledTimes: (value: ScheduledTimes[]) => void
	changeDates: (values: [Date, Date]) => void
	handleCheckTime: (value: boolean) => void
	isAidScreen: boolean | undefined
	formikRef: RefObject<FormikProps<any>>
}

export default function SelectScheduledTime(props: ISelectScheduledTimeProps) {
	const { scheduledTimes, setScheduledTimes, changeDates, handleCheckTime, isAidScreen } = props

	const [sameTime, setSameTime] = useState<boolean>(true)
	const [startDate, setStartDate] = useState<Date | null>(
		isAidScreen ? moment().add('day', 2).toDate() : new Date()
	)
	const [endDate, setEndDate] = useState<Date | null>(null)
	const [receivingTimeStart, setRecieveTimeStart] = useState<Date | null>(null)
	const [receivingTimeEnd, setRecieveTimeEnd] = useState<Date | null>(null)
	const [page, setPage] = useState(0)

	const onChange = (dates: [Date | null, Date | null]) => {
		const [start, end] = dates
		setStartDate(start)
		setEndDate(end)

		const newSchedules: ScheduledTimes[] = []
		if (!start || !end) return

		calculateDiffs(start.toISOString(), end.toISOString())?.map((item) => {
			const date = moment(start).add(item, 'day').format('dddd, DD-MM-yyyy').split(', ')
			const newDate = `${daysOfWeek[date[0]]}, ${date[1]}`
			newSchedules.push({
				day: moment(start).add(item, 'day').format('yyyy-MM-DD'),
				label: newDate,
				startTime: '',
				endTime: '',
				status: true
			} as ScheduledTimes)
		})
		changeDates([start, end])
		setScheduledTimes(newSchedules)
		setPage(0)
	}

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage)
	}

	const disableDate = [
		{
			'react-datepicker__day--highlighted-disable': scheduledTimes
				?.filter((item) => !item.status)
				?.map((item) => moment(item.day).add('days', 1).toDate())
		}
	]

	return (
		<Box
			className='full-width'
			sx={{
				marginTop: '5px',
				display: 'flex',
				flexDirection: props.isAidScreen
					? 'column'
					: {
							xl: 'row',
							lg: 'row',
							md: 'column',
							sm: 'column',
							xs: 'column'
					  },
				justifyContent: 'center',
				alignItems: props.isAidScreen
					? 'center'
					: {
							xl: 'normal',
							lg: 'normal',
							md: 'center',
							sm: 'center',
							xs: 'center'
					  },
				gap: 3
			}}
		>
			<DatePicker
				locale={'vi'}
				startDate={startDate}
				endDate={endDate}
				name='receivingDateStart'
				autoComplete='off'
				placeholderText='Ngày-Tháng-Năm'
				minDate={
					props.isAidScreen
						? moment().add(2, 'day').startOf('day').toDate()
						: moment().startOf('day').toDate()
				}
				maxDate={
					props.isAidScreen
						? moment().add(3, 'month').endOf('day').toDate()
						: moment().add(2, 'week').endOf('day').toDate()
				}
				customInput={<TextField size='small' label='Bắt đầu' fullWidth />}
				selectsRange
				highlightDates={disableDate}
				inline
				dateFormat={'dd/MM/yyyy'}
				onChange={onChange}
				{...(props.isAidScreen ? { monthsShown: 4 } : null)}
			/>
			<Paper
				elevation={9}
				sx={{
					width: '100%',
					display: 'flex',
					justifyContent: 'center'
				}}
			>
				<Stack
					direction={'column'}
					divider={<Divider orientation='vertical' flexItem />}
					sx={{
						padding: '10px',
						justifyContent: 'center',
						width: '100%'
					}}
				>
					<FormControl
						sx={{
							WebkitFlexDirection: 'row'
						}}
					>
						<FormControlLabel
							value='start'
							control={
								<Switch
									color='primary'
									checked={sameTime}
									onChange={(e) => {
										setSameTime(e.target.checked)
										handleCheckTime(e.target.checked)
									}}
								/>
							}
							label={
								<Typography fontWeight={500}>Thời gian nhận của các ngày là giống nhau</Typography>
							}
							labelPlacement='start'
						/>
					</FormControl>
					{startDate && endDate && (
						<Typography pl={4} fontWeight={500}>{`Thời gian đã chọn: Từ ${formateDateDDMMYYYY(
							startDate.toString()
						)} đến ${formateDateDDMMYYYY(endDate?.toString())}`}</Typography>
					)}
					{sameTime && (
						<Grid
							container
							spacing={2}
							sx={{
								width: '100%',
								flexDirection: 'column'
							}}
						>
							<Grid item display={'flex'} gap={2}>
								<Typography fontWeight={500} textAlign={'center'} width={'150px'}>
									Từ
									<Typography
										component={'span'}
										variant='body2'
										fontWeight={500}
										px={1}
										sx={{
											color: 'red !important'
										}}
									>
										(*)
									</Typography>
								</Typography>
								<DatePicker
									locale={'vi'}
									selected={receivingTimeStart ? moment(receivingTimeStart).toDate() : null}
									minTime={
										moment(startDate).isSame(moment(), 'day')
											? moment().add('hour', 1).toDate()
											: moment().startOf('day').toDate()
									}
									maxTime={moment().startOf('day').subtract('hour', 2).toDate()}
									showTimeSelect
									showTimeSelectOnly
									timeIntervals={30}
									timeCaption='Bắt đầu'
									dateFormat='HH:mm'
									customInput={
										<TextField
											autoComplete='off'
											InputProps={{
												autoComplete: 'off'
											}}
											size='small'
											{...props.formikRef?.current?.getFieldProps('receivingTimeStart')}
											label='Bắt đầu'
											error={
												props.formikRef?.current?.getFieldMeta('receivingTimeStart').touched &&
												!!props.formikRef?.current?.getFieldMeta('receivingTimeStart').error
											}
											helperText={
												props.formikRef?.current?.getFieldMeta('receivingTimeStart').touched &&
												props.formikRef?.current?.getFieldMeta('receivingTimeStart').error
													? props.formikRef?.current?.getFieldMeta('receivingTimeStart').error
													: ''
											}
											sx={{
												width: '200px'
											}}
										/>
									}
									onChange={(date: Date | null) => {
										console.log(date)
										props.formikRef?.current?.setFieldValue('receivingTimeStart', date?.toString())
										setRecieveTimeStart(date)
									}}
								/>
							</Grid>
							<Grid item display={'flex'} gap={2}>
								<Typography fontWeight={500} textAlign={'center'} width={'150px'}>
									Đến
									<Typography
										component={'span'}
										variant='body2'
										fontWeight={500}
										px={1}
										sx={{
											color: 'red !important'
										}}
									>
										(*)
									</Typography>
								</Typography>
								<DatePicker
									locale={'vi'}
									minTime={
										receivingTimeStart
											? moment(receivingTimeStart).add(50, 'minutes').toDate()
											: moment(moment().startOf('day')).toDate()
									}
									maxTime={moment(moment().endOf('day')).toDate()}
									selected={receivingTimeEnd ? moment(receivingTimeEnd).toDate() : undefined}
									onBlur={() => {
										props.formikRef?.current?.setFieldTouched('receivingTimeEnd')
									}}
									showTimeSelect
									showTimeSelectOnly
									timeIntervals={30}
									timeCaption='Kết thúc'
									dateFormat='HH:mm'
									customInput={
										<TextField
											autoComplete='off'
											InputProps={{
												autoComplete: 'off'
											}}
											size='small'
											{...props.formikRef?.current?.getFieldProps('receivingTimeEnd')}
											label='Kết thúc'
											error={
												props.formikRef?.current?.getFieldMeta('receivingTimeEnd')?.touched &&
												!!props.formikRef?.current?.getFieldMeta('receivingTimeEnd')?.error
											}
											helperText={
												props.formikRef?.current?.getFieldMeta('receivingTimeEnd')?.touched &&
												props.formikRef?.current?.getFieldMeta('receivingTimeEnd')?.error
													? props.formikRef?.current?.getFieldMeta('receivingTimeEnd')?.error
													: ''
											}
											sx={{
												width: '200px'
											}}
										/>
									}
									onChange={(date: Date | null) => {
										console.log(date)
										props.formikRef?.current?.setFieldValue('receivingTimeEnd', date?.toString())
										setRecieveTimeEnd(date)
									}}
								/>
							</Grid>
						</Grid>
					)}
					{!sameTime && (
						<Box>
							<TableContainer>
								<Table>
									<TableHead>
										<TableRow>
											<TableCell
												size='small'
												sx={{
													width: 50
												}}
											>
												<Checkbox
													checked={
														scheduledTimes?.filter((schedule) => schedule.status).length ===
														scheduledTimes?.length
													}
													onChange={(e) => {
														const newSchedules = scheduledTimes?.map((schedule) => {
															schedule.status = e.target.checked

															return schedule
														})

														setScheduledTimes([...(newSchedules ?? [])])
													}}
												/>
											</TableCell>

											<TableCell size='small'>Ngày</TableCell>
											<TableCell
												sx={{
													width: 200
												}}
												size='small'
											>
												Giờ bắt đầu
											</TableCell>
											<TableCell
												sx={{
													width: 200
												}}
												size='small'
											>
												Giờ kết thúc
											</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{[...(scheduledTimes ?? [])]
											?.slice(page * 7, page * 7 + 7)
											?.map((item, index) => {
												const indexNumber = page * 7 + index
												
												return (
													<TableRow
														key={index}
														sx={{
															width: 50
														}}
													>
														<TableCell
															sx={{
																verticalAlign: 'top'
															}}
														>
															<Checkbox
																checked={item.status}
																onChange={(e) => {
																	const newSchedules = [...scheduledTimes] || []
																	newSchedules[indexNumber] = {
																		...newSchedules[indexNumber],
																		status: e.target.checked
																	}

																	console.log(newSchedules)

																	setScheduledTimes([...newSchedules])
																}}
															/>
														</TableCell>
														<TableCell
															sx={{
																verticalAlign: 'top'
															}}
														>
															<Typography
																sx={{
																	height: '42px',
																	display: 'flex',
																	alignItems: 'center'
																}}
															>
																{item.label}
															</Typography>
														</TableCell>
														<TableCell
															sx={{
																verticalAlign: 'top'
															}}
														>
															<DatePicker
																disabled={!item.status}
																locale={'vi'}
																selected={
																	props.formikRef?.current?.values?.scheduledTimes[indexNumber] &&
																	props.formikRef?.current?.values?.scheduledTimes[indexNumber]
																		?.startTime
																		? moment(
																				props.formikRef?.current?.values.scheduledTimes[indexNumber]
																					.startTime
																		  ).toDate()
																		: undefined
																}
																showTimeSelect
																showTimeSelectOnly
																minTime={moment().startOf('day').toDate()}
																maxTime={moment().endOf('day').subtract('hours', 1).toDate()}
																timeIntervals={30}
																timeCaption='Bắt đầu'
																dateFormat='h:mm a'
																onBlur={() => {
																	props.formikRef?.current?.setFieldTouched(
																		`scheduledTimes[${indexNumber}].startTime`
																	)
																}}
																customInput={
																	<TextField
																		size='small'
																		{...props.formikRef?.current?.getFieldProps(
																			`scheduledTimes[${indexNumber}].startTime`
																		)}
																		label='Bắt đầu'
																		error={
																			props.formikRef?.current?.getFieldMeta(
																				`scheduledTimes[${indexNumber}].startTime`
																			).touched &&
																			!!props.formikRef?.current?.getFieldMeta(
																				`scheduledTimes[${indexNumber}].startTime`
																			).error
																		}
																		helperText={
																			props.formikRef?.current?.getFieldMeta(
																				`scheduledTimes[${indexNumber}].startTime`
																			).touched &&
																			props.formikRef?.current?.getFieldMeta(
																				`scheduledTimes[${indexNumber}].startTime`
																			).error
																				? props.formikRef?.current?.getFieldMeta(
																						`scheduledTimes[${indexNumber}].startTime`
																				  ).error
																				: ''
																		}
																		fullWidth
																		variant='standard'
																	/>
																}
																onChange={(date: Date | null) => {
																	const newscheduledTimes = [...scheduledTimes]
																	newscheduledTimes[indexNumber] = {
																		...newscheduledTimes[indexNumber],
																		startTime: date?.toString()
																	}

																	setScheduledTimes([...newscheduledTimes])
																	props.formikRef?.current?.setFieldValue('scheduledTimes', [
																		...newscheduledTimes
																	])
																}}
															/>
														</TableCell>
														<TableCell
															sx={{
																verticalAlign: 'top'
															}}
														>
															<DatePicker
																disabled={!item.status}
																locale={'vi'}
																minTime={
																	props.formikRef?.current?.values?.scheduledTimes[indexNumber]
																		?.startTime
																		? moment(
																				props.formikRef?.current?.values.scheduledTimes[indexNumber]
																					.startTime
																		  )
																				.add(50, 'minutes')
																				.toDate()
																		: moment(moment().startOf('day')).toDate()
																}
																maxTime={moment(moment().endOf('day')).toDate()}
																selected={
																	props.formikRef?.current?.values.scheduledTimes[indexNumber] &&
																	props.formikRef?.current?.values.scheduledTimes[indexNumber]
																		?.endTime
																		? moment(
																				props.formikRef?.current?.values.scheduledTimes[indexNumber]
																					.endTime
																		  ).toDate()
																		: undefined
																}
																onBlur={() => {
																	props.formikRef?.current?.setFieldTouched(
																		`scheduledTimes[${indexNumber}].endTime`
																	)
																}}
																showTimeSelect
																showTimeSelectOnly
																timeIntervals={30}
																timeCaption='Bắt đầu'
																dateFormat='h:mm a'
																customInput={
																	<TextField
																		size='small'
																		{...props.formikRef?.current?.getFieldProps(
																			`scheduledTimes[${indexNumber}].endTime`
																		)}
																		label='Kết thúc'
																		error={
																			props.formikRef?.current?.getFieldMeta(
																				`scheduledTimes[${indexNumber}].endTime`
																			).touched &&
																			!!props.formikRef?.current?.getFieldMeta(
																				`scheduledTimes[${indexNumber}].endTime`
																			).error
																		}
																		helperText={
																			props.formikRef?.current?.getFieldMeta(
																				`scheduledTimes[${indexNumber}].endTime`
																			).touched &&
																			props.formikRef?.current?.getFieldMeta(
																				`scheduledTimes[${indexNumber}].endTime`
																			).error
																				? props.formikRef?.current?.getFieldMeta(
																						`scheduledTimes[${indexNumber}].endTime`
																				  ).error
																				: ''
																		}
																		fullWidth
																		variant='standard'
																	/>
																}
																onChange={(date: Date | null) => {
																	const newscheduledTimes = [...scheduledTimes]
																	newscheduledTimes[indexNumber] = {
																		...newscheduledTimes[indexNumber],
																		endTime: date?.toString()
																	}

																	setScheduledTimes([...newscheduledTimes])
																	props.formikRef?.current?.setFieldValue('scheduledTimes', [
																		...newscheduledTimes
																	])
																}}
															/>
														</TableCell>
													</TableRow>
												)
											})}
									</TableBody>
								</Table>
							</TableContainer>
							<TablePagination
								rowsPerPageOptions={[7]}
								component='div'
								count={scheduledTimes?.length ?? 0}
								rowsPerPage={7}
								page={page}
								onPageChange={handleChangePage}
							/>
						</Box>
					)}
				</Stack>
			</Paper>
		</Box>
	)
}