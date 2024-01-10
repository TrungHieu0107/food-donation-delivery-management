import React, { useState } from 'react'
import IconButton from '@mui/material/IconButton'
import SortIcon from '@mui/icons-material/Sort'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'


export default function FilterAidRequests({ filterObject, setFilterObject }: any) {
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
    if (s === 'ALL'){
      setFilterObject({
        ...filterObject,
        status:""
      })
      setAnchorEl(null)

      return;
    }
    let statusNumber
   
    if (s === 'PENDING') statusNumber = 0
    if (s === 'ACCEPTED') statusNumber = 1
    if (s === 'REJECTED') statusNumber = 2
    if (s === 'CANCELED') statusNumber = 3
    if (s === 'EXPIRED') statusNumber = 4
    if (s === 'PROCESSING') statusNumber = 5
    if (s === 'SELF_SHIPPING') statusNumber = 6
    if (s === 'REPORTED') statusNumber = 7
    if (s === 'FINISHED') statusNumber = 8

    setFilterObject({
      ...filterObject,
      status: statusNumber
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
            maxHeight: 50 * 7.5,
            width: '20ch'
          }
        }}
      >
          <Box>
            <MenuItem onClick={() => handleFilterStatus('ALL')} divider>
              <Typography
                sx={{
                  color: '#141e26',
                  fontWeight: 'bold',
                  fontStyle: 'italic',
                  fontSize: '13px'
                }}
              >
                TẤT CẢ
              </Typography>
            </MenuItem>

            <MenuItem onClick={() => handleFilterStatus('PENDING')}  divider>
              <Typography
                sx={{
                  color: '#141e26',
                  fontWeight: 'bold',
                  fontStyle: 'italic',
                  fontSize: '13px'
                }}
              >
                ĐANG ĐỢI XỬ LÝ
              </Typography>
            </MenuItem>
          </Box>
          <MenuItem onClick={() => handleFilterStatus('ACCEPTED')} divider>
              <Typography
                sx={{
                  color: '#141e26',
                  fontWeight: 'bold',
                  fontStyle: 'italic',
                  fontSize: '13px'
                }}
              >
                ĐÃ ĐƯỢC CHẤP NHẬN
              </Typography>
            </MenuItem>
            <MenuItem onClick={() => handleFilterStatus('REJECTED')} divider>
              <Typography
                sx={{
                  color: '#141e26',
                  fontWeight: 'bold',
                  fontStyle: 'italic',
                  fontSize: '13px'
                }}
              >
               ĐÃ BỊ TỪ CHỐI
              </Typography>
            </MenuItem>
            <MenuItem onClick={() => handleFilterStatus('CANCELED')} divider>
              <Typography
                sx={{
                  color: '#141e26',
                  fontWeight: 'bold',
                  fontStyle: 'italic',
                  fontSize: '13px'
                }}
              >
               ĐÃ BỊ HỦY
              </Typography>
            </MenuItem>
            <MenuItem onClick={() => handleFilterStatus('EXPIRED')} divider>
              <Typography
                sx={{
                  color: '#141e26',
                  fontWeight: 'bold',
                  fontStyle: 'italic',
                  fontSize: '13px'
                }}
              >
                ĐÃ QUÁ HẠN
              </Typography>
            </MenuItem>
            <MenuItem onClick={() => handleFilterStatus('PROCESSING')} divider>
              <Typography
                sx={{
                  color: '#141e26',
                  fontWeight: 'bold',
                  fontStyle: 'italic',
                  fontSize: '13px'
                }}
              >
                ĐANG XỬ LÝ
              </Typography>
            </MenuItem>
            <MenuItem onClick={() => handleFilterStatus('SELF_SHIPPING')} divider>
              <Typography
                sx={{
                  color: '#141e26',
                  fontWeight: 'bold',
                  fontStyle: 'italic',
                  fontSize: '13px'
                }}
              >
               TỰ LẤY VẬT PHẨM
              </Typography>
            </MenuItem>
            <MenuItem onClick={() => handleFilterStatus('REPORTED')} divider>
              <Typography
                sx={{
                  color: '#141e26',
                  fontWeight: 'bold',
                  fontStyle: 'italic',
                  fontSize: '13px'
                }}
              >
               ĐÃ ĐƯỢC BÁO CÁO
              </Typography>
            </MenuItem>
            <MenuItem onClick={() => handleFilterStatus('FINISHED')}>
              <Typography
                sx={{
                  color: '#141e26',
                  fontWeight: 'bold',
                  fontStyle: 'italic',
                  fontSize: '13px'
                }}
              >
               ĐÃ KẾT THÚC
              </Typography>
            </MenuItem>
      
      </Menu>
    </div>
  )
}
