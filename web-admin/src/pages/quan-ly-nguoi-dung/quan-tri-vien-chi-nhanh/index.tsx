'use client'
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import { Button, InputAdornment, Paper, Stack, TextField } from '@mui/material'
import useSession from 'src/@core/hooks/useSession'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import axiosClient from 'src/api-client/ApiClient'
import { KEY } from 'src/common/Keys'
import UserLayout from 'src/layouts/UserLayout'
import TableListUser from '../nguoi-dung-thuong/TableListUser'

interface filter {
  page: number
  keyWords: string
  pageSize: number
}

function BranchAdminManagement() {
  const { session }: any = useSession()
  const router = useRouter()
  const handleCreateBranchAdmin = () => {
    router.push('tao-quan-tri-vien-chi-nhanh')
  }
  const [filterObject, setFilterObject] = useState<filter>({
    keyWords: '',
    page: 1,
    pageSize: 10
  })
  const [data, setData] = useState<any>()
  const [dataRoles, setDataRoles] = useState<any>()
  const [dataPagination, setDataPagination] = useState<any>()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const handleKeywordChange = (e: any) => {
    console.log(e.target.value)

    setFilterObject({
      ...filterObject,
      keyWords: e.target.value
    })
  }

  useEffect(() => {
    setIsLoading(true)
    const fetchData = async () => {
      try {
        const responseRole: any = await axiosClient.get(`/roles`)
        const desiredObject = responseRole.data.find((item: any) => item.name === 'BRANCH_ADMIN')
        const finalFilter = { ...filterObject, roleIds: [desiredObject.id] }
        const response: any = await axiosClient.get('/users', {
          params: finalFilter,
          paramsSerializer: {
            indexes: null // by default: false
          }
        })
        console.log(response.data, responseRole.data)
        setDataRoles(responseRole.data)
        if (response.data) {
          setData(response.data)
        } else {
          setData([])
        }
        setDataPagination(response.pagination)
      } catch (error) {
        console.log(error)
        toast.error('Lấy thông tin thất bại')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [filterObject])

  return (
    <Paper sx={{
      padding: 5
    }} elevation={3}>
      {/* <Typography variant='h6' fontWeight={550} mb={3}>Danh sách người dùng</Typography> */}
      <Stack direction='row' justifyContent={'space-between'} alignItems={'flex-end'} sx={{ mb: 5 }}>
        <Stack direction='column' spacing={5}>
          <Stack direction={'row'} justifyContent={'flex-start'} spacing={10} alignItems={'center'}>
            {/* <InputLabel sx={{ color: 'black' }}>Tên hoạt động:</InputLabel> */}
            <TextField
              size='small'
              placeholder='Tìm theo từ khóa'
              label='Tên/Email/Số điện thoại'
              onBlur={handleKeywordChange}
              sx={{ minWidth: '450px' }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchOutlinedIcon />
                  </InputAdornment>
                )
              }}
            />
          </Stack>
        </Stack>
        {session?.user.role === 'SYSTEM_ADMIN' && (
          <Button
            startIcon={<AddBoxOutlinedIcon />}
            color='info'
            variant='contained'
            size='small'
            sx={{
              borderRadius: '20px',
              mb: 1
            }}
            onClick={handleCreateBranchAdmin}
          >
            Tạo quản trị viên chi nhánh
          </Button>
        )}
      </Stack>
        <TableListUser
          data={data}
          pagination={dataPagination}
          filterObject={filterObject}
          setFilterObject={setFilterObject}
          dataRoles={dataRoles}
          type='BRANCH_ADMIN'
          isloading={isLoading}
        />
    </Paper>
  )
}

export default BranchAdminManagement

BranchAdminManagement.auth = {
  role: [KEY.ROLE.SYSTEM_ADMIN]
}
BranchAdminManagement.getLayout = (page: React.ReactNode) => (
  <UserLayout pageTile='Danh sách quản trị viên chi nhánh'>{page}</UserLayout>
)