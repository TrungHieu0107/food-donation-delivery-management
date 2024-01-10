'use client'

import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Card, styled } from '@mui/material'
import MuiTab, { TabProps } from '@mui/material/Tab'
import { SyntheticEvent, useState } from 'react'
import { KEY } from 'src/common/Keys'
import UserLayout from 'src/layouts/UserLayout'
import DirectDonateAtStock from './ImportItemFormUser'
import DirectImportItem from './ImportItemDirect'


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

const ImportStock = () => {
  const [value, setValue] = useState<string>('DirectImportForUser')
  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }


    return (
      <Card>
        <TabContext value={value}>
          <TabList
            onChange={handleChange}
            aria-label='account-settings tabs'
            sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
          >
            <Tab
              value='DirectImportForUser'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TabName>Nhập kho với người quyên góp</TabName>
                </Box>
              }
            />
              <Tab
                value='DirectImportForItem'
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TabName>Nhập vật phẩm</TabName>
                  </Box>
                }
              />


          </TabList>
          <TabPanel sx={{ p: 0 }} value='DirectImportForUser'>
           <DirectDonateAtStock/>
          </TabPanel>
          <TabPanel sx={{ p: 0 }} value='DirectImportForItem'>
           <DirectImportItem/>
          </TabPanel>
        </TabContext>
      </Card>
    )
}

export default ImportStock

ImportStock.auth = {
  role: [KEY.ROLE.BRANCH_ADMIN]
}
ImportStock.getLayout = (page: React.ReactNode) => (
  <UserLayout pageTile='Nhập vật phẩm vào kho'>{page}</UserLayout>
)
