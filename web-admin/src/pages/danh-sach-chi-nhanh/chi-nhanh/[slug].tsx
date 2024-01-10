import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Card, CardContent } from '@mui/material'
import MuiTab, { TabProps } from '@mui/material/Tab'
import { styled } from '@mui/material/styles'
import { SyntheticEvent, useState } from 'react'
import { KEY } from 'src/common/Keys'
import BranchHistoryStock from './BranchHistoryStock'
import DetailBranchTab from './GeneralTab'
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
const DetailBranch = () => {
  const [value, setValue] = useState<string>('general')
  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

    return (
      <Card>
        <CardContent>
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

            <Tab
              value='history'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TabName>Lịch sử xuất/nhập kho</TabName>
                </Box>
              }
            />
          </TabList>

         <TabPanel sx={{ p: 0 }} value='general'><DetailBranchTab/></TabPanel>
          <TabPanel sx={{ p: 0 }} value='history'><BranchHistoryStock/> </TabPanel>

        </TabContext>   
        </CardContent>
      </Card>
    )
}

export default DetailBranch

DetailBranch.auth = {
  role: [KEY.ROLE.SYSTEM_ADMIN, KEY.ROLE.BRANCH_ADMIN]
}
DetailBranch.getLayout = (page: React.ReactNode) => (
  <UserLayout pageTile='Thông tin chi tiết chi nhánh hệ thống'>{page}</UserLayout>
)
