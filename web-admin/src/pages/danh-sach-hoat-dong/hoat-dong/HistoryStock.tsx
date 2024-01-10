import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  CircularProgress,
  Grid,
  Pagination,
  Stack,
  Typography
} from '@mui/material'
import moment from 'moment'
import { useRouter } from 'next/router'
import { SyntheticEvent, useEffect, useState } from 'react'
import axiosClient from 'src/api-client/ApiClient'
import Calendar from 'src/layouts/components/calendar/Calendar'

interface filter {
  startDate: string
  endDate: string
  page: number
  pageSize: number
}

function HistoryStock() {
  const [data, setData] = useState<any>()
  const [loading, setLoading] = useState<boolean>(false)
  const [dataStockPagination, setDataStockPagination] = useState<any>()
  const [filterObject, setFilterObject] = useState<filter>({
    startDate: '2023-1-1',
    endDate: '2024-12-12',
    page: 1,
    pageSize: 10
  })
  const router = useRouter()
  const { slug } = router.query
  const [expanded, setExpanded] = useState<string | false>(false)

  const handleChange = (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false)
  }
  const handlePageStockChange = (event: any, page: any) => {
    setFilterObject({ ...filterObject, page: page })
  }
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const res: any = await axiosClient.get(`stock-updated-history-details/activity/${slug}`, {
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
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10, mb: 10 }}>
        <Grid container spacing={3} sx={{ width: '80%' }}>
          <Grid item xs={6} md={6}>
            <Calendar label='Ngày bắt đầu' filterObject={filterObject} setFilterObject={setFilterObject} />
          </Grid>
          <Grid item xs={6} md={6}>
            <Calendar label='Ngày kết thúc' filterObject={filterObject} setFilterObject={setFilterObject} />
          </Grid>
        </Grid>
      </Box>
      {loading && (
        <Stack sx={{ height: '50vh' }} direction={'row'} justifyContent={'center'} alignItems={'center'} spacing={5}>
          <CircularProgress color='secondary' />
          <Typography>Đang tải dữ liệu...</Typography>
        </Stack>
      )}

      {data?.length === 0 && loading === false && (
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Typography variant='h5' sx={{ fontWeight: 700, textAlign: 'center' }}>
            Hiện không có dữ liệu thống kê cho hoạt động này
          </Typography>
        </Box>
      )}
      {data?.length > 0 &&
        data?.map((d: any, index: any) => (
          <Box sx={{ width: '80%', m: 'auto', mb: 5 }} key={d.id}>
            <Accordion
              sx={{ bgcolor: '#E3FAF5' }}
              expanded={expanded === `panel${index}`}
              onChange={handleChange(`panel${index}`)}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index}bh-content`}
                id={`panel${index}bh-header`}
              >
                {d.type === 'IMPORT' && (
                  <Stack direction={'column'}>
                    <Typography>
                      <span style={{ fontWeight: 600, color: '#00c853' }}>
                        +{d.quantity} {d.unit} {d.name}
                      </span>
                      , quyên góp từ nhà hảo tâm{' '}
                      <span style={{ fontWeight: 600, color: '#0288d1' }}>{d.donorName}</span> cho{' '}
                      <span style={{ fontWeight: 600, color: '#0288d1' }}>{d.pickUpPoint}</span>{' '}
                    </Typography>
                    <Typography>{moment(d.createdDate).format('DD/MM/YYYY')}</Typography>
                  </Stack>
                )}
                {d.type === 'EXPORT' && (
                  <Stack direction={'column'}>
                    <Typography>
                      <span style={{ fontWeight: 600, color: '#f44336' }}>
                        -{d.quantity} {d.unit} {d.name}
                      </span>
                      , được quyên góp bởi <span style={{ fontWeight: 600, color: '#0288d1' }}>{d.donorName}</span>{' '}
                      thông qua <span style={{ fontWeight: 600, color: '#0288d1' }}>{d.pickUpPoint}</span> đã giao cho{' '}
                      <span style={{ fontWeight: 600, color: '#0288d1' }}>{d.deliveryPoint}</span>{' '}
                    </Typography>
                    <Typography>{moment(d.createdDate).format('DD/MM/YYYY')}</Typography>
                  </Stack>
                )}
              </AccordionSummary>
              <AccordionDetails>
                <Typography>Ghi chú: {d.note ? d.note : 'Không có ghi chú'}</Typography>
              </AccordionDetails>
            </Accordion>
          </Box>
        ))}
      {data?.length > 0 && (
        <Box justifyContent={'center'} alignItems='center' display={'flex'} width={'100%'} sx={{ mb: 10, mt: 5 }}>
          <Pagination
            color='primary'
            count={Math.ceil(dataStockPagination?.total ? dataStockPagination?.total / 10 : 0)}
            onChange={handlePageStockChange}
            page={dataStockPagination?.currentPage ? dataStockPagination?.currentPage : 0}
          />
        </Box>
      )}
    </Box>
  )
}

export default HistoryStock
