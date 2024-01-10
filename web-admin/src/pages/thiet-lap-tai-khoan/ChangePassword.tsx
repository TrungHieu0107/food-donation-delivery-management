'use client'

import { Button, Container, TextField } from '@mui/material'
import { Field, Form, Formik } from 'formik'
import { signOut } from 'next-auth/react'
import { useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import { toast } from 'react-toastify'
import axiosClient from 'src/api-client/ApiClient'
import { Authentation } from 'src/api-client/authentication'
import { KEY } from 'src/common/Keys'
import * as Yup from 'yup'

const validationSchema = Yup.object({
  oldPassword: Yup.string()
    .required('Mật khẩu hiện tại là bắt buộc!')
    .min(8, 'Tên ít nhất 8 kí tự!')
    .max(60, 'Tên nhiều nhất 60 kí tự!'),
  newPassword: Yup.string()
    .required('Mật khẩu mới là bắt buộc!')
    .min(8, 'Tên ít nhất 8 kí tự!')
    .max(40, 'Tên nhiều nhất 40 kí tự!'),
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Xác nhận mật khẩu không khớp!')
    .required('Xác nhận mật khẩu mới là bắt buộc!')
})

const ChangePassword = () => {
  const [loading, setIsLoading] = useState(false)

  return (
    <Container fixed sx={{ height: '100%' }}>
      <Formik
        initialValues={{
          oldPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        }}
        validationSchema={validationSchema}
        onSubmit={async values => {
          setIsLoading(true)
          const formData = {
            oldPassword: values.oldPassword,
            newPassword: values.newPassword
          }
          try {
            const res: any = await axiosClient.put('/users/profile/password', formData)
            setIsLoading(false)
           toast.success(res.message)
            console.log("zo đây");
            const url = '/quan-tri-vien/dang-nhap'
            Authentation.logout()
            .then(() => {
              signOut({
                redirect: true,
                callbackUrl: url
              })
            })
            .catch(error => {
              console.log(error)
              signOut({
                redirect: true,
                callbackUrl: url
              })
            })
          } catch (error: any) {
            console.log('err nè: ', error)
            setIsLoading(false)
           }
        }}
      >
        {({}) => (
          <Form>
            <Field name='oldPassword'>
              {({ field, meta }: any) => (
                <TextField
                  {...field}
                  label='Mật khẩu hiện tại'
                  error={meta.touched && !!meta.error}
                  helperText={meta.touched && !!meta.error ? meta.error : ''}
                  fullWidth
                  sx={{ mt: 10 }}
                />
              )}
            </Field>
            <Field name='newPassword'>
              {({ field, meta }: any) => (
                <TextField
                  {...field}
                  label='Mật khẩu mới'
                  error={meta.touched && !!meta.error}
                  helperText={meta.touched && !!meta.error ? meta.error : ''}
                  fullWidth
                  sx={{ mt: 10 }}
                />
              )}
            </Field>
            <Field name='confirmNewPassword'>
              {({ field, meta }: any) => (
                <TextField
                  {...field}
                  label='Xác nhận mật khẩu mới'
                  error={meta.touched && !!meta.error}
                  helperText={meta.touched && !!meta.error ? meta.error : ''}
                  fullWidth
                  sx={{ mt: 10, mb: 10 }}
                />
              )}
            </Field>
            <Button sx={{ mb: 10 }} color='info' fullWidth type='submit' variant='contained' disabled={loading}>
              Đổi mật khẩu
            </Button>
          </Form>
        )}
      </Formik>
    </Container>
  )
}

export default ChangePassword

ChangePassword.auth = {
  role: [KEY.ROLE.BRANCH_ADMIN, KEY.ROLE.SYSTEM_ADMIN]
}
