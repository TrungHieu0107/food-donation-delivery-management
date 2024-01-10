'use client'

import {
    Avatar,
    Box,
    Chip,
    Paper,
    Skeleton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography
} from '@mui/material'
import { format } from 'date-fns'
import { useRouter } from 'next/router'
import Pagin from 'src/layouts/components/pagination/Pagination'

const TableListPost = ({ data, pagination, isLoading, filterObject, setFilterObject }: any) => {
  const router = useRouter()
  const handleNavigate = (id: string) => {
    router.push(`bai-viet/chi-tiet/${id}`)
  }

  return (
    <Paper>
      <TableContainer>
        <Table aria-label='simple table'>
          <TableHead
            sx={{
              borderRadius: '10px 10px 0px 0px'
            }}
          >
            <TableRow>
              <TableCell size='small' sx={{ color: '#ffffff', fontWeight: 'bold', pl: 0 }}>
                #
              </TableCell>

              <TableCell size='small' sx={{ color: '#ffffff', fontWeight: 'bold', pl: 0 }}>
                Tên hoạt động
              </TableCell>

              <TableCell size='small' align='center' sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                Thể loại
              </TableCell>
              <TableCell size='small' sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                Ngày bắt đầu
              </TableCell>

              <TableCell size='small' sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                Ngày kết thúc
              </TableCell>
              <TableCell size='small' sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                <Stack direction={'row'} alignItems={'center'}>
                  Phạm vi
                </Stack>
              </TableCell>
              <TableCell size='small' sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                <Stack direction={'row'} alignItems={'center'}>               
                  Trạng thái
                </Stack>
              </TableCell>

              <TableCell size='small' sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                Thao tác
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!isLoading && data
              ? data.map((a: any, index: number) => (
                  <TableRow hover={true} key={a.id}>
                    <TableCell size='small' align='left' onClick={() => handleNavigate(a.id)}>
                      {index + 1 }
                    </TableCell>
                    <TableCell size='small' align='left' onClick={() => handleNavigate(a.id)}>
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
                      >
                        {a.name}
                      </Typography>
                    </TableCell>
                    <TableCell align='left' size='small'>
                      <Stack direction={'row'} spacing={2} justifyContent={"center"} sx={{ mt: 2, mb: 2 }}>
                        {a.activityTypeComponents?.map((d: any) => (
                          <Box key={d}>
                            {d === 'Lao động tình nguyện' && (

                              // <Chip
                              //   sx={{ fontWeight: 'bold', p: 1 }}
                              //   label={d}
                              //   color='success'
                              //   icon={<Diversity1RoundedIcon />}
                              // />
                              <Tooltip title="Lao động tình nguyện">
                              <Avatar alt="Remy Sharp"  src="https://cdn-icons-png.flaticon.com/512/4994/4994354.png" />
                              </Tooltip>
                            )}
                            {d === 'Quyên góp' && (

                              // <Chip
                              //   sx={{ fontWeight: 'bold', p: 1 }}
                              //   label={d}
                              //   color='info'
                              //   icon={<FavoriteBorderOutlinedIcon />}
                              // />
                              <Tooltip title="Quyên góp">
                              <Avatar alt="Remy Sharp" src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Heart_coraz%C3%B3n.svg/768px-Heart_coraz%C3%B3n.svg.png" />
                              </Tooltip>
                            )}
                            {d === 'Hỗ trợ phát đồ' && (

                              // <Chip
                              //   sx={{ fontWeight: 'bold', p: 1 }}
                              //   color='secondary'
                              //   icon={<VolunteerActivismOutlinedIcon />}
                              //   label={d}
                              // />
                              <Tooltip title="Hỗ trợ phát đồ">
                              <Avatar alt="Remy Sharp" sx={{border: "1px solid"}} src="https://thumbs.dreamstime.com/b/vector-illustrations-red-heart-blue-color-hand-icon-isolated-white-background-red-heart-hand-icon-272457682.jpg" />
                              </Tooltip>
                            )}
                          </Box>
                        ))}
                      </Stack>
                    </TableCell>
                    <TableCell align='left' size='small'>
                      {a.startDate ? (
                        <Typography>{format(new Date(a.startDate), 'dd/MM/yyyy')}</Typography>
                      ) : (
                        <Stack direction={'column'} alignItems={'center'}>
                          
                          <Typography>(dự kiến)</Typography>
                        </Stack>
                      )}
                    </TableCell>
                    <TableCell align='left' size='small'>
                      {a.endDate ? (
                        <Typography>{format(new Date(a.endDate), 'dd/MM/yyyy')}</Typography>
                      ) : (
                        <Stack direction={'column'} alignItems={'center'}>
                         
                          <Typography>(dự kiến)</Typography>
                        </Stack>
                      )}
                    </TableCell>
                    <TableCell align='left' size='small'>
                     
                    </TableCell>
                    <TableCell align='center' size='small'>
                      {a.status === 'NOT_STARTED' && (
                        <Chip
                          color='info'
                          sx={{
                            color: '#FFFFFF',
                            fontWeight: 'bold'
                          }}
                          label={'CHƯA BẮT ĐẦU'}
                        />
                      )}
                      {a.status === 'STARTED' && (
                        <Chip
                          color='primary'
                          sx={{
                            color: '#FFFFFF',
                            fontWeight: 'bold'
                          }}
                          label={'ĐANG HOẠT ĐỘNG'}
                        />
                      )}
                      {a.status === 'ENDED' && (
                        <Chip
                          color='success'
                          sx={{
                            color: '#FFFFFF',
                            fontWeight: 'bold'
                          }}
                          label={'ĐÃ KẾT THÚC'}
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
                    <TableCell align='center' size='small'>
                     
                    </TableCell>
                  </TableRow>
                ))
              : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((_, index: number) => (
                  <TableRow sx={{ height: '100px' }} hover={true} key={index}>
                    <TableCell>
                      <Skeleton variant='rectangular' />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant='rectangular' />
                    </TableCell>
                    <TableCell align='left' size='small'>
                      <Skeleton variant='rectangular' />
                    </TableCell>
                    <TableCell align='left' size='small'>
                      <Skeleton variant='rectangular' />
                    </TableCell>
                    <TableCell align='left' size='small'>
                      <Skeleton variant='rectangular' />
                    </TableCell>
                    <TableCell align='left' size='small'>
                      <Skeleton variant='rectangular' />
                    </TableCell>
                    <TableCell align='center' size='small'>
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
    </Paper>
  )
}

export default TableListPost
