import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'
import ContactMailOutlinedIcon from '@mui/icons-material/ContactMailOutlined'
import ContactPhoneOutlinedIcon from '@mui/icons-material/ContactPhoneOutlined'
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined'
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined'
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import ContactEmergencyOutlinedIcon from '@mui/icons-material/ContactEmergencyOutlined'
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import moment from 'moment'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import axiosClient from 'src/api-client/ApiClient'
import { KEY } from 'src/common/Keys'
import UserLayout from 'src/layouts/UserLayout'

const DetailUser = () => {
  const router = useRouter()
  const { slug } = router.query
  const [data, setData] = useState<any>()
  const [reason, setReason] = useState<any>('')
  const [openPopup, setOpenPopup] = useState(false)
  const handleClose = () => {
    setOpenPopup(false)
  }
  const handleAccept = () => {
    const acceptCollaborator = async () => {
      try {
        const res: any = await axiosClient.put(`/collaborators/${slug}`, {
          isAccept: true
        })
        router.push('/quan-ly-nguoi-dung/cong-tac-vien')
        toast.success(res.message)
      } catch (error: any) {
        console.log('error delete: ', error)
        if (error.response && error.response.data) {
          if (error.response.data?.message) toast.error(error.response.data?.message)
        } else toast.error('Duyệt thất bại')
      }
    }
    const confirmed = window.confirm('Bạn có chắc chắn muốn nhận cộng tác viên này không?')
    if (confirmed) {
      acceptCollaborator()
      setOpenPopup(false)
    }
  }
  const handleCancelConfirm = () => {
    const confirmed = window.confirm('Bạn có chắc chắn muốn từ chối cộng tác viên này không?')
    if (confirmed) {
      setOpenPopup(true)
    }
  }
  const handleSubmitFormCancel = () => {
    const rejectCollaborator = async () => {
      try {
        const res: any = await axiosClient.put(`/collaborators/${slug}`, {
          collaboratorId: slug,
          isAccept: false,
          reason: reason
        })
        toast.success(res.message)
        setOpenPopup(false)
        router.push('/quan-ly-nguoi-dung/cong-tac-vien')
      } catch (error: any) {
        console.log('error delete: ', error)
        setOpenPopup(false)
        if (error.response && error.response.data) {
          if (error.response.data?.message) toast.error(error.response.data?.message)

          if (error.response.data?.errors.RejectingReason) {
            error.response.data?.errors.RejectingReason.map((e: any) => toast.error(e))
          }
        } else toast.error('Duyệt thất bại!')
      }
    }
    rejectCollaborator()
  }
  useEffect(() => {
    const fetchData = async () => {
      const res = await axiosClient.get(`/collaborators/${slug}`)
      setData(res.data || {})
    }
    if (slug) fetchData()
  }, [slug])

  if (data) {
    return (
      <Box>
        <Dialog
          open={openPopup}
          onClose={handleClose}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
          sx={{
            '& .MuiPaper-root': {
              minWidth: '300px'
            }
          }}
        >
          <DialogTitle id='alert-dialog-title'>{'Hãy cho chúng tôi biết lí do của bạn'}</DialogTitle>
          <DialogContent>
            <TextField
              multiline
              rows={5}
              placeholder='Vui lòng ghi rõ lí do của bạn ở đây...'
              label='Lí do từ chối'
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setReason(event.target.value)}
              sx={{ minWidth: '500px', mt: 5, mb: 5 }}
            />
          </DialogContent>
          <DialogActions>
            <Button fullWidth variant='contained' color='info' onClick={() => handleSubmitFormCancel()} autoFocus>
              Nộp biểu mẫu
            </Button>
          </DialogActions>
        </Dialog>

        <Card sx={{ height: '100%', width: '85%', m: 'auto', color: '#00b0ff' }}>
          <CardContent>
            <Grid container spacing={5} sx={{ mb: 5 }}>
              <Grid item xs={12} md={6} lg={4}>
                <Avatar alt='avatar' src={data?.avatar} sx={{ width: '250px', height: '250px', ml: 10, mt: 3 }} />
              </Grid>
              <Grid item container xs={12} md={6} lg={8} sx={{ mt: 5 }}>
                <Grid item xs sm md lg={6}>
                  <Stack direction={'row'} alignItems={'center'} spacing={2}>
                    <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mt: 5, mb: 5 }}>
                      <AccountCircleOutlinedIcon />
                      <Typography variant='body1' sx={{ mb: 3, fontWeight: 700 }}>
                        Họ và tên:
                      </Typography>
                    </Stack>
                    <Typography variant='body1'>{data?.fullName}</Typography>
                  </Stack>
                  <Stack direction={'row'} alignItems={'center'} spacing={2}>
                    <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mt: 5, mb: 5 }}>
                      <AccessTimeOutlinedIcon />
                      <Typography variant='body1' sx={{ mb: 3, fontWeight: 700 }}>
                        Ngày sinh:
                      </Typography>
                    </Stack>
                    <Typography variant='body1'>{moment(data?.dateOfBirth).format('DD/MM/YYYY')}</Typography>
                  </Stack>

                  <Stack direction={'row'} alignItems={'center'} spacing={2}>
                    <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mt: 5, mb: 5 }}>
                      <AccountCircleOutlinedIcon />
                      <Typography variant='body1' sx={{ mb: 3, fontWeight: 700 }}>
                        Giới tính:
                      </Typography>
                    </Stack>
                    <Typography variant='body1'>{data?.gender === 'MALE' ? 'Nam' : 'Nữ'}</Typography>
                  </Stack>
                </Grid>
                <Grid item xs sm md lg={6}>
                  <Stack direction={'row'} alignItems={'center'} spacing={2}>
                    <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mt: 5, mb: 5 }}>
                      <ContactMailOutlinedIcon />
                      <Typography variant='body1' sx={{ mb: 3, fontWeight: 700 }}>
                        Email:
                      </Typography>
                    </Stack>
                    <Typography variant='body1'>{data?.email}</Typography>
                  </Stack>

                  <Stack direction={'row'} alignItems={'center'} spacing={2}>
                    <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mt: 5, mb: 5 }}>
                      <ContactPhoneOutlinedIcon />
                      <Typography variant='body1' sx={{ mb: 3, fontWeight: 700 }}>
                        Số điện thoại:
                      </Typography>
                    </Stack>
                    <Typography variant='body1'>{data?.phone}</Typography>
                  </Stack>
                  {data?.status === 'ACTIVE' && (
                    <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mt: 5, mb: 5 }}>
                      <FactCheckOutlinedIcon />
                      <Typography variant='body1' sx={{ fontWeight: 700 }}>
                        Trạng thái:{' '}
                      </Typography>
                      <Chip
                        color='success'
                        sx={{
                          color: '#FFFFFF',
                          fontWeight: 600
                        }}
                        label={'ĐANG HOẠT ĐỘNG'}
                        icon={<CheckCircleOutlineOutlinedIcon />}
                      />
                    </Stack>
                  )}
                  {data?.status === 'INACTIVE' && (
                    <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mt: 5, mb: 5 }}>
                      <FactCheckOutlinedIcon />
                      <Typography variant='body1' sx={{ fontWeight: 700 }}>
                        Trạng thái:{' '}
                      </Typography>
                      <Chip
                        color='error'
                        sx={{
                          color: '#FFFFFF',
                          fontWeight: 600
                        }}
                        label={'NGƯNG HOẠT ĐỘNG'}
                        icon={<CancelOutlinedIcon />}
                      />
                    </Stack>
                  )}
                </Grid>
              </Grid>
              {data?.address && (
                <Stack direction={'row'} alignItems={'center'} spacing={2}>
                  <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mt: 5, mb: 5 }}>
                    <LocationOnOutlinedIcon />
                    <Typography variant='body1' sx={{ mb: 3, fontWeight: 700 }}>
                      Địa chỉ:
                    </Typography>
                  </Stack>
                  <Typography variant='body1'>{data?.address}</Typography>
                </Stack>
              )}
              {data?.status === 'UNVERIFIED' && (
                <ButtonGroup disableElevation sx={{ mt: 2 }}>
                  <Button color='error' variant='outlined' onClick={handleCancelConfirm}>
                    Từ chối
                  </Button>
                  <Button color='info' variant='contained' onClick={() => handleAccept()}>
                    Đồng ý
                  </Button>
                </ButtonGroup>
              )}
            </Grid>
            {data?.address && (
              <Stack direction={'row'} alignItems={'center'} spacing={2}>
                <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mt: 5, mb: 5 }}>
                  <LocationOnOutlinedIcon />
                  <Typography variant='body1' sx={{ mb: 3, fontWeight: 700 }}>
                    Địa chỉ:
                  </Typography>
                </Stack>
                <Typography variant='body1'>{data?.address}</Typography>
              </Stack>
            )}
            <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mb: 5 }}>
              <EditNoteOutlinedIcon />
              <Typography variant='body1' sx={{ mb: 3, fontWeight: 700 }}>
                Mô tả của người hỗ trợ vận chuyển:
              </Typography>
            </Stack>
            <Typography variant='body1' sx={{ border: '2px solid', p: 3, borderRadius: '20px', mb: 5 }}>
              {data?.description ? data?.description : 'Không có'}
            </Typography>
            <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mb: 5 }}>
              <EditNoteOutlinedIcon />
              <Typography variant='body1' sx={{ mb: 3, fontWeight: 700 }}>
                Ghi chú của người hỗ trợ vận chuyển:
              </Typography>
            </Stack>
            <Typography variant='body1' sx={{ border: '2px solid', p: 3, borderRadius: '20px' }}>
              {data?.note ? data?.note : 'Không có ghi chú'}
            </Typography>

            <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mt: 5, mb: 5 }}>
              <ContactEmergencyOutlinedIcon />
              <Typography variant='body1' sx={{ mb: 3, fontWeight: 700 }}>
                Thông tin CMND/CCCD:
              </Typography>
            </Stack>
            <Card>
              <Grid container spacing={5}>
                <Grid item xs={6}>
                  <CardMedia
                    sx={{ height: 300, objectFit: 'contain' }}
                    component={'img'}
                    src={data?.frontOfIdCard}
                    alt='Front of ID card'
                  />
                </Grid>
                <Grid item xs={6}>
                  {' '}
                  <CardMedia
                    sx={{ height: 300, objectFit: 'contain' }}
                    component={'img'}
                    src={data?.backOfIdCard}
                    alt='Back of ID card'
                  />
                </Grid>
              </Grid>
            </Card>
          </CardContent>
          <CardActions
            sx={{
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <Button
              color='info'
              variant='outlined'
              onClick={() => {
                router.back()
              }}
            >
              Quay về
            </Button>
          </CardActions>
        </Card>
      </Box>
    )
  } else {
    return (
      <Stack
        sx={{ height: '50vh', width: '100%' }}
        direction={'row'}
        justifyContent={'center'}
        alignItems={'center'}
        spacing={3}
      >
        <CircularProgress color='info' />
        <Typography>Đang tải dữ liệu.....</Typography>
      </Stack>
    )
  }
}

export default DetailUser

DetailUser.auth = {
  role: [KEY.ROLE.SYSTEM_ADMIN]
}
DetailUser.getLayout = (page: React.ReactNode) => (
  <UserLayout pageTile='Thông tin người hỗ trợ vận chuyển'>{page}</UserLayout>
)
