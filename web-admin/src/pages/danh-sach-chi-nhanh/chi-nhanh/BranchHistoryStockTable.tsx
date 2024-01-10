import AddHomeOutlinedIcon from '@mui/icons-material/AddHomeOutlined'
import DeliveryDiningOutlinedIcon from '@mui/icons-material/DeliveryDiningOutlined'
import {
  Box,
  Chip,
  CircularProgress,
  Collapse,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  styled
} from '@mui/material'
import { tableCellClasses } from '@mui/material/TableCell'
import { useState } from 'react'
import { formateDateDDMMYYYYHHMM } from 'src/@core/layouts/utils'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}))

const DetailHistoryStockOfBranch = ({ a, index }: any) => {
  const [expanded, setExpanded] = useState<any>(false)
  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  return (
    <>
      <TableRow hover={true} onClick={handleExpandClick} sx={{ cursor: 'pointer' }}>
        <TableCell size='small' align='left'>
          {index + 1}
        </TableCell>
        <TableCell size='small' align='left'>
          <Typography>{a?.pickUpPoint}</Typography>
        </TableCell>
        <TableCell align='left' size='small'>
          {a?.deliveryPoint ? a?.deliveryPoint : 'Không'}
        </TableCell>
        <TableCell align='left' size='small'>
          {a?.donorName ? a?.donorName : 'Không'}
        </TableCell>
        <TableCell align='left' size='small'>
          {a?.createdDate ? formateDateDDMMYYYYHHMM(a?.createdDate) : 'Không xác định'}
        </TableCell>
        <TableCell align='left' size='small'>
          {a?.type === 'IMPORT' && (
            <Chip label={'Nhập kho'} color='info' icon={<AddHomeOutlinedIcon />} sx={{ p: 1 }} />
          )}
          {a?.type === 'EXPORT' && (
            <Chip label={'Xuất kho'} color='success' icon={<DeliveryDiningOutlinedIcon />} sx={{ p: 1 }} />
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell align='center' size='small' style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={expanded} timeout='auto' unmountOnExit>
            <Box sx={{ margin: 4 }}>
              <Table size='small' aria-label='purchases'>
                <TableHead
                  sx={{
                    '& .MuiTableHead-root': {
                      bgcolor: 'red important'
                    }
                  }}
                >
                  <TableRow>
                    <StyledTableCell>Hoạt động tiếp nhận</StyledTableCell>
                    <StyledTableCell>Vật phẩm</StyledTableCell>
                    <StyledTableCell>Thuộc tính</StyledTableCell>
                    <StyledTableCell>Ghi chú</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                    <TableCell component='th' scope='row'>
                      {a?.activityName ? a?.activityName : 'Không'}
                    </TableCell>
                    <TableCell>
                      {a?.quantity} {a?.unit} {a?.name}
                    </TableCell>
                    <TableCell>
                      {a?.attributeValues?.length > 0 && (
                        <Stack direction={'row'} alignItems={'center'} spacing={3} sx={{ mb: 2 }}>
                          {a?.attributeValues?.map((a: any, index: any) => (
                            <Chip label={a} key={index} color='primary' size='small' sx={{ p: 1 }} />
                          ))}
                        </Stack>
                      )}
                    </TableCell>
                    <TableCell>{a?.note ? a?.note : 'Không'}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

const TableHistoryStockOfBranch = ({ d }: any) => {
  if (d) {
    return (
      <Box sx={{ width: '80vw', m: 'auto' }}>
        {d?.length > 0 && (
          <>
            <Box
              sx={{
                height: '40px',
                mb: 5,
                mt: 2,
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Typography variant='h5' fontWeight={600}>
                Bảng thống kê lịch sử xuất/nhập kho của chi nhánh
              </Typography>
            </Box>
            <Box>
              <TableContainer>
                <Table aria-label='collapsible table'>
                  <TableHead
                    sx={{
                      borderRadius: '10px 10px 0px 0px'
                    }}
                  >
                    <TableRow>
                      <TableCell size='small' sx={{ color: '#ffffff', fontWeight: 'bold', pl: 0 }}>
                        #
                      </TableCell>
                      <TableCell size='small' sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                        Chi nhánh thực hiện
                      </TableCell>
                      <TableCell size='small' sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                        Nơi nhận
                      </TableCell>
                      <TableCell size='small' sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                        Người đóng góp
                      </TableCell>
                      <TableCell size='small' sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                        Ngày tạo
                      </TableCell>

                      <TableCell size='small' sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                        Loại
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {d?.map((a: any, index: number) => (
                      <DetailHistoryStockOfBranch key={index} index={index} a={a} />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </>
        )}
      </Box>
    )
  } else {
    return (
      <Stack
        sx={{ height: '50vh', width: '100%' }}
        direction={'column'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <CircularProgress color='info' />
        <Typography>Đang tải dữ liệu...</Typography>
      </Stack>
    )
  }
}

export default TableHistoryStockOfBranch
