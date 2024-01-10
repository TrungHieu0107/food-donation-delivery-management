// Importing libraries and components
import { Button, Grid, Paper, TextField, Typography } from '@mui/material'
import { FormikProps, Formik, Form, Field, FieldProps } from 'formik'
import { LatLngExpression, LatLngTuple } from 'leaflet'
import * as React from 'react'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import * as Yup from 'yup'

// Importing custom components
import SelectOneFile from 'src/layouts/components/image/SelectOneFile'
import SelectOneImageView from 'src/layouts/components/image/SelectOneImage'
import GetLocationDialog from 'src/layouts/components/popup-get-location/PopUpGetLocation'

// Importing models
import { CharityUnitModel } from 'src/models/Charity'
import { UserModel } from 'src/models/User'
import { CommonRepsonseModel } from 'src/models/common/CommonResponseModel'

// Importing API
import { CharityAPI } from 'src/api-client/Charity'

const validationSchema = Yup.object({
  email: Yup.string().email('Email không khả dụng.').required('Hãy chọn điền email của đơn vị tổ chức'),
  phone: Yup.string()
    .matches(/(03|05|07|08|09|01|3|5|7|8|9|1[2|6|8|9])+([0-9]{8})\b/, 'Số điện thoại không hợp lệ.')
    .required('Hãy điền số điện thoại của đơn vị tổ chức'),
  name: Yup.string().required('Hãy điền tên của đơn vị tổ chức.'),
  image: Yup.mixed().required('Hãy chọn 1 ảnh đại diện của đơn vị'),
  legalDocument: Yup.mixed().required('Hãy chọn 1 tài liệu đăng ký hoạt động của đơn vị'),
  address: Yup.string().required('Hãy chọn địa chỉ của đơn vị tổ chức'),
  location: Yup.array().of(Yup.string()).required('Hãy chọn địa vị của đơn vị tổ chức.'),
  description: Yup.string()
})

export default function CreateNewCharityUnit() {
  const formikRef = React.useRef<FormikProps<CharityUnitModel>>(null)
  const [loading, setIsLoading] = React.useState(false)
  const router = useRouter()

  const handleSubmit = async (values: CharityUnitModel) => {
    try {
      setIsLoading(true)
      console.log('data submit: ', values)
      const response = await CharityAPI.createCharityUnit(values)
      toast.success(new CommonRepsonseModel<any>(response).message)
      router.push('/')
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Paper
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100vh',
        overflow: 'auto',
        padding: 10
      }}
    >
      <Typography variant='h5' sx={{ mb: 10, textAlign: 'center' }}>
        ꧁༺TẠO THÔNG TIN ĐƠN VỊ TỔ CHỨC TỪ THIỆN༻꧂
      </Typography>
      <Formik
        innerRef={formikRef}
        initialValues={
          new CharityUnitModel({
            address: '',
            description: '',
            email: '',
            image: null,
            legalDocument: null,
            location: undefined,
            name: '',
            phone: ''
          })
        }
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({}) => (
          <Form>
            <Grid container spacing={2} direction={'column'}>
              <Grid item>
                <Field name={`name`}>
                  {({ field, meta }: FieldProps) => (
                    <>
                      <TextField
                        {...field}
                        label='Tên đơn vị'
                        error={meta.touched && !!meta.error}
                        helperText={meta.touched && meta.error ? meta.error : ''}
                        fullWidth
                      />
                    </>
                  )}
                </Field>
              </Grid>
              <Grid item container spacing={2}>
                <Grid item xl lg md sm={12} xs={12}>
                  <Field name={`email`}>
                    {({ field, meta }: FieldProps) => (
                      <TextField
                        {...field}
                        label='Email'
                        error={meta.touched && !!meta.error}
                        helperText={meta.touched && meta.error ? meta.error : ''}
                        fullWidth
                      />
                    )}
                  </Field>
                </Grid>
                <Grid item xl lg md sm={12} xs={12}>
                  <Field name={`phone`}>
                    {({ field, meta }: any) => (
                      <TextField
                        {...field}
                        label='Số điện thoại'
                        error={meta.touched && !!meta.error}
                        helperText={meta.touched && meta.error ? meta.error : ''}
                        fullWidth
                        type='number'
                        inputProps={{
                          maxLength: 10
                        }}
                        onWheel={e => {
                          e.preventDefault()
                          e.currentTarget.blur()
                        }}
                        onScroll={e => {
                          e.preventDefault()
                          e.currentTarget.blur()
                        }}
                        InputProps={{
                          startAdornment: (
                            <Typography
                              title='+84'
                              variant='body1'
                              sx={{
                                px: 3,
                                borderRight: 1,
                                borderColor: '#d5d5d6'
                              }}
                            >
                              
                              +84
                            </Typography>
                          )
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            paddingLeft: '0px !important'
                          },
                          '& .css-15vcgfp-MuiInputBase-input-MuiOutlinedInput-input': {
                            paddingLeft: '15px !important'
                          }
                        }}
                      />
                    )}
                  </Field>
                </Grid>
              </Grid>
              <Grid item>
                <Field name={`address`}>
                  {({ field, form, meta }: FieldProps) => (
                    <GetLocationDialog
                      buttonProps={{
                        size: 'small',
                        sx: {
                          p: 0,
                          textTransform: 'none'
                        },
                        variant: 'text'
                      }}
                      textButton={`Vị trí trên \n bản đồ`}
                      handleChangeAddress={(userModel: UserModel) => {
                        form.setFieldValue(field.name, userModel.address)
                      }}
                      setLatlng={(value: LatLngExpression) => {
                        console.log(value)
                        const [lat, lng] = (value ?? [0, 0]) as LatLngTuple

                        form.setFieldValue(`location`, [lat, lng])
                      }}
                      fieldProps={{ field, form, meta }}
                      location={formikRef.current?.values.location}
                    />
                  )}
                </Field>
              </Grid>
              <Grid item>
                <Field name={`description`}>
                  {({ field, meta }: any) => (
                    <TextField
                      {...field}
                      multiline
                      rows={5}
                      label='Mô tả'
                      error={meta.touched && !!meta.error}
                      helperText={meta.touched && meta.error ? meta.error : ''}
                      fullWidth
                    />
                  )}
                </Field>
              </Grid>
              <Grid item>
                <Field name={`image`}>
                  {(fieldProps: FieldProps) => (
                    <SelectOneImageView formProp={fieldProps} title={'Chọn hình ảnh đại diện'} />
                  )}
                </Field>
              </Grid>
              <Grid item>
                <Field name={`legalDocument`}>
                  {(fieldProps: FieldProps) => (
                    <SelectOneFile formProp={fieldProps} title={'Chọn tài liệu đăng ký hoạt động'} />
                  )}
                </Field>
              </Grid>
            </Grid>
            <Grid container justifyContent={'center'} spacing={3}>
              <Grid item>
                <Button
                  color='secondary'
                  fullWidth
                  type='button'
                  disabled={loading}
                  onClick={() => {
                    router.push('/')
                  }}
                >
                  Quay lại
                </Button>
              </Grid>
              <Grid item>
                <Button fullWidth type='submit' variant='contained' disabled={loading}>
                  Đăng ký
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Paper>
  )
}
