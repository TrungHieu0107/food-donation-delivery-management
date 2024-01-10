'use client'

import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Card, CircularProgress, Stack, Typography, styled } from '@mui/material'
import MuiTab, { TabProps } from '@mui/material/Tab'
import { useRouter } from 'next/router'
import { SyntheticEvent, useEffect, useState } from 'react'
import axiosClient from 'src/api-client/ApiClient'
import { KEY } from 'src/common/Keys'
import BranchJoinTab from './BranchJoinTab'
import GeneralInformationActivity from './GeneralTab'
import ItemTargetTab from './ItemTargetTab'
import MembersTab from './MemberTab'
import PhaseTab from './PhaseTab'
import useSession from 'src/@core/hooks/useSession'
import HistoryStock from './HistoryStock'
import ListFeedBack from './ListFeedBack'
import UserLayout from 'src/layouts/UserLayout'

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
}))

const DetailActivity = () => {
  const router = useRouter()
  const { slug } = router.query
  const [data, setData] = useState<any>(null)
  const [location, setLocation] = useState<any>(null)
  const { session }: any = useSession()
  const [dataType, setDataType] = useState<any>([])
  const [value, setValue] = useState<string>('general')
  const [show, setIsShow] = useState<any>(false)
  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosClient.get(`/activities/${slug}`)
        const responseTypes = await axiosClient.get('/activity-types')
        console.log('Data chi tiết: ', res, responseTypes)
        setDataType(responseTypes.data || [])
        setIsShow(res?.data?.isJoined ? true : false)
        if (res.data.location) {
          const locationGetFromAPI = res.data.location.split(',')
          setLocation([locationGetFromAPI[0], locationGetFromAPI[1]])
        } else {
          setLocation(null)
        }
        setData(res.data || [])
      } catch (error) {
        console.log(error)
        setData([])
      }
    }
    if (slug) fetchData()
  }, [slug])

  if (data) {
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

            {(session?.user.role === 'SYSTEM_ADMIN' || (session?.user.role === 'BRANCH_ADMIN' && show)) && (
              <Tab
                value='members'
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TabName>Thành viên</TabName>
                  </Box>
                }
              />
            )}
            <Tab
              value='phases'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TabName>Giai đoạn</TabName>
                </Box>
              }
            />
            <Tab
              value='branches'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TabName>Chi nhánh</TabName>
                </Box>
              }
            />
            <Tab
              value='items'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TabName>Vật phẩm</TabName>
                </Box>
              }
            />
              <Tab
              value='history'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TabName>Sao kê</TabName>
                </Box>
              }
            />
            {session?.user.role === 'SYSTEM_ADMIN' && 
             <Tab
              value='feedback'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TabName>Phản hồi</TabName>
                </Box>
              }
            />
          }
          </TabList>

          <TabPanel sx={{ p: 0 }} value='general'>
            <GeneralInformationActivity data={data} location={location} dataType={dataType} />
          </TabPanel>
          {((show && session?.user.role === 'BRANCH_ADMIN') || session?.user.role === 'SYSTEM_ADMIN') && (
            <TabPanel sx={{ p: 0 }} value='members'>
              {' '}
              <MembersTab isJoined = {show}/>{' '}
            </TabPanel>
          )}
          <TabPanel sx={{ p: 0 }} value='phases'>
            <PhaseTab />{' '}
          </TabPanel>
          <TabPanel sx={{ p: 0 }} value='branches'>
            {' '}
            <BranchJoinTab data={data} />{' '}
          </TabPanel>
          <TabPanel sx={{ p: 0 }} value='items'>
            <ItemTargetTab data={data} />{' '}
          </TabPanel>
          <TabPanel sx={{ p: 0 }} value='history'>
            <HistoryStock />{' '}
          </TabPanel>
          <TabPanel sx={{ p: 0 }} value='feedback'>
            <ListFeedBack />{' '}
          </TabPanel>
        </TabContext>
        {/* )} */}

        {/* {session?.user.role === 'SYSTEM_ADMIN' && <ActivityGeneralInformation />} */}
      </Card>
    )
  } else {
    return (
      <Stack
        sx={{ height: '50vh', width:"100%" }}
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


export default DetailActivity

DetailActivity.auth = {
  role: [KEY.ROLE.BRANCH_ADMIN, KEY.ROLE.SYSTEM_ADMIN]
}
DetailActivity.getLayout = (page: React.ReactNode) => (
  <UserLayout pageTile='Chi tiết thông tin hoạt động'>{page}</UserLayout>
)
