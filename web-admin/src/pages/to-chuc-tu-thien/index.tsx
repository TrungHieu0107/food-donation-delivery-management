'use client'

import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import { InputAdornment, Paper, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import axiosClient from 'src/api-client/ApiClient'
import { KEY } from 'src/common/Keys'
import { PaginationModel } from 'src/models/common/CommonResponseModel'
import TableListCharities from './TableListCharities'
import UserLayout from 'src/layouts/UserLayout'

interface filter {
  page: number
  pageSize: number
  name: string
}

function ListCharities() {
  const [filterObject, setFilterObject] = useState<filter>({
    page: 1,
    pageSize: 10,
    name: ''
  })
  const [data, setData] = useState<any>()
  const [dataPagination, setDataPagination] = useState<PaginationModel>()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const response: any = await axiosClient.get(`/charities`,{
          params: filterObject
        })
        console.log('data', response.data)
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
  const handleTextChange = (e: any) => {
    setFilterObject({
      ...filterObject,
      name: e.target.value
    })
  }

  return (
    <Paper sx={{ px: 5, py: 5 }}>
      <TextField
        size='small'
        sx={{ mb: 5, width:"50%" }}
        placeholder='Tìm kiếm theo tên tổ chức'
        label='Tên tổ chức'
        onBlur={handleTextChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <SearchOutlinedIcon />
            </InputAdornment>
          )
        }}
      />
      <TableListCharities
        data={data}
        isLoading={isLoading}
        pagination={dataPagination}
        filterObject={filterObject}
        setFilterObject={setFilterObject}
      />
    </Paper>
  )
}

export default ListCharities

ListCharities.auth = {
  role: [KEY.ROLE.BRANCH_ADMIN, KEY.ROLE.SYSTEM_ADMIN]
}
ListCharities.getLayout = (page: React.ReactNode) => (
  <UserLayout pageTile='Danh sách tổ chức từ thiện'>{page}</UserLayout>
)