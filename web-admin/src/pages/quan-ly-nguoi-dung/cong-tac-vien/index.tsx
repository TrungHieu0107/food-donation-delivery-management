'use client'

import { Paper } from '@mui/material'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import axiosClient from 'src/api-client/ApiClient'
import { KEY } from 'src/common/Keys'
import UserLayout from 'src/layouts/UserLayout'
import FilterCollaborators from './FilterCollaborator'
import TableListCollaborators from './TableListCollaborators'

interface filter {
  page: number
  pageSize: number
}

function CollaboratorManagement() {
  const [filterObject, setFilterObject] = useState<filter>({
    page: 1,
    pageSize: 10
  })
  const [data, setData] = useState<any>()
  const [dataPagination, setDataPagination] = useState<any>()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    setIsLoading(true)
    const fetchData = async () => {
      try {
        const response: any = await axiosClient.get('/collaborators', {
          params: filterObject,
          paramsSerializer: {
            indexes: null // by default: false
          }
        })
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
    <Paper
      elevation={3}
      sx={{
        padding: 5
      }}
    >
      {/* <Typography variant='h6' fontWeight={550} mb={3}>
        Danh sách cộng tác viên
      </Typography> */}
      <FilterCollaborators filter={filterObject} setFilter={setFilterObject} />
      <TableListCollaborators
        data={data}
        pagination={dataPagination}
        filterObject={filterObject}
        setFilterObject={setFilterObject}
        isLoading={isLoading}
      />
    </Paper>
  )
}

export default CollaboratorManagement

CollaboratorManagement.auth = {
  role: [KEY.ROLE.SYSTEM_ADMIN]
}
CollaboratorManagement.getLayout = (page: React.ReactNode) => (
  <UserLayout pageTile='Danh sách cộng tác viên'>{page}</UserLayout>
)