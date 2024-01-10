// ** React Imports
import { Fragment, SyntheticEvent, useState } from 'react'

// ** MUI Imports
import Avatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

// ** Icons Imports
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import LogoutVariant from 'mdi-material-ui/LogoutVariant'
import { useRouter } from 'next/router'
import useSession from 'src/@core/hooks/useSession'
import { Authentation } from 'src/api-client/authentication'
import { KEY, Role } from 'src/common/Keys'
import { UserModel } from 'src/models/User'

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
  const { session }: any = useSession()
  const router = useRouter()

  const handleDropdownOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget)
  }
  const handleCloseMenu = () => {
    setAnchorEl(null)
  }
  const handleDropdownClose = (url?: string) => {
    switch (url) {
      case 'thong-tin-ca-nhan':
        router.push('/thiet-lap-tai-khoan')
        break
      case 'dang-nhap':
        if (session?.user.role === KEY.ROLE.SYSTEM_ADMIN || session?.user.role === KEY.ROLE.BRANCH_ADMIN) {
          url = '/quan-tri-vien/dang-nhap'
        }

        setLoading(true)
        Authentation.logout()
          .then(() => {
            setLoading(false)
          })
          .catch(error => {
            console.error(error)
          })
          .then(() => {
            setLoading(false)

            // signOut({
            //   redirect: true,
            //   callbackUrl: url
            // })
            if (typeof window !== 'undefined') {
              localStorage.removeItem('tu_tam_admin')

              //  setSession(userData)
            }
            router.push('/quan-tri-vien/dang-nhap')
          })
        break

      default:
        break
    }

    setAnchorEl(null)
  }

  // const styles = {
  //   py: 2,
  //   px: 4,
  //   width: '100%',
  //   display: 'flex',
  //   alignItems: 'center',
  //   color: 'text.primary',
  //   textDecoration: 'none',
  //   '& svg': {
  //     fontSize: '1.375rem',
  //     color: 'text.secondary'
  //   }
  // }

  return (
    <Fragment>
      <Badge
        overlap='circular'
        onClick={handleDropdownOpen}
        sx={{ ml: 2, cursor: 'pointer' }}
        badgeContent={<BadgeContentSpan />}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Avatar
          alt={userLogin?.name || KEY.DEFAULT_VALUE}
          onClick={handleDropdownOpen}
          sx={{ width: 40, height: 40 }}
          src={userLogin?.avatar || '/images/avatars/1.png'}
        />
      </Badge>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleCloseMenu()}
        sx={{ '& .MuiMenu-paper': { width: 230, marginTop: 4 } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ pt: 2, pb: 3, px: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Badge
              overlap='circular'
              badgeContent={<BadgeContentSpan />}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
              <Avatar
                alt={userLogin?.name}
                src={userLogin?.avatar || '/images/avatars/1.png'}
                sx={{ width: '2.5rem', height: '2.5rem' }}
              />
            </Badge>
            <Box sx={{ display: 'flex', marginLeft: 3, alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 600 }}>{userLogin?.name}</Typography>
              <Typography variant='body2' sx={{ fontSize: '0.8rem', color: 'text.disabled' }}>
                {Role[session?.user.role ?? '']}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ mt: 0, mb: 1 }} />
        {/* <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
          <Box sx={styles}>
            <EmailOutline sx={{ marginRight: 2 }} />
            Inbox
          </Box>
        </MenuItem>
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
          <Box sx={styles}>
            <MessageOutline sx={{ marginRight: 2 }} />
            Chat
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
          <Box sx={styles}>
            <CogOutline sx={{ marginRight: 2 }} />
            Settings
          </Box>
        </MenuItem>
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
          <Box sx={styles}>
            <CurrencyUsd sx={{ marginRight: 2 }} />
            Pricing
          </Box>
        </MenuItem>
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose()}>
          <Box sx={styles}>
            <HelpCircleOutline sx={{ marginRight: 2 }} />
            FAQ
          </Box>
        </MenuItem> */}
        {/* <Divider /> */}
        <MenuItem sx={{ py: 2 }} onClick={() => handleDropdownClose('dang-nhap')}>
          <LogoutVariant sx={{ marginRight: 2, fontSize: '1.375rem', color: 'text.secondary' }} />
          Đăng xuất
        </MenuItem>
      </Menu>
      <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </Fragment>
  )
}

export default UserDropdown
