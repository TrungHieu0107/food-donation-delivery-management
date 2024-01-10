"use client"

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import * as React from 'react';
import ListItemCreateActivity from './TableItem';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import { Box, FormControl, Grid, InputAdornment, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import Calendar from 'src/layouts/components/calendar/Calendar';

interface SearchItemParamsModel {
    keyWord: string | '' | undefined
    startDate: string | '' | null | undefined
    endDate: string | '' | null | undefined
    urgencyLevel: number | null | undefined
    pageSize: number
    page: number
}

export default function PopupGetItemByBranchAdmin(props: any) {
  const [open, setOpen] = React.useState(false);
  const [dataSelect, setDataSelect] = React.useState<any>();
  const [selectedType, setSelectedType] = React.useState<any>()
  const [filterObject, setFilterObject] = React.useState<SearchItemParamsModel>({
    keyWord: '',
    startDate: '',
    endDate: '',
    urgencyLevel:undefined,
    pageSize: 10,
    page: 1
  })

  const handleTypeChange = (event: SelectChangeEvent) => {
    if(parseInt(event.target.value as string) === -1){
      setSelectedType(null);
      setFilterObject({
        ...filterObject,
        urgencyLevel: undefined
      })

      return;
    }
    setSelectedType(parseInt(event.target.value as string));
    setFilterObject({
      ...filterObject,
      urgencyLevel: parseInt(event.target.value as string)
    })
  };
  const handleTextChange = (e: any) => {
    setFilterObject({
      ...filterObject,
      keyWord: e.target.value
    })
  }
  const handleClickOpen = () => {
    setOpen(true);
  };
 
  const handleClose = () => {
    if(!dataSelect){
      window.alert("Vui lòng chọn vật phẩm")

      return;
    }
    setOpen(false);
    const dataNew = [...props.itemSelected, ...dataSelect].reduce((acc, current) => {
      // Kiểm tra xem phần tử với id tương ứng đã tồn tại trong acc chưa
      const existingItem = acc.find((item: any) => item.id === current.id);
    
      // Nếu không tồn tại, thêm vào mảng kết quả
      if (!existingItem) {
        console.log("new");
        acc.push(current);
      }
      

      return acc;
    }, []);

    // const dataNew = props.itemSelected.filter((item: any)=> item?.status === "new_item")
    props.setItemSelected(dataNew)
    props.formikRef.current?.setFieldValue("listItemSelected",dataNew)
   
  };
  const handleExit = () => {
    setOpen(false);
  };

  return (
    <div>      
      <Button variant="outlined"  color="info" onClick={handleClickOpen} sx={{mb: 10}}>
        Chọn vật phẩm từ các yêu cầu hỗ trợ
      </Button>
      <Dialog
        open={open}      
        
        // onClose={handleExit}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"  
        sx={{
          "& .MuiPaper-root": {         
            minWidth: "1000px",       
          },
        }}      
      >
        <DialogTitle id="alert-dialog-title" >
          {"Chọn các vật phẩm từ các yêu cầu hỗ trợ cho hoạt động"}
        </DialogTitle>
        <DialogContent>   
          <Box sx={{mt: 5, mb: 5}}>
          <Grid container spacing={5}>
        <Grid item xs={12} sm={6} md={3}>
          {' '}
          <TextField
            size='small'
            fullWidth
            placeholder='Nhập tên ở đây...'
            label='Tên vật phẩm'
            onBlur={handleTextChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchOutlinedIcon />
                </InputAdornment>
              )
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl sx={{ width: '100%' }} size='small'>
            <InputLabel id='select-type'>Tình trạng khẩn cấp</InputLabel>
            <Select
              value={selectedType}
              label={"Tình trạng khẩn cấp"}
              fullWidth
              onChange={handleTypeChange}
              labelId='select-type' >     
              <MenuItem value={-1}>
               Tất cả
                </MenuItem>    
                <MenuItem value={0}>
                Rất khẩn cấp
                </MenuItem>
                <MenuItem value={1}>
                  Khẩn cấp
                </MenuItem>
                <MenuItem value={2}>                 
                  Không khẩn cấp
                </MenuItem>
             
            </Select>
          </FormControl>{' '}
        </Grid>
        <Grid item xs={6} sm={6} md={3} justifyContent={'center'}>
          <Calendar label='Ngày bắt đầu' filterObject={filterObject} setFilterObject={setFilterObject} />
        </Grid>
        <Grid item xs={6} sm={6} md={3} justifyContent={'center'}>
          <Calendar label='Ngày kết thúc' filterObject={filterObject} setFilterObject={setFilterObject} />
        </Grid>
      </Grid>
            </Box>        
          <ListItemCreateActivity filterObject={filterObject} setFilterObject={setFilterObject} dataSelect={dataSelect} setDataSelect = {setDataSelect} />                
        </DialogContent>
        <DialogActions>       
          <Button onClick={handleClose} color='info' variant='contained' autoFocus>
            Xác nhận
          </Button>
          <Button onClick={handleExit} color='info' variant='outlined' autoFocus>
            Hủy
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
