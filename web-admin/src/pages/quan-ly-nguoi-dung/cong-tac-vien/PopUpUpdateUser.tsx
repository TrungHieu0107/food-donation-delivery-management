'use client'

import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined'
import {
  Grid,
  MenuItem,
  Select,
  Stack,
  Typography
} from '@mui/material'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import * as React from 'react'
import { toast } from 'react-toastify'
import axiosClient from 'src/api-client/ApiClient'

// const PermissionSelect = ({ data, setData, id, init }: any) => {
//   const [selectedScope, setSelectedScope] = React.useState<number>(init === 'PERMITTED' ? 0 : 1)
//   const handleChangePermissions = (e: SelectChangeEvent<number>) => {
//     setSelectedScope(e.target.value as number)
//     const updatedArray = data.map((item: any) => {
//       if (item.permissionId === id && (e.target.value as number) === 0) {
//         return { ...item, status: 'PERMITTED' }
//       } else if (item.permissionId === id && (e.target.value as number) === 1) {
//         return { ...item, status: 'BANNED' }
//       }

//       return item
//     })
//     setData(updatedArray)
//   }

//   return (
//     <Select sx={{width:"100%"}}  id='scope' value={selectedScope} size='small' onChange={handleChangePermissions}>
//       <MenuItem value={0}>{'Được phép'}</MenuItem>
//       <MenuItem value={1}>{'Không'}</MenuItem>
//     </Select>
//   )
// }
const StatusSelect = ({ status, setStatus }: any) => {
  return (
    <Grid container sx={{ mt: 5, width:"50%", m:"auto" }} alignItems={"center"}>
      <Grid item xs={4}><Stack direction={'row'} spacing={2} alignItems={'center'}>
        <FactCheckOutlinedIcon />
        <Typography>Trạng thái: </Typography>
      </Stack></Grid>
      <Grid item xs={8}>
      <Select sx={{width:"100%"}} value={status} onChange={e => setStatus(e.target.value as number)} size='small'>
        <MenuItem value={0}>{'Được phép hoạt động'}</MenuItem>
        <MenuItem value={1}>{'Ngưng hoạt động'}</MenuItem>
      </Select>
      </Grid>
    </Grid>
  )
}

interface PopUpUpdateUserProps {
  id: string
  open: boolean
  handleClose: () => void
}

export default function PopUpUpdateUser({ id, open, handleClose }: PopUpUpdateUserProps) {
  const [data, setData] = React.useState<any>()
  const [newStatus, setNewStatus] = React.useState<any>(0)
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
   console.log(isLoading);
  React.useEffect(() => {
    if (id && open) {
      getDataUser()
    }
  }, [id, open])

  const getDataUser = async () => {
    try {
      setIsLoading(true)
      const userData: any = await axiosClient.get(`/user-permissions?userId=${id}`)
      console.log(userData)
      setData(userData.data)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirm = async () => {
    try {
      const formData = new FormData()
      formData.append('status', newStatus)
      const res: any = await axiosClient.put(`/users/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      const dataUpdatePermission = {
        userId: id,
        permissionRequests: data.map((d: any) => ({
          permissionId: d.permissionId,
          status: d.status === 'PERMITTED' ? 0 : 1
        }))
      }
      const res2: any = await axiosClient.put(`/user-permissions`, dataUpdatePermission)
      console.log(res, res2)
      toast.success(res.message)
    } catch (error: any) {
      console.log(error)
      if (error.response) toast.error(error.response?.data?.message)
      else toast.error('Cập nhật thất bại')
    }
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        sx={{
          '& .MuiPaper-root': {
            minWidth: '70vw'
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center' }} id='alert-dialog-title'>
          {'Cập trạng thái người dùng'}
        </DialogTitle>
        <DialogContent sx={{height:"100px", display:"flex", alignItems:"center"}}>
          <StatusSelect status={newStatus} setStatus={setNewStatus} />
          {/* {data && (
            <TableContainer >
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
                  {!isLoading ? (
                    !!data ? (
                      data.length > 0 ? (
                        data.map((d: any) => (
                          <TableRow key={d.permissionId}>
                            <TableCell size='small' align='center'>
                              {d.displayName}
                            </TableCell>
                            <TableCell align='center' size='small'>
                              <PermissionSelect data={data} setData={setData} id={d.permissionId} init={d.status} />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell size='small' align='center' colSpan={2}>
                            <Typography textAlign={'center'}>Không có dữ liệu</Typography>
                          </TableCell>
                        </TableRow>
                      )
                    ) : (
                      <TableRow>
                        <TableCell size='small' align='center' colSpan={2}>
                          <Typography textAlign={'center'}>Không có dữ liệu</Typography>
                        </TableCell>
                      </TableRow>
                    )
                  ) : (
                    [0, 1, 2, 3, 4, 5].map((d: any) => (
                      <TableRow key={d.permissionId}>
                        <TableCell size='small' align='center'>
                          <Skeleton variant='rectangular' />
                        </TableCell>
                        <TableCell align='center' size='small'>
                          <Skeleton variant='rectangular' />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )} */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus color='info' variant='outlined' fullWidth>
            Đóng
          </Button>
          <Button onClick={handleConfirm} autoFocus color='primary' fullWidth variant='contained'>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
