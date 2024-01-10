'use client'

import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Card } from '@mui/material'
import MuiTab, { TabProps } from '@mui/material/Tab'
import { styled } from '@mui/material/styles'
import { useRouter } from 'next/router'
import { SyntheticEvent, useEffect, useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import useSession from 'src/@core/hooks/useSession'
import axiosClient from 'src/api-client/ApiClient'
import { KEY } from 'src/common/Keys'
import UserLayout from 'src/layouts/UserLayout'
import ActivityGeneralInformation from './GeneralTab'
import ActivityPhases from './PhaseTab'
import ActivityRoles from './RoleTab'
import ActivityTask from './TaskTab'

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
const UpdateActivity = () => {
  const router = useRouter()
  const { slug } = router.query
  const { session }: any = useSession()
  const [value, setValue] = useState<string>('general')
  const [show, setIsShow] = useState<any>(false)
  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosClient.get(`/activities/${slug}`)      
        setIsShow(res?.data?.isJoined ? true : false)
      } catch (error) {
        console.log(error)
      }
    }
    if (slug) {
      fetchData()
    }
  }, [slug])

  return (
    <Card>
      {/* {session?.user.role === 'BRANCH_ADMIN' && ( */}
        <TabContext value={value}>
          <TabList
            onChange={handleChange}
            aria-label='account-settings tabs'
            sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
          >
            <Tab
              value='general'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TabName>Thông tin chung</TabName>
                </Box>
              }
            />

        {((show && session?.user.role === 'BRANCH_ADMIN') || session?.user.role === 'SYSTEM_ADMIN') &&   
         <Tab
              value='role'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TabName>Vai trò</TabName>
                </Box>
              }
            />
          }
           {/* {(session?.user.role === 'BRANCH_ADMIN' && show) && (
              <Tab
                value='members'
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TabName>Thành viên</TabName>
                  </Box>
                }
              />
            )} */}
          {((show && session?.user.role === 'BRANCH_ADMIN') || session?.user.role === 'SYSTEM_ADMIN') &&   
             <Tab
              value='phase'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TabName>Giai đoạn</TabName>
                </Box>
              }
            />}
         {((show && session?.user.role === 'BRANCH_ADMIN') || session?.user.role === 'SYSTEM_ADMIN') &&   
            <Tab
              value='task'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TabName>Công việc</TabName>
                </Box>
              }
            />}
          </TabList>

         <TabPanel sx={{ p: 0 }} value='general'><ActivityGeneralInformation /></TabPanel>
         {((show && session?.user.role === 'BRANCH_ADMIN') || session?.user.role === 'SYSTEM_ADMIN') &&   
           <TabPanel sx={{ p: 0 }} value='role'> <ActivityRoles/> </TabPanel>}
              {/* {(show && session?.user.role === 'BRANCH_ADMIN') &&   
           <TabPanel sx={{ p: 0 }} value='members'> <MembersTab isJoined = {session?.user.role === 'SYSTEM_ADMIN' ? true: show}/>{' '} </TabPanel>} */}
        {((show && session?.user.role === 'BRANCH_ADMIN') || session?.user.role === 'SYSTEM_ADMIN') &&   
          <TabPanel sx={{ p: 0 }} value='phase'> <ActivityPhases/> </TabPanel>}
        {((show && session?.user.role === 'BRANCH_ADMIN') || session?.user.role === 'SYSTEM_ADMIN') &&   
          <TabPanel sx={{ p: 0 }} value='task'> <ActivityTask/> </TabPanel>
            }
        </TabContext>
       {/* )} */}

      {/* {session?.user.role === 'SYSTEM_ADMIN' && <ActivityGeneralInformation />} */}
    </Card>
  )
}

export default UpdateActivity
UpdateActivity.auth = {
  role: [KEY.ROLE.BRANCH_ADMIN, KEY.ROLE.SYSTEM_ADMIN]
}
UpdateActivity.getLayout = (page: React.ReactNode) => (
  <UserLayout pageTile='Cập nhật thông tin hoạt động'>{page}</UserLayout>
)
