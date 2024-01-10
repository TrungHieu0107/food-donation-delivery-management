'use client'

import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import { Box, Button, Grid, InputAdornment, Paper, TextField } from '@mui/material'
import useSession from 'src/@core/hooks/useSession'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import axiosClient from 'src/api-client/ApiClient'
import { KEY } from 'src/common/Keys'
import UserLayout from 'src/layouts/UserLayout'
import TableListBranch from './TableListBranch'

interface filter {
  page: number
  name: string
  address: string
  pageSize: number
}

function BranchManagement() {
  const { session }: any = useSession()
  const router = useRouter()
  const handleAddNewActivities = () => {
    router.push('danh-sach-chi-nhanh/tao-chi-nhanh-moi')
  }
  const [filterObject, setFilterObject] = useState<filter>({
    name: '',
    address: '',
    page: 1,
    pageSize: 10
  })
  const [data, setData] = useState<any>()
  const [dataPagination, setDataPagination] = useState<any>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const handleAddressChange = (e: any) => {
    console.log(e.target.value)

    setFilterObject({
      ...filterObject,
      address: e.target.value
    })
  }

  const handleNameChange = (e: any) => {
      setFilterObject({
        ...filterObject,
        name: e.target.value
      })
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const apiUrl = `/branches`
        const response: any = await axiosClient.get(apiUrl, {
          params: {
            ...filterObject
          }
        })
        console.log(response.data)
        setData(response.data)
        setDataPagination(response.pagination)
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
        paddingY: 5,
        paddingX: 10
      }}
    >
      <Grid container spacing={5}>
        <Grid item xs={12} md={4}>
          <TextField
            autoComplete='off'
            size='small'
            placeholder='Tìm theo tên chi nhánh'
            label='Tên chi nhánh'
            onBlur={handleNameChange}
            sx={{ width: '100%' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchOutlinedIcon />
                </InputAdornment>
              )
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          {' '}
          <TextField          
            size='small'
            placeholder='Tìm theo địa chỉ'
            label='Địa chỉ'
            onBlur={handleAddressChange}
            sx={{ width: '100%' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchOutlinedIcon />
                </InputAdornment>
              )
            }}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', mt: 3 }}>
        {session?.user.role === 'SYSTEM_ADMIN' && (
          <Button
            startIcon={<AddBoxOutlinedIcon />}
            variant='contained'
            color='info'
            size='small'
            sx={{
              borderRadius: '20px',
              mb: 3
            }}
            onClick={handleAddNewActivities}
          >
            Tạo chi nhánh mới
          </Button>
        )}
      </Box>

      <TableListBranch
        data={data}
        isLoading={isLoading}
        pagination={dataPagination}
        filterObject={filterObject}
        setFilterObject={setFilterObject}
      />
    </Paper>
  )
}

export default BranchManagement

BranchManagement.auth = {
  role: [KEY.ROLE.BRANCH_ADMIN, KEY.ROLE.SYSTEM_ADMIN]
}
BranchManagement.getLayout = (page: React.ReactNode) => (
  <UserLayout pageTile='Danh sách chi nhánh hệ thống'>{page}</UserLayout>
)
