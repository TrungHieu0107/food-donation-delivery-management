import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import GradingOutlinedIcon from '@mui/icons-material/GradingOutlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import * as React from 'react';
import { toast } from 'react-toastify';
import axiosClient from 'src/api-client/ApiClient';
import RejectPostDialog from './PopupRejectPost';

export default function MenuApply({ id, filterObject, setFilterObject }: any) {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [isOpen, setIsOpen] = React.useState(false)
  const open = Boolean(anchorEl)

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleUpdate = async () => {
    setAnchorEl(null)
    try {
      const response: any = await axiosClient.put(`/posts/admin/${id}`, {isAccept: true})  
      setFilterObject({...filterObject, page: 1})
      toast.success(response?.message)
    } catch (error) {
        console.log(error);
        toast.error("Thao tác không thành công")
    }
  }
  const handleReject = () => {
    setAnchorEl(null)
    const confirmed = window.confirm('Bạn có chắc chắn muốn từ chối bài viết này không?')
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
        <MenuItem onClick={() => handleUpdate()}>
          <GradingOutlinedIcon sx={{ mr: '4px' }} color='info' />
          <span>Chấp nhận</span>
        </MenuItem>
        <MenuItem onClick={() => handleReject()}>
          <DoDisturbIcon sx={{ mr: '4px' }} color='error' />
          <span>Từ chối</span>
        </MenuItem>
      </Menu>
      <RejectPostDialog id={id} filterObject={filterObject} setFilterObject={setFilterObject} isOpen={isOpen} setIsOpen={setIsOpen}/>
    </div>
  )
}
