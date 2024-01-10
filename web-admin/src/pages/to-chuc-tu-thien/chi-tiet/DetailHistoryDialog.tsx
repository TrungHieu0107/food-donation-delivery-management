import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Chip,
    CircularProgress,
    Grid,
    Pagination,
    Stack,
    Typography
} from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { formateDateDDMMYYYYHHMM } from 'src/@core/layouts/utils';
import { customColor } from 'src/@core/theme/color';
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba';
import { StockAPI } from 'src/api-client/Stock';
import Calendar from 'src/layouts/components/calendar/Calendar';
import { ItemCharityRecievedMModel } from 'src/models/Charity';
import { CommonRepsonseModel } from 'src/models/common/CommonResponseModel';

interface filter {
	startDate: string
	endDate: string
	page: number
	pageSize: number
}

export default function DetailHistoryCharityUnit({id}: any) {
  const [open, setOpen] = React.useState(false);
  const [data, setData] = useState<ItemCharityRecievedMModel[]>([])
	const [dataStockPagination, setDataStockPagination] = useState<any>()
	const [loading, setLoading] = useState<boolean>(false)
	const [filterObject, setFilterObject] = useState<filter>({
		startDate: '2023-01-01',
		endDate: '2024-12-12',
		page: 1,
		pageSize: 10
	})

	const [expanded, setExpanded] = useState<string | false>(false)

	const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
		setExpanded(isExpanded ? panel : false)
	}

	const handlePageStockChange = (event: any, page: any) => {
		setFilterObject({ ...filterObject, page: page })
	}
  const handleClickOpen = () => {
    setOpen(true);
  };
 
  const handleClose = () => {
    setOpen(false);

  };
  const handleExit = () => {
    setOpen(false);
  };
  useEffect(() => {
    const fetchData = async () => {
        setLoading(true)
        try {
            if(id === "_") {

                return
            }


            const res = await StockAPI.getStockReceivedOfChariry(id as string, filterObject)
            const commonResponse = new CommonRepsonseModel<ItemCharityRecievedMModel[]>(res)
            setData(commonResponse.data || [])
            setDataStockPagination(commonResponse.pagination)
        } catch (error) {
            console.log(error)
            setData([])
        } finally {
            setLoading(false)
        }
    }
    if (id) {
        fetchData()
    }
}, [id, filterObject])

  return (
    <div>      
      <Button variant="outlined"  color="info" onClick={handleClickOpen}>
        Lịch sử nhận vật phẩm của chi nhánh
      </Button>
      <Dialog
        open={open}      
        onClose={handleExit}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"    
      >
        <DialogTitle id="alert-dialog-title" >
          {"Thống kê lịch sử nhận vật phẩm"}
        </DialogTitle>
        <DialogContent>     
        <Box sx={{mt: 5}}>
			<Grid container spacing={3}>
				<Grid item xs md>
					<Calendar
						label='Ngày bắt đầu'
						filterObject={filterObject}
						setFilterObject={setFilterObject}
					/>
				</Grid>
				<Grid item xs md>
					<Calendar
						label='Ngày kết thúc'
						filterObject={filterObject}
						setFilterObject={setFilterObject}
					/>
				</Grid>
			</Grid>

			{loading && (
				<Stack
					sx={{ height: '30vh', mt: '20vh', ml: '45vw' }}
					direction={'column'}
					justifyContent={'center'}
					alignItems={'center'}
				>
					<CircularProgress color='secondary' />
					<Typography>Đang tải dữ liệu.....</Typography>
				</Stack>
			)}
			{data?.length === 0 && loading === false && (
				<Box
					sx={{
						height: '40px',
						mb: 5,
						mt: 5,
						width: '100%',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center'
					}}
				>
					<Typography variant='h6' fontWeight={600}>
						Hiện chưa có lịch sử xuất/nhập kho cho chi nhánh này
					</Typography>
				</Box>
			)}
			<Box display={'flex'} flexDirection={'column'} mt={3}>
				{data &&
					data?.map((d) => (
						<Accordion
							key={d.id}
							expanded={expanded === d.id}
							onChange={handleChange(d.id)}
							sx={{
								':hover': {
									backgroundColor: hexToRGBA(customColor.primary, 0.1)
								},                            
							}}
						>
							<AccordionSummary
								expandIcon={<ExpandMoreIcon />}
								aria-controls='panel1bh-content'
								id='panel1bh-header'
								sx={{
									borderBottom: '1px solid',
									borderColor: (theme) => theme.palette.grey[400]
								}}
							>
								<Box display={'flex'} flexDirection={'column'} width={'100%'}>
									<Box
										display={'flex'}
										justifyContent={'space-between'}
										width={'100%'}
										alignItems={'center'}
									>
										<Box display={'flex'} gap={2} width={'100%'} padding={'5px'}>
											<Typography>{d.name}</Typography>
											{d.attributeValues.map((attribute, index) => (
												<Chip label={attribute} key={index} color='info' size='small' />
											))}
										</Box>
										<Typography
											textAlign={'right'}
											sx={{
												whiteSpace: 'nowrap',
												color: (theme) => theme.palette.success.light,
												mr: 2
											}}
											fontWeight={500}
										>
											+ {d.quantity}({d.unit})
										</Typography>
									</Box>
									<Typography
										variant='caption'
										sx={{
											width: '100%'
										}}
										fontWeight={600}
									>
										{formateDateDDMMYYYYHHMM(d.createdDate)}
									</Typography>
								</Box>
							</AccordionSummary>
							<AccordionDetails>
								<Box
									sx={{
										padding: '10px'
									}}
								>
									<Typography>Nhận từ chi nhánh {d.pickUpPoint}</Typography>
									{!!d.activityName && (
										<Typography>Từ hoạt động từ thiện: {d.activityName}</Typography>
									)}
									<Typography>Ghi chú: {d.note}</Typography>
								</Box>
							</AccordionDetails>
						</Accordion>
					))}
			</Box>
			{data?.length > 0 && (
				<Box
					justifyContent={'center'}
					alignItems='center'
					display={'flex'}
					width={'100%'}
					sx={{ mb: 10, mt: 5 }}
				>
					<Pagination
						color='primary'
						count={Math.ceil(dataStockPagination?.total ? dataStockPagination?.total / 10 : 0)}
						onChange={handlePageStockChange}
						page={dataStockPagination?.currentPage ? dataStockPagination?.currentPage : 0}
					/>
				</Box>
			)}
		</Box>
      
        </DialogContent>
        <DialogActions sx={{display:"flex", justifyContent:"center"}}>  
          <Button onClick={handleClose} color='info' fullWidth autoFocus sx={{mt: 3, mb: 3}}>
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
