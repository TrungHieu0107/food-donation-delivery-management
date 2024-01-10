// ** MUI Imports
import Box from '@mui/material/Box'
import { Theme } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Icons Imports
import Menu from 'mdi-material-ui/Menu'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'

// ** Components
import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler'
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'
import NotificationDropdown from 'src/@core/layouts/components/shared-components/NotificationDropdown'
import HorizontalNavItems from 'src/@core/layouts/components/horizontal/navigation/HorizontalNavItems'
import List from '@mui/material/List'
import { useEffect, useState } from 'react'
import horizontal from 'src/navigation/horizontal'
import HorizontalNavHeader from 'src/@core/layouts/components/horizontal/navigation/HorizontalNavHeader'
import { useSession } from 'next-auth/react'
import { Button } from '@mui/material'
import { useRouter } from 'next/router'
import { CommonRepsonseModel } from 'src/models/common/CommonResponseModel'
import { UserModel } from 'src/models/User'
import { UserAPI } from 'src/api-client/User'

interface Props {
	hidden: boolean
	settings: Settings
	toggleNavVisibility: () => void
	saveSettings: (values: Settings) => void
}

const AppBarContent = (props: Props) => {
	// ** Props
	const { hidden, settings, saveSettings, toggleNavVisibility } = props

	// ** Hook
	const hiddenSm = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

	const [groupActive, setGroupActive] = useState<string[]>([])
	const [currentActiveGroup, setCurrentActiveGroup] = useState<string[]>([])
	const [userLogin, setUserLogin] = useState<UserModel>()

	const { status } = useSession()
	const router = useRouter()

	useEffect(() => {
		if (status === 'authenticated') {
			fetchDataUserLogin()
		}
	}, [status])

	const fetchDataUserLogin = async () => {
		try {
			const data = await UserAPI.getProfileLogin()
			const commonDataResponse = new CommonRepsonseModel<UserModel>(data)
			setUserLogin(commonDataResponse.data)
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<Box
			sx={{
				width: '100%',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				position: 'fixed',
				backgroundColor: (theme) => theme.palette.background.paper,
				top: 0,
				left: 0,
				zIndex: 1000,
				boxShadow: '0px 4px 8px -4px rgba(58, 53, 65, 0.42)'
			}}
		>
			<Box className='actions-left' sx={{ mr: 2, display: 'flex', alignItems: 'center', ml: 2.75 }}>
				{hidden ? (
					<>
						<IconButton
							color='inherit'
							onClick={toggleNavVisibility}
							sx={{ ...(hiddenSm ? {} : { mr: 3.5 }) }}
						>
							<Menu />
						</IconButton>
						<HorizontalNavHeader {...props} />
					</>
				) : (
					<HorizontalNavHeader {...props} />
				)}
				{hidden ? null : (
					<>
						<List
							className='nav-items'
							sx={{
								transition: 'padding .25s ease',
								pr: 4.5,
								display: 'flex',
								flexDirection: 'row',
								pt: 0,
								pb: 0,
								justifyContent: 'flex-start',
								width: '100%',
								height: '64px'
							}}
						>
							<HorizontalNavItems
								groupActive={groupActive}
								setGroupActive={setGroupActive}
								currentActiveGroup={currentActiveGroup}
								setCurrentActiveGroup={setCurrentActiveGroup}
								verticalNavItems={horizontal()}
								{...props}
							/>
						</List>
					</>
				)}
			</Box>
			{/* <Box className='actions-center' sx={{ display: 'flex', alignItems: 'center' }}>
				{hidden ? null : (
					<>
						<List
							className='nav-items'
							sx={{
								transition: 'padding .25s ease',
								pr: 4.5,
								display: 'flex',
								flexDirection: 'row',
								pt: 0,
								pb: 0,
								justifyContent: 'flex-start',
								width: '100%',
								height: '64px'
							}}
						>
							<HorizontalNavItems
								groupActive={groupActive}
								setGroupActive={setGroupActive}
								currentActiveGroup={currentActiveGroup}
								setCurrentActiveGroup={setCurrentActiveGroup}
								verticalNavItems={horizontal()}
								{...props}
							/>
						</List>
					</>
				)}
			</Box> */}

			<Box className='actions-right' mr={0} sx={{ display: 'flex', alignItems: 'center' }}>
				{status === 'authenticated' ? (
					<>
						<ModeToggler settings={settings} saveSettings={saveSettings} />

						{userLogin && (
							<>
								<NotificationDropdown userLogin={userLogin} />
								<UserDropdown userLogin={userLogin} />
							</>
						)}
					</>
				) : (
					<>
						<Button
							variant='contained'
							onClick={() => {
								router.push('/tinh-nguyen-vien/dang-nhap')
							}}
							color='info'
							sx={{
								height: 64,
								fontSize: 12,
								textTransform: 'none',

								borderRadius: '0px',
								whiteSpace: 'pre-wrap',
								width: 150
							}}
						>
							{`Đăng nhập\nngười hỗ trợ`}
						</Button>

						<Button
							variant='contained'
							onClick={() => {
								router.push('/to-chuc-tu-thien/dang-nhap')
							}}
							color='success'
							sx={{
								height: 64,
								fontSize: 12,
								textTransform: 'none',

								borderRadius: '0px',
								whiteSpace: 'pre-wrap',
								width: 150

								// ml: 3,
								// mr: 3
							}}
						>
							{`Đăng nhập\ntổ chức từ thiện`}
						</Button>
					</>
				)}
			</Box>
		</Box>
	)
}

export default AppBarContent
