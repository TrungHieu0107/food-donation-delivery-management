'use client'

import { Box, Button, Card, CardMedia, Grid, Paper, Stack, TextField } from '@mui/material'
import { Field, Form, Formik } from 'formik'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import { toast } from 'react-toastify'
import axiosClient from 'src/api-client/ApiClient'
import { KEY } from 'src/common/Keys'
import UserLayout from 'src/layouts/UserLayout'
import * as Yup from 'yup'

const validationSchema = Yup.object({
  fullName: Yup.string()
    .required('Tiêu đề bắt buộc có')
    .min(5, 'Tên ít nhất 8 kí tự')
    .max(50, 'Tên nhiều nhất 60 kí tự'),
  mainImage: Yup.mixed().required('Hình ảnh avatar cần phải có !'),
  phone: Yup.string()
    .required('Số điện thoại cần phải có !')
    .min(10, 'Số điện thoại ít nhất 10 kí tự')
    .max(11, 'Số điện thoại ít nhất 11 kí tự'),
  email: Yup.string()
    .email('Không đúng định dạng email!')
    .required('Email cần phải có !')
    .min(10, 'Email ít nhất 10 kí tự')
    .max(50, 'Email ít nhất 50 kí tự')
})

const CreateNewBranchAdmin = () => {
  const router = useRouter()
  const [loading, setIsLoading] = useState(false)
  const [imgSrc, setImgSrc] = useState<string>()
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosClient.get('/users/branch-admin')
        console.log(res.data)

        //setDataSearch(res.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])

  return (
    <Paper elevation={6} sx={{ p: 5, height: '100%' }}>
      <Formik
        initialValues={{
          fullName: '',
          phone: '',
          email: '',
          mainImage: ''
        }}
        validationSchema={validationSchema}
        onSubmit={async values => {
          setIsLoading(true)
          const formData = new FormData()
          formData.append('fullName', values.fullName)
          formData.append('email', values.email)
          formData.append('phone', values.phone)
          formData.append(`avatar`, values.mainImage)
          try {
            const data = await axiosClient.post('/users/branch-admin', formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            })
            console.log(data)
            toast.success('Tạo quản trị viên chi nhánh thành công')

            router.push('/quan-ly-nguoi-dung')
          } catch (error: any) {
            console.log('err nè: ', error)
            toast.error('Tạo quản trị viên chi nhánh thất bại')
          } finally {
            setIsLoading(false)
          }
        }}
      >
        {({}) => (
          <Form>
            <Grid container sx={{width:"80%", m: 'auto', mt: 20, mb:10}}>
              <Grid item xs={12} sm={6} md={3}>
                <Box>
                {imgSrc ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 5, pr: 5 }}>
                      <Box>
                        <Card>
                          <CardMedia component='img' height='194' image={imgSrc} alt='alt text' />
                        </Card>
                      </Box>
                    </Box>
                  ):(
                    <Box height={88}>                    
                    </Box>
                  )}
                  <Stack direction={'column'} sx={{pr: 5}}>
                    <label htmlFor='mainImage' style={{ fontSize: '16px', marginRight: '10px', fontWeight: 700, textAlign:"center" }}>
                      Hình ảnh đại diện
                    </label>
                    <Field name='mainImage'>
                      {({ field, form }: any) => (
                       
                          <Button component='label' color='primary' variant='outlined' htmlFor='mainImage'>
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
                     
                      )}
                    </Field>
                  </Stack>               
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={9}>
                <Field name='fullName'>
                  {({ field, meta }: any) => (
                    <TextField
                      {...field}
                      label='Tên người dùng'
                      error={meta.touched && !!meta.error}
                      helperText={meta.touched && !!meta.error ? meta.error : ''}
                      fullWidth
                    />
                  )}
                </Field>
                <Stack direction={'row'} justifyContent={'space-between'} spacing={5} sx={{ mt: 10 }}>
                  <Field name='phone'>
                    {({ field, meta }: any) => (
                      <TextField
                        {...field}
                        label='Số điện thoại'
                        error={meta.touched && !!meta.error}
                        helperText={meta.touched && !!meta.error ? meta.error : ''}
                        fullWidth
                      />
                    )}
                  </Field>
                  <Field name='email'>
                    {({ field, meta }: any) => (
                      <TextField
                        {...field}
                        label='Email'
                        error={meta.touched && !!meta.error}
                        helperText={meta.touched && !!meta.error ? meta.error : ''}
                        fullWidth
                      />
                    )}
                  </Field>
                </Stack>
              </Grid>
            </Grid>

            <Stack direction={'column'} justifyContent={'space-between'} spacing={5} sx={{width:"80%", m: 'auto' }}>
              <Button fullWidth type='submit' color='info' variant='contained' disabled={loading}>
                Nộp biểu mẫu
              </Button>
              <Link
              style={{
                textDecoration: 'none',                   
              }}
              href='/quan-ly-nguoi-dung/quan-tri-vien-chi-nhanh'
            >
              Trở về danh sách quản trị viên chi nhánh
            </Link>
            </Stack>
            
          </Form>
        )}
      </Formik>
    </Paper>
  )
}

export default CreateNewBranchAdmin

CreateNewBranchAdmin.auth = {
  role: [KEY.ROLE.SYSTEM_ADMIN]
}
CreateNewBranchAdmin.getLayout = (page: React.ReactNode) => (
  <UserLayout pageTile='Tạo quản trị viên chi nhánh'>{page}</UserLayout>
)
