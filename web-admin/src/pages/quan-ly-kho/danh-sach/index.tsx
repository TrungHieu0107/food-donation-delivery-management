import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft'
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import {
  Box,
  Card,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  styled
} from '@mui/material'
import moment from 'moment'
import { useEffect, useState } from 'react'
import axiosClient from 'src/api-client/ApiClient'
import { KEY } from 'src/common/Keys'
import UserLayout from 'src/layouts/UserLayout'
import SingleItemTab from './SingleItemTab'

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
  itemId: string
}
interface itemFilterObject {
  page: number
  pageSize: number
  itemCategoryType: number | null
  itemCategoryId: string | null
  searchKeyWord: string
}

export default function StockManagement() {
  const [dataSearch, setDataSearch] = useState<stockFilterObject>({
    page: 1,
    pageSize: 10,
    branchId: '',
    itemId: ''
  })
  const [itemFilterObject, setItemFilterObject] = useState<itemFilterObject>({
    page: 1,
    pageSize: 16,
    itemCategoryId: null,
    itemCategoryType: null,
    searchKeyWord: ''
  })
  const [dataPagination, setDataPagination] = useState<any>()
  const [dataStockPagination, setDataStockPagination] = useState<any>()
  const [branchProfile, setBranchProfile] = useState<any>()
  const [dataStock, setDataStock] = useState<any>()
  const [items, setItems] = useState<any>([])
  const [categories, setCategories] = useState<any>([])
  const [categorySelected, setCategorySelected] = useState<any>("0")
  const [currentSelected, setCurrentSelected] = useState<any>()
  const [isFood, setIsFood] = useState<any>(false)
  const [unit, setUnit] = useState<any>('')
  useEffect(() => {
    fetchAllItemCategory()
    fetchProfileBranchAdmin()
  }, [])
  useEffect(() => {
    if (dataSearch.branchId && dataSearch.itemId) {
      try {
        fetchDataStock()
      } catch (err) {
        console.log(err)
      }
    }
  }, [dataSearch])
  useEffect(() => {
    console.log("zo", itemFilterObject.itemCategoryId);
    const fetchAllItem = async () => {
      try {
        const response: any = await axiosClient.get(`/item`, {
          params: itemFilterObject
        })
        setItems(response.data || [])
        setDataPagination(response.pagination)
      } catch (error) {
        console.log(error)
      }
    }
    fetchAllItem()
  }, [itemFilterObject])
  const handleChangeIsFood = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsFood(event.target.checked)
    if (event.target.checked) {
      setItemFilterObject({
        ...itemFilterObject,
        itemCategoryType: 0
      })
    } else {
      setItemFilterObject({
        ...itemFilterObject,
        itemCategoryType: null
      })
    }
  }
  const fetchAllItemCategory = async () => {
    try {
      const response: any = await axiosClient.get(`/item-categories`)
      setCategories(response.data || [])
    } catch (error) {
      console.log(error)
    }
  }
  const fetchProfileBranchAdmin = async () => {
    try {
      const response: any = await axiosClient.get(`/branches/profile`)
      setBranchProfile(response.data)
      setDataSearch({ ...dataSearch, branchId: response?.data?.id })
    } catch (error) {
      console.log(error)
    }
  }

  const fetchDataStock = async () => {
    try {
      const response: any = await axiosClient.get(`/branch/${dataSearch.branchId}/items/${dataSearch.itemId}`)
      setDataStock(response.data || null)
      setDataStockPagination(response.pagination)
      setUnit(response?.data?.currentStocksDetails[0]?.unit || '')
    } catch (error) {
      console.log(error)
      setDataStock(null)
    }
  }
  const handleTextChange = (e: any) => {
    setItemFilterObject({
      ...itemFilterObject,
      searchKeyWord: e.target.value
    })
  }
  const handlePageChange = (data: any) => {
    setItemFilterObject({ ...itemFilterObject, page: data })
  }
  const handlePageStockChange = (event: any, page: any) => {
    setDataSearch({ ...dataSearch, page: page })
  }
  console.log(itemFilterObject);

  return (
    <Box>
      <Grid container spacing={5} sx={{ mt: 3 }}>
        <Grid item xs={12} sm={5} md={5}>
          <TextField
            size='small'
            fullWidth
            placeholder='Nhập tên vật phẩm'
            label='Tên vật phẩm'
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
        <Grid item xs={12} sm={5} md={5}>
          <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'>Loại vật phẩm</InputLabel>
            <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              value={categorySelected}
              size='small'
              label='Loại vật phẩm'
              onChange={e => {
                
                if (e.target.value as string === "0") {
                  console.log("value ở 0", e.target.value);
                  setItemFilterObject({ ...itemFilterObject, itemCategoryId: null })
                  setCategorySelected("0")

                  return
                }else{
                  setCategorySelected(e.target.value as string)
                  setItemFilterObject({ ...itemFilterObject, itemCategoryId: e.target.value as string })
                }
                
              }}
            >
              <MenuItem value={"0"} key={"0"}>Tất cả</MenuItem>
              {categories.map((c: any) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={2} md={2}>
          <FormControlLabel label='Thực phẩm' control={<Checkbox checked={isFood} onChange={handleChangeIsFood} />} />
        </Grid>
      </Grid>
      <Grid container sx={{ mt: 5 }}>
        <Grid item lg={5} md={12} sm={12} xs={12} sx={{ position: 'relative', pr: '25px' }}>
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
                : `Kết quả tìm kiếm vật phẩm: ${
                    (dataPagination?.currentPage - 1) * dataPagination?.pageSize + 1
                  }-${Math.min(dataPagination?.currentPage * dataPagination?.pageSize, dataPagination?.total)}/${
                    dataPagination?.total
                  }`}
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

         
            <Grid container spacing={3}>
              
                {items?.map((item: any) => (
                  <Grid key={item.itemTemplateId} item xs={12} md={6}>
                  <SingleItemTab
                   
                    item={item}
                    isActive={item.itemTemplateId === currentSelected ? true : false}
                    setCurrentSelected={setCurrentSelected}
                    setDataSearch={setDataSearch}
                    dataSearch={dataSearch}
                    branchProfile={branchProfile}
                  />
                  </Grid>
                ))}
              
            </Grid>
         
        </Grid>

        <Grid item xl lg md={12} sm={12} xs={12} pt='45px'>
          <Paper
            sx={{ width: '100%', height: '100%', borderRadius: '20px', display: 'flex', justifyContent: 'center' }}
          >
            {!dataStock && (
              <Stack direction={'column'} alignItems={'center'} sx={{ pt: 15 }}>
                <Typography sx={{ fontWeight: 700, fontSize: '20px', textAlign: 'center', pt: 5, mb: 10 }}>
                  Hiện không có thông tin
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
            {dataStock && (
              <Box sx={{ p: 5, width: '100%' }}>
                <Typography sx={{ fontWeight: 700, fontSize: '20px', textAlign: 'center', mb: 5 }}>
                  Thông tin trong kho
                </Typography>
                <TableContainer>
                  <Table aria-label='collapsible table'>
                    <TableHead
                      sx={{
                        borderRadius: '10px 10px 0px 0px'
                      }}
                    >
                      <TableRow>
                        <TableCell size='small' align='center' sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                        Tổng số lượng vật phẩm
                        </TableCell>
                        <TableCell size='small' align='center' sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                        Số lượng vật phẩm khả dụng
                        </TableCell>
                        <TableCell size='small' align='center' sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                        Số vật phẩm không khả dụng
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell size='small' align='center' sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                        {dataStock?.total} {unit}
                        </TableCell>
                        <TableCell size='small' align='center' sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                        {dataStock?.totalItemAvailable} {unit}
                        </TableCell>
                        <TableCell size='small' align='center' sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                        {dataStock?.totalItemNotAvailable} {unit}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                {dataStock?.currentStocksDetails?.map((x: any) => (
                  <Card key={x.stockId} sx={{ mt: 3, mb: 3, p: 2, bgcolor: '#a7ffeb' }}>
                    <Grid container alignItems={'center'}>
                      <Grid item xs={10}>
                        <Typography sx={{ mb: 3 }}>
                          <span style={{ fontWeight: 600 }}>Số lượng:</span> {x?.quantity} {x?.unit}
                        </Typography>
                        <Typography>
                          <span style={{ fontWeight: 600 }}>Ngày hết hạn:</span>{' '}
                          {moment(x?.exprirationDate).format('DD/MM/YYYY')}
                        </Typography>
                      </Grid>
                      {x?.status === 'EXPIRED' && (
                        <Grid item xs={2}>
                          <Chip label='Hết hạn' color='error' />
                        </Grid>
                      )}
                      {x?.status === 'VALID' && (
                        <Grid item xs={2}>
                          <Chip label='Còn hạn' color='info' />
                        </Grid>
                      )}
                    </Grid>
                  </Card>
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

StockManagement.auth = [KEY.ROLE.BRANCH_ADMIN, KEY.ROLE.SYSTEM_ADMIN]
StockManagement.getLayout = (page: React.ReactNode) => (
  <UserLayout pageTile='Thông tin vật phẩm trong kho'>{page}</UserLayout>
)
