import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material'
import { ReactNode, useEffect, useState } from 'react'
import DialogCustom from 'src/@core/layouts/components/dialog/Dialog'
import { FilterNotifcationModel, NotificationDataResponse, NotificationModel } from 'src/models/Notification'
import { HeadCell } from 'src/models/common/CommonModel'
import TableHeader from '../table/TableHeader'
import TableLabel from '../table/TableLabel'
import moment from 'moment'
import { KEY } from 'src/common/Keys'
import TableHeaderCheckBox from '../table/TableHeaderCheckBox'
import MyTablePagination from '../table/TablePagination'
import { CommonRepsonseModel, PaginationModel } from 'src/models/common/CommonResponseModel'
import { NotificationAPI } from 'src/api-client/Notification'
import { LIST_NOTIFICATION_STATUS } from 'src/common/constants'
import { customColor } from 'src/@core/theme/color'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import DraftsIcon from '@mui/icons-material/Drafts'


const StatusNotificationChip: {
  [key: string]: ReactNode
} = {
  NEW: <Chip label='Chưa xem' color='warning' />,
  SEEN: <Chip label='Đã xem' color='success' />
}

const TypeNotificationChip: {
  [key: string]: ReactNode
} = {
  NOTIFYING: <Chip label='Thông báo' color='info' />,
  WARN: <Chip label='Cảnh báo' color='warning' />
}
const headerCell: HeadCell<NotificationModel>[] = [
  {
    id: 'name',
    label: <TableLabel title='Tên thông báo' />,
    width: 250
  },
  {
    id: 'createdDate',
    label: <TableLabel title='Ngày tạo' />,
    width: 170,
    format(val) {
      return moment(val.createdDate).format(KEY.FORMAT_DATE_d_m_y_H_M)
    }
  },
  {
    id: 'type',
    label: <TableLabel title='Loại thông báo' />,
    width: 150,
    format(val) {
      return TypeNotificationChip[val.type]
    }
  },
  {
    id: 'content',
    width: 350,
    label: <TableLabel title='Nội dung' />
  },
  {
    id: 'status',
    label: <TableLabel title='Trạng thái' />,
    format(val) {
      return StatusNotificationChip[val.status]
    }
  }
]

