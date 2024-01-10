'use client'

import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import axiosClient from 'src/api-client/ApiClient'
import { toast } from 'react-toastify'
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import {
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'

const PermissionSelect = ({data, setData, id, init}: any) => {
  const [selectedScope, setSelectedScope] = React.useState<number>(init === "PERMITTED" ? 0 : 1)
  const handleChangePermissions = (e: SelectChangeEvent<number>) =>{
    setSelectedScope(e.target.value as number)
    const updatedArray = data.map((item: any) => {
      if (item.permissionId === id && e.target.value as number === 0) {    

        return { ...item, status: "PERMITTED" }
      } else if (item.permissionId === id && e.target.value as number === 1) {

        return { ...item, status: 'BANNED' }
      }

      return item
    })
    setData(updatedArray)
  }

  return (
    <Select id='scope' value={selectedScope} size='small' onChange={handleChangePermissions}>
      <MenuItem value={0}>{'Được phép'}</MenuItem>
      <MenuItem value={1}>{'Không'}</MenuItem>
    </Select>
  )
}
const StatusSelect = ({status, setStatus}: any) => {

  return (
    <Stack direction={"row"} spacing={5} alignItems={"center"} sx={{mt: 5, mb: 5}}>
      <Stack direction={"row"} spacing={2} alignItems={"center"} >
      <FactCheckOutlinedIcon/>
      <Typography>Trạng thái: </Typography>
      </Stack>    
      <Select value={status} onChange={e => setStatus(e.target.value as number)} size='small'>
        <MenuItem value={0}>{'Được phép hoạt động'}</MenuItem>
        <MenuItem value={1}>{'Ngưng hoạt động'}</MenuItem>
      </Select>
    </Stack>
  )
}

export default function PopUpUpdateUser({ id, status, currentDataFilter, reload }: any) {
  const [data, setData] = React.useState<any>()
  const [newStatus, setNewStatus] = React.useState<any>(status === "ACTIVE" ? 0 : 1)
  const getDataUser = async () => {
    try {
      const userData: any = await axiosClient.get(`/user-permissions?userId=${id}`)
      console.log(userData)
      setData(userData.data)
    } catch (error) {
      console.log(error)
      toast.error('Lấy ttin thất bại')
    }
  }
  const [open, setOpen] = React.useState(false)
  const handleClickOpen = () => {
    getDataUser()
    setOpen(true)
  }
  const handleConfirm = async () => {
    try {
      const formData = new FormData()
      formData.append("status", newStatus)
      const res: any = await axiosClient.put(`/users/${id}`, formData,{
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      const dataUpdatePermission = {
        userId: id,
        permissionRequests : data.map((d: any)=> ({
          permissionId: d.permissionId,
          status: d.status === "PERMITTED" ? 0 : 1
        })) 
      }
      const res2: any = await axiosClient.put(`/user-permissions`, dataUpdatePermission)
      console.log(res, res2);
      reload({...currentDataFilter})
      toast.success(res.message)
    } catch (error: any) {
      console.log(error);
      if(error.response) toast.error(error.response?.data?.message)
      else toast.error("Cập nhật thất bại")
    }
    setOpen(false)
  }
  const handleExit = () => {
    setOpen(false)
  }

  return (
    <>
      <EditOutlinedIcon color='info' sx={{ cursor: 'pointer' }} onClick={handleClickOpen} />
      <Dialog
        open={open}
        onClose={handleExit}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        sx={{
          '& .MuiPaper-root': {
            minWidth: '70vw'
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center' }} id='alert-dialog-title'>
          {'꧁༺ Cập nhật quyền hạn và trạng thái người dùng ༻꧂'}
        </DialogTitle>
        <DialogContent>
        <StatusSelect status={newStatus} setStatus={setNewStatus}/>
          {data && (
            <TableContainer sx={{ border: '1px solid' }}>
              <Table aria-label='simple table'>
                <TableHead
                  sx={{
                    borderRadius: '10px 10px 0px 0px'
                  }}
                >
                  <TableRow>
                    <TableCell size='small' align='center' sx={{ color: '#ffffff', fontWeight: 'bold', pl: 0 }}>
                      Tên
                    </TableCell>
                    <TableCell size='small' align='center' sx={{ color: '#ffffff', fontWeight: 'bold', pl: 0 }}>
                      Quyền hạn
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((d: any) => (
                    <TableRow key={d.permissionId}>
                      <TableCell size='small' align='center' sx={{ color: '#ffffff', fontWeight: 'bold', pl: 0 }}>
                        {d.displayName}
                      </TableCell>
                      <TableCell align='center' size='small'>
                        <PermissionSelect data={data} setData={setData} id={d.permissionId} init={d.status}/>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}        
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirm} autoFocus color='secondary' fullWidth variant='contained'>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
