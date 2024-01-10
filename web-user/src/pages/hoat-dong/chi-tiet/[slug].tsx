// import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined'
// import AccessibilityNewOutlinedIcon from '@mui/icons-material/AccessibilityNewOutlined'
// import BeenhereOutlinedIcon from '@mui/icons-material/BeenhereOutlined'
// import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
// import Diversity1RoundedIcon from '@mui/icons-material/Diversity1Rounded'
// import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
// import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined'
// import InputOutlinedIcon from '@mui/icons-material/InputOutlined'
// import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
// import MapOutlinedIcon from '@mui/icons-material/MapOutlined'
// import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined'
// import VolunteerActivismOutlinedIcon from '@mui/icons-material/VolunteerActivismOutlined'
// import {
//   Box,
//   Button,
//   Card,
//   CardActions,
//   CardContent,
//   CardMedia,
//   Chip,
//   Divider,
//   Grid,
//   Stack,
//   Typography
// } from '@mui/material'
// import { format } from 'date-fns'
// import dynamic from 'next/dynamic'
// import { useRouter } from 'next/router'
// import {  useEffect, useState } from 'react'
// import Carousel from 'react-material-ui-carousel'
// import axiosClient from 'src/api-client/ApiClient'
// import { KEY } from 'src/common/Keys'

// // import LinearWithValueLabel from 'src/layouts/components/loading/LinearProgressWithLabel'

// const DetailActivity = () => {
//   const router = useRouter()
//   const { id } = router.query
//   const [data, setData] = useState<any>()
//   const [location, setLocation] = useState<any>()
//   const DetailLocation = dynamic(() => import('src/layouts/components/map/DetailLocationActivity'), { ssr: false })
//   console.log(id)
//   useEffect(() => {
//     const fetchData = async () => {
//       const res = await axiosClient.get(`/activities/${id}`)
//       console.log('Data chi tiết: ', res)
//       setData(res.data)
//       if (res.data.location) {
//         const locationGetFromAPI = res.data.location.split(',')
//         setLocation([locationGetFromAPI[0], locationGetFromAPI[1]])
//       }
//     }
//     if (id) fetchData()
//   }, [id])

//   if (data) {
//     return (
//       <Card sx={{ width: '70vw', margin: 'auto' }}>
//         <Carousel sx={{ margin: 'auto', border: 'none' }}>
//           {data.images &&
//             data.images.map((i: any, index: any) => (
//               <CardMedia key={index} component='img' height='500' image={i} alt='img' sx={{ objectFit: 'contain' }} />
//             ))}
//         </Carousel>
//         <CardContent>
//           {/* name */}
//           <Typography gutterBottom variant='h4' component='div' textAlign={'center'}>
//             {data.name}
//           </Typography>

//           {/* start time */}
//           <Stack
//             direction={'row'}
//             justifyContent={'space-between'}
//             alignItems={'center'}
//             sx={{ mb: 5, mt: 5, ml: '10vw', mr: '10vw' }}
//           >
//             <Stack direction={'row'} alignItems={'center'} spacing={2}>
//               <AccessTimeOutlinedIcon />
//               {data.estimatedStartDate ? (
//                 <Typography>
//                   Ngày bắt đầu (dự kiến): {format(new Date(data.estimatedStartDate), 'dd/MM/yyyy')}
//                 </Typography>
//               ) : (
//                 <Typography>Ngày bắt đầu (dự kiến): Chưa cập nhật</Typography>
//               )}
//             </Stack>
//             <Stack direction={'row'} alignItems={'center'} spacing={2}>
//               <AccessTimeOutlinedIcon />
//               {data.startDate ? (
//                 <Typography>Ngày bắt đầu: {format(new Date(data.startDate), 'dd/MM/yyyy')}</Typography>
//               ) : (
//                 <Typography>Ngày bắt đầu: Chưa cập nhật</Typography>
//               )}
//             </Stack>
//           </Stack>

//           {/* end time */}
//           <Stack
//             direction={'row'}
//             justifyContent={'space-between'}
//             alignItems={'center'}
//             spacing={2}
//             sx={{ mb: 5, mt: 5, ml: '10vw', mr: '10vw' }}
//           >
//             <Stack direction={'row'} alignItems={'center'} spacing={2}>
//               <AccessTimeOutlinedIcon />
//               {data.estimatedEndDate ? (
//                 <Typography>
//                   Ngày kết thúc (dự kiến): {format(new Date(data.estimatedEndDate), 'dd/MM/yyyy')}
//                 </Typography>
//               ) : (
//                 <Typography>Ngày kết thúc (dự kiến): Chưa cập nhật</Typography>
//               )}
//             </Stack>
//             <Stack direction={'row'} alignItems={'center'} spacing={2}>
//               <AccessTimeOutlinedIcon />
//               {data.endDate ? (
//                 <Typography>Ngày kết thúc: {format(new Date(data.endDate), 'dd/MM/yyyy')}</Typography>
//               ) : (
//                 <Typography>Ngày kết thúc: Chưa cập nhật</Typography>
//               )}
//             </Stack>
//           </Stack>

