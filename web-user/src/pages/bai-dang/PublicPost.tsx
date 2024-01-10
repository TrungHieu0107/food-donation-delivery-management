'use client'

import {
    Box,
    Button,
    CircularProgress,
    Stack,
    Typography
} from '@mui/material'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import axiosClient from 'src/api-client/ApiClient'
import { UserAPI } from 'src/api-client/User'
import { UserModel } from 'src/models/User'
import { CommonRepsonseModel } from 'src/models/common/CommonResponseModel'
import PostDetail from './PostDetail'

interface filter {
  page: number
  pageSize: number
  status: string
}

function PublicPost() {
  const [filterObject, setFilterObject] = useState<filter>({
    page: 1,
    pageSize: 10,
    status: 'ACTIVE'
  })
  const [data, setData] = useState<any>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isLoadMore, setIsLoadMore] = useState<boolean>(false)
  const [isChangeStatus, setIsChangeStatus] = useState<boolean>(false)
  const { status } = useSession()
  const [userLogin, setUserLogin] = useState<UserModel>()



  const fetchDataUserLogin = async () => {
    try {
      const data = await UserAPI.getProfileLogin()
      const commonDataResponse = new CommonRepsonseModel<UserModel>(data)
      setUserLogin(commonDataResponse.data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    if (status === 'authenticated') {
      fetchDataUserLogin()
    }
  }, [status])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: any = await axiosClient.get(`/posts`, {
          params: filterObject,
          paramsSerializer: {
            indexes: null
          }
        })
        console.log(response)
        if (data.length === 0 || filterObject.page === 1) {
          setData(response.data || [])
        } else {
          if (isChangeStatus) {
            setData(response.data || [])
            
          } else {
            setData((prevData: any) => [...prevData, ...(response.data || [])])        
          }
        }
        if (response?.data?.length === 0 || response?.data === null) {
          setIsLoadMore(false)
        } else {
          setIsLoadMore(true)
        }
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
        setIsChangeStatus(false)
      }
    }
    fetchData()
  }, [filterObject])


  const handleLoadMore = () => {
    setFilterObject({
      ...filterObject,
      page: filterObject.page + 1
    })
  }

  return (
    <Box sx={{ p: 5, width:"70vw", m:"auto" }}>
      {isLoading === false &&
        data.length > 0 &&
        data.map((p: any, index: any) => (
          <PostDetail type={"PUBLIC"} userLogin={userLogin} setData={setData} setFilterObject={setFilterObject} filterObject={filterObject} key={index} data={p} />
        ))}
      {isLoading === true &&  <Stack
        sx={{ height: '50vh', width: '100%' }}
        direction={'column'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <CircularProgress color='info' />
        <Typography>Đang tải dữ liệu...</Typography>
      </Stack>}
      <Box sx={{ width: '90%', m: 'auto', mt: 3, mb: 3 }}>
        {isLoadMore && (
          <Button variant='contained' fullWidth color='info' onClick={handleLoadMore}>
            Tải thêm
          </Button>
        )}
        {(isLoadMore === false && isLoading === false) && (
          <Typography sx={{ fontWeight: 700, textAlign: 'center' }}>Hiện không có bài viết để tải lên</Typography>
        )}
      </Box>
    </Box>
  )
}

export default PublicPost
