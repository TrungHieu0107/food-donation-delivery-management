import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined'
import AccessibilityNewOutlinedIcon from '@mui/icons-material/AccessibilityNewOutlined'
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'

import BeenhereOutlinedIcon from '@mui/icons-material/BeenhereOutlined'
import ContactMailOutlinedIcon from '@mui/icons-material/ContactMailOutlined'
import ContactPhoneOutlinedIcon from '@mui/icons-material/ContactPhoneOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import Diversity1RoundedIcon from '@mui/icons-material/Diversity1Rounded'
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined'
import InputOutlinedIcon from '@mui/icons-material/InputOutlined'

import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import MapOutlinedIcon from '@mui/icons-material/MapOutlined'
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined'
import VolunteerActivismOutlinedIcon from '@mui/icons-material/VolunteerActivismOutlined'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Grid,
  Stack,
  Typography
} from '@mui/material'
import { format } from 'date-fns'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Carousel from 'react-material-ui-carousel'
import { toast } from 'react-toastify'
import useSession from 'src/@core/hooks/useSession'
import axiosClient from 'src/api-client/ApiClient'
import { KEY } from 'src/common/Keys'

const GeneralInformationActivity = ({ data, location, dataType }: any) => {
  const router = useRouter()
  const { slug } = router.query
  const { session }: any = useSession()
  const DetailLocation = dynamic(() => import('src/layouts/components/map/DetailLocationActivity'), { ssr: false })
  const handleUpdate = () => {
    router.push(`/danh-sach-hoat-dong/cap-nhat-hoat-dong/${slug}`)
  }
  const handleFeedBack = () => {
    const startFeedBack = async () => {
      try {
        const res: any = await axiosClient.post(`/activity-feedbacks/activity?activityId=${slug}`)
        toast.success(res.message)
      } catch (error: any) {
        console.log('error delete: ', error)
      }
    }
    startFeedBack()
  }
  const handleStart = async() => {
    const formData = new FormData()
    if (slug !== undefined) {
      formData.append('Id', slug as string)
    }
    formData.append('Name', data?.name)
    formData.append(
      'EstimatedStartDate',
    data?.estimatedStartDate
    )
    formData.append(
      'EstimatedEndDate',
     data?.estimatedEndDate
    )
    if(data?.deliveringDate){
      formData.append(
        'DeliveringDate',
      data?.deliveringDate
      )
    }
    
    formData.append('Description', data?.description)  
      for (let i = 0; i < data?.images?.length; i++) {
        formData.append(`Images`, data?.images[i])
      }
    
    formData.append('Scope', data?.scope === "PUBLIC" ? "0" : "1")
    formData.append('Status', "1")

    if(dataType && dataType?.length > 0){
      let dataFind;
      for (let i = 0; i < data?.activityTypeComponents?.length; i++) {
        dataFind = dataType.find((t: any)=> t.name === data?.activityTypeComponents[i])
        formData.append(`ActivityTypeIds`, dataFind?.id)
      }
    }
    
    if (data?.branchResponses?.length > 0 && session?.user.role === 'SYSTEM_ADMIN') {
      for (let i = 0; i < data?.branchResponses?.length; i++) {
        formData.append(`BranchIds`, data?.branchResponses[i]?.id)
      }
    }
    if (location && location?.length > 0) {  
      for (let i = 0; i < location.length; i++) {
        formData.append(`Location`, location[i])
      }
      formData.append(`address`, data?.address)
    }
    try {
      const data = await axiosClient.put(`/activities`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      console.log(data)
      toast.success('Cập nhật thành công')
      router.push('/danh-sach-hoat-dong')
    } catch (error: any) {
      console.log("err", error);
      toast.error('Cập nhật không thành công')
    }
  }
  const handleInActive = () => {
    const confirmed = window.confirm('Bạn có chắc chắn muốn ngưng hoạt động này không?')
    if (confirmed) {
      const callAPIDelete = async () => {
        try {
          const res: any = await axiosClient.delete(`/activities/${slug}`)
          toast.success(res.message)
          router.push(`/danh-sach-hoat-dong`)
        } catch (error: any) {
          console.log('error delete: ', error)
          toast.error("Thao tác không thành công")
        }
      }
      callAPIDelete()
    }
  }
  useEffect(() => {
    if (slug) console.log(slug, data, location)
  }, [slug])

  if (data) {
    return (
      <Card>
        <Carousel sx={{ margin: 'auto', border: 'none' }}>
          {data.images &&
            data.images.map((i: any, index: any) => (
              <CardMedia key={index} component='img' height='345' image={i} alt='img' sx={{ objectFit: 'cover' }} />
            ))}
        </Carousel>
        <CardContent>
          {/* name */}
          <Typography gutterBottom variant='h4' component='div' textAlign={'center'}>
            {data.name}
          </Typography>

          {/* start time */}
          <Stack
            direction={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}
            sx={{ mb: 5, mt: 5, ml: '10vw', mr: '10vw' }}
          >
            <Stack direction={'row'} alignItems={'center'} spacing={2}>
              <AccessTimeOutlinedIcon />
              {data.estimatedStartDate ? (
                <Typography>
                  Ngày bắt đầu (dự kiến): {format(new Date(data.estimatedStartDate), 'dd/MM/yyyy')}
                </Typography>
              ) : (
                <Typography>Ngày bắt đầu (dự kiến): Chưa cập nhật</Typography>
              )}
            </Stack>
            <Stack direction={'row'} alignItems={'center'} spacing={2}>
              <AccessTimeOutlinedIcon />
              {data.startDate ? (
                <Typography>Ngày bắt đầu: {format(new Date(data.startDate), 'dd/MM/yyyy')}</Typography>
              ) : (
                <Typography>Ngày bắt đầu: Chưa cập nhật</Typography>
              )}
            </Stack>
          </Stack>

          {/* end time */}
          <Stack
            direction={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}
            spacing={2}
            sx={{ mb: 5, mt: 5, ml: '10vw', mr: '10vw' }}
          >
            <Stack direction={'row'} alignItems={'center'} spacing={2}>
              <AccessTimeOutlinedIcon />
              {data.estimatedEndDate ? (
                <Typography>
                  Ngày kết thúc (dự kiến): {format(new Date(data.estimatedEndDate), 'dd/MM/yyyy')}
                </Typography>
              ) : (
                <Typography>Ngày kết thúc (dự kiến): Chưa cập nhật</Typography>
              )}
            </Stack>
            <Stack direction={'row'} alignItems={'center'} spacing={2}>
              <AccessTimeOutlinedIcon />
              {data.endDate ? (
                <Typography>Ngày kết thúc: {format(new Date(data.endDate), 'dd/MM/yyyy')}</Typography>
              ) : (
                <Typography>Ngày kết thúc: Chưa cập nhật</Typography>
              )}
            </Stack>
          </Stack>

          {/* delivery time */}
          {/* <Stack
            direction={'row'}
            alignItems={'center'}
            justifyContent={'center'}
            spacing={2}
            sx={{ mb: 5, mt: 5, ml: '10vw', mr: '10vw' }}
          >
            <AccessTimeOutlinedIcon />
            {data.deliveringDate ? (
              <Typography>Ngày giao đồ: {format(new Date(data.deliveringDate), 'dd/MM/yyyy')}</Typography>
            ) : (
              <Typography>Ngày giao đồ: Chưa cập nhật</Typography>
            )}
          </Stack> */}

          {/* description */}
          <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mb: 5, mt: 10 }}>
            <DescriptionOutlinedIcon />
            <Typography variant='body1' sx={{ fontWeight: 700 }}>
              Mô tả chi tiết hoạt động:
            </Typography>
          </Stack>
          <Typography variant='body1' sx={{ border: '2px solid', p: 3, borderRadius: '20px' }}>
            {data.description}
          </Typography>
          <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mt: 5, mb: 5 }}>
            <GroupAddOutlinedIcon />
            <Typography variant='body1' sx={{ fontWeight: 700 }}>
              Số người tham gia:{' '}
            </Typography>
            <Typography variant='body1'> {data.numberOfParticipants}</Typography>
          </Stack>

          {data.scope === 'PUBLIC' ? (
            <Stack direction={'row'} alignItems={'center'} spacing={3} sx={{ mt: 5, mb: 5 }}>
              <Stack direction={'row'} alignItems={'center'} spacing={2}>
                <MapOutlinedIcon />
                <Typography variant='body1' sx={{ fontWeight: 700 }}>
                  Phạm vi:{' '}
                </Typography>
              </Stack>
              <Chip label='Cộng đồng' icon={<PublicOutlinedIcon />} color='info' sx={{ p: 2 }} />
            </Stack>
          ) : (
            <Stack direction={'row'} alignItems={'center'} spacing={3} sx={{ mt: 5, mb: 5 }}>
              <Stack direction={'row'} alignItems={'center'} spacing={2}>
                <MapOutlinedIcon />
                <Typography variant='body1' sx={{ fontWeight: 700 }}>
                  Phạm vi:{' '}
                </Typography>
              </Stack>

              <Chip label='Nội bộ' icon={<InputOutlinedIcon />} color='warning' sx={{ p: 2, color: 'black' }} />
            </Stack>
          )}

          {data.status === 'NOT_STARTED' && (
            <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mt: 5, mb: 5 }}>
              <BeenhereOutlinedIcon />
              <Typography variant='body1' sx={{ fontWeight: 700 }}>
                Trạng thái:{' '}
              </Typography>
              <Chip
                color='info'
                sx={{
                  color: '#FFFFFF',
                  fontWeight: 'bold'
                }}
                label={'CHƯA BẮT ĐẦU'}
              />
            </Stack>
          )}
          {data.status === 'STARTED' && (
            <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mt: 5, mb: 5 }}>
              <BeenhereOutlinedIcon />
              <Typography variant='body1' sx={{ fontWeight: 700 }}>
                Trạng thái:{' '}
              </Typography>
              <Chip
                color='primary'
                sx={{
                  color: '#FFFFFF',
                  fontWeight: 'bold'
                }}
                label={'ĐANG HOẠT ĐỘNG'}
              />
            </Stack>
          )}
          {data.status === 'ENDED' && (
            <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mt: 5, mb: 5 }}>
              <BeenhereOutlinedIcon />
              <Typography variant='body1' sx={{ fontWeight: 700 }}>
                Trạng thái:{' '}
              </Typography>
              <Chip
                color='success'
                sx={{
                  color: '#FFFFFF',
                  fontWeight: 'bold'
                }}
                label={'ĐÃ KẾT THÚC'}
              />
            </Stack>
          )}
          {data.status === 'INACTIVE' && (
            <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mt: 5, mb: 5 }}>
              <BeenhereOutlinedIcon />
              <Typography variant='body1' sx={{ fontWeight: 700 }}>
                Trạng thái:{' '}
              </Typography>
              <Chip
                color='error'
                sx={{
                  color: '#FFFFFF',
                  fontWeight: 'bold'
                }}
                label={'NGƯNG HOẠT ĐỘNG'}
              />
            </Stack>
          )}

          <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mt: 5, mb: 5 }}>
            <AccessibilityNewOutlinedIcon />
            <Typography variant='body1' sx={{ fontWeight: 700 }}>
              Loại hoạt động:{' '}
            </Typography>
            {data.activityTypeComponents.map((t: any) => (
              <Box key={t}>
                {t === 'Lao động tình nguyện' && (
                  <Chip
                    label='Lao động tình nguyện'
                    color='success'
                    icon={<Diversity1RoundedIcon />}
                    sx={{ p: 2 }}
                  ></Chip>
                )}
                {t === 'Hỗ trợ phát đồ' && (
                  <Chip label='Hỗ trợ' color='secondary' icon={<VolunteerActivismOutlinedIcon />} sx={{ p: 2 }}></Chip>
                )}
                {t === 'Quyên góp' && (
                  <Chip label='Quyên góp' color='info' icon={<FavoriteBorderOutlinedIcon />} sx={{ p: 2 }}></Chip>
                )}
              </Box>
            ))}
          </Stack>
          {data.address && (
            <Stack direction={'row'} alignItems={'center'} spacing={2}>
              <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mt: 5, mb: 5 }}>
                <LocationOnOutlinedIcon />
                <Typography variant='body1' sx={{ mb: 3, fontWeight: 700 }}>
                  Địa điểm:
                </Typography>
              </Stack>
              <Typography variant='body1'>{data.address}</Typography>
            </Stack>
          )}
          <Box>{location && <DetailLocation selectedPosition={location} />}</Box>
          <Box sx={{ mb: 10, mt: 10, border: '1px solid', pb: 3, borderRadius: '20px', maxWidth: '600px' }}>
            <Typography sx={{ textAlign: 'center', fontSize: '18px', fontWeight: 700, mt: 3, mb: 2 }}>
              Thông tin người tạo hoạt động
            </Typography>
            <Grid container columnSpacing={3}>
              <Grid item xs={12} md={4} lg={4}>
                <Box sx={{ display: 'flex', justifyContent: { xs: 'center' } }}>
                  <Avatar
                    alt={data.creater.fullName}
                    src={data.creater.avatar}
                    sx={{ width: { md: '150px', xs: '100px' }, height: { md: '150px', xs: '100px' }, ml: 10, mt: 3 }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={8} lg={8}>
                <Stack
                  direction={'row'}
                  alignItems={'center'}
                  sx={{ justifyContent: { xs: 'center', md: 'flex-start' } }}
                  spacing={2}
                >
                  <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mt: 2, mb: 2 }}>
                    <AccountBoxOutlinedIcon />
                    <Typography variant='body1' sx={{ mb: 3, fontWeight: 700 }}>
                      Họ và tên:
                    </Typography>
                  </Stack>
                  <Typography variant='body1'>{data.creater.fullName}</Typography>
                </Stack>

                <Stack
                  direction={'row'}
                  alignItems={'center'}
                  sx={{ justifyContent: { xs: 'center', md: 'flex-start' } }}
                  spacing={2}
                >
                  <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mt: 2, mb: 2 }}>
                    <AccountCircleOutlinedIcon />
                    <Typography variant='body1' sx={{ mb: 3, fontWeight: 700 }}>
                      Vai trò:
                    </Typography>
                  </Stack>
                  <Typography variant='body1'>
                    {data.creater.role === 'BRANCH_ADMIN' ? 'Quản trị viên chi nhánh' : 'Quản trị viên chi hệ thống'}
                  </Typography>
                </Stack>

                <Stack
                  direction={'row'}
                  alignItems={'center'}
                  spacing={2}
                  sx={{ justifyContent: { xs: 'center', md: 'flex-start' } }}
                >
                  <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mt: 2, mb: 2 }}>
                    <ContactMailOutlinedIcon />
                    <Typography variant='body1' sx={{ mb: 3, fontWeight: 700 }}>
                      Email:
                    </Typography>
                  </Stack>
                  <Typography variant='body1'>
                    {data.creater.email ? data.creater.email : 'Chưa có thông tin'}
                  </Typography>
                </Stack>

                <Stack
                  direction={'row'}
                  alignItems={'center'}
                  spacing={2}
                  sx={{ justifyContent: { xs: 'center', md: 'flex-start' } }}
                >
                  <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mt: 2, mb: 2 }}>
                    <ContactPhoneOutlinedIcon />
                    <Typography variant='body1' sx={{ mb: 3, fontWeight: 700 }}>
                      Số điện thoại:
                    </Typography>
                  </Stack>
                  <Typography variant='body1'>
                    {data.creater.phone ? data.creater.phone : 'Chưa có thông tin'}
                  </Typography>
                </Stack>

                {data.creater.status === 'ACTIVE' && (
                  <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mt: 2, mb: 2 }}>
                    <FactCheckOutlinedIcon />
                    <Typography variant='body1' sx={{ fontWeight: 700 }}>
                      Trạng thái:{' '}
                    </Typography>
                    <Chip
                      color='info'
                      sx={{
                        color: '#FFFFFF',
                        fontWeight: 'bold'
                      }}
                      label={'ĐANG HOẠT ĐỘNG'}
                    />
                  </Stack>
                )}
                {data.creater.status === 'INACTIVE' && (
                  <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mt: 2, mb: 2 }}>
                    <FactCheckOutlinedIcon />
                    <Typography variant='body1' sx={{ fontWeight: 700 }}>
                      Trạng thái:{' '}
                    </Typography>
                    <Chip
                      color='error'
                      sx={{
                        color: '#FFFFFF',
                        fontWeight: 'bold'
                      }}
                      label={'NGƯNG HOẠT ĐỘNG'}
                    />
                  </Stack>
                )}
              </Grid>
            </Grid>
          </Box>
          <Stack direction={'row'} justifyContent={'center'} alignItems={'center'} sx={{ mt: 2, mb: 2 }} spacing={2}>
            {data.isJoined && session?.user.role === 'BRANCH_ADMIN' && (
              <Stack direction={'row'} spacing={2}>
                <Button color='info' variant='contained' onClick={() => handleUpdate()}>
                  Cập nhật
                </Button>
                {data?.status === 'NOT_STARTED' && (
                  <Button onClick={handleStart} color='success' variant='contained'>
                    Bắt đầu
                  </Button>
                )}
                <Button onClick={handleInActive} color='error' variant='contained'>
                  Xóa hoạt động
                </Button>
              </Stack>
            )}
            {session?.user.role === 'SYSTEM_ADMIN' && (
              <Stack direction={'row'} spacing={2}>
                <Button color='info' variant='contained' onClick={() => handleUpdate()}>
                  Cập nhật
                </Button>
                <Button color='success' variant='outlined' onClick={() => handleFeedBack()}>
                  Mở phản hồi
                </Button>
                {data?.status === 'NOT_STARTED' && (
                  <Button onClick={handleStart} color='success' variant='contained'>
                    Bắt đầu
                  </Button>
                )}
                <Button onClick={handleInActive} color='error' variant='contained'>
                  Xóa hoạt động
                </Button>
              </Stack>
            )}

            <Button
              onClick={() => {
                router.push(`/danh-sach-hoat-dong`)
              }}
              color='primary'
              variant='outlined'
            >
              Quay về
            </Button>
          </Stack>
        </CardContent>
      </Card>
    )
  } else {
    return (
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', height: '100%', alignItems: 'center' }}>
        <CircularProgress color='info' />
        <Typography>Đang tải dữ liệu...</Typography>
      </Box>
    )
  }
}

// export const getServerSideProps: GetServerSideProps<DetailActivityPageProps> = async (context: any) => {
//   // Truy xuất dữ liệu sản phẩm dựa trên context.query.slug
//   const slug = context.query.slug as string
//   console.log('id nè: ', slug)

//   const res: Response = await fetch(`https://64df3f5f71c3335b2582543e.mockapi.io/api/v1/tblUsers/1`, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   })
//   const activity = await res.json()
//   console.log(activity)

//   return {
//     props: {
//       activity: { title: 'Dự án thiện nguyện số 1', description: 'Tổ chức từ thiện description' }
//     }
//   }
// }

export default GeneralInformationActivity

GeneralInformationActivity.auth = {
  role: [KEY.ROLE.BRANCH_ADMIN, KEY.ROLE.SYSTEM_ADMIN]
}
