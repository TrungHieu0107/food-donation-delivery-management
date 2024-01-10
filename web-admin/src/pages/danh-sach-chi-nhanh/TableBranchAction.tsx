import EditIcon from '@mui/icons-material/Edit'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { DotsVertical } from 'mdi-material-ui'
import { useRouter } from 'next/router'
import * as React from 'react'

export default function TableBranchAction({ id }: any) {
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
    router.push(`danh-sach-chi-nhanh/cap-nhat-chi-nhanh/${id}`)
  }

  // const handleDelete = (id: any) => {
  //   setAnchorEl(null)
  //   const confirmed = window.confirm('Bạn có chắc chắn muốn dừng hoạt động của chi nhánh này không?')
  //   if (confirmed) {
  //     const callAPIDelete = async () => {
  //       try {
  //         const res: any = await axiosClient.delete(`/activities/${id}`)
  //         addToast(res.message, {
  //           appearance: 'success',
  //           autoDismiss: true
  //         })
  //         setFilterObject({
  //           name: '',        
  //           page: 1
  //         })
  //       } catch (error: any) {
  //         console.log('error delete: ', error)
  //         if(error.response && error.response.data){
  //           addToast(error.response.data.message, {
  //             appearance: 'error',
  //             autoDismiss: true
  //           }) 
  //         }
  //         else{
  //           addToast('Ngưng hoạt động thất bại', {
  //             appearance: 'error',
  //             autoDismiss: true
  //           })
  //         }
          
  //       }
  //     }

  //     //callAPIDelete()
  //   }
  // }

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
        <DotsVertical />
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
        {/* <MenuItem >
          <DeleteForeverIcon sx={{ mr: '4px' }} color='error' />
          <span>Ngưng hoạt động</span>
        </MenuItem> */}
      </Menu>
    </div>
  )
}
