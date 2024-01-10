import React, { useState } from 'react'
import IconButton from '@mui/material/IconButton'
import SortIcon from '@mui/icons-material/Sort'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

export default function TableUserFilter({ type, filterObject, setFilterObject, dataRoles }: any) {
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
        status: ''
      })

      return;
    }
    
    let statusNumber
    if (s === 'ACTIVE') statusNumber = 0
    if (s === 'INACTIVE') statusNumber = 1
    if (s === 'UNVERIFIED') statusNumber = 2
    if (s === 'ALL') statusNumber = 0
    setFilterObject({
      ...filterObject,
      status: statusNumber
    })
    setAnchorEl(null)
  }
  const handleFilterRole = (id: string) => {
    if (id) {
      setFilterObject({
        ...filterObject,
        roleIds: id
      })
    } else {
      setFilterObject({
        ...filterObject,
        roleIds: ''
      })
    }
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
            width: '20ch'
          }
        }}
      >
        {type === 'STATUS' ? (
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
                Tất cả
              </Typography>
            </MenuItem>
            <MenuItem onClick={() => handleFilterStatus('ACTIVE')} divider>
              <Typography
                sx={{
                  color: '#141e26',
                  fontWeight: 'bold',
                  fontStyle: 'italic',
                  fontSize: '13px'
                }}
              >
                Đang hoạt động
              </Typography>
            </MenuItem>

            <MenuItem onClick={() => handleFilterStatus('INACTIVE')} divider>
              <Typography
                sx={{
                  color: '#141e26',
                  fontWeight: 'bold',
                  fontStyle: 'italic',
                  fontSize: '13px'
                }}
              >
                Ngưng hoạt động
              </Typography>
            </MenuItem>
            <MenuItem onClick={() => handleFilterStatus('UNVERIFIED')}>
              <Typography
                sx={{
                  color: '#141e26',
                  fontWeight: 'bold',
                  fontStyle: 'italic',
                  fontSize: '13px'
                }}
              >
                Chưa xác nhận
              </Typography>
            </MenuItem>
          </Box>
        ) : (
          <Box>
            {dataRoles && dataRoles.map((r: any) => (
              <MenuItem onClick={() => handleFilterRole(r.id)} divider key={r.id}>
                <Typography
                  sx={{
                    color: '#141e26',
                    fontWeight: 'bold',
                    fontStyle: 'italic',
                    fontSize: '13px'
                  }}
                >
                  {r.displayName}
                </Typography>
              </MenuItem>
            ))}
            <MenuItem onClick={() => handleFilterRole('')}>
              <Typography
                sx={{
                  color: '#141e26',
                  fontWeight: 'bold',
                  fontStyle: 'italic',
                  fontSize: '13px'
                }}
              >
                Tất cả
              </Typography>
            </MenuItem>
          </Box>
        )}
      </Menu>
    </div>
  )
}
