"use client"

import { Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import * as React from 'react';
import { formateDateDDMMYYYYHHMM } from 'src/@core/layouts/utils';
import axiosClient from 'src/api-client/ApiClient';

export default function ListMemberInTask({id, name}: any) {
    console.log(id, name);
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState<any>()
  const handleClickOpen = () => {
    setOpen(true);
  };
  
  const handleClose = () => {
  
    setOpen(false);
   
  };
  const handleExit = () => {
    setOpen(false);
  };
  React.useEffect(()=>{
   const fetchData = async () => {
    try {
        const response: any = await axiosClient.get(`/activity-tasks/${id}`)
        console.log(response.data);
        setData(response.data || [])
    } catch (error) {
        console.log(error);
        setData([]) 
    }   
   }
   if(open && id){
    fetchData()
   }
  },[id, open])

  return (
    <div>      
      <Button sx={{mb: 3}} variant="outlined" size='small' color="info" onClick={handleClickOpen}>
       Xem thành viên
      </Button>
      <Dialog
        open={open}      
        onClose={handleExit}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"  
        sx={{
          "& .MuiPaper-root": {         
            minWidth: "70vw",
          },
        }}      
      >
        <DialogContent > 
            <Typography align='center' sx={{fontWeight: 700, mb: 5, mt: 5}}> Danh sách các tình nguyện viên đang làm công việc {name}</Typography>    
       {data?.activityMember?.length > 0 && <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label='simple table'>
              <TableHead>
                <TableRow>
                  <TableCell size='small' align='center'>
                    Tên
                  </TableCell>
                  <TableCell size='small' align='center'>
                   Số điện thoại
                  </TableCell>
                  <TableCell size='small' align='center'>
                    Ngày tạo
                  </TableCell>
                  <TableCell size='small' align='center'>
                    Trạng thái
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.activityMember?.map((row: any) => (
                  <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component='th' scope='row' align='center'>
                      {row.name}
                    </TableCell>
                    <TableCell align='center'>{row.phone ? row.phone : "-"}</TableCell>
                    <TableCell align='center'>{row.createDate ? formateDateDDMMYYYYHHMM(row.createDate): "Chưa xác định"}</TableCell>
                    <TableCell align='center'>
                        {row.status === "ACTIVE"
                         ? 
                        <Chip label={"ĐANG HOẠT ĐỘNG"} color='info'/> 
                        :
                         <Chip label={"NGỪNG HOẠT ĐỘNG"} color='error'/>}
                        
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer> }
        {data?.activityMember?.length === 0 && <Typography align='center' sx={{fontWeight: 700, mb:5, mt: 5}}>Hiện không có tình nguyện viên nào tham gia vào công việc này</Typography>}
        </DialogContent>
        <DialogActions>       
          <Button onClick={handleClose} sx={{mt: 10}} variant='contained' color='info' fullWidth autoFocus>
           Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
