'use client'

import { SyntheticEvent, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import MuiTab, { TabProps } from '@mui/material/Tab'

// ** Icons Imports
import AccountOutline from 'mdi-material-ui/AccountOutline'
import LockOpenOutline from 'mdi-material-ui/LockOpenOutline'

//import InformationOutline from 'mdi-material-ui/InformationOutline'
// ** Demo Tabs Imports
//import TabInfo from 'src/views/account-settings/TabInfo'
// import TabAccount from 'src/views/account-settings/TabAccount'
// import TabSecurity from 'src/views/account-settings/TabSecurity'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'
import axiosClient from 'src/api-client/ApiClient'
import AccountInformation from './AccountInformation'
import useSession from 'src/@core/hooks/useSession'
import ChangePassword from './ChangePassword'
import { KEY } from 'src/common/Keys'
import UserLayout from 'src/layouts/UserLayout'
import { CircularProgress, Stack, Typography } from '@mui/material'

const Tab = styled(MuiTab)<TabProps>(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    minWidth: 100
  },
  [theme.breakpoints.down('sm')]: {
    minWidth: 67
  }
}))

const TabName = styled('span')(({ theme }) => ({
  lineHeight: 1.71,
  fontSize: '0.875rem',
  marginLeft: theme.spacing(2.4),

  // [theme.breakpoints.down('md')]: {
  //   display: 'none'
  // }
}))

const AccountSettings = () => {
  const { session }: any = useSession()
  const [value, setValue] = useState<string>(session?.user.role === 'BRANCH_ADMIN' ? 'account' : 'security')
  const [data, setData] = useState<any>()
  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res: any = await axiosClient.get('/users/profile')  
        console.log(res.data)
        setData(res.data)
      } catch (error) {
        console.log(error)
      }
    }
    if (session?.user.role === 'BRANCH_ADMIN') {     
      fetchData()
    } else {
      setData([])
    }
  }, [session])

  if (data) {
    return (
      <Card>
        <TabContext value={value}>
          <TabList
            onChange={handleChange}
            aria-label='account-settings tabs'
            sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
          >
            {session?.user.role !== 'SYSTEM_ADMIN' && (
              <Tab
                value='account'
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccountOutline />
                    <TabName>Thông tin tài khoản</TabName>
                  </Box>
                }
              />
            )}
            <Tab
              value='security'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LockOpenOutline />
                  <TabName>Đổi mật khẩu</TabName>
                </Box>
              }
            />
            {/* <Tab
              value='info'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <InformationOutline />
                  <TabName>Info</TabName>
                </Box>
              }
            /> */}
          </TabList>

          {session?.user.role !== 'SYSTEM_ADMIN' && (
            <TabPanel sx={{ p: 0 }} value='account'>
              <AccountInformation data={data} />
            </TabPanel>
          )}
          <TabPanel sx={{ p: 0 }} value='security'>
            <ChangePassword />
          </TabPanel>
          {/* <TabPanel sx={{ p: 0 }} value='info'>
            <TabInfo />
          </TabPanel> */}
        </TabContext>
      </Card>
    )
  } else {
    return (
      <Stack
      sx={{ height: '50vh',  width:"100%" }}
      direction={'column'}
      justifyContent={'center'}
      alignItems={'center'}
    >
      <CircularProgress color='info' />
      <Typography>Đang tải dữ liệu...</Typography>
    </Stack>
    )
  }
}

export default AccountSettings
AccountSettings.auth = {
  role: [KEY.ROLE.BRANCH_ADMIN, KEY.ROLE.SYSTEM_ADMIN]
}
AccountSettings.getLayout = (page: React.ReactNode) => (
  <UserLayout pageTile='Cập nhật thông tin tài khoản'>{page}</UserLayout>
)