import {
  Box,
  CircularProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import axiosClient from 'src/api-client/ApiClient'
import PhaseDetailOfActivity from './PhaseDetailOfActivity'

function PhaseTab() {
  const router = useRouter()
  const { slug } = router.query
  const [dataPhases, setDataPhases] = useState<any>()
  const [dataRoles, setDataRoles] = useState<any>()
  useEffect(() => {
    if (slug) {
      const fetchData = async () => {
        try {
          const responsePhases = await axiosClient.get(`/phases/activity/${slug}`)
          console.log(responsePhases.data)
          const reponseRoles = await axiosClient.get(`/activity-roles/${slug}`)
          console.log(reponseRoles.data)
          setDataPhases(responsePhases.data || [])
          setDataRoles(reponseRoles.data || [])
        } catch (error) {
          setDataPhases([])
          setDataRoles([])
          console.log(error)
        }
      }
      fetchData()
    }
  }, [slug])
  if (dataPhases && dataRoles) { 
    return (
      <Box>
         {dataPhases?.length === 0 && 
        <Box
          sx={{ height: '40px', mb: 5, mt: 10, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <Typography variant='h5' fontWeight={600}>
            Hoạt động hiện tại chưa cập nhật giai đoạn
          </Typography>
        </Box>}
          {dataPhases?.length > 0 && 
        <Box
          sx={{ height: '40px', mb: 5, mt: 10, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <Typography variant='h5' fontWeight={600}>
            Danh sách giai đoạn của hoạt động
          </Typography>
        </Box>}

     {dataRoles?.length > 0 &&  <Box sx={{ p: 10, mt: 5, mb: 10 }}>
          <Stack direction={"row"} spacing={2} alignItems={"center"}> 
          <EditNoteOutlinedIcon/>
          <Typography variant='body2'>Bảng ghi chú các vai trò đang có trong hoạt động</Typography></Stack>
         
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label='simple table'>
              <TableHead>
                <TableRow>
                  <TableCell size='small' align='center'>
                    Vai trò
                  </TableCell>
                  <TableCell size='small' align='center'>
                    Mô tả
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataRoles?.map((row: any) => (
                  <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component='th' scope='row' align='center'>
                      {row.name}
                    </TableCell>
                    <TableCell align='center'>{row.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
  }
        {dataPhases.map((p: any) => (
          <PhaseDetailOfActivity key={p.id} phase={p} />
        ))}
      </Box>
    )
  } else {
    return (
      <Stack
        sx={{ height: '50vh', width:"100%" }}
        direction={'column'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <CircularProgress color='secondary' />
        <Typography>Đang tải dữ liệu...</Typography>
      </Stack>
    )
  }
}

export default PhaseTab