//           {/* delivery time */}
//           <Stack
//             direction={'row'}
//             alignItems={'center'}
//             justifyContent={'center'}
//             spacing={2}
//             sx={{ mb: 5, mt: 5, ml: '10vw', mr: '10vw' }}
//           >
//             <AccessTimeOutlinedIcon />
//             {data.deliveringDate ? (
//               <Typography>Ngày giao đồ: {format(new Date(data.deliveringDate), 'dd/MM/yyyy')}</Typography>
//             ) : (
//               <Typography>Ngày giao đồ: Chưa cập nhật</Typography>
//             )}
//           </Stack>

//           {/* description */}
//           <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mb: 5, mt: 10 }}>
//             <DescriptionOutlinedIcon />
//             <Typography variant='body1' sx={{ fontWeight: 700 }}>
//               Mô tả chi tiết hoạt động:
//             </Typography>
//           </Stack>
//           <Typography variant='body1' sx={{ border: '2px solid', p: 3, borderRadius: '20px' }}>
//             {data.description}
//           </Typography>
//           <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mt: 5, mb: 5 }}>
//             <GroupAddOutlinedIcon />
//             <Typography variant='body1' sx={{ fontWeight: 700 }}>
//               Số người tham gia:
//             </Typography>
//             <Typography variant='body1'> {data.numberOfParticipants}</Typography>
//           </Stack>

//           {data.scope === 'PUBLIC' ? (
//             <Stack direction={'row'} alignItems={'center'} spacing={3} sx={{ mt: 5, mb: 5 }}>
//               <Stack direction={'row'} alignItems={'center'} spacing={2}>
//                 <MapOutlinedIcon />
//                 <Typography variant='body1' sx={{ fontWeight: 700 }}>
//                   Phạm vi:
//                 </Typography>
//               </Stack>
//               <Chip label='Cộng đồng' icon={<PublicOutlinedIcon />} color='info' sx={{ p: 2 }} />
//             </Stack>
//           ) : (
//             <Stack direction={'row'} alignItems={'center'} spacing={3} sx={{ mt: 5, mb: 5 }}>
//               <Stack direction={'row'} alignItems={'center'} spacing={2}>
//                 <MapOutlinedIcon />
//                 <Typography variant='body1' sx={{ fontWeight: 700 }}>
//                   Phạm vi:
//                 </Typography>
//               </Stack>

//               <Chip label='Nội bộ' icon={<InputOutlinedIcon />} color='warning' sx={{ p: 2, color: 'black' }} />
//             </Stack>
//           )}

//           {data.status === 'NOT_STARTED' && (
//             <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mt: 5, mb: 5 }}>
//               <BeenhereOutlinedIcon />
//               <Typography variant='body1' sx={{ fontWeight: 700 }}>
//                 Trạng thái:
//               </Typography>
//               <Chip
//                 color='info'
//                 sx={{
//                   color: '#FFFFFF',
//                   fontWeight: 'bold'
//                 }}
//                 label={'CHƯA BẮT ĐẦU'}
//               />
//             </Stack>
//           )}
//           {data.status === 'STARTED' && (
//             <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mt: 5, mb: 5 }}>
//               <BeenhereOutlinedIcon />
//               <Typography variant='body1' sx={{ fontWeight: 700 }}>
//                 Trạng thái:
//               </Typography>
//               <Chip
//                 color='primary'
//                 sx={{
//                   color: '#FFFFFF',
//                   fontWeight: 'bold'
//                 }}
//                 label={'ĐANG HOẠT ĐỘNG'}
//               />
//             </Stack>
//           )}
//           {data.status === 'ENDED' && (
//             <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mt: 5, mb: 5 }}>
//               <BeenhereOutlinedIcon />
//               <Typography variant='body1' sx={{ fontWeight: 700 }}>
//                 Trạng thái:
//               </Typography>
//               <Chip
//                 color='success'
//                 sx={{
//                   color: '#FFFFFF',
//                   fontWeight: 'bold'
//                 }}
//                 label={'ĐÃ KẾT THÚC'}
//               />
//             </Stack>
//           )}
//           {data.status === 'INACTIVE' && (
//             <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mt: 5, mb: 5 }}>
//               <BeenhereOutlinedIcon />
//               <Typography variant='body1' sx={{ fontWeight: 700 }}>
//                 Trạng thái:
//               </Typography>
//               <Chip
//                 color='error'
//                 sx={{
//                   color: '#FFFFFF',
//                   fontWeight: 'bold'
//                 }}
//                 label={'NGƯNG HOẠT ĐỘNG'}
//               />
//             </Stack>
//           )}

