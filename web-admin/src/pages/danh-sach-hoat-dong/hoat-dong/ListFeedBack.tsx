import { Box, Pagination, Rating, Stack, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { formateDateDDMMYYYYHHMM } from 'src/@core/layouts/utils'
import axiosClient from 'src/api-client/ApiClient'

interface filterObject {
  page: number
  pageSize: number
  activityId: string | undefined | string[]
  status: number | null
}
function ListFeedBack() {
  const router = useRouter()
  const { slug } = router.query
  const [filterObject, setFilterObject] = useState<filterObject>({
    page: 1,
    pageSize: 10,
    activityId: slug,
    status: 0
  })
  const [dataFeedback, setDataFeedback] = useState<any>()
  const [dataPagination, setDataPagination] = useState<any>()
  const handlePageChange = (event: any, page: any) => {
    setFilterObject({ ...filterObject, page: page })
  }
  console.log("dataFB", dataFeedback);
  useEffect(() => {
    const getListFeedBack = async () => {
      try {
        const response: any = await axiosClient.get(`/activity-feedbacks`, {
          params: filterObject
        })
        setDataFeedback(response.data || null)
        setDataPagination(response.pagination)
      } catch (error) {
        console.log('error getting list feedback', error)
      }
    }
    if (slug) {
      getListFeedBack()
    }
  }, [slug])

  return (
    <Box sx={{ width: '80%', m: 'auto' }}>
      {dataFeedback?.activityId ? (
        <>
          <Typography sx={{ textAlign: 'center', fontWeight: 700, fontSize: '20px', mt: 10, mb: 3 }}>
            Danh sách các phản hồi của hoạt động
          </Typography>
          <Stack direction={'row'} justifyContent={'center'} alignItems={'center'} spacing={3} sx={{ mb: 10 }}>
            {' '}
            <Typography component='legend'>
              <span style={{ fontWeight: 600 }}>Tổng đánh giá: </span>
            </Typography>
            <Rating name='read-only' value={dataFeedback?.averageStar ? dataFeedback?.averageStar : 0} readOnly />
          </Stack>
          {dataFeedback?.feedbackResponses?.map((f: any) => (
            <Box
              key={f.id}
              sx={{ width: '100%', bgcolor: 'rgba(118, 224, 253, 0.4)', mb: 5, p: 3, borderRadius: '20px' }}
            >
              <Typography sx={{ mb: 3 }}>
                <span style={{ fontWeight: 600 }}>Nội dung:</span> {f.content}
              </Typography>
              <Typography sx={{ mb: 3 }}>
                <span style={{ fontWeight: 600 }}>Ngày tạo: </span>
                {f?.createdDate ? formateDateDDMMYYYYHHMM(f?.createdDate) : 'Chưa xác định'}
              </Typography>
              <Stack direction={'row'} alignItems={'center'} spacing={3}>
                {' '}
                <Typography component='legend'>
                  <span style={{ fontWeight: 600 }}>Đánh giá: </span>
                </Typography>
                <Rating name='read-only' value={f.rating ? f.rating : 0} readOnly />
              </Stack>
            </Box>
          ))}
          <Box justifyContent={'center'} alignItems='center' display={'flex'} width={'100%'} sx={{ mb: 10, mt: 3 }}>
            <Pagination
              color='primary'
              count={Math.ceil(dataPagination?.total ? dataPagination?.total / 10 : 0)}
              onChange={handlePageChange}
              page={dataPagination?.currentPage ? dataPagination?.currentPage : 0}
            />
          </Box>
        </>
      ) : (
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 10, mb: 10 }}>
          <Typography variant='h5' sx={{ fontWeight: 700, textAlign: 'center' }}>
            Hiện chưa có phản hồi nào cho hoạt động này
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default ListFeedBack
