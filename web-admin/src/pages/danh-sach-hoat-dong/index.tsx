'use client'

import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import {
  Box,
  Button,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  SelectChangeEvent,
  TextField
} from '@mui/material'
import { Theme, useTheme } from '@mui/material/styles'
import useSession from 'src/@core/hooks/useSession'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import axiosClient from 'src/api-client/ApiClient'
import { KEY } from 'src/common/Keys'
import UserLayout from 'src/layouts/UserLayout'
import Calendar from 'src/layouts/components/calendar/Calendar'
import ActivitiesTable from 'src/layouts/components/table/ActivitiesTable'

function getStyles(name: string, selectName: readonly string[], theme: Theme) {
  return {
    fontWeight: selectName.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium
  }
}
interface filter {
  name: string
  startDate: string
  endDate: string
  activityTypeIds: string[]
  page: number
  isJoined: boolean | null
  pageSize: number
  orderBy: string | null
  sortType: number | null
}
const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
}
function ListActivities() {
  const theme = useTheme()
  const router = useRouter()
  const handleAddNewActivities = () => {
    router.push('/danh-sach-hoat-dong/tao-hoat-dong-moi')
  }
  const {session}: any = useSession()
  const [filterObject, setFilterObject] = useState<filter>({
    name: '',
    startDate: '',
    endDate: '',
    activityTypeIds: [],
    page: 1,
    pageSize: 10,
    isJoined: null,
    orderBy: null,
    sortType: null
  })
  const [data, setData] = useState<any>()
  const [dataPagination, setDataPagination] = useState<any>()
  const [selectedType, setSelectedType] = useState<string[]>([])
  const [dataSelect, setDataSelect] = useState<{ id: string; name: string }[]>([
    { id: '1', name: 'Quyên góp' },
    { id: '2', name: 'Lao động tình nguyện' },
    { id: '3', name: 'Hỗ trợ phát đồ' }
  ])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [checked, setChecked] = useState(false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked)
    if (event.target.checked) {
      setFilterObject({
        ...filterObject,
        isJoined: true
      })
    } else {
      setFilterObject({
        ...filterObject,
        isJoined: null
      })
    }
  }
  const handleTypeChange = (event: SelectChangeEvent<typeof selectedType>) => {
    const {
      target: { value }
    } = event
    setSelectedType(typeof value === 'string' ? value.split(',') : value)
    setFilterObject({
      ...filterObject,
      activityTypeIds: typeof value === 'string' ? [value] : value
    })
  }
  const handleTextChange = (e: any) => {
    setFilterObject({
      ...filterObject,
      name: e.target.value
    })
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const response: any = await axiosClient.get(`/activities`, {
          params: filterObject
        })
        const responseTypes = await axiosClient.get('/activity-types')
        setData(response.data)
        setDataPagination(response.pagination)
        setDataSelect(responseTypes.data)
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [filterObject])

  return (
    <Paper
      sx={{
        padding: 5
      }}
    >
      <Grid container spacing={5} justifyContent={'flex-start'}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            size='small'
            fullWidth
            placeholder='Nhập tên hoạt động'
            label='Tên hoạt động'
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
        <Grid item xs={12} sm={6} md={3}>
          <FormControl sx={{ width: '100%' }} size='small'>
            <InputLabel id='select-type'>Loại hoạt động</InputLabel>
            <Select
              multiple
              value={selectedType}
              fullWidth
              onChange={handleTypeChange}
              labelId='select-type'
              input={<OutlinedInput label='Loại hoạt động' />}
              renderValue={selected => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                  {selected.map(value => (
                    <Chip key={value} label={dataSelect.find(item => item.id === value)?.name} variant='outlined' />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {dataSelect.map(item => (
                <MenuItem key={item.id} value={item.id} style={getStyles(item.name, selectedType, theme)}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>{' '}
        </Grid>
        <Grid item xs={6} sm={6} md={2}>
          <Calendar label='Ngày bắt đầu' filterObject={filterObject} setFilterObject={setFilterObject} />
        </Grid>
        <Grid item xs={6} sm={6} md={2}>
          <Calendar label='Ngày kết thúc' filterObject={filterObject} setFilterObject={setFilterObject} />
        </Grid>
        {session?.user.role === "BRANCH_ADMIN" && 
        <Grid item xs={12} sm={6} md={2}>
          <FormControlLabel label='Đã tham gia' control={<Checkbox checked={checked} onChange={handleChange} />} />
        </Grid>
        }
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
        <Button
          startIcon={<AddBoxOutlinedIcon />}
          variant='contained'
          color='info'
          size='small'
          sx={{
            borderRadius: '20px',
            mt: 3,
            mb: 3
          }}
          onClick={handleAddNewActivities}
        >
          Tạo hoạt động
        </Button>
      </Box>

      <ActivitiesTable
        data={data}
        isLoading={isLoading}
        pagination={dataPagination}
        filterObject={filterObject}
        setFilterObject={setFilterObject}
      />
    </Paper>
  )
}

export default ListActivities

ListActivities.auth = {
  role: [KEY.ROLE.BRANCH_ADMIN, KEY.ROLE.SYSTEM_ADMIN]
}
ListActivities.getLayout = (page: React.ReactNode) => (
  <UserLayout pageTile='Danh sách hoạt động từ thiện'>{page}</UserLayout>
)