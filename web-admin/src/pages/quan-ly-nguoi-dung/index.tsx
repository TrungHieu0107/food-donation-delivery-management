'use client'

import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import { Box, InputAdornment, Stack, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import axiosClient from 'src/api-client/ApiClient'
import { KEY } from 'src/common/Keys'
import TableListUser from '../quan-ly-nguoi-dung/nguoi-dung-thuong/TableListUser'
import UserLayout from 'src/layouts/UserLayout'

interface filter {
  page: number
  keyWords: string
  pageSize: number,
  roleIds: any
}

function UserManagement() {

  const [filterObject, setFilterObject] = useState<filter>({
    keyWords: '',
    page: 1,
    pageSize: 10,
    roleIds:""
  })
  const [data, setData] = useState<any>()
  const [dataRoles, setDataRoles] = useState<any>()
  const [dataPagination, setDataPagination] = useState<any>()

  const handleKeywordChange = (e: any) => {
    console.log(e.target.value)

    setFilterObject({
      ...filterObject,
      keyWords: e.target.value
    })
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseRole: any = await axiosClient.get(`/roles`)
        const objectVolunteer = responseRole.data.find((item: any) => item.name === "CHARITY_UNIT");
        const objectCharity = responseRole.data.find((item: any) => item.name === "VOLUNTEER");
        let finalFilter
        if(!filterObject.roleIds){
          finalFilter = {...filterObject, roleIds: [objectVolunteer.id,objectCharity.id]}
        }else{
          finalFilter = filterObject
        }
               
        const response: any = await axiosClient.get("/users", 
        {
          params: finalFilter,
          paramsSerializer: {
          indexes: null 
          }
      })      
        console.log(response.data, responseRole.data)
        const filterRole = [objectVolunteer, objectCharity] 
        setDataRoles(filterRole)
        if(response.data){
            setData(response.data.filter((u: any)=>u.role !== "Admin của chi nhánh" && u.role !== "Admin của hệ thống" && u.role !== "Cộng tác viên"))
        }else{
            setData([])
        }
        setDataPagination(response.pagination)
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [filterObject])

  return (
    <Box>
      <Stack direction='row' justifyContent={'space-between'} alignItems={'flex-end'} sx={{ mb: 5 }}>
        <Stack direction='column' spacing={5}>
          <Stack direction={'row'} justifyContent={'flex-start'} spacing={10} alignItems={'center'}>
            {/* <InputLabel sx={{ color: 'black' }}>Tên hoạt động:</InputLabel> */}
            <TextField
              size='small'
              placeholder='Tìm theo từ khóa'
              label='Tên/Email/Số điện thoại'
              onBlur={handleKeywordChange}
              sx={{ minWidth: '300px' }}
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
        {/* {session?.user.role === 'SYSTEM_ADMIN' && (
          <Button
            startIcon={<AddBoxOutlinedIcon />}
            variant='contained'
            size='small'
            sx={{
              background: '#77D7D3',
              borderRadius: '20px',
              mb: 1
            }}
            onClick={handleAddNewActivities}
          >
            Tạo quản trị viên chi nhánh
          </Button>
        )} */}
      </Stack>
      {data ? (
        <TableListUser
          data={data}
          pagination={dataPagination}
          filterObject={filterObject}
          setFilterObject={setFilterObject}
          dataRoles={dataRoles}
          type={"NORMAL_USER"}
        />
      ) : (
        <Box>Loading</Box>
      )}
    </Box>
  )
}

export default UserManagement

UserManagement.auth = {
  role: [KEY.ROLE.SYSTEM_ADMIN]
}
UserManagement.getLayout = (page: React.ReactNode) => (
  <UserLayout pageTile='Danh sách người dùng'>{page}</UserLayout>
)