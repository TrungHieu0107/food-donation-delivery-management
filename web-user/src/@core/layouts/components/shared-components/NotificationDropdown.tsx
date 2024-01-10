// ** React Imports
import { useState, SyntheticEvent, Fragment, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import MuiMenu, { MenuProps } from '@mui/material/Menu'
import MuiAvatar, { AvatarProps } from '@mui/material/Avatar'
import MuiMenuItem, { MenuItemProps } from '@mui/material/MenuItem'
import Typography, { TypographyProps } from '@mui/material/Typography'
import Badge from '@mui/material/Badge'

// ** Icons Imports
import BellOutline from 'mdi-material-ui/BellOutline'

// ** Third Party Components
import PerfectScrollbarComponent from 'react-perfect-scrollbar'
import { HubConnectionBuilder } from '@microsoft/signalr'
import { NotificationAPI } from 'src/api-client/Notification'
import moment from 'moment'
import { Skeleton } from '@mui/material'
import {
	FilterNotifcationModel,
	NotificationDataResponse,
	NotificationModel,
	NotificationType
} from 'src/models/Notification'
import { BASE_URL } from 'src/common/Keys'
import { CommonRepsonseModel } from 'src/models/common/CommonResponseModel'
import NotificationDialog from 'src/layouts/components/notification/NotificationDialog'
import { UserModel } from 'src/models/User'
import { formateDateDDMMYYYY } from '../../utils'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'

// ** Styled Menu component
const Menu = styled(MuiMenu)<MenuProps>(({ theme }) => ({
	'& .MuiMenu-paper': {
		width: 380,
		overflow: 'hidden',
		marginTop: theme.spacing(4),
		[theme.breakpoints.down('sm')]: {
			width: '100%'
		}
	},
	'& .MuiMenu-list': {
		padding: 0
	}
}))

// ** Styled MenuItem component
const MenuItem = styled(MuiMenuItem)<MenuItemProps>(({ theme }) => ({
	paddingTop: theme.spacing(3),
	paddingBottom: theme.spacing(3),
	borderBottom: `1px solid ${theme.palette.divider}`
}))

const styles = {
	maxHeight: 349,
	'& .MuiMenuItem-root:last-of-type': {
		border: 0
	}
}

// ** Styled PerfectScrollbar component
const PerfectScrollbar = styled(PerfectScrollbarComponent)({
	...styles
})

// ** Styled Avatar component
const Avatar = styled(MuiAvatar)<AvatarProps>({
	width: '2.375rem',
	height: '2.375rem',
	fontSize: '1.125rem'
})

// ** Styled component for the title in MenuItems
const MenuItemTitle = styled(Typography)<TypographyProps>(({ theme }) => ({
	fontWeight: 600,
	flex: '1 1 100%',
	overflow: 'hidden',
	fontSize: '0.875rem',
	whiteSpace: 'nowrap',
	textOverflow: 'ellipsis',
	marginBottom: theme.spacing(0.75)
}))

// ** Styled component for the subtitle in MenuItems
const MenuItemSubtitle = styled(Typography)<TypographyProps>({
	flex: '1 1 100%',
	overflow: 'hidden',
	whiteSpace: 'nowrap',
	textOverflow: 'ellipsis'
})

const NotificationDropdown = ({ userLogin }: { userLogin: UserModel }) => {
	// ** States
	const [anchorEl, setAnchorEl] = useState<(EventTarget & Element) | null>(null)

	const [notifications, setNotificaitons] = useState<NotificationModel[]>([])
	const [newNotification, setNewNotificaiton] = useState<NotificationModel>()
	const [messgaeUnseenCount, setMessgaeUnseenCount] = useState<number>(0)
	const [numOfNotification, setNumOfNotification] = useState(10)
	const [isLoading, setIsLoading] = useState(false)

	const router = useRouter()

	useEffect(() => {
		getNotification(numOfNotification)
	}, [numOfNotification])

	useEffect(() => {
		const connection = new HubConnectionBuilder()
			.withUrl(BASE_URL + '/notificationHub')
			.withAutomaticReconnect()
			.build()

		connection
			.start()
			.then(() => {
				console.log('SignalR Connected', userLogin.id)
			})
			.catch((error) => console.log('SignalR Connection Error: ', userLogin.id, error))

		connection.on(userLogin.id ?? '', (message) => {
			setNewNotificaiton(new NotificationModel(message))
		})

		return () => {
			connection.stop()
		}
	}, [])

	useEffect(() => {
		newNotification && handleGetNewNotification(newNotification)
	}, [newNotification])

	const readNotifications = async (notificationList: string[]) => {
		try {
			await NotificationAPI.readNotification(notificationList)
			setMessgaeUnseenCount(messgaeUnseenCount - 1)
			await getNotification(numOfNotification)
		} catch (error) {
			console.log(error)
		}
	}

	const handleDropdownOpen = (event: SyntheticEvent) => {
		setAnchorEl(event.currentTarget)
	}

	const handleDropdownClose = () => {
		setAnchorEl(null)
	}

	const handleNotificationClick = async (notification: NotificationModel) => {
		// notification.link && router.push(notification.link)
		handleDropdownClose()

		const url = getUrl(notification)
		if (!!url) router.push(url)
		if (notification.status === 'NEW' && notification.id.length !== 0) {
			await NotificationAPI.readNotification([notification.id]).then(async () => {
				setMessgaeUnseenCount(messgaeUnseenCount - 1)
				await getNotification(numOfNotification)
			})
		}
	}

	const getNotification = async (num: number) => {
		try {
			const notificationList = await NotificationAPI.getNotification(
				new FilterNotifcationModel({
					pageSize: num
				})
			)

			const commonReponse = new CommonRepsonseModel<NotificationDataResponse>(notificationList)

			const data = new NotificationDataResponse(commonReponse.data)

			setMessgaeUnseenCount(data.notSeen)
			setNotificaitons(data.notificationResponses)
		} catch (error) {
			console.log(error)
		} finally {
			setIsLoading(false)
		}
	}

	const getUrl = (notification: NotificationModel) => {
		let url = ''

		switch (notification.dataType) {
			case NotificationType.NONE.toString():
				break
			case NotificationType.USER.toString():
				break
			case NotificationType.POST.toString():
				break
			case NotificationType.DELIVERY_REQUEST.toString():
				// url = '/van-chuyen'
				break
			case NotificationType.REPORTABLE_DELIVERY_REQUEST.toString():
				break
			case NotificationType.DONATED_REQUEST.toString():
				// url = '/quyen-gop/chi-tiet/' + notification.dataId
				break
			case NotificationType.AID_REQUEST.toString():
				url = '/lich-su-yeu-cau-ho-tro?yeu_cau_ho_tro=' + notification.dataId
				break
			case NotificationType.ACTIVITY.toString():
				// url = '/danh-sach-hoat-dong/hoat-dong/' + notification.dataId
				break
			case NotificationType.STOCK.toString():
				break
			case NotificationType.SCHEDULED_ROUTE.toString():
				// url = '/van-chuyen/tuyen-duong/chi-tiet/' + notification.dataId
				break
			default:
				break
		}

		return url
	}

	const NotificationBody = (newNoti: NotificationModel) => {
		// const url = getUrl(newNoti)

		return (
			<Box

			// onClick={() => {
			// 	if (!!url) router.push(url)
			// }}
			>
				<Typography fontWeight={500}>{newNoti.content}</Typography>
			</Box>
		)
	}

	const handleGetNewNotification = (newNoti: NotificationModel) => {
		const list = [newNoti, ...notifications]
		setNotificaitons(list)
		setMessgaeUnseenCount(messgaeUnseenCount + 1)
		toast.info(NotificationBody(newNoti), {
			autoClose: 1000 * 30,
			position: 'top-right',
			closeOnClick: true,
			onClick() {
				handleNotificationClick(newNoti)
			},
		})
	}

	return (
		<Fragment>
			<IconButton
				color='inherit'
				aria-haspopup='true'
				onClick={handleDropdownOpen}
				aria-controls='customized-menu'
			>
				<Badge badgeContent={messgaeUnseenCount} color='success'>
					<BellOutline />
				</Badge>
			</IconButton>

			<Menu
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={handleDropdownClose}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
				transformOrigin={{ vertical: 'top', horizontal: 'right' }}
			>
				<MenuItem disableRipple>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							width: '100%'
						}}
					>
						<Typography sx={{ fontWeight: 600 }}>Thông báo</Typography>
						<Chip
							size='small'
							label={messgaeUnseenCount}
							color='primary'
							sx={{ height: 20, fontSize: '0.75rem', fontWeight: 500, borderRadius: '10px' }}
						/>
					</Box>
				</MenuItem>
				<PerfectScrollbar
					options={{ suppressScrollX: true, wheelPropagation: false }}
					{...(!isLoading && numOfNotification <= notifications.length
						? {
								onYReachEnd: () => {
									if (isLoading || numOfNotification > notifications.length) return
									setIsLoading(true)

									const num = numOfNotification + 5

									setNumOfNotification(num)
								}
						  }
						: null)}
				>
					{notifications?.map((item, index) => {
						let messageTime = ''

						const a = moment()
						const b = moment(item.createdDate)

						const diff = a.diff(b, 'days')

						if (diff === 0) {
							messageTime = 'Hôm nay'
						} else if (diff === 1) {
							messageTime = `1 ngày trước`
						} else if (diff > 1 && diff < 7) {
							messageTime = `${diff} ngày trước`
						} else {
							messageTime = formateDateDDMMYYYY(item.createdDate || '')
						}

						return (
							<MenuItem
								key={index}
								onClick={() => {
									handleNotificationClick(item)
								}}
							>
								<Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
									<Avatar alt='Notification' src={item.image} />
									<Box
										sx={{
											mx: 4,
											flex: '1 1',
											display: 'flex',
											overflow: 'hidden',
											flexDirection: 'column'
										}}
									>
										<MenuItemTitle color={item.status === 'NEW' ? 'black' : '#b7b7b7'}>
											{item.name}
										</MenuItemTitle>
										<MenuItemSubtitle variant='body2'>{item.content}</MenuItemSubtitle>
									</Box>
									<Typography variant='caption' sx={{ color: 'text.disabled' }}>
										{messageTime}
									</Typography>
								</Box>
							</MenuItem>
						)
					})}
					{isLoading && (
						<MenuItem
							sx={{
								display: 'flex',
								justifyContent: 'center'
							}}
						>
							<Skeleton variant='rectangular' height={40} />
						</MenuItem>
					)}
				</PerfectScrollbar>
				<MenuItem
					disableRipple
					sx={{
						py: 3.5,
						borderBottom: 0,
						borderTop: (theme) => `1px solid ${theme.palette.divider}`
					}}
				>
					<NotificationDialog
						handleNotificationClick={handleNotificationClick}
						readNotifications={readNotifications}
					/>
				</MenuItem>
			</Menu>
		</Fragment>
	)
}

export default NotificationDropdown
