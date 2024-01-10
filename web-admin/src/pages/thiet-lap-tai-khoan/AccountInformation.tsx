'use client'

import { Avatar, Box, Button, FormControl, Grid, Stack, TextField, Typography } from '@mui/material'
import { Field, Form, Formik } from 'formik'
import { useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import { toast } from 'react-toastify'
import axiosClient from 'src/api-client/ApiClient'
import { KEY } from 'src/common/Keys'
import SimpleDialogDemo from 'src/layouts/components/PopUpGetLocation/PopUpGetLocation'
import * as Yup from 'yup'

const validationSchema = Yup.object({
  fullName: Yup.string()
    .required('Tiêu đề bắt buộc có')
    .min(5, 'Tên ít nhất 8 kí tự')
    .max(50, 'Tên nhiều nhất 60 kí tự'),
  mainImage: Yup.mixed().required('Hình ảnh avatar cần phải có !'),
  description: Yup.string().min(8, 'Mô tả ít nhất 8 kí tự').max(200, 'Mô tả nhiều nhất 200 kí tự')
})

const AccountInformation = ({ data }: any) => {
  const [loading, setIsLoading] = useState(false)
  const [addressBranch, setAddressBranch] = useState<any>(data.address)
  const [imgSrc, setImgSrc] = useState<string>(data.avatar)

  // const [imgSrc2, setImgSrc2] = useState<string>(data.frontOfIdCard)
  // const [imgSrc3, setImgSrc3] = useState<string>(data.backOfIdCard)
  const [latlng, setLatlng] = useState<{ lat: string; lng: string }>({ lat: '', lng: '' })

  return (
    <Box>
      <Formik
        initialValues={{
          fullName: data.name,
          mainImage: data.avatar

          // description: data.description,
          // frontOfIdCard: '',
          // backOfIdCard: '',
          // otherContacts: data.otherContacts,
          // experiences: data.experiences,
          // favorites: data.favorites,
          // skills: data.skills,
          // strengths: data.strengths,
          // jobs: data.jobs,
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
            toast.error('Vui lòng chọn tọa độ chi nhánh!')

            return
          }
          const formData = new FormData()
          formData.append('name', values.fullName)
          formData.append(`avatar`, values.mainImage)
          if (latlng.lat && latlng.lng) {
            const location = [latlng.lat, latlng.lng]
            for (let i = 0; i < location.length; i++) {
              formData.append(`location`, location[i])
            }
          }
          if (addressBranch) {
            formData.append(`address`, addressBranch)
          }

          try {
            const res: any = await axiosClient.put('/users/profile', formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            })
            toast.success(res.message)
          } catch (error: any) {
            console.log('err nè: ', error)
            if (error?.response?.data) {
              toast.error(error.response?.data?.message)
            }
          } finally {
            setIsLoading(false)
          }
        }}
      >
        {({}) => (
          <Form>
            <Grid container spacing={3} sx={{ pt: 10, width:{md: "90%"}, m: "auto" }}>
              <Grid item xs={12} sm={12} md={4} lg={3} sx={{ mt: 3 }}>
                {imgSrc && <Avatar sx={{ width: '250px', height: '250px', mb: 5 }} alt='avatar' src={imgSrc} />}
                <Field name='mainImage'>
                  {({ field, form, meta }: any) => (
                    <Stack direction={"row"}>
                      <Button
                        component='label'
                        color='primary'
                        variant='contained'
                        htmlFor='mainImage'
                        sx={{ ml: 7 }}
                      >
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
                    </Stack>
                  )}
                </Field>
              </Grid>
              <Grid item  xs={12} sm={12} md={8} lg={9} sx={{ mt: 10}}>
                <Stack direction={"column"}>
               
                  <Box width={"100%"} sx={{mb: 3}}>
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
                  </Box>
                <Box>
                  <FormControl sx={{width:"100%"}}>
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
                  <SimpleDialogDemo setAddressActivity={setAddressBranch} setLatlng={setLatlng} />
                  </Box>
                  </Stack>
              </Grid>
            </Grid>

            <Button sx={{ mb: 10, mt: 10 }} color='info' fullWidth type='submit' variant='contained' disabled={loading}>
              Lưu thay đổi
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  )
}

export default AccountInformation

AccountInformation.auth = {
  role: [KEY.ROLE.BRANCH_ADMIN]
}
