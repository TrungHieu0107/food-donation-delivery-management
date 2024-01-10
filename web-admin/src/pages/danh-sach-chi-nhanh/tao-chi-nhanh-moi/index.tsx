'use client'

import {
  Box,
  Button,
  Card,
  CardMedia,
  Paper,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { Field, Form, Formik } from 'formik'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import axiosClient from 'src/api-client/ApiClient'
import { KEY } from 'src/common/Keys'
import SimpleDialogDemo from 'src/layouts/components/PopUpGetLocation/PopUpGetLocation'
import * as Yup from 'yup'
import SearchBranchAdmin from './searchBranchAdmin'
import UserLayout from 'src/layouts/UserLayout'
import { toast } from 'react-toastify'

const validationSchema = Yup.object({
  name: Yup.string()
    .required('Tiêu đề bắt buộc có')
    .min(10, 'Tên ít nhất 10 kí tự')
    .max(200, 'Tên nhiều nhất 150 kí tự'),
  mainImage: Yup.mixed().required('Hình ảnh cần phải có !')
})

const CreateBranch = () => {
  const router = useRouter()
  const [loading, setIsLoading] = useState(false)
  const [addressBranch, setAddressBranch] = useState<any>('')
  const [latlng, setLatlng] = useState<{ lat: string; lng: string }>({ lat: '', lng: '' })
  const [selectedScope, setSelectedScope] = useState<string>('0')
  const [imgSrc, setImgSrc] = useState<string>()
  const [dataSearch, setDataSearch] = useState([])
  const [dataSearchSelected, setDataSearchSelected] = useState([])

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const res = await axiosClient.get('/users/branch-admin')
  //       console.log(res.data)

  //     } catch (error) {
  //       console.log(error)
  //     }
  //   }
  //   fetchData()
  // }, [])
  console.log('location: ', latlng)

  return (
    <Box component={Paper} sx={{ p: 10 }}>
      {/* <Typography variant='h4' sx={{ mb: 10, textAlign: 'center' }}>
        ꧁༺TẠO CHI NHÁNH MỚI༻꧂
      </Typography> */}
      <Formik
        initialValues={{
          name: '',
          mainImage: '',
          description: ''
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
          console.log(dataSearchSelected)
          if (dataSearchSelected.length === 0) {
            setIsLoading(false)
            toast.error('Vui lòng quản trị viên chi nhánh!')

            return
          }
          const formData = new FormData()
          formData.append('name', values.name)
          formData.append('description', values.description)
          formData.append('address', addressBranch)
          formData.append(`image`, values.mainImage)
          formData.append('status', parseInt(selectedScope, 10).toString())
          const location = [latlng.lat, latlng.lng]
          for (let i = 0; i < location.length; i++) {
            formData.append(`location`, location[i])
          }
          const newDataSelectedBranchAdmin = dataSearchSelected.map((data: any) => data.id)

          // for (let i = 0; i < newDataSelectedBranchAdmin.length; i++) {
          formData.append(`BranchAdminId`, newDataSelectedBranchAdmin[0])

          //}
          try {
            const data = await axiosClient.post('/branches', formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            })
            console.log(data)
            setIsLoading(false)
            toast.success('Tạo chi nhánh thành công')

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
                  rows={5}
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
                      Chọn hình
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

              <SimpleDialogDemo setAddressActivity={setAddressBranch} setLatlng={setLatlng} />
              <FormControl fullWidth>
                {latlng.lat !== '' && (
                  <Typography sx={{ mt: 1, mb: 3 }}>Tọa độ của bạn chọn đã được ghi nhận</Typography>
                )}
                <TextField
                  label='Địa chỉ'
                  value={addressBranch}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setAddressBranch(event.target.value)
                  }}
                  fullWidth
                  helperText={'Vui lòng kiểm tra địa chỉ trước khi nộp biểu mẫu'}
                  sx={{ mb: 3, mt: 3 }}
                />
              </FormControl>
            </Box>
            <Stack direction={'row'} justifyContent={'flex-start'} spacing={10} sx={{ mb: 5, mt: 5 }}>
              <Box>
                <InputLabel htmlFor='scope' sx={{ fontWeight: 700 }}>
                  Trạng thái
                </InputLabel>
                <Select
                  id='scope'
                  value={selectedScope}
                  onChange={e => setSelectedScope(e.target.value)}
                  sx={{ width: '20vw' }}
                >
                  <MenuItem value={'0'}>{'Đang hoạt động'}</MenuItem>
                  <MenuItem value={'1'}>{'Ngưng hoạt động'}</MenuItem>
                </Select>
              </Box>
            </Stack>
            <Box sx={{ mb: 10, width:"100%" }}>
              <Typography sx={{ fontWeight: 700, mb: 3 }}>Chọn quản trị viên cho chi nhánh</Typography>
              <SearchBranchAdmin
                dataSearch={dataSearch}
                setDataSearch={setDataSearch}
                dataSearchSelected={dataSearchSelected}
                setDataSearchSelected={setDataSearchSelected}
                type={'CREATE'}
              />
            </Box>
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
    </Box>
  )
}

export default CreateBranch

CreateBranch.auth = {
  role: [KEY.ROLE.SYSTEM_ADMIN]
}
CreateBranch.getLayout = (page: React.ReactNode) => (
  <UserLayout pageTile='Tạo mới chi nhánh hệ thống'>{page}</UserLayout>
)
