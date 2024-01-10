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
import useSession from 'src/@core/hooks/useSession'
import { useRouter } from 'next/router'
import Pagin from '../pagination/Pagination'
import FilterComponet from './TableFilter'
import PositionedMenu from './TableMenuAction'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'

// import Diversity1RoundedIcon from '@mui/icons-material/Diversity1Rounded'
// import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
// import VolunteerActivismOutlinedIcon from '@mui/icons-material/VolunteerActivismOutlined'

const ActivitiesTable = ({ data, pagination, isLoading, filterObject, setFilterObject }: any) => {
  const { session }: any = useSession()
  const router = useRouter()
  const handleNavigate = (id: string) => {
    router.push(`danh-sach-hoat-dong/hoat-dong/${id}`)
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
                <Stack direction={'row'} justifyContent={'center'} spacing={2}>
                  <span>Ngày bắt đầu</span>
                  {filterObject?.sortType === 0 || filterObject?.sortType === null ? (
                    <ArrowUpwardIcon
                      fontSize={'small'}
                      sx={{ cursor: 'pointer' }}
                      onClick={() => {
                        setFilterObject({ ...filterObject, sortType: 1, orderBy: 'StartDate' })
                      }}
                    />
                  ) : (
                    <ArrowDownwardIcon
                      fontSize={'small'}
                      sx={{ cursor: 'pointer' }}
                      onClick={() => {
                        setFilterObject({ ...filterObject, sortType: 0, orderBy: 'StartDate' })
                      }}
                    />
                  )}
                </Stack>
              </TableCell>

              <TableCell size='small' sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                <Stack direction={'row'} justifyContent={'center'} spacing={2}>
                  <span>Ngày kết thúc</span>
                  {filterObject?.sortType === 0 || filterObject?.sortType === null ? (
                    <ArrowUpwardIcon
                      fontSize={'small'}
                      sx={{ cursor: 'pointer' }}
                      onClick={() => {
                        setFilterObject({ ...filterObject, sortType: 1, orderBy: 'EndDate' })
                      }}
                    />
                  ) : (
                    <ArrowDownwardIcon
                      fontSize={'small'}
                      sx={{ cursor: 'pointer' }}
                      onClick={() => {
                        setFilterObject({ ...filterObject, sortType: 0, orderBy: 'EndDate' })
                      }}
                    />
                  )}
                </Stack>
              </TableCell>
              <TableCell size='small' sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                <Stack direction={'row'} alignItems={'center'}>
                  {session?.user.role === 'SYSTEM_ADMIN' && (
                    <FilterComponet filterObject={filterObject} setFilterObject={setFilterObject} type={'SCOPE'} />
                  )}
                  Phạm vi
                </Stack>
              </TableCell>
              <TableCell size='small' sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                <Stack direction={'row'} alignItems={'center'}>
                  <FilterComponet filterObject={filterObject} setFilterObject={setFilterObject} type={'STATUS'} />
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
                      {index + 1 + (pagination.currentPage - 1) * pagination.pageSize}
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
                      <Stack direction={'row'} spacing={2} justifyContent={'center'} sx={{ mt: 2, mb: 2 }}>
                        {a.activityTypeComponents.map((d: any) => (
                          <Box key={d}>
                            {d === 'Lao động tình nguyện' && (
                              <Tooltip title='Lao động tình nguyện'>
                                <Avatar
                                  sx={{ width: '30px', height: '30px' }}
                                  alt='Remy Sharp'
                                  src='https://cdn-icons-png.flaticon.com/512/4994/4994354.png'
                                />
                              </Tooltip>
                            )}
                            {d === 'Quyên góp' && (
                              <Tooltip title='Quyên góp'>
                                <Avatar
                                  sx={{ width: '30px', height: '30px' }}
                                  alt='Remy Sharp'
                                  src='https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Heart_coraz%C3%B3n.svg/768px-Heart_coraz%C3%B3n.svg.png'
                                />
                              </Tooltip>
                            )}
                            {d === 'Hỗ trợ phát đồ' && (
                              <Tooltip title='Hỗ trợ phát đồ'>
                                <Avatar
                                  sx={{ width: '30px', height: '30px', border: '1px solid' }}
                                  alt='Remy Sharp'
                                  src='https://thumbs.dreamstime.com/b/vector-illustrations-red-heart-blue-color-hand-icon-isolated-white-background-red-heart-hand-icon-272457682.jpg'
                                />
                              </Tooltip>
                            )}
                          </Box>
                        ))}
                      </Stack>
                    </TableCell>
                    <TableCell align='left' size='small'>
                      {a.startDate ? (
                        <Typography align='center'>{format(new Date(a.startDate), 'dd/MM/yyyy')}</Typography>
                      ) : (
                        <Stack direction={'column'} alignItems={'center'}>
                          <Typography>{format(new Date(a.estimatedStartDate), 'dd/MM/yyyy')}</Typography>
                          <Typography>(dự kiến)</Typography>
                        </Stack>
                      )}
                    </TableCell>
                    <TableCell align='left' size='small'>
                      {a.endDate ? (
                        <Typography align='center'>{format(new Date(a.endDate), 'dd/MM/yyyy')}</Typography>
                      ) : (
                        <Stack direction={'column'} alignItems={'center'}>
                          <Typography>{format(new Date(a.estimatedEndDate), 'dd/MM/yyyy')}</Typography>
                          <Typography>(dự kiến)</Typography>
                        </Stack>
                      )}
                    </TableCell>
                    <TableCell align='left' size='small'>
                      {a.scope === 'PUBLIC' && <Typography>Cộng đồng</Typography>}
                      {a.scope === 'INTERNAL' && <Typography>Nội bộ</Typography>}
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
                          color='info'
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
                      {a.isJoined && session?.user.role === 'BRANCH_ADMIN' && (
                        <PositionedMenu id={a.id} setFilterObject={setFilterObject} />
                      )}
                      {session?.user.role === 'SYSTEM_ADMIN' && (
                        <PositionedMenu id={a.id} setFilterObject={setFilterObject} />
                      )}
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

export default ActivitiesTable
