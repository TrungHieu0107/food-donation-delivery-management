// ** MUI Imports
import Box from '@mui/material/Box'
import { Theme } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import useMediaQuery from '@mui/material/useMediaQuery'

// import InputAdornment from '@mui/material/InputAdornment'
// import TextField from '@mui/material/TextField'
// ** Icons Imports
import Menu from 'mdi-material-ui/Menu'

// import Magnify from 'mdi-material-ui/Magnify'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'

// ** Components
import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler'
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'
import NotificationDropdown from 'src/@core/layouts/components/shared-components/NotificationDropdown'
import { UserModel } from 'src/models/User'
import { useEffect, useState } from 'react'
import useSession from 'src/@core/hooks/useSession'
import { UserAPI } from 'src/api-client/User'
import { CommonRepsonseModel } from 'src/models/common/CommonResponseModel'
import { Typography } from '@mui/material'

interface Props {
  hidden: boolean
  settings: Settings
  toggleNavVisibility: () => void
  saveSettings: (values: Settings) => void
  pageTitle?: string
}

const AppBarContent = (props: Props) => {
  // ** Props
  const { hidden, settings, saveSettings, toggleNavVisibility } = props

  // ** Hook
  const hiddenSm = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

  const { session }: any = useSession()
  const [userLogin, setUserLogin] = useState<UserModel>()

  useEffect(() => {
    if (session?.user) {
      fetchDataUserLogin()
    }
  }, [session])

  const fetchDataUserLogin = async () => {
    try {
      console.log("getprofile");
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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
      }}
    >
      <Box className='actions-left' sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
        {hidden ? (
          <IconButton
            color='inherit'
            onClick={toggleNavVisibility}
            sx={{ ml: -2.75, ...(hiddenSm ? {} : { mr: 3.5 }) }}
          >
            <Menu />
          </IconButton>
        ) : null}
        <Typography
          id='page-title'
          variant='h5'
          fontWeight={600}
          sx={{
            whiteSpace: 'nowrap',
            paddingLeft: hidden ? 'none' :'70px'
          }}
        >
          {props.pageTitle}
        </Typography>
        {/* <TextField
          size='small'
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <Magnify fontSize='small' />
              </InputAdornment>
            )
          }}
        /> */}
      </Box>
      <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center' }}>
        {/* {hiddenSm ? null : (
          <Box
            component='a'
            target='_blank'
            rel='noreferrer'
            sx={{ mr: 4, display: 'flex' }}
            href='https://github.com/themeselection/materio-mui-react-nextjs-admin-template-free'
          >
            <img
              height={24}
              alt='github stars'
              src='https://img.shields.io/github/stars/themeselection/materio-mui-react-nextjs-admin-template-free?style=social'
            />
          </Box>
        )} */}
        <ModeToggler settings={settings} saveSettings={saveSettings} />
        {userLogin && (
          <>
            <NotificationDropdown userLogin={userLogin} />
            <UserDropdown userLogin={userLogin} />
          </>
        )}
      </Box>
    </Box>
  )
}

export default AppBarContent
