import {
  Box,
  Chip,
  CircularProgress,
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
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { formateDateDDMMYYYYHHMM } from 'src/@core/layouts/utils'
import axiosClient from 'src/api-client/ApiClient'
import Pagin from 'src/layouts/components/pagination/Pagination'
import FilterComponet from 'src/layouts/components/table/TableFilter'
import MenuApply from './MenuAction'

interface filter {
  name: string
  startDate: string
  endDate: string
  activityTypeIds: string[]
  page: number
}

function MembersTab({ isJoined }: any) {
  const router = useRouter()
  const { slug } = router.query
  const [members, setMembers] = useState<any>([])
  const [filterObject, setFilterObject] = useState<filter>({
    name: '',
    startDate: '',
    endDate: '',
    activityTypeIds: [],
    page: 1
  })
  const [dataPagination, setDataPagination] = useState<any>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const fetchData = async () => {
    setIsLoading(true)
    try {
      const response: any = await axiosClient.get(`/activity-members?activityId=${slug}`)
      console.log(response.data)
      setMembers(response.data || [])
      setDataPagination(response.pagination)
      setIsLoading(false)
    } catch (error) {
      console.log(error)
      setMembers([])
      setIsLoading(false)
    }
  }
  useEffect(() => {
    if (slug) {
      fetchData()
    }
  }, [slug])

  if (members) {
    return (
      <Box>
        {members?.length === 0 && (
          <Box
            sx={{
              height: '40px',
              mb: 5,
              mt: 10,
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Typography variant='h5' fontWeight={600}>
              Hiện chưa có người đóng góp tham gia hoạt động này
            </Typography>
          </Box>
        )}
        {members?.length > 0 && (
          <>
            <Box
              sx={{
                height: '40px',
                mb: 5,
                mt: 10,
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Typography variant='h5' fontWeight={600}>
                Danh sách người đóng góp tham gia hoạt động
              </Typography>
            </Box>
            <Box sx={{ p: 10 }}>
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
                        Họ và tên
                      </TableCell>
                      <TableCell size='small' sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                        Email
                      </TableCell>
                      <TableCell size='small' align='center' sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                        Số điện thoại
                      </TableCell>
                      <TableCell size='small' sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                        Ngày đăng kí
                      </TableCell>

                      <TableCell size='small' sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                        Ngày xác nhận
                      </TableCell>

                      
                        <TableCell size='small' sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                          <Stack direction={'row'} alignItems={'center'}>
                          {isJoined && ( <FilterComponet
                              filterObject={filterObject}
                              setFilterObject={setFilterObject}
                              type={'STATUS'}
                            />
                            )}
                            Trạng thái
                          </Stack>
                        </TableCell>
                      

                      <TableCell size='small' sx={{ color: '#ffffff', fontWeight: 'bold' }}></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {!isLoading && members
                      ? members?.map((a: any, index: number) => (
                          <TableRow hover={true} key={a.id}>
                            <TableCell
                              size='small'
                              align='left'
                              onClick={() => {
                                console.log(a.id)
                              }}
                            >
                              {index + 1}
                            </TableCell>
                            <TableCell
                              size='small'
                              align='left'
                              onClick={() => {
                                console.log(a.id)
                              }}
                            >
                              <Typography
                                sx={{
                                  width: '200px'

                                  // '&:hover': {
                                  //   cursor: 'pointer',
                                  //   fontFamily: 'Roboto',
                                  //   fontStyle: 'normal',
                                  //   fontWeight: 'bold',
                                  //   fontSize: '20px'
                                  // }
                                }}
                                noWrap={true}
                              >
                                {a?.user?.name}
                              </Typography>
                            </TableCell>
                            <TableCell align='left' size='small'>
                              {a?.user?.email}
                            </TableCell>
                            <TableCell align='left' size='small'>
                              {a?.user?.phone ? a?.user?.phone : 'Chưa cập nhật'}
                            </TableCell>
                            <TableCell align='left' size='small'>
                              {a.createdDate ? (
                                <Typography>{formateDateDDMMYYYYHHMM(a.createdDate)}</Typography>
                              ) : (
                                <Stack direction={'column'} alignItems={'center'}>
                                  <Typography>Chưa xác định</Typography>
                                </Stack>
                              )}
                            </TableCell>
                            <TableCell align='left' size='small'>
                              {a.confirmedDate ? (
                                <Typography>{formateDateDDMMYYYYHHMM(a.confirmedDate)}</Typography>
                              ) : (
                                <Stack direction={'column'} alignItems={'center'}>
                                  <Typography>Chưa xác định</Typography>
                                </Stack>
                              )}
                            </TableCell>
                            <TableCell  size='small'>
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
                            <TableCell align='center' size='small'>
                              {a.status === 'UNVERIFIED' && <MenuApply id={a.id} fetchData={fetchData} />}
                            </TableCell>
                          </TableRow>
                        ))
                      : [0, 1, 2, 3, 4, 5].map((_, index: number) => (
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
              {dataPagination && (
                <Pagin data={dataPagination} filterObject={filterObject} setFilterObject={setFilterObject} />
              )}
            </Box>
          </>
        )}
      </Box>
    )
  } else {
    return (
      <Stack
        sx={{ height: '50vh', width:"100%" }}
        direction={'column'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <CircularProgress color='secondary' />
        <Typography>Đang tải dữ liệu...</Typography>
      </Stack>
    )
  }
}

export default MembersTab
