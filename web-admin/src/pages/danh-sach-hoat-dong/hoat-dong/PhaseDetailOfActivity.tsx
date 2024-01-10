import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined'
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Collapse,
  Divider,
  Grid,
  Stack,
  Typography
} from '@mui/material'
import { format } from 'date-fns'
import { useRouter } from 'next/router'
import * as React from 'react'
import { toast } from 'react-toastify'
import axiosClient from 'src/api-client/ApiClient'
import ListMemberInTask from './MemberInTask'

export default function PhaseDetailOfActivity({ phase }: any) {
  const [expanded, setExpanded] = React.useState(false)
  const router = useRouter()
  const { slug } = router.query
  const [listTasks, setListTasks] = React.useState<any>()

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosClient.get(`/activity-tasks/?activityId=${slug}&phaseId=${phase.id}`)
        console.log(response.data)
        setListTasks(response.data || [])
      } catch (error) {
        console.log(error)
        toast.error('Lỗi tải dữ liệu từ server')
      }
    }
    if (slug) {
      fetchData()
    }
  }, [slug])

  if (phase && listTasks) {
    return (
      <Card sx={{ m: 10, border: '1px solid' }}>
        <CardHeader />
        <CardContent>
          <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
            <Box>
              <Typography>Tên giai đoạn: {phase?.name}</Typography>

              {phase.status === 'NOT_STARTED' && (
                <Typography>
                  Thời gian bắt đầu (dự kiến): {format(new Date(phase.estimatedStartDate), 'dd/MM/yyyy')}
                </Typography>
              )}
              {phase.status === 'STARTED' && (
                <Typography>Thời gian bắt đầu: {format(new Date(phase.startDate), 'dd/MM/yyyy')}</Typography>
              )}
              {phase.status === 'ENDED' && (
                <Typography>Thời gian bắt đầu: {format(new Date(phase.startDate), 'dd/MM/yyyy')}</Typography>
              )}
              {phase.status === 'NOT_STARTED' && (
                <Typography>
                  Thời gian kết thúc (dự kiến): {format(new Date(phase.estimatedEndDate), 'dd/MM/yyyy')}
                </Typography>
              )}
              {phase.status === 'STARTED' && (
                <Typography>
                  Thời gian kết thúc (dự kiến): {format(new Date(phase.estimatedEndDate), 'dd/MM/yyyy')}
                </Typography>
              )}
              {phase.status === 'ENDED' && phase.endDate && (
                <Typography>Thời gian kết thúc: {format(new Date(phase.endDate), 'dd/MM/yyyy')}</Typography>
              )}
              {phase.status === 'NOT_STARTED' && <Chip label='Chưa bắt đầu' color='primary' sx={{ mt: 3, p: 3 }} />}
              {phase.status === 'STARTED' && <Chip label='Đã bắt đầu' color='success' sx={{ mt: 3, p: 3 }} />}
              {phase.status === 'ENDED' && <Chip label='Đã kết thúc' color='info' sx={{ mt: 3, p: 3 }} />}
            </Box>
            <Box>
              {expanded === false && (
                <Button
                  variant='contained'
                  color='info'
                  endIcon={<ExpandMoreOutlinedIcon />}
                  onClick={handleExpandClick}
                >
                  Chi tiết
                </Button>
              )}
              {expanded === true && (
                <Button
                  variant='contained'
                  color='info'
                  endIcon={<ExpandLessOutlinedIcon />}
                  onClick={handleExpandClick}
                >
                  Thu gọn
                </Button>
              )}
            </Box>
          </Stack>
        </CardContent>
        <Collapse in={expanded} timeout='auto' unmountOnExit>
          <CardContent>
            <Divider sx={{ mb: 10 }}>
              <Chip
                label='Danh sách các công việc'
                color='info'
                variant='outlined'
                sx={{ pt: 3, pb: 3, pl: 2, pr: 2, fontSize: '18px' }}
              />
            </Divider>
            {listTasks?.map((task: any, index: any) => (
              <Box key={index} sx={{ mt: 10, mb: 10 }}>
                <Stack direction={'row'} alignItems={'center'} spacing={5}>
                  <Typography sx={{ fontWeight: 700, mb: 3 }}>Công việc {index + 1}</Typography>
                  <ListMemberInTask id={task.id} name={task.name}/>
                </Stack>

                <Grid container spacing={5}>
                  <Grid item xs={12} md={6} lg={6}>
                    Tên công việc: {task.name}
                  </Grid>
                  <Grid item xs={12} md={6} lg={6}>
                    <Stack direction={'row'} alignItems={'center'} spacing={3}>
                      <Typography>Vai trò tham gia: </Typography>
                      {task?.activityRole?.map((r: any) => (
                        <Chip color='info' key={r.id} label={r.name} />
                      ))}
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={6} lg={6}>
                    Mô tả: {task.description}
                  </Grid>

                  <Grid item xs={12} md={6} lg={6}>
                    <Stack direction={'row'} alignItems={'center'} spacing={3}>
                      <Typography>Trạng thái: </Typography>
                      {task.status === 'NOT_STARTED' && <Chip color='primary' label={'Chưa bắt đầu'} />}
                      {task.status === 'ACTIVE' && <Chip color='success' label={'Đang hoạt động'} />}
                      {task.status === 'DONE' && <Chip color='info' label={'Đã kết thúc'} />}
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </CardContent>
        </Collapse>
      </Card>
    )
  } else {
    return (
      <Stack
        sx={{ height: '80vh', width:"100%" }}
        direction={'column'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <CircularProgress color='secondary' />
        <Typography> Loading data {phase?.name}.....</Typography>
      </Stack>
    )
  }
}
