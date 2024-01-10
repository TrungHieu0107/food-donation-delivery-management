import { Button, Grid, Paper, Skeleton, TextField, Typography } from '@mui/material'
import { Formik, Form, Field, FieldProps, FormikProps } from 'formik'
import { LatLngExpression, LatLng } from 'leaflet'
import { useSession } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'
import { UserAPI } from 'src/api-client/User'
import SelectAvatar from 'src/layouts/components/image/SelectAvatar'
import GetLocationDialog from 'src/layouts/components/popup-get-location/PopUpGetLocation'
import { UserModel } from 'src/models/User'
import { CommonRepsonseModel } from 'src/models/common/CommonResponseModel'
import * as Yup from 'yup'

const validationSchema = Yup.object<UserModel>({
  name: Yup.string().required('Hãy nhập tên của bạn.'),
  description: Yup.string(),
  address: Yup.string().required('Hãy nhập địa chỉ của bạn.'),
  location: Yup.array().of(Yup.string()).required('Hãy chọn vị trí của bạn.'),
  avatar: Yup.string().required('Hãy chọn ảnh đại diện của bạn')
})

export default function UpdateProfile() {
  const formikRef = useRef<FormikProps<UserModel>>(null)
  const [loading, setIsLoading] = useState(false)
  const [userLogin, setUserLogin] = useState<UserModel>()
  const [location, setLocation] = useState<LatLngExpression>()
  const { status } = useSession()

  useEffect(() => {
    try {
      if (status === 'authenticated') {
        fetchDataUserLogin()
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }, [status])

  const fetchDataUserLogin = async () => {
    const data = await UserAPI.getProfileLogin()
    const commonDataResponse = new CommonRepsonseModel<UserModel>(data)

    if (commonDataResponse.data?.location !== undefined && data.data?.location !== '') {
      const lat: number = Number.parseFloat(commonDataResponse.data?.location?.toString().split(',')[0] || '0')
      const lng: number = Number.parseFloat(commonDataResponse.data?.location?.toString().split(',')[1] || '0')
      lat === 0 && lng === 0 ? setLocation(undefined) : setLocation([lat, lng] as LatLngExpression)
    }

    setUserLogin(commonDataResponse.data)
    if (formikRef.current) {
      formikRef.current.setValues({ ...commonDataResponse.data })
    }
  }

  const handleSubmit = (values: UserModel) => {
    console.log(values)
  }

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 5,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Typography variant='h5' fontWeight={600} mb={3} textAlign={'center'}>
        Cập nhật thông tin cá nhân
      </Typography>

      <Formik
        innerRef={formikRef}
        initialValues={userLogin ?? {}}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({}) => (
          <Form>
            <Grid container spacing={2} direction={'column'}>
              <Grid item container spacing={2}>
                <Grid item xl lg md sm={12} xs={12}>
                  {userLogin && !loading ? (
                    <Field name={'name'}>
                      {({ field, meta }: FieldProps) => (
                        <>
                          <TextField
                            {...field}
                            label='Tên của bạn'
                            error={meta.touched && !!meta.error}
                            helperText={meta.touched && meta.error ? meta.error : ''}
                            fullWidth
                          />
                        </>
                      )}
                    </Field>
                  ) : (
                    <Skeleton height={30} width={'100%'} />
                  )}
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
                        form.setFieldValue(`location`, [(value as LatLng).lat, (value as LatLng).lng])
                      }}
                      fieldProps={{ field, form, meta }}
                      location={location}
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
                <Field name={`avatar`}>
                  {(fieldProps: FieldProps) => <SelectAvatar formProp={fieldProps} title={'Chọn hình ảnh đại diện'} />}
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
                    // handleChangeTab(nameBackTab, formikRef.current?.values)
                  }}
                >
                  Quay lại
                </Button>
              </Grid>
              <Grid item>
                <Button fullWidth type='submit' variant='contained' disabled={loading}>
                  Cập nhật
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Paper>
  )
}
