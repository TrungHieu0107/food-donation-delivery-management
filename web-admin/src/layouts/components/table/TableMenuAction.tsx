import * as React from 'react'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import EditIcon from '@mui/icons-material/Edit'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { useRouter } from 'next/router'
import axiosClient from 'src/api-client/ApiClient'
import { toast } from 'react-toastify'
import FeedbackOutlinedIcon from '@mui/icons-material/FeedbackOutlined';

export default function PositionedMenu({ id, setFilterObject }: any) {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const router = useRouter()
  const open = Boolean(anchorEl)
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleUpdate = (id: any) => {
    setAnchorEl(null)
    router.push(`/danh-sach-hoat-dong/cap-nhat-hoat-dong/${id}`)
  }
  const handleDelete = (id: any) => {
    setAnchorEl(null)
    const confirmed = window.confirm('Bạn có chắc chắn muốn ngưng hoạt động này không?')
    if (confirmed) {
      const callAPIDelete = async () => {
        try {
          const res: any = await axiosClient.delete(`/activities/${id}`)
          toast.success(res.message)
          setFilterObject({
            name: '',
            startDate: '',
            endDate: '',
            activityTypeIds: [],
            page: 1
          })
        } catch (error: any) {
          console.log('error delete: ', error)
        }
      }
      callAPIDelete()
    }
  }
  const handleStartFeedBack = (id: any) => {
    setAnchorEl(null) 
      const startFeedBack = async () => {
        try {
          const res: any = await axiosClient.post(`/activity-feedbacks/activity?activityId=${id}`)
          toast.success(res.message)        
        } catch (error: any) {
          console.log('error delete: ', error)
        }
      }
      startFeedBack()   
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
          <span>Cập nhật</span>
        </MenuItem>
        <MenuItem onClick={() => handleDelete(id)}>
          <DeleteForeverIcon sx={{ mr: '4px' }} color='error' />
          <span>Ngưng hoạt động</span>
        </MenuItem>      
        <MenuItem onClick={() => handleStartFeedBack(id)}>
          <FeedbackOutlinedIcon sx={{ mr: '4px' }} color='success' />
          <span>Mở phản hồi</span>
        </MenuItem>    
      </Menu>
    </div>
  )
}