//           <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mt: 5, mb: 5 }}>
//             <AccessibilityNewOutlinedIcon />
//             <Typography variant='body1' sx={{ fontWeight: 700 }}>
//               Loại hoạt động:
//             </Typography>
//             {data.activityTypeComponents.map((t: any) => (
//               <Box key={t}>
//                 {t === 'Lao động tình nguyện' && (
//                   <Chip
//                     label='Lao động tình nguyện'
//                     color='success'
//                     icon={<Diversity1RoundedIcon />}
//                     sx={{ p: 2 }}
//                   ></Chip>
//                 )}
//                 {t === 'Hỗ trợ phát đồ' && (
//                   <Chip label='Hỗ trợ' color='secondary' icon={<VolunteerActivismOutlinedIcon />} sx={{ p: 2 }}></Chip>
//                 )}
//                 {t === 'Quyên góp' && (
//                   <Chip label='Quyên góp' color='info' icon={<FavoriteBorderOutlinedIcon />} sx={{ p: 2 }}></Chip>
//                 )}
//               </Box>
//             ))}
//           </Stack>
//           {data.targetProcessResponses ? (
//             <Stack direction={'row'} alignItems={'top'} spacing={2} sx={{ mt: 5, mb: 5 }}>
//               <AccessibilityNewOutlinedIcon />

//               <Typography variant='body1' sx={{ fontWeight: 700 }}>
//                 Tiến độ
//               </Typography>
//               <Box display={'flex'} flexDirection={'column'} pl={10} width={300}>
//                 {data.targetProcessResponses.map(
//                   (
//                     process: {
//                       itemTemplateResponse: {
//                         name: string | undefined
//                       }
//                       process: any
//                       target: any
//                     },
//                     index: number
//                   ) => (
//                     <div key={index}>
//                       <Typography variant='body1' fontWeight={400}>
//                         {process.itemTemplateResponse?.name}
//                       </Typography>
//                       {/* <LinearWithValueLabel progress={process?.process ?? 0} target={process?.target ?? 0} /> */}
//                     </div>
//                   )
//                 )}
//               </Box>
//             </Stack>
//           ) : null}
//           <Box>{location && <DetailLocation selectedPosition={location} />}</Box>
//           {data.address && (
//             <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mt: 5, mb: 5 }}>
//               <LocationOnOutlinedIcon />
//               <Typography variant='body1' sx={{ mb: 3, fontWeight: 700 }}>
//                 Địa điểm: {data.address}
//               </Typography>
//             </Stack>
//           )}
//           {/* render list branch */}
//           {data.branchResponses.length > 0 && (
//             <Divider sx={{ mb: 10, mt: 20 }}>
//               <Chip
//                 label='Danh sách các chi nhánh tham gia'
//                 color='info'
//                 sx={{ pt: 3, pb: 3, pl: 2, pr: 2, fontSize: '18px' }}
//               />
//             </Divider>
//           )}
//           {data.branchResponses &&
//             data.branchResponses.map((b: any) => (
//               <Grid container columnSpacing={5} key={b.id} sx={{ mb: 10 }}>
//                 <Grid item xs={3}>
//                   <Card>
//                     <CardMedia component='img' height='200' image={b.image} alt='img' />
//                   </Card>
//                 </Grid>
//                 <Grid item xs={8}>
//                   <Typography variant='h5'>{b.name}</Typography>
//                   <Stack direction='row' alignItems={'center'} spacing={3} sx={{ mb: 5, mt: 5 }}>
//                     <LocationOnOutlinedIcon />
//                     <Typography sx={{ mt: 3, fontSize: 14 }} variant='body1'>
//                       Địa chỉ: {b.address}
//                     </Typography>
//                   </Stack>

