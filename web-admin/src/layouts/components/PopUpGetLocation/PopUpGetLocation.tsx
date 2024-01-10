"use client"

import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';
import dynamic from 'next/dynamic'

export default function SimpleDialogDemo({setAddressActivity, setLatlng, location}: any) {
  const [selectedPosition, setSelectedPosition] = React.useState(location ? location : null);
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const getAddressFromCoordinates = async (latlng: any) => {
    try {    
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`);
      const data = await response.json();
      if (data.display_name) {
        const regex = /(.*?),\s*\d+,/;
        const result = data.display_name.match(regex)[1];
        setAddressActivity(result);
      } else {
        setAddressActivity("Không thể lấy địa chỉ.");
      }
    } catch (error) {
      console.error("Lỗi khi lấy địa chỉ: ", error);
      setAddressActivity("Không thể lấy địa chỉ.");
    }
  };
  const handleClose = () => {
    if(!selectedPosition){
      window.alert("Vui lòng chọn vị trí")

      return;
    }
    console.log(selectedPosition);
    setOpen(false);
    setLatlng(selectedPosition)
    getAddressFromCoordinates(selectedPosition)
  };
  const handleExit = () => {
    setOpen(false);
  };
  const MyMap = dynamic(() => import("src/layouts/components/map/PickLocationOnMap"), { ssr: false });

  return (
    <div>      
      <Button variant="outlined"  color="info" onClick={handleClickOpen}>
        Chọn vị trí trên bản đồ
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
        <DialogTitle id="alert-dialog-title" >
          {"Chọn vị trí bạn muốn tổ chức hoạt động"}
        </DialogTitle>
        <DialogContent >     
        <MyMap selectedPosition={selectedPosition} setSelectedPosition={setSelectedPosition}/>
        <DialogContentText sx={{mt: 3, fontSize:"20px", fontWeight: 700, color:"black"}}>
            Vui lòng chọn vị trí trên bản đồ trước khi xác nhận để chúng tôi có thể ghi nhận vị trí mà bạn muốn chọn
          </DialogContentText>
        </DialogContent>
        <DialogActions>       
          <Button onClick={handleClose} color='info' autoFocus>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
