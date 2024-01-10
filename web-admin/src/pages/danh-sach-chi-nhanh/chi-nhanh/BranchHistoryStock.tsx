import { Box, CircularProgress, Grid, Pagination, Stack, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import axiosClient from 'src/api-client/ApiClient'
import Calendar from 'src/layouts/components/calendar/Calendar'
import TableHistoryStockOfBranch from './BranchHistoryStockTable'

interface filter {
  startDate: string
  endDate: string
  page: number
  pageSize: number
}

function BranchHistoryStock() {
  const [data, setData] = useState<any>()
  const [loading, setLoading] = useState<boolean>(false)
  const [filterObject, setFilterObject] = useState<filter>({
    startDate: '2023-1-1',
    endDate: '2024-1-1',
    page: 1,
    pageSize: 10
  })
  const [dataStockPagination, setDataStockPagination] = useState<any>()
  const router = useRouter()
  const { slug } = router.query
  const handlePageStockChange = (event: any, page: any) => {
    setFilterObject({ ...filterObject, page: page })
  }
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const res: any = await axiosClient.get(`/stock-updated-history-details/branch/${slug}`, {
          params: filterObject,
          paramsSerializer: {
            indexes: null
          }
        })
        console.log(res.data)
        setData(res.data || [])
        setDataStockPagination(res.pagination)
      } catch (error) {
        console.log(error)
        setData([])
      } finally {
        setLoading(false)
      }
    }
    if (slug) {
      fetchData()
    }
  }, [slug, filterObject])

  return (
    <Box sx={{minHeight:"60vh"}}>
      <Box sx={{ mb: 5, mt: 10, ml: { md: 10, xs: 0 }, width: { md: '50%' } }}>
        <Grid container spacing={3} sx={{ m: 'auto' }}>
          <Grid item xs={6} md={6}>
            <Calendar label='Ngày bắt đầu' filterObject={filterObject} setFilterObject={setFilterObject} />
          </Grid>
          <Grid item xs={6} md={6}>
            <Calendar label='Ngày kết thúc' filterObject={filterObject} setFilterObject={setFilterObject} />
          </Grid>
        </Grid>
      </Box>
      <Grid container spacing={5} sx={{ p: 5 }}>
        {loading && (
          <Stack
            sx={{ height: '50vh', width: '100%' }}
            direction={'column'}
            justifyContent={'center'}
            alignItems={'center'}
          >
            <CircularProgress color='secondary' />
            <Typography>Đang tải dữ liệu.....</Typography>
          </Stack>
        )}
        {data?.length === 0 && (
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
            <Typography variant='h5' fontWeight={600} sx={{mt: "20vh"}}>
              Hiện chưa có lịch sử xuất/nhập kho cho chi nhánh này
            </Typography>
          </Box>
        )}
        {data?.length > 0 && loading === false &&
          <TableHistoryStockOfBranch d={data}/>
          }
      </Grid>
      {data?.length > 0 && loading === false &&<Box justifyContent={'center'} alignItems='center' display={'flex'} width={'100%'}>
        <Pagination
          color='primary'
          count={Math.ceil(dataStockPagination?.total ? dataStockPagination?.total / 10 : 0)}
          onChange={handlePageStockChange}
          page={dataStockPagination?.currentPage ? dataStockPagination?.currentPage : 0}
        />
      </Box>}
    </Box>
  )
}

export default BranchHistoryStock