//                   <Stack direction='row' alignItems={'center'} spacing={3}>
//                     <BeenhereOutlinedIcon />
//                     <Typography sx={{ mt: 3, fontSize: 14 }} variant='body1'>
//                       Trạng thái: {b.status === 'ACTIVE' ? 'Đang hoạt động' : 'Ngưng hoạt động'}
//                     </Typography>
//                   </Stack>
//                 </Grid>
//               </Grid>
//             ))}
//         </CardContent>
//         <CardActions
//           sx={{
//             display: 'flex',
//             justifyContent: 'center',
//             gap: 3
//           }}
//         >
//           <Button
//             onClick={() => {
//               router.back()
//             }}
//           >
//             Quay về
//           </Button>
//           {data.activityTypeComponents &&
//             (data.activityTypeComponents.includes('Lao động tình nguyện') ||
//               data.activityTypeComponents.includes('Hỗ trợ phát đồ')) && (
//               <Button variant='contained' color='primary'>
//                 Tham gia
//               </Button>
//             )}
//           {data.activityTypeComponents &&
//             data.activityTypeComponents.includes('Quyên góp') && (
//               <Button variant='contained' color='primary' onClick={() => {
//                 router.push('/tao-yeu-cau-quyen-gop?hoat_dong='+ data.id)
//               }}>
//                 Quyên góp
//               </Button>
//             )}
//         </CardActions>
//       </Card>
//     )
//   } else {
//     return <Box>Đang tải</Box>
//   }
// }

// export default DetailActivity

// DetailActivity.auth = {
//   role: [KEY.ROLE.CONTRIBUTOR, KEY.ROLE.CHARITY, KEY.ROLE.GUEST, KEY.ROLE.COLABORATOR]
// }

'use client'

import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, CircularProgress, Stack, Typography, styled } from '@mui/material'
import MuiTab, { TabProps } from '@mui/material/Tab'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { SyntheticEvent, useEffect, useState } from 'react'
import axiosClient from 'src/api-client/ApiClient'
import BranchJoinTab from './BranchJoinTab'
import GeneralInformationActivity from './GeneralTab'
import HistoryStock from './HistoryStock'
import ItemTargetTab from './ItemTargetTab'
import PhaseTab from './PhaseTab'

const Tab = styled(MuiTab)<TabProps>(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    minWidth: 100
  },
  [theme.breakpoints.down('sm')]: {
    minWidth: 67
  }
}))

const TabName = styled('span')(({ theme }) => ({
  lineHeight: 1.71,
  fontSize: '0.875rem',
  marginLeft: theme.spacing(2.4)
}))

const DetailActivity = () => {
  const router = useRouter()
  const { slug } = router.query
  const [data, setData] = useState<any>(null)
  const [location, setLocation] = useState<any>(null)
  const { data: session } = useSession()
  console.log(session);
  const [value, setValue] = useState<string>('general')
  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosClient.get(`/activities/${slug}`)
        console.log('Data chi tiết: ', res)
        if (res.data.location) {
          const locationGetFromAPI = res.data.location.split(',')
          setLocation([locationGetFromAPI[0], locationGetFromAPI[1]])
        } else {
          setLocation(null)
        }
        setData(res.data || [])
      } catch (error) {
        console.log(error)
        setData([])
      }
    }
    if (slug) fetchData()
  }, [slug])

  if (data) {
    return (
      <Box >
        <TabContext value={value}>
          <TabList
            onChange={handleChange}
            aria-label='account-settings tabs'
            sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}`,"& .MuiTabs-flexContainer": {         
              justifyContent: 'center'
            } }}        
            scrollButtons={"auto"} 
            variant='scrollable'
          >
            <Tab
              value='general'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center'}}>
                  <TabName>Thông tin chung</TabName>
                </Box>
              }
            />
           {session?.user && <Tab
              value='phases'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TabName>Giai đoạn</TabName>
                </Box>
              }
            />}
            <Tab
              value='branches'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TabName>Chi nhánh</TabName>
                </Box>
              }
            />
            <Tab
              value='items'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TabName>Vật phẩm</TabName>
                </Box>
              }
            />
              <Tab
              value='history'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TabName>Sao kê</TabName>
                </Box>
              }
            />
          </TabList>

          <TabPanel sx={{ p: 0 }} value='general'>
            <GeneralInformationActivity data={data} location={location} />
          </TabPanel>
          {session?.user &&  <TabPanel sx={{ p: 0 }} value='phases'>
            <PhaseTab />
          </TabPanel>}
          <TabPanel sx={{ p: 0 }} value='branches'>
            
            <BranchJoinTab data={data} />
          </TabPanel>
          <TabPanel sx={{ p: 0 }} value='items'>
            <ItemTargetTab data={data} />
          </TabPanel>
          <TabPanel sx={{ p: 0 }} value='history'>
            <HistoryStock />
          </TabPanel>
        </TabContext>
      </Box>
    )
  } else {
    return (
      <Stack
        sx={{ height: '80vh', mt: '50vh, ml: 50vw' }}
        direction={'column'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <CircularProgress color='secondary' />
        <Typography> Đang tải dữ liệu .....</Typography>
      </Stack>
    )
  }
}


export default DetailActivity

// DetailActivity.auth = {
//   role: [KEY.ROLE.CONTRIBUTOR, KEY.ROLE.CHARITY, KEY.ROLE.GUEST]
// }
