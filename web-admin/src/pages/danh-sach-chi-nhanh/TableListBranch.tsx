import {
  Box,
  Card,
  CardMedia,
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
import useSession from 'src/@core/hooks/useSession'
import { useRouter } from 'next/router'
import Pagin from '../../layouts/components/pagination/Pagination'
import TableBranchAction from './TableBranchAction'
import TableBranchFilter from './TableBranchFilter'

const TableListBranch = ({ data, pagination, filterObject, setFilterObject, isLoading }: any) => {
  const { session }: any = useSession()
  const router = useRouter()
  const handleNavigate = (id: string) => {
    router.push(`danh-sach-chi-nhanh/chi-nhanh/${id}`)
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
                Địa chỉ
              </TableCell>
              <TableCell size='small'>Ngày tạo</TableCell>

              <TableCell size='small'>
                <Stack direction={'row'} alignItems={'center'}>
                  <TableBranchFilter filterObject={filterObject} setFilterObject={setFilterObject} type={'STATUS'} />
                  Trạng thái
                </Stack>
              </TableCell>
              {session?.user.role === 'SYSTEM_ADMIN' && <TableCell size='small'>Thao tác</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {!isLoading
              ? data?.map((a: any, index: number) => (
                  <TableRow sx={{ height: '100px' }} hover={true} key={a.id}>
                    <TableCell size='small' align='left'>
                      {index + 1 + ((pagination?.currentPage ?? 0) - 1) * pagination?.pageSize ?? 10}
                    </TableCell>
                    <TableCell size='small' align='left'>
                    <Typography
                          sx={{
                            width: '200px',
                            '&:hover': {
                              cursor: 'pointer',
                              fontFamily: 'Roboto',
                              fontStyle: 'normal',
                              fontWeight: 'bold',
                              fontSize: '20px'
                            }
                          }}
                          noWrap={true}
                          onClick={() => handleNavigate(a.id)}
                        >
                          {a.name}
                        </Typography>
                    </TableCell>
                    <TableCell align='left' size='small'>
                      <Card sx={{ width: '100px' }}>
                        <CardMedia component='img' height='100' image={a.image} alt='img' />
                      </Card>
                    </TableCell>
                    <TableCell align='left' size='small'>
                      <Typography noWrap={true} sx={{ width: '250px' }}>
                        {a.address}
                      </Typography>
                    </TableCell>
                    <TableCell align='left' size='small'>
                      <Typography>{format(new Date(a.createdDate), 'dd/MM/yyyy')}</Typography>
                    </TableCell>

                    <TableCell align='center' size='small'>
                      {a.status === 'ACTIVE' && (
                        <Chip
                          color='info'
                          sx={{
                            color: '#FFFFFF',
                            fontWeight: 'bold'
                          }}
                          label={'ĐANG HOẠT ĐỘNG'}
                        />
                      )}
                      {a.status === 'INACTIVE' && (
                        <Chip
                          color='error'
                          sx={{
                            color: '#FFFFFF',
                            fontWeight: 'bold'
                          }}
                          label={'NGƯNG HOẠT ĐỘNG'}
                        />
                      )}
                    </TableCell>
                    {session?.user.role === 'SYSTEM_ADMIN' && (
                      <TableCell align='center' size='small'>
                        <TableBranchAction id={a.id} setFilterObject={setFilterObject} />
                      </TableCell>
                    )}
                  </TableRow>
                ))
              : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((_, index: number) => (
                  <TableRow sx={{ height: '100px' }} hover={true} key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Skeleton variant='rectangular' />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant='rectangular' height={50} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant='rectangular' />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant='rectangular' />
                    </TableCell>

                    <TableCell>
                      <Skeleton variant='rectangular' />
                    </TableCell>
                    {session?.user.role === 'SYSTEM_ADMIN' && (
                      <TableCell>
                        <Skeleton variant='rectangular' />
                      </TableCell>
                    )}
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
      {pagination && <Pagin data={pagination} filterObject={filterObject} setFilterObject={setFilterObject} />}
    </Box>
  )
}

export default TableListBranch
