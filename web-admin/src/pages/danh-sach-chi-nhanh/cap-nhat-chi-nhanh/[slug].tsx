'use client'

import {
  Box,
  Button,
  Card,
  CardMedia,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  Paper
} from '@mui/material'
import ContactMailOutlinedIcon from '@mui/icons-material/ContactMailOutlined'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import ContactPhoneOutlinedIcon from '@mui/icons-material/ContactPhoneOutlined'
import { Field, Form, Formik } from 'formik'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import axiosClient from 'src/api-client/ApiClient'
import { KEY } from 'src/common/Keys'
import SimpleDialogDemo from 'src/layouts/components/PopUpGetLocation/PopUpGetLocation'
import * as Yup from 'yup'
import SearchBranchAdmin from '../tao-chi-nhanh-moi/searchBranchAdmin'
import UserLayout from 'src/layouts/UserLayout'
import { toast } from 'react-toastify'

const validationSchema = Yup.object({
  name: Yup.string()
    .required('Tên chi nhánh bắt buộc có')
    .min(10, 'Tên ít nhất 10 kí tự')
    .max(200, 'Tên nhiều nhất 150 kí tự'),
  description: Yup.string().min(50, 'Mô tả chi nhánh phải  có ít nhất 50 kí tự.')
})

const UpdateBranch = () => {
  const router = useRouter()
  const { slug } = router.query
  const [loading, setIsLoading] = useState(false)
  const [addressBranch, setAddressBranch] = useState<any>('')
  const [latlng, setLatlng] = useState<any>({ lat: '', lng: '' })
  const [selectedStatus, setSelectedStatus] = useState<string>('0')
  const [imgSrc, setImgSrc] = useState<string>()
  const [dataSearch, setDataSearch] = useState([])
  const [dataSearchSelected, setDataSearchSelected] = useState<any>([])
  const [initialValues, setInitialValues] = useState<any>()
  const [oldAdmin, setOldAdmin] = useState<any>()
  console.log('data search', dataSearchSelected)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res2 = await axiosClient.get(`/branches/${slug}`)
        setInitialValues(res2.data)
        setAddressBranch(res2.data.address)
        setDataSearchSelected([res2.data.branchAdminResponses])
        setOldAdmin(res2.data.branchAdminResponses.id)
        console.log('data new', res2.data)
        if (res2.data.location != null) {
          const location = res2.data.location.split(',')
          setLatlng({ lat: location[0], lng: location[1] })
        }
        if (res2.data.status != null) {
          setSelectedStatus(res2.data.status === 'ACTIVE' ? '0' : '1')
        }
      } catch (error) {
        console.log(error)
      }
    }
    if (slug) fetchData()
  }, [slug])

  if (initialValues) {
    return (
      <Container fixed>
        <Paper sx={{ p: 10 }}>
          {/* <Typography variant='h4' sx={{ mb: 10, textAlign: 'center' }}>
          ꧁༺CẬP NHẬT CHI NHÁNH༻꧂
        </Typography> */}
          <Formik
            initialValues={{
              name: initialValues.name,
              mainImage: '',
              description: initialValues.description
            }}
            validationSchema={validationSchema}
            onSubmit={async values => {
              setIsLoading(true)
              if (!addressBranch) {
                setIsLoading(false)
                toast.error('Khi chọn vị trí bắt buộc phải có địa chỉ dạng văn bản đi kèm!')

                return
              }
              if (!latlng) {
                setIsLoading(false)
                toast.error('Vui lòng chọn tọa độ chi nhánh!')

                return
              }

              const formData = new FormData()
              formData.append('name', values.name)
              formData.append('description', values.description)
              formData.append('address', addressBranch)
              formData.append(`image`, values.mainImage)
              formData.append('status', parseInt(selectedStatus, 10).toString())
              const location = [latlng.lat, latlng.lng]
              for (let i = 0; i < location.length; i++) {
                formData.append(`location`, location[i])
              }
              if (oldAdmin !== dataSearchSelected[0].id) {
                const newDataSelectedBranchAdmin = dataSearchSelected.map((item: any) => ({
                  id: item.id

                  // status: item.hasOwnProperty('status') ? item.status : 'ACTIVE'
                }))

                for (let i = 0; i < newDataSelectedBranchAdmin.length; i++) {
                  formData.append(`branchAdminId`, newDataSelectedBranchAdmin[i].id)
                }
              }
              try {
                const res: any = await axiosClient.put(`/branches/${slug}`, formData, {
                  headers: {
                    'Content-Type': 'multipart/form-data'
                  }
                })
                setIsLoading(false)
                toast.success(res.message)

                router.push('/danh-sach-chi-nhanh')
              } catch (error: any) {
                console.log('err nè: ', error)
                setIsLoading(false)
              }
            }}
          >
            {({}) => (
              <Form>
                <Field name='name'>
                  {({ field, meta }: any) => (
                    <TextField
                      {...field}
                      label='Tên chi nhánh'
                      error={meta.touched && !!meta.error}
                      helperText={meta.touched && !!meta.error ? meta.error : ''}
                      fullWidth
                    />
                  )}
                </Field>
                <Field name='description'>
                  {({ field, meta }: any) => (
                    <TextField
                      {...field}
                      multiline
                      minrows={5}
                      maxRows={15}
                      label='Mô tả'
                      error={meta.touched && !!meta.error}
                      helperText={meta.touched && !!meta.error ? meta.error : ''}
                      fullWidth
                      sx={{ mt: 5 }}
                    />
                  )}
                </Field>
                <Box sx={{ mt: 3 }}>
                  <label htmlFor='mainImage' style={{ fontSize: '16px', marginRight: '10px', fontWeight: 700 }}>
                    Hình ảnh đại diện
                  </label>
                  {initialValues.image && !imgSrc && (
                    <Card sx={{ width: '200px', mt: 5, mb: 5 }}>
                      <CardMedia component='img' height='200' image={initialValues.image} alt='image alt text' />
                    </Card>
                  )}
                  {imgSrc && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 5 }}>
                      <Box>
                        <Card>
                          <CardMedia component='img' height='194' image={imgSrc} alt='alt text' />
                        </Card>
                      </Box>
                    </Box>
                  )}
                  <Field name='mainImage'>
                    {({ field, form, meta }: any) => (
                      <>
                        <Button component='label' color='info' variant='contained' htmlFor='mainImage'>
                          Chọn hình mới
                          <input
                            hidden
                            type='file'
                            id='mainImage'
                            accept='image/png, image/jpeg'
                            onChange={(event: any) => {
                              const reader = new FileReader()
                              const files = event.currentTarget.files
                              if (files && files.length !== 0) {
                                reader.onload = () => setImgSrc(reader.result as string)
                                reader.readAsDataURL(files[0])
                              }
                              form.setFieldValue(field.name, event.currentTarget.files[0])
                            }}
                          />
                        </Button>
                        {imgSrc && (
                          <Button
                            color='error'
                            sx={{ ml: 3 }}
                            variant='outlined'
                            onClick={() => {
                              setImgSrc('')
                              form.setFieldValue(field.name, '')
                            }}
                          >
                            Xóa
                          </Button>
                        )}
                        {meta.touched && !!meta.error && <div style={{ color: 'red' }}>{meta.error}</div>}
                      </>
                    )}
                  </Field>
                </Box>

                <Box sx={{ mt: 5, mb: 5 }}>
                  <Typography sx={{ fontWeight: 700 }}>Xác định vị trí chi nhánh</Typography>

                  <SimpleDialogDemo
                    setAddressActivity={setAddressBranch}
                    setLatlng={setLatlng}
                    location={
                      latlng.lat !== '' ? { lat: latlng.lat, lng: latlng.lng } : { lat: 10.7768, lng: 106.7298 }
                    }
                  />
                  {latlng && <Typography sx={{ mt: 1, mb: 3 }}>Tọa độ của bạn chọn đã được ghi nhận</Typography>}
                  <FormControl>
                    <TextField
                      label='Địa chỉ'
                      value={addressBranch}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setAddressBranch(event.target.value)
                      }}
                      fullWidth
                      helperText={'Vui lòng kiểm tra địa chỉ trước khi nộp biểu mẫu'}
                      sx={{ mb: 3, mt: 3, width: '70vw' }}
                    />
                  </FormControl>
                </Box>
                <Stack direction={'row'} justifyContent={'flex-start'} spacing={30} sx={{ mb: 5, mt: 5 }}>
                  <Box>
                    <Typography sx={{ fontWeight: 700 }}>Chọn quản trị viên cho chi nhánh</Typography>
                    <SearchBranchAdmin
                      dataSearch={dataSearch}
                      setDataSearch={setDataSearch}
                      dataSearchSelected={dataSearchSelected}
                      setDataSearchSelected={setDataSearchSelected}
                      type={'UPDATE'}
                    />
                  </Box>
                  <Box>
                    <InputLabel htmlFor='scope' sx={{ fontWeight: 700 }}>
                      Trạng thái
                    </InputLabel>
                    <Select
                      id='scope'
                      value={selectedStatus}
                      onChange={e => setSelectedStatus(e.target.value)}
                      sx={{ width: '250px' }}
                    >
                      <MenuItem value={'0'}>{'Đang hoạt động'}</MenuItem>
                      <MenuItem value={'1'}>{'Ngưng hoạt động'}</MenuItem>
                    </Select>
                  </Box>
                </Stack>
                {dataSearchSelected &&
                  dataSearchSelected.map((m: any) => (
                    <Paper
                      elevation={3}
                      key={m.id}
                      sx={{ width: '400px', mb: 5, p: 3, bgcolor: '#F9E79F', borderRadius: '15px' }}
                    >
                      <Stack direction={'row'} alignItems={'center'} spacing={2}>
                        <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mt: 5, mb: 5 }}>
                          <AccountCircleOutlinedIcon />
                          <Typography variant='body1' sx={{ mb: 3, fontWeight: 700 }}>
                            Họ và tên:
                          </Typography>
                        </Stack>
                        <Typography variant='body1'>{m.memberName ? m.memberName : m.fullName}</Typography>
                      </Stack>
                      <Stack direction={'row'} alignItems={'center'} spacing={2}>
                        <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mt: 5, mb: 5 }}>
                          <ContactMailOutlinedIcon />
                          <Typography variant='body1' sx={{ mb: 3, fontWeight: 700 }}>
                            Email:
                          </Typography>
                        </Stack>
                        <Typography variant='body1'>{m.email}</Typography>
                      </Stack>
                      <Stack direction={'row'} alignItems={'center'} spacing={2}>
                        <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mt: 5, mb: 5 }}>
                          <ContactPhoneOutlinedIcon />
                          <Typography variant='body1' sx={{ mb: 3, fontWeight: 700 }}>
                            Số điện thoại:
                          </Typography>
                        </Stack>
                        <Typography variant='body1'>{m.phone}</Typography>
                      </Stack>
                    </Paper>
                  ))}
                <Stack direction={'row'} justifyContent={'space-between'} spacing={5} sx={{ mb: 10 }}>
                  <Button fullWidth type='submit' color='info' variant='contained' disabled={loading}>
                    Nộp biểu mẫu
                  </Button>
                </Stack>
                <Link
                  style={{
                    textDecoration: 'none'
                  }}
                  href='/danh-sach-chi-nhanh'
                >
                  Trở về danh sách các chi nhánh
                </Link>
              </Form>
            )}
          </Formik>
        </Paper>
      </Container>
    )
  } else {
    return <Box>Loading data from server</Box>
  }
}

export default UpdateBranch

UpdateBranch.auth = {
  role: [KEY.ROLE.SYSTEM_ADMIN]
}
UpdateBranch.getLayout = (page: React.ReactNode) => (
  <UserLayout pageTile='Cập nhật chi nhánh hệ thống'>{page}</UserLayout>
)
