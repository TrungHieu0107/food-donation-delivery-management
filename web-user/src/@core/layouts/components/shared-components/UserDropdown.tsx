// ** React Imports
import { useState, SyntheticEvent, Fragment } from 'react'

// ** MUI Imports
import {
	Box,
	Menu,
	Badge,
	Avatar,
	Divider,
	MenuItem,
	Typography,
	Backdrop,
	CircularProgress
} from '@mui/material'
import { SxProps, Theme, styled, useTheme } from '@mui/material/styles'

// ** Icons Imports
import { LogoutVariant, AccountOutline } from 'mdi-material-ui'
import HistoryIcon from '@mui/icons-material/History'

// ** Next Auth Imports
import { signOut, useSession } from 'next-auth/react'

// ** Router Imports
import { useRouter } from 'next/router'

// ** API Client Imports
import { Authentation } from 'src/api-client/authentication'

// ** Model Imports
import { UserModel } from 'src/models/User'

// ** Key Imports
import { KEY, Role } from 'src/common/Keys'

// ** Component Imports
import ConfirmChangeDeliveryStatus from './ConfirmChangeCollaboratorStatus'
import UpdatePasswordDialog from 'src/layouts/components/views/profile/UpdatePasswordDialog'
import LinkEmailDialog from 'src/layouts/components/views/profile/LinkEmailDialog'

// ** Styled Components
const BadgeContentSpan = styled('span')(({ theme }) => ({
	width: 8,
	height: 8,
	borderRadius: '50%',
	backgroundColor: theme.palette.success.main,
	boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
}))

