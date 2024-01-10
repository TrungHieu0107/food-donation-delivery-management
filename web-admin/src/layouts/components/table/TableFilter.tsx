import React, { useState } from 'react'
import IconButton from '@mui/material/IconButton'
import SortIcon from '@mui/icons-material/Sort'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'

export default function FilterComponet({ type, filterObject, setFilterObject }: any) {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClickFilter = (event: any) => {
    setAnchorEl(event.currentTarget)
    console.log(event.currentTarget.value)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleFilterStatus = (s: string) => {
    console.log(s)
    let statusNumber
    if (s === 'NOT_STARTED') statusNumber = 0
    if (s === 'STARTED') statusNumber = 1
    if (s === 'ENDED') statusNumber = 2
    if (s === 'INACTIVE') statusNumber = 3

    setFilterObject({
      ...filterObject,
      status: statusNumber
    })
    setAnchorEl(null)
  }
  const handleFilterScope = (s: string) => {
    console.log(s)
    let scopeNumber
    if (s === 'PUBLIC') scopeNumber = 0
    if (s === 'INTERNAL') scopeNumber = 1

    setFilterObject({
      ...filterObject,
      scope: scopeNumber
    })
    setAnchorEl(null)
  }

  return (
    <div className='styleFilter'>
      <IconButton
        aria-label='more'
        id='long-button'
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup='true'
        onClick={handleClickFilter}
        sx={{ color: 'white', marginLeft: '-4px', marginTop: '-2px' }}
      >
        <SortIcon />
      </IconButton>
      <Menu
        id='long-menu'
        MenuListProps={{
          'aria-labelledby': 'long-button'
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: 50 * 6.5,
            width: '15ch'
          }
        }}
      >
        {type === 'STATUS' ? (
          <Box>
            <MenuItem onClick={() => handleFilterStatus('NOT_STARTED')} divider>
              <Typography
                sx={{
                  color: '#141e26',
                  fontWeight: 'bold',
                  fontStyle: 'italic',
                  fontSize: '13px'
                }}

                // NOT_STARTED(0), STARTED(1), ENDED(2), INACTIVE(3)
              >
                Chưa bắt đầu
              </Typography>
            </MenuItem>
            <MenuItem onClick={() => handleFilterStatus('STARTED')} divider>
              <Typography
                sx={{
                  color: '#141e26',
                  fontWeight: 'bold',
                  fontStyle: 'italic',
                  fontSize: '13px'
                }}

                // NOT_STARTED(0), STARTED(1), ENDED(2), INACTIVE(3)
              >
                Đang hoạt động
              </Typography>
            </MenuItem>
            <MenuItem onClick={() => handleFilterStatus('ENDED')} divider>
              <Typography
                sx={{
                  color: '#141e26',
                  fontWeight: 'bold',
                  fontStyle: 'italic',
                  fontSize: '13px'
                }}

                // NOT_STARTED(0), STARTED(1), ENDED(2), INACTIVE(3)
              >
                Đã kết thúc
              </Typography>
            </MenuItem>
            <MenuItem onClick={() => handleFilterStatus('INACTIVE')}>
              <Typography
                sx={{
                  color: '#141e26',
                  fontWeight: 'bold',
                  fontStyle: 'italic',
                  fontSize: '13px'
                }}

                // NOT_STARTED(0), STARTED(1), ENDED(2), INACTIVE(3)
              >
                Ngưng hoạt động
              </Typography>
            </MenuItem>
          </Box>
        ) : (
          <Box>
            <MenuItem onClick={() => handleFilterScope('PUBLIC')}>
              <Typography
                sx={{
                  color: '#141e26',
                  fontWeight: 'bold',
                  fontStyle: 'italic',
                  fontSize: '13px'
                }}

                // NOT_STARTED(0), STARTED(1), ENDED(2), INACTIVE(3)
              >
                Cộng đồng
              </Typography>
            </MenuItem>
            <Divider/>
            <MenuItem onClick={() => handleFilterScope('INTERNAL')}>
              <Typography
                sx={{
                  color: '#141e26',
                  fontWeight: 'bold',
                  fontStyle: 'italic',
                  fontSize: '13px'
                }}

                // NOT_STARTED(0), STARTED(1), ENDED(2), INACTIVE(3)
              >
                Nội bộ
              </Typography>
            </MenuItem>
          </Box>
        )}
      </Menu>
    </div>
  )
}
