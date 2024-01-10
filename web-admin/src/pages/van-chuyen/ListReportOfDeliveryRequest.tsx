'use client'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography
} from '@mui/material'
import { SyntheticEvent, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { formateDateDDMMYYYYHHMM } from 'src/@core/layouts/utils'
import axiosClient from 'src/api-client/ApiClient'

function ListReportOfDeliveryRequest({ id }: any) {
  const [listReport, setListReport] = useState<any>([])
  const [expanded, setExpanded] = useState<string | false>(false)
  const [statusUpdate, setStatusUpdate] = useState<number>(-1)
  const handleChange = (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false)
  }
  const handleUpdate = async () => {
    try {
      const res = await axiosClient.put(`delivery-requests/${id}/reports?deliveryRequestStatus=` + statusUpdate )
      console.log(res)
      toast.success('Cập nhật thành công')
    } catch (error) {
      console.log('err', error)
      toast.error('Cập nhật không thành công!')
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const reponseRoles = await axiosClient.get(`/reports/admin/delivery-request/${id}`)
        console.log(reponseRoles.data)
        setListReport(reponseRoles.data || [])
      } catch (error) {
        setListReport([])
        console.log(error)
      }
    }
    if (id) {
      fetchData()
    }
  }, [id])

  return (
    <Box sx={{ p: 5 }}>
      {listReport?.length > 0 &&
        (listReport[0]?.type === 'CONTRIBUTOR_DO_NOT_GIVE_ITEMS' ||
          listReport[0]?.type === 'CONTRIBUTOR_ALREADY_GIVEN_ALL_ITEMS') && (
          <Box display={'flex'} flexDirection={'column'} gap={2}>
            <Typography fontWeight={550}>
              Yêu cầu vận chuyển đã được báo cáo vui lòng cập nhật lại trạng thái:
            </Typography>
            <Stack direction={'row'} spacing={3} sx={{ mb: 5 }}>
              <FormControl sx={{ width: '30%' }}>
                <InputLabel id='demo-simple-select-label'>Cập nhật trạng thái</InputLabel>
                <Select
                  labelId='demo-simple-select-label'
                  id='demo-simple-select'
                  value={statusUpdate}
                  label='Cập nhật trạng thái'
                  fullWidth
                  size='small'
                  onChange={(event: any) => {
                    setStatusUpdate(+event?.target?.value)
                  }}
                >
                  <MenuItem value={-1}></MenuItem>
                  <MenuItem value={0}>Đang đợi</MenuItem>
                  <MenuItem value={9}>Hết hạn</MenuItem>
                </Select>
              </FormControl>
              <Button variant='contained' disabled={statusUpdate === -1} onClick={handleUpdate}>
                Cập nhật
              </Button>
            </Stack>
          </Box>
        )}
      {listReport?.length > 0 && (
        <Typography variant='h6' fontWeight={600} sx={{ mb: 3 }}>
          Danh sách các báo cáo
        </Typography>
      )}

      {listReport?.length > 0 &&
        listReport?.map((r: any, index: any) => (
          <Accordion
            sx={{ border: 'none', bgcolor: '#FFFBEB', mb: 3 }}
            expanded={expanded === `panel${index}`}
            onChange={handleChange(`panel${index}`)}
            key={index}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}bh-content`}
              id={`panel${index}bh-header`}
            >
              <Box>
                <Typography fontWeight={600} >Tiêu đề: {r.title}</Typography>
                <Stack direction={'row'} spacing={2} alignItems={'center'} sx={{  flexShrink: 0 }}>
                  <Avatar src={r.avatar} />
                  <Box>
                    <Typography fontWeight={550}>{r.userName}</Typography>
                    <Typography>Email: {r.email}</Typography>
                    <Typography>Số điện thoại: {r.phone}</Typography>
                  </Box>
                </Stack>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography sx={{ mb: 3 }}>Ngày tạo: {formateDateDDMMYYYYHHMM(r.createdDate)}</Typography>
              <Typography>Nội dung báo cáo: {r.content}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
    </Box>
  )
}

export default ListReportOfDeliveryRequest