const UserDropdown = ({ userLogin }: { userLogin: UserModel }) => {
	// ** States
	const [anchorEl, setAnchorEl] = useState<Element | null>(null)
	const [loading, setLoading] = useState<boolean>(false)
	const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false)

	const { data: session } = useSession()
	const router = useRouter()

	const handleDropdownOpen = (event: SyntheticEvent) => {
		setAnchorEl(event.currentTarget)
	}

	const handleDropdownClose = (url?: string) => {
		switch (url) {
			case '/thong-tin-ca-nhan':
				router.push(url)
				break
			case 'dang-nhap':
				if (session?.user.role === KEY.ROLE.CONTRIBUTOR) {
					url = '/tinh-nguyen-vien/dang-nhap'
				} else if (session?.user.role === KEY.ROLE.CHARITY) {
					url = '/to-chuc-tu-thien/dang-nhap'
				}
				setLoading(true)
				Authentation.logout()
					.then(() => {
						setLoading(false)
					})
					.catch((error) => {
						console.error(error)
					})
					.finally(() => {
						console.log('dhaskdh', url)

						setLoading(false)

						signOut({
							redirect: true,
							callbackUrl: url
						})
					})
				break

			case 'delivery-request':
				setConfirmDialogOpen(true)
				break
			case 'create-new-charity-unit':
				router.push('/tao-chi-nhanh-moi')
				break
			case 'history-donated':
				router.push('/lich-su-quyen-gop')
				break
			case 'history-aid-request':
				router.push('/lich-su-yeu-cau-ho-tro')
				break

			default:
				break
		}
		setAnchorEl(null)
	}

	const theme = useTheme()

	const styles = {
		py: 2,
		px: 4,
		width: '100%',
		display: 'flex',
		alignItems: 'center',
		color: 'text.primary',
		textDecoration: 'none',
		'& svg': {
			fontSize: '1.375rem',
			color: theme.palette.secondary[theme.palette.mode]
		} as SxProps
	} as SxProps

	const getBackgroundColor = (theme: Theme) => {
		return theme.palette.success[theme.palette.mode]
	}

	return (
		<Fragment>
			<Badge
				overlap='circular'
				onClick={handleDropdownOpen}
				sx={{ ml: 2, cursor: 'pointer' }}
				badgeContent={
					<BadgeContentSpan
						sx={{
							backgroundColor: (theme) => {
								return getBackgroundColor(theme)
							}
						}}
					/>
				}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
			>
				<Avatar
					alt={userLogin?.name || '_'}
					onClick={handleDropdownOpen}
					sx={{ width: 40, height: 40 }}
					src={userLogin?.avatar || '/images/avatars/1.png'}
				/>
			</Badge>
			<Menu
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={() => handleDropdownClose()}
				sx={{ '& .MuiMenu-paper': { width: 'auto', marginTop: 4 } }}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
				transformOrigin={{ vertical: 'top', horizontal: 'right' }}
			>
				<Box sx={{ pt: 2, pb: 3, px: 4 }}>
					<Box sx={{ display: 'flex', alignItems: 'center' }}>
						<Badge
							overlap='circular'
							badgeContent={
								<BadgeContentSpan
									sx={{
										backgroundColor: (theme) => {
											return getBackgroundColor(theme)
										}
									}}
								/>
							}
							anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
						>
							<Avatar
								alt={userLogin?.name}
								src={userLogin?.avatar || '/images/avatars/1.png'}
								sx={{ width: '2.5rem', height: '2.5rem' }}
							/>
						</Badge>
						<Box
							sx={{
								display: 'flex',
								marginLeft: 3,
								alignItems: 'flex-start',
								flexDirection: 'column'
							}}
						>
							<Typography sx={{ fontWeight: 600 }}>{userLogin?.name}</Typography>
							<Typography variant='body2' sx={{ fontSize: '0.8rem', color: 'text.disabled' }}>
								{Role[session?.user.role ?? '']}
							</Typography>
						</Box>
					</Box>
				</Box>
				<Divider sx={{ mt: 0, mb: 1 }} />
				<MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose('/thong-tin-ca-nhan')}>
					<Box sx={styles}>
						<AccountOutline sx={{ marginRight: 2 }} />
						Thông tin
					</Box>
				</MenuItem>

				{session?.user.role === KEY.ROLE.CHARITY &&
					userLogin.isHeadquarter && [
						<MenuItem
							key={2}
							sx={{ p: 0 }}
							onClick={() => handleDropdownClose('create-new-charity-unit')}
						>
							<Box sx={styles}>
								<AccountOutline sx={{ marginRight: 2 }} />
								Tạo chi nhánh mới
							</Box>
						</MenuItem>
					]}

				{session?.user.role === KEY.ROLE.CHARITY && (
					<MenuItem
						key={1}
						sx={{ p: 0 }}
						onClick={() => handleDropdownClose('history-aid-request')}
					>
						<Box sx={styles}>
							<HistoryIcon
								sx={{
									marginRight: 2
								}}
							/>
							Lịch sử yêu cầu hỗ trợ
						</Box>
					</MenuItem>
				)}
				{session?.user.role === KEY.ROLE.CONTRIBUTOR && [
					<LinkEmailDialog key={2} styles={styles} />,
					<MenuItem key={1} sx={{ p: 0 }} onClick={() => handleDropdownClose('history-donated')}>
						<Box sx={styles}>
							<HistoryIcon
								sx={{
									marginRight: 2
								}}
							/>
							Lịch sử quyên góp
						</Box>
					</MenuItem>
				]}
				<UpdatePasswordDialog styles={styles} />
				<Divider />
				<MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose('dang-nhap')}>
					<Box sx={styles}>
						<LogoutVariant sx={{ marginRight: 2 }} />
						Đăng xuất
					</Box>
				</MenuItem>
			</Menu>
			<Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
				<CircularProgress color='inherit' />
			</Backdrop>
			<ConfirmChangeDeliveryStatus
				status={userLogin.collaboratorStatus ?? ''}
				dialogOpen={confirmDialogOpen}
				onClose={function (): void {
					setConfirmDialogOpen(false)
				}}
			/>
		</Fragment>
	)
}

export default UserDropdown
