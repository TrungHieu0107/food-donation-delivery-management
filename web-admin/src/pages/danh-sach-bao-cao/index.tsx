'use client'

import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import React, { useEffect, useState, SyntheticEvent } from 'react'
import { formateDateDDMMYYYYHHMM } from 'src/@core/layouts/utils'
import axiosClient from 'src/api-client/ApiClient'
import { KEY } from 'src/common/Keys'
import UserLayout from 'src/layouts/UserLayout'
import useSession from 'src/@core/hooks/useSession'
import {useRouter} from "next/router"

interface filter {
  keyWord: string
  page: number
  pageSize: number
  reportType: number | null
}

function ListReport() {
  const { session }: any = useSession()
  console.log('session in report page: ', session)
  const [filterObject, setFilterObject] = useState<filter>({
    keyWord: '',
    page: 1,
    pageSize: 10,
    reportType: null
  })
  const [expanded, setExpanded] = useState<string | false>(false)
  const [data, setData] = useState<any>([])
  const router = useRouter()
  const handleChange = (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false)
  }
  const [dataPagination, setDataPagination] = useState<any>()
  const handleTextChange = (e: any) => {
    setFilterObject({
      ...filterObject,
      keyWord: e.target.value
    })
  }
  const handlePageChange = (event: any, page: any) => {
    setFilterObject({ ...filterObject, page: page })
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: any = await axiosClient.get(`/reports/admin`, {
          params: filterObject
        })
        setData(response.data || [])
        setDataPagination(response.pagination)
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [filterObject])

  return (
    <Paper
      sx={{
        padding: 5,
        minHeight: '80vh'
      }}
    >
      <Grid container spacing={5} sx={{ mt: 3, mb: 5 }}>
        <Grid item xs={12} sm={6} md={6}>
          {' '}
          <TextField
            size='small'
            fullWidth
            placeholder='Nhập tên báo cáo...'
            label='Tên báo cáo'
            onBlur={handleTextChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchOutlinedIcon />
                </InputAdornment>
              )
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <FormControl sx={{ width: '100%' }}>
            <InputLabel id='demo-simple-select-label'>Loại</InputLabel>
            <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              value={filterObject.reportType}
              label='Loại'
              fullWidth
              size='small'
              onChange={(event: any) => {
                const newQuery = {
                  ...filterObject,
                  reportType: event?.target?.value !== -1 ? event?.target?.value : null
                }
                setFilterObject(newQuery)
              }}
            >
              <MenuItem value={-1}>Tất cả</MenuItem>
              <MenuItem value={0}>Thiếu vật phẩm mà nhà hảo tâm đã đóng góp</MenuItem>
              <MenuItem value={1}>Nơi cần giúp đỡ nhận thiếu vật phẩm</MenuItem>
              <MenuItem value={2}>Nhà hảo tâm không quyên góp vật phẩm</MenuItem>
              <MenuItem value={3}>Nhà hảo tâm đã quyên góp xong trước đó</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      {data?.length > 0 ? (
        data?.map((r: any, index: any) => (
          <Accordion
            sx={{ border: 'none', bgcolor: '#FFFBEB', mb: 3 }}
            expanded={expanded === `panel${index}`}
            onChange={handleChange(`panel${index}`)}
            key={index}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}bh-content`}
              id={`panel${index}bh-header`}
            >
              <Stack direction={'row'} spacing={2} alignItems={'center'} sx={{ width: '50%', flexShrink: 0 }}>
                <Tooltip
                  title={
                    <React.Fragment>
                      <Typography color='primary'>Email: {r.email}</Typography>
                      <Divider />
                      <Typography color='primary'>Số điện thoại: {r.phone} </Typography>
                    </React.Fragment>
                  }
                >
                  <Avatar src={r.avatar} />
                </Tooltip>
                <Box>
                  <Typography>Tên: {r.userName}</Typography>
                  <Typography sx={{ mb: 3, ml: 0, mt: 3 }}>Tiêu đề báo cáo: {r.title}</Typography>
                </Box>
              </Stack>
              <Box>
                {r.type === 'MISSING_ITEMS_TO_CHARITY' && (
                  <Chip label={'Nơi cần giúp đỡ nhận thiếu vật phẩm'} color='info' />
                )}
                {r.type === 'MISSING_ITEMS_FROM_CONTRIBUTOR' && (
                  <Chip label={'Thiếu vật phẩm mà nhà hảo tâm đã đóng góp'} color='info' />
                )}
                {r.type === 'CONTRIBUTOR_DO_NOT_GIVE_ITEMS' && (
                  <Chip label={'Nhà hảo tâm không quyên góp vật phẩm'} color='info' />
                )}
                {r.type === 'CONTRIBUTOR_ALREADY_GIVEN_ALL_ITEMS' && (
                  <Chip label={'Nhà hảo tâm đã quyên góp xong trước đó'} color='info' />
                )}
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ width: '100%' }}>
              <Grid container sx={{ width: '100%' }} flexDirection={'column'} spacing={3}>
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  {' '}
                  <Typography sx={{ mb: 3 }}>Ngày tạo: {formateDateDDMMYYYYHHMM(r.createdDate)}</Typography>
                  <Typography>Nội dung báo cáo: {r.content}</Typography>{' '}
                </Grid>
                {!!r?.deliveredUser && (
                  <Grid item display={'flex'} flexDirection={'column'}>
                    <Typography sx={{ mb: 3 }} fontWeight={550}>Người thực hiện vận chuyển</Typography>
                    <Box display={'flex'} flexDirection={'row'} flexWrap={'nowrap'} gap={2} ml={3}>
                      <Avatar
                        src={r?.deliveredUser?.avatar}
                        alt={r?.deliveredUser?.userName}
                        sx={{
                          width: '100px',
                          height: '100px'
                        }}
                      />
                      <Box display={'flex'} flexDirection={'column'} flexWrap={'nowrap'} justifyContent={'center'}>
                        <Typography fontWeight={550}>{r?.deliveredUser?.userName}</Typography>
                        <Typography fontWeight={550}>
                          Email:
                          <Typography component={'span'} px={1}>
                            {r?.deliveredUser?.email}
                          </Typography>
                        </Typography>
                        <Typography fontWeight={550}>
                          Số điện thoại:
                          <Typography component={'span'} px={1}>
                            {r?.deliveredUser?.phone}
                          </Typography>
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
                <Grid item display={'flex'} justifyContent={'center'}>
                  <Button
                    variant='contained'
                    size='small'
                    onClick={() => {
                      router.push(`/van-chuyen/${r?.deliveryRequestId}`)
                    }}
                  >
                    Xem chi tiết
                  </Button>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        ))
      ) : (
        <Typography variant='h5' sx={{ fontWeight: 550, textAlign: 'center', mt: 10 }}>
          Không có dữ liệu
        </Typography>
      )}
      {data?.length > 0 && (
        <Box
          justifyContent={'center'}
          alignItems='center'
          display={'flex'}
          sx={{
            margin: '20px 0px'
          }}
        >
          <Pagination
            color='primary'
            count={Math.ceil(dataPagination?.total ? dataPagination?.total / 10 : 0)}
            onChange={handlePageChange}
            page={dataPagination?.currentPage ? dataPagination?.currentPage : 0}
          />
        </Box>
      )}
    </Paper>
  )
}

export default ListReport

ListReport.auth = {
  role: [KEY.ROLE.SYSTEM_ADMIN]
}
ListReport.getLayout = (page: React.ReactNode) => <UserLayout pageTile='Tổng hợp bài báo cáo'>{page}</UserLayout>
