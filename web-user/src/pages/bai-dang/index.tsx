'use client'

import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box } from '@mui/material'
import MuiTab, { TabProps } from '@mui/material/Tab'
import { styled } from '@mui/material/styles'
import { useSession } from 'next-auth/react'
import { SyntheticEvent, useState } from 'react'
import PrivatePost from './PrivatePost'
import PublicPost from './PublicPost'

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
  fontSize: '16px',
  fontWeight: 700,
  marginLeft: theme.spacing(2.4),

  // [theme.breakpoints.down('md')]: {
  //   display: 'none'
  // }
}))
const ListPost = () => {
  const [value, setValue] = useState<string>('public')
  const { data: session } = useSession()
  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

    return (
      <Box >     
        <TabContext value={value}>
          <TabList
            onChange={handleChange}
            aria-label='account-settings tabs'
            sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}`, 
            "& .MuiTabs-flexContainer": {         
              justifyContent: 'center'
            } }}
            
          >
            <Tab
              value='public'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TabName>Cộng đồng</TabName>
                </Box>
              }
            />
           {session?.user.role === "CHARITY" && 
            <Tab
              value='private'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TabName>Cá nhân</TabName>
                </Box>
              }
            />}
          </TabList>

         <TabPanel sx={{ p: 0 }} value='public'><PublicPost/> </TabPanel>
         {session?.user.role === "CHARITY" &&   <TabPanel sx={{ p: 0 }} value='private'><PrivatePost/></TabPanel>}

        </TabContext>   
      
      </Box>
    )
}

export default ListPost

