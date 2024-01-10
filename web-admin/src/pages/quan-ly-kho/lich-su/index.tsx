import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft'
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight'
import RoofingSharpIcon from '@mui/icons-material/RoofingSharp'
import {
  Autocomplete,
  Box,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  styled
} from '@mui/material'
import { useEffect, useState } from 'react'
import useSession from 'src/@core/hooks/useSession'
import axiosClient from 'src/api-client/ApiClient'
import { KEY } from 'src/common/Keys'
import UserLayout from 'src/layouts/UserLayout'
import Calendar from 'src/layouts/components/calendar/Calendar'
import SingleItemTab from './CharityView'
import DetailHistoryStockOfBranch from './DetailHistoryStockOfBranch'

export const Page = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: 'center',
  color: theme.palette.text.secondary,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  padding: 20,
  minHeight: '500px'
}))

interface stockFilterObject {
  page: number
  pageSize: number
  branchId: string
  charityUnitId: string
  startDate: string
  endDate: string
  type: number | null
}

interface charityFilterObject {
  page: number
  pageSize: number
}

export default function HistoryUpdateStockView() {
  const { session }: any = useSession()
  const role = session?.user.role ?? ''
  const [dataSearch, setDataSearch] = useState<stockFilterObject>({
    page: 1,
    pageSize: 5,
    branchId: '',
    charityUnitId: '',
    startDate: '2023-1-1',
    endDate: '2024-12-12',
    type: null
  })
  const [charityFilterObject, setItemFilterObject] = useState<charityFilterObject>({
    page: 1,
    pageSize: 10
  })
  const [dataPagination, setDataPagination] = useState<any>()
  const [dataStockPagination, setDataStockPagination] = useState<any>()
  const [branches, setBranches] = useState<any>([])
  const [branchProfile, setBranchProfile] = useState<any>()
  const [dataStock, setDataStock] = useState<any>([])
  const [items, setItems] = useState<any>([])
  const [currentSelected, setCurrentSelected] = useState<any>()
  useEffect(() => {
    if (role === KEY.ROLE.SYSTEM_ADMIN) {
      try {
        fetchAllBranch()
      } catch (err) {
        console.log(err)
      }
    } else {
      fetchProfileBranchAdmin()
    }
  }, [])
  useEffect(() => {
    if (dataSearch.branchId) {
      try {
        fetchDataStock()
      } catch (err) {
        console.log(err)
      }
    }
  }, [dataSearch])
  useEffect(() => {
    try {
      fetchAllItem()
    } catch (err) {
      console.log(err)
    }
  }, [charityFilterObject])
  const fetchProfileBranchAdmin = async () => {
    try {
      const response: any = await axiosClient.get(`/branches/profile`)
      console.log(response.data)
      setBranchProfile(response.data)
      setDataSearch({ ...dataSearch, branchId: response?.data?.id })
    } catch (error) {
      console.log(error)
    }
  }
  const fetchAllItem = async () => {
    try {
      const response: any = await axiosClient.get(`/charities`, {
        params: {
          ...charityFilterObject
        }
      })
      console.log(response.data)
      setItems(response.data || [])
      setDataPagination(response.pagination)
    } catch (error) {
      console.log(error)
    }
  }
  const fetchAllBranch = async () => {
    try {
      const response = await axiosClient.get(`/branches?page=1&pageSize=100`)
      setBranches(response.data || [])
    } catch (error) {
      console.log(error)
    }
  }
  const fetchDataStock = async () => {
    try {
      const response: any = await axiosClient.get(`/stock-updated-history-details/admin`, {
        params: dataSearch
      })
      setDataStock(response.data || [])
      setDataStockPagination(response.pagination)
    } catch (error) {
      console.log(error)
      setDataStock([])
    }
  }
  const handlePageChange = (data: any) => {
    setItemFilterObject({ ...charityFilterObject, page: data })
  }
  const handlePageStockChange = (event: any, page: any) => {
    setDataSearch({ ...dataSearch, page: page })
  }

  return (
    <Box>
      {/* <Typography variant='h5' fontWeight={700} textAlign={'center'} sx={{ mt: 5, mb: 5 }}>
        Danh sách vật phẩm trong kho
      </Typography> */}

      <Grid container spacing={3} sx={{ width:"80%", mt: 5 }}>
        {role === KEY.ROLE.SYSTEM_ADMIN && (
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size='small'>
              <Autocomplete
                size='small'
                disablePortal
                fullWidth
                renderInput={params => (
                  <TextField
                    {...params}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: <RoofingSharpIcon color='primary' />
                    }}
                    name='branch'
                    placeholder='Tên chi nhánh'
                    label='Chi nhánh'
                    fullWidth
                  />
                )}
                defaultValue={branches.filter((branch: any) => branch?.id === dataSearch?.branchId).at(0)}
                getOptionLabel={option => option.name ?? '_'}
                isOptionEqualToValue={(option, value) => option === value}
                options={branches}
                onChange={(_: React.SyntheticEvent, newValue) => {
                  const newQuery = {
                    ...dataSearch,
                    branchId: newValue?.id
                  }
                  setDataSearch(newQuery)
                }}
              />
            </FormControl>
          </Grid>
        )}

        <Grid item xs={6} md={4}>
          <Calendar label='Ngày bắt đầu' filterObject={dataSearch} setFilterObject={setDataSearch} />
        </Grid>
        <Grid item xs={6} md={4}>
          <Calendar label='Ngày kết thúc' filterObject={dataSearch} setFilterObject={setDataSearch} />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl sx={{ width: '100%' }}>
            <InputLabel id='demo-simple-select-label'>Loại</InputLabel>
            <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              value={dataSearch.type}
              label='Loại'
              fullWidth
              size='small'
              onChange={(event: any) => {
                const newQuery = {
                  ...dataSearch,
                  type: event?.target?.value !== -1 ? event?.target?.value : null
                }
                setDataSearch(newQuery)
              }}
            >
              <MenuItem value={-1}>Tất cả</MenuItem>
              <MenuItem value={0}>Nhập kho</MenuItem>
              <MenuItem value={1}>Xuất kho</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container sx={{ mt: 5 }}>
        <Grid item lg={6} md={12} sm={12} xs={12} sx={{ position: 'relative', pr: '25px' }}>
          <Box display='flex' gap={3} justifyContent='center' alignItems='center'>
            <IconButton
              disabled={dataPagination?.currentPage === 1 || dataPagination?.total === 0}
              color='secondary'
              size='small'
              onClick={() => handlePageChange(dataPagination?.currentPage - 1)}
            >
              <ArrowCircleLeftIcon fontSize='large' />
            </IconButton>

            <Typography
              variant='body1'
              mb='10px'
              sx={{ verticalAlign: 'middle', alignItems: 'center', display: 'flex' }}
            >
              {dataPagination?.total === 0
                ? 'Không tìm thấy'
                : `Kết quả tìm kiếm: ${(dataPagination?.currentPage - 1) * dataPagination?.pageSize + 1}-${Math.min(
                    dataPagination?.currentPage * dataPagination?.pageSize,
                    dataPagination?.total
                  )}/${dataPagination?.total}`}
            </Typography>

            <IconButton
              disabled={dataPagination?.currentPage * dataPagination?.pageSize >= dataPagination?.total}
              color='secondary'
              size='small'
              onClick={() => handlePageChange(dataPagination?.currentPage + 1)}
            >
              <ArrowCircleRightIcon fontSize='large' />
            </IconButton>
          </Box>

          <Stack alignItems='center' gap={2} flexDirection='row'>
            <Grid container spacing={3} flexDirection='column' pr='10px'>
              <Grid item>
                {items?.map((item: any) => (
                  <SingleItemTab
                    key={item.id}
                    item={item}
                    isActive={item.id === currentSelected ? true : false}
                    setCurrentSelected={setCurrentSelected}
                    setDataSearch={setDataSearch}
                    dataSearch={dataSearch}
                    branchProfile={branchProfile}
                  />
                ))}
              </Grid>
            </Grid>
          </Stack>
        </Grid>

        <Grid item xl lg md={12} sm={12} xs={12} pt='45px'>
          <Paper
            sx={{
              width: '100%',
              height: '100%',
              borderRadius: '20px',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            {dataStock?.length === 0 && (
              <Stack direction={'column'} alignItems={'center'} sx={{ pt: 15 }}>
                <Typography sx={{ fontWeight: 700, fontSize: '20px', textAlign: 'center', pt: 5, mb: 10 }}>
                  Hiện không có thông tin thống kê đối với tổ chức từ thiện bạn đã chọn!
                </Typography>
                <Box sx={{ width: { lg: '500px', md: '300px', sm: '200px', xs: '100px' } }}>
                  <img
                    style={{ width: '100%' }}
                    src={
                      'https://static.vecteezy.com/system/resources/previews/012/181/008/original/document-data-file-not-found-concept-illustration-flat-design-eps10-modern-graphic-element-for-landing-page-empty-state-ui-infographic-icon-etc-vector.jpg'
                    }
                    alt='not found'
                  />
                </Box>
              </Stack>
            )}
            {dataStock?.length > 0 && (
              <Box sx={{ p: 7, width: '100%' }}>
                <Typography sx={{ mt: 0, mb: 5, textAlign: 'center', fontWeight: 600, fontSize: '20px' }}>
                  Thông tin xuất/nhập kho
                </Typography>
                {dataStock?.map((d: any) => (
                  <DetailHistoryStockOfBranch key={d.id} d={d}/>
                ))}
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
                    count={Math.ceil(dataStockPagination?.total ? dataStockPagination?.total / 10 : 0)}
                    onChange={handlePageStockChange}
                    page={dataStockPagination?.currentPage ? dataStockPagination?.currentPage : 0}
                  />
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

HistoryUpdateStockView.auth = [KEY.ROLE.BRANCH_ADMIN, KEY.ROLE.SYSTEM_ADMIN]
HistoryUpdateStockView.getLayout = (page: React.ReactNode) => (
  <UserLayout pageTile='Lịch sử xuất/nhập vật phẩm trong kho'>{page}</UserLayout>
)
