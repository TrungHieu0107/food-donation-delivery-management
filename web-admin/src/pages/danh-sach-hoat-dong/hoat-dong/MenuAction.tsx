import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import EditIcon from '@mui/icons-material/Edit'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import * as React from 'react'
import { toast } from 'react-toastify'
import axiosClient from 'src/api-client/ApiClient'
import RejectVolunteerDialog from './RejectPopup'

export default function MenuApply({ id, fetchData }: any) {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [isOpen, setIsOpen] = React.useState(false)
  const open = Boolean(anchorEl)
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleUpdate = async (id: any) => {
    setAnchorEl(null)
    try {
      const response: any = await axiosClient.put(`/activity-members/${id}`, {isAccept: true})  
      console.log(response);
      fetchData()
      toast.success(response?.message)
    } catch (error) {
        console.log(error);
        toast.error("Thao tác không thành công")
    }
  }
  const handleReject = () => {
    setAnchorEl(null)
    const confirmed = window.confirm('Bạn có chắc chắn muốn từ chối tình nguyện viên này không?')
    if (confirmed) {
   setIsOpen(true)
    }
  }

  return (
    <div>
      <Button
        id='demo-positioned-button'
        aria-controls={open ? 'demo-positioned-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{ width: '20px' }}
      >
        <MoreHorizIcon />
      </Button>
      <Menu
        id='demo-positioned-menu'
        aria-labelledby='demo-positioned-button'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
      >
        <MenuItem onClick={() => handleUpdate(id)}>
          <EditIcon sx={{ mr: '4px' }} color='info' />
          <span>Chấp nhận</span>
        </MenuItem>
        <MenuItem onClick={() => handleReject()}>
          <DoDisturbIcon sx={{ mr: '4px' }} color='error' />
          <span>Từ chối</span>
        </MenuItem>
      </Menu>
      <RejectVolunteerDialog fetchData={fetchData} isOpen={isOpen} id={id} setIsOpen={setIsOpen}/>
    </div>
  )
}
