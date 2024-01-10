import {
  Avatar,
  Box,
  Chip,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import { format } from 'date-fns'
import { useRouter } from 'next/router'
import Pagin from '../../layouts/components/pagination/Pagination'
import TableCharityFilter from './TableCharityFilter'
import { ReactNode } from 'react'

export const CharityStatus: {
  [key: string]: ReactNode
} = {
  ACTIVE: (
    <Chip
      label={
        <Typography
          fontWeight={550}
          sx={{
            color: theme => theme.palette.primary.contrastText
          }}
        >
          Đang hoạt động
        </Typography>
      }
      color='primary'
    />
  ),
  INACTIVE: (
    <Chip
      label={
        <Typography
          fontWeight={550}
          sx={{
            color: theme => theme.palette.error.contrastText
          }}
        >
          Ngừng hoạt động
        </Typography>
      }
      color='error'
    />
  ),
  UNVERIFIED: (
    <Chip
      label={
        <Typography
          fontWeight={550}
          sx={{
            color: theme => theme.palette.error.contrastText
          }}
        >
          Chưa xác thực
        </Typography>
      }
      color='warning'
    />
  ),
  UNVERIFIED_UPDATE: (
    <Chip
      label={
        <Typography
          fontWeight={550}
          sx={{
            color: theme => theme.palette.error.contrastText
          }}
        >
          Chờ xác thực đổi mới
        </Typography>
      }
      color='warning'
    />
  ),
  '': <Typography color={'error'}>Không có dữ liệu</Typography>
}

const TableListCharities = ({ data, pagination, filterObject, setFilterObject, isLoading }: any) => {
  const router = useRouter()
  const handleNavigate = (id: string) => {
    router.push(`/to-chuc-tu-thien/chi-tiet/${id}`)
  }

  return (
    <Box>
      <TableContainer>
        <Table aria-label='simple table'>
          <TableHead
            sx={{
              borderRadius: '10px 10px 0px 0px'
            }}
          >
            <TableRow>
              <TableCell size='small'>STT</TableCell>
              <TableCell size='small'>Tên chi nhánh</TableCell>
              <TableCell size='small'>Ảnh đại diện</TableCell>
              <TableCell size='small' align='center'>
                Số đơn vị
              </TableCell>
              <TableCell size='small'>Ngày tạo</TableCell>

              <TableCell size='small'>
                <Stack direction={'row'} alignItems={'center'} justifyContent={'center'}>
                  <TableCharityFilter filterObject={filterObject} setFilterObject={setFilterObject} />
                  Trạng thái
                </Stack>
              </TableCell>

              {/* {session?.user.role === "SYSTEM_ADMIN" && (<TableCell size='small' >
                Thao tác
              </TableCell>)} */}
            </TableRow>
          </TableHead>
          <TableBody>
            {!isLoading
              ? data?.map((a: any, index: number) => (
                  <TableRow hover={true} key={a.id}>
                    <TableCell size='small'>{index + 1}</TableCell>
                    <TableCell size='small' align='left'>
                      
                        <Typography
                          width={'auto'}
                          sx={{
                            '&:hover': {
                              cursor: 'pointer',
                              fontFamily: 'Roboto',
                              fontStyle: 'normal',
                              fontWeight: 'bold',
                              fontSize: '18px',
                              textDecoration: 'underline'
                            }
                          }}
                          onClick={() => handleNavigate(a.id)}
                        >
                          {a.name}
                        </Typography>                    
                    </TableCell>
                    <TableCell align='left' size='small'>
                      <Avatar sx={{ width: 50, height: 50 }} src={a.logo} alt='img' />
                    </TableCell>
                    <TableCell align='center' size='small'>
                      {a.numberOfCharityUnits}
                    </TableCell>
                    <TableCell align='left' size='small'>
                      <Typography>{format(new Date(a.createdDate), 'dd/MM/yyyy')}</Typography>
                    </TableCell>
                    <TableCell align='center' size='small'>
                      {CharityStatus[a?.status ?? '']}
                    </TableCell>
                    {/* {session?.user.role === "SYSTEM_ADMIN" && <TableCell align='center' size='small'>
                </TableCell>} */}
                  </TableRow>
                ))
              : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((_, index: number) => (
                  <TableRow hover={true} key={index}>
                    <TableCell size='small'>{index + 1}</TableCell>
                    <TableCell size='small' align='left'>
                      <Skeleton variant='rectangular' />
                    </TableCell>
                    <TableCell align='left' size='small'>
                      <Skeleton variant='circular' height={50} width={50} />
                    </TableCell>
                    <TableCell align='center' size='small'>
                      <Skeleton variant='rectangular' />
                    </TableCell>
                    <TableCell align='left' size='small'>
                      <Skeleton variant='rectangular' />
                    </TableCell>
                    <TableCell align='center' size='small'>
                      <Skeleton variant='rectangular' />
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
      {pagination && <Pagin data={pagination} filterObject={filterObject} setFilterObject={setFilterObject} />}
    </Box>
  )
}

export default TableListCharities
