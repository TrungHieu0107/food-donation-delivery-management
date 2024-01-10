import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
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
import useSession from 'src/@core/hooks/useSession'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Pagin from '../../../layouts/components/pagination/Pagination'
import TableUserFilter from './TableUserFilter'
import PopUpUpdateUser from './PopUpUpdateUser'

const TableListUser = ({ data, pagination, filterObject, setFilterObject, type, isLoading }: any) => {
  const { session }: any = useSession()
  const router = useRouter()
  const [sortASC, setSortASC] = useState(true)
  const handleNavigate = (id: string) => {
    router.push(`chi-tiet-nguoi-dung/${id}`)
  }
  const handleSort = () => {
    if (sortASC) {
      setFilterObject({
        ...filterObject,
        sortType: 1
      })
    } else {
      setFilterObject({
        ...filterObject,
        sortType: 0
      })
    }
    setSortASC(sortASC ? false : true)
  }

  return (
    <Box>
      <TableContainer>
        <Table aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell size='small' sx={{ fontWeight: 'bold', pl: 0 }}>
                #
              </TableCell>
              <TableCell size='small' sx={{ fontWeight: 'bold', pl: 0 }}>
                <Stack direction={'row'} alignItems={'center'} justifyContent={'center'} spacing={2}>
                  {sortASC === true ? (
                    <ArrowUpwardIcon sx={{ fontSize: 18, cursor: 'pointer' }} onClick={handleSort} />
                  ) : (
                    <ArrowDownwardIcon sx={{ fontSize: 18, cursor: 'pointer' }} onClick={handleSort} />
                  )}
                  <Box>Họ và Tên</Box>
                </Stack>
              </TableCell>
              <TableCell size='small' align='center' sx={{ fontWeight: 'bold' }}>
                Ảnh đại diện
              </TableCell>
              <TableCell size='small' align='center' sx={{ fontWeight: 'bold' }}>
                Email
              </TableCell>
              <TableCell size='small' align='center' sx={{ fontWeight: 'bold' }}>
                Số điện thoại
              </TableCell>  
              {type === 'NORMAL_USER' && (  <TableCell size='small' align='center' sx={{ fontWeight: 'bold' }}>
              Vai trò  
              </TableCell>  )}                                
              <TableCell size='small' sx={{ fontWeight: 'bold' }}>
                <Stack direction={'row'} alignItems={'center'}>
                  <TableUserFilter filterObject={filterObject} setFilterObject={setFilterObject} type={'STATUS'} />
                  Trạng thái
                </Stack>
              </TableCell>
             <TableCell size='small' align='center' sx={{ fontWeight: 'bold' }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!isLoading ? (
              !!data ? (
                data?.map((a: any, index: number) => (
                  <TableRow hover={true} key={a.id}>
                    <TableCell>
                      {index + 1 + ((pagination?.currentPage || 1) - 1) * pagination?.pageSize ?? 10}
                    </TableCell>
                    <TableCell size='small' align='left'>
                      <Typography sx={{ cursor: 'pointer' }} onClick={() => handleNavigate(a.id)} align='center'>
                        {a.fullName}
                      </Typography>
                    </TableCell>
                    <TableCell align='center' size='small'>
                     <Box sx={{width:"100%", display:"flex", justifyContent:"center" }}><Avatar alt='Avatar of user' src={a.avatar} /></Box> 
                    </TableCell>
                    <TableCell align='center' size='small'>
                      {a.email ? <Typography> {a.email}</Typography> : <Typography>Chưa xác nhận</Typography>}
                    </TableCell>
                    <TableCell align='center' size='small'>
                      {a.phone ? <Typography> {a.phone}</Typography> : <Typography>Chưa xác nhận</Typography>}
                    </TableCell>
                    {type === 'NORMAL_USER' && (
                      <TableCell align='left' size='small'>
                        <Typography sx={{ ml: 3 }} align='center'>
                          {a.role}
                        </Typography>
                      </TableCell>
                    )}
                    <TableCell size='small'>
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
                      {a.status === 'UNVERIFIED' && (
                        <Chip
                          color='warning'
                          sx={{
                            color: '#FFFFFF',
                            fontWeight: 'bold'
                          }}
                          label={'CHƯA XÁC NHẬN'}
                        />
                      )}
                    </TableCell>
                    {session?.user.role === 'SYSTEM_ADMIN' && (
                      <TableCell align='center' size='small'>
                        {/* <EditOutlinedIcon
                  color='info' 
                  sx={{cursor:"pointer"}}
                  onClick={()=>handleUpdateUser(a.id, "ACTIVE")}
                  />                  */}

                        <PopUpUpdateUser
                          id={a.id}
                          status={a.status}
                          currentDataFilter={filterObject}
                          reload={setFilterObject}
                        />
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow hover>
                  <TableCell colSpan={type === 'NORMAL_USER' ? 8 : 7}>
                    <Typography variant='body1' textAlign={'center'}>
                      Không có dữ liệu
                    </Typography>
                  </TableCell>
                </TableRow>
              )
            ) : (
              [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(a => (
                <TableRow hover={true} key={a}>
                  <TableCell>{a + 1}</TableCell>
                  <TableCell size='small' align='left'>
                    <Skeleton variant='rectangular' />
                  </TableCell>
                  <TableCell align='center' size='small'>
                    <Skeleton variant='circular' />
                  </TableCell>
                  <TableCell align='center' size='small'>
                    <Skeleton variant='rectangular' />
                  </TableCell>
                  <TableCell align='center' size='small'>
                    <Skeleton variant='rectangular' />
                  </TableCell>
                  {type === 'NORMAL_USER' && (
                    <TableCell align='left' size='small'>
                      <Skeleton variant='rectangular' />
                    </TableCell>
                  )}
                  <TableCell size='small'>
                    <Skeleton variant='rectangular' />
                  </TableCell>
                  {session?.user.role === 'SYSTEM_ADMIN' && (
                    <TableCell align='center' size='small'>
                      <Skeleton variant='rectangular' />
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {pagination && <Pagin data={pagination} filterObject={filterObject} setFilterObject={setFilterObject} />}
    </Box>
  )
}

export default TableListUser
