'use client'

import {
  Box,
  CircularProgress,
  Paper,
  Typography
} from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import { toast } from 'react-toastify'
import axiosClient from 'src/api-client/ApiClient'
import PhaseDetail from './PhaseDetail'

const ActivityTask = () => {
  const router = useRouter()
  
  const [listPhases, setListPhases] = useState<any>([])
  const [listRoles, setListRoles] = useState<any>([])
  const [loading, setLoading] = useState<any>(true)
  const { slug } = router.query

  useEffect(() => { 
    const fetchData = async () => {
      try {
        const responsePhases = await axiosClient.get(`/phases/activity/${slug}`)
        const reponseRoles = await axiosClient.get(`/activity-roles/${slug}`)
        console.log(reponseRoles.data,responsePhases.data)   
        setListRoles(reponseRoles.data || [])
        setListPhases(responsePhases.data || [])
        setLoading(false)
      } catch (error) {
        console.log(error)
        setLoading(false)
        toast.error("Lỗi tải dữ liệu từ máy chủ")
      }
    }
    if (slug) {
      fetchData()
    }
  }, [slug])

  if (loading === false) {
    return (
      <Paper sx={{ p: 5, minHeight:"80vh" }}>
        {listPhases?.length > 0 ? listPhases.map((p: any)=>(
         <PhaseDetail key={p.id} phase={p} roles = {listRoles}/>
        ))
        :(
          <Typography variant='h6' align='center' sx={{mt:"30vh"}}>Vui lòng cập nhật giai đoạn và vai trò trước khi tiến hành tạo công việc</Typography>
        )
      }
       
      </Paper>
    )
  } else {
    return (
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', height: '70vh', alignItems: 'center' }}>
        <CircularProgress color='info' />
        <Typography>Đang tải dữ liệu...</Typography>
      </Box>
    )
  }
}

export default ActivityTask