export default function NotificationDialog({
	handleNotificationClick,
	readNotifications
}: {
	handleNotificationClick: (notification: NotificationModel) => void
	readNotifications: (notificationList: string[]) => void
}) {
	const [open, setOpen] = useState<boolean>(false)
	const [pagination, setPagination] = useState<PaginationModel>(new PaginationModel())
	const [filterNotification, setFilterNotification] = useState<FilterNotifcationModel>(
		new FilterNotifcationModel()
	)
	const [notifications, setNotificaitons] = useState<NotificationModel[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [notificationSelected, setNotificationSelected] = useState<Set<string>>(new Set([]))

	const handleShowDialog = () => {
		setOpen(true)
	}

	const handleCloseDialog = () => {
		setOpen(false)
	}

	useEffect(() => {
		getNotification()
	}, [filterNotification])

	const getNotification = async () => {
		try {
			setIsLoading(true)
			const notificationList = await NotificationAPI.getNotification(filterNotification)
			const commonReponse = new CommonRepsonseModel<NotificationDataResponse>(notificationList)
			const data = new NotificationDataResponse(commonReponse.data)
			setPagination(commonReponse.pagination)
			setNotificaitons(data.notificationResponses)
		} catch (error) {
			console.log(error)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<>
			<Button fullWidth variant='contained' onClick={handleShowDialog}>
				Xem tất cả
			</Button>
			<DialogCustom
				content={
					<>
						<TableContainer
							sx={{
								maxHeight: 300
							}}
						>
							<Table stickyHeader>
								<TableHead>
									<TableRow>
										<TableHeaderCheckBox
											numSelected={notificationSelected.size}
											onSelectAllClick={(e) => {
												if (e.target.checked) {
													const newNotificationSelected = notifications.map((item) => item.id || '')
													setNotificationSelected(new Set(newNotificationSelected))
												} else {
													setNotificationSelected(new Set([]))
												}
											}}
											rowCount={pagination.pageSize}
										/>
										<TableCell>#</TableCell>
										{headerCell.map((item, index) => {
											return <TableHeader key={index} headCell={item} />
										})}
									</TableRow>
								</TableHead>
								<TableBody>
									{!isLoading
										? notifications.map((notification: any, index) => {
												return (
													<TableRow hover key={index}>
														<TableCell>
															<Checkbox
																onChange={() => {
																	const newNotificationSelected = new Set(
																		Array.from(notificationSelected)
																	)
																	if (notificationSelected.has(notification.id || ''))
																		newNotificationSelected.delete(notification.id || '')
																	else newNotificationSelected.add(notification.id || '')

																	setNotificationSelected(newNotificationSelected)
																}}
																checked={notificationSelected.has(notification.id || '')}
															/>
														</TableCell>
														<TableCell>
															{index + 1 + (pagination.currentPage - 1) * pagination.pageSize}
														</TableCell>
														{headerCell.map((item) => {
															return (
																<TableCell
																	key={item.id}
																	sx={{
																		minWidth: item.minWidth,
																		maxWidth: item.maxWidth ?? 'none',
																		width: item.width ?? 'auto',
																		...(notification.status === 'NEW' && {
																			color: 'black !important',
																			':hover': {
																				cursor: 'pointer'
																			}
																		})
																	}}
																	onClick={() => {
																		handleNotificationClick(new NotificationModel(notification))
																	}}
																>
																	{item.format ? item.format(notification) : notification[item.id]}
																</TableCell>
															)
														})}
													</TableRow>
												)
										  })
										: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((notification: any, index) => {
												return (
													<TableRow hover key={index}>
														<TableCell></TableCell>
														<TableCell>{index + 1}</TableCell>
														{headerCell.map((item) => {
															return (
																<TableCell
																	key={item.id}
																	sx={{
																		minWidth: item.minWidth,
																		maxWidth: item.maxWidth ?? 'none',
																		width: item.width ?? 'auto'
																	}}
																>
																	<Skeleton variant='rectangular' />
																</TableCell>
															)
														})}
													</TableRow>
												)
										  })}
								</TableBody>
							</Table>
						</TableContainer>
						<MyTablePagination
							data={pagination}
							filterObject={filterNotification}
							setFilterObject={setFilterNotification}
						/>
					</>
				}
				handleClose={handleCloseDialog}
				open={open}
				title={'Danh sách các thông báo'}
				action={<Button>Đóng</Button>}
				actionTitle={
					<Box
						sx={{
							padding: '5px',
							height: '60px',
							display: 'flex',
							alignItems: 'center'
						}}
					>
						{notificationSelected.size === 0 ? (
							<Autocomplete
								size='small'
								disablePortal
								fullWidth
								renderInput={(params) => (
									<TextField
										{...params}
										name='unit'
										placeholder='Trạng thái'
										label='Trạng thái'
										fullWidth
									/>
								)}
								getOptionLabel={(option) => option.label ?? '_'}
								options={LIST_NOTIFICATION_STATUS}
								onChange={(_: React.SyntheticEvent, newValue) => {
									setFilterNotification(
										new FilterNotifcationModel({
											...filterNotification,
											notificationStatus: newValue?.value
										})
									)
								}}
								sx={{
									width: '25%'
								}}
							/>
						) : (
							<Box
								sx={{
									display: 'flex',
									flexDirection: 'row',
									justifyContent: 'space-between',
									alignItems: 'center',
									gap: 2,
									width: '100%',
									height: '100%',
									backgroundColor: hexToRGBA(customColor.primary, 0.2),
									borderRadius: '10px'
								}}
							>
								<Typography
									component={'p'}
									sx={{
										color: customColor.secondary,
										pl: 5
									}}
								>
									Đã chọn{' '}
									<Typography
										component={'span'}
										sx={{
											paddingX: '5px',
											color: customColor.secondary
										}}
									>
										{notificationSelected.size}
									</Typography>
									thông báo
								</Typography>
								<Button
									size='small'
									startIcon={<DraftsIcon />}
									onClick={async () => {
										await readNotifications(Array.from(notificationSelected))
										setNotificationSelected(new Set<string>([]))
										await getNotification()
									}}
								>
									Đánh dấu đã đọc
								</Button>
							</Box>
						)}
					</Box>
				}
			/>
		</>
	)
}
