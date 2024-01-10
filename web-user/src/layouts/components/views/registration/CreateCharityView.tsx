import { Button, TextField, Typography, Paper, Grid } from '@mui/material'
import { Field, FieldProps, Form, Formik, FormikProps } from 'formik'
import { useRef, useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import * as Yup from 'yup'
import { CharityCreatingModel } from 'src/models/Charity'
import SelectAvatar from '../../image/SelectAvatar'

const validationSchema = Yup.object<CharityCreatingModel>({
  name: Yup.string()
    .min(5, 'Tên tổ chức phải dài ít nhất 5 kí tự.')
    .max(100, 'Tên tổ chức dài tối đa 100 kí tự.')
    .required('Nhập tên của tổ chức'),
  email: Yup.string().email('Email không đúng định dạng.').required('Hãy nhập email chính của tổ chức'),
  logo: Yup.mixed().required('HÃy chọn 1 hình ảnh địa diện của tỗ chức'),
  description: Yup.string().max(500, 'Ghi chú không được vượt quá 500 kí tự.')
})

interface CreateCharityViewProps {
  nameNextTab: string
  nameBackTab: string
  charityModel: CharityCreatingModel
  handleChangeTab: (tabName: string, charityModel?: CharityCreatingModel) => void
}

const CreateCharityView = (props: CreateCharityViewProps) => {
  const { nameNextTab, nameBackTab, charityModel, handleChangeTab } = props
  const formikRef = useRef<FormikProps<CharityCreatingModel>>(null)

  const [loading, setIsLoading] = useState(false)

  const handleSubmit = (values: CharityCreatingModel) => {
    setIsLoading(true)
    handleChangeTab(nameNextTab, values)
    setIsLoading(false)
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
        ꧁༺TẠO THÔNG TIN TỔ CHỨC TỪ THIỆN༻꧂
      </Typography>
      <Formik
        innerRef={formikRef}
        initialValues={charityModel}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({}) => (
          <Form>
            <Grid container spacing={2} direction={'column'}>
              <Grid item>
                <Field name='name'>
                  {({ field, meta }: any) => (
                    <TextField
                      {...field}
                      label='Tên tổ chức'
                      error={meta.touched && !!meta.error}
                      helperText={meta.touched && meta.error ? meta.error : ''}
                      fullWidth
                    />
                  )}
                </Field>
              </Grid>
              <Grid item>
                <Field name='email'>
                  {({ field, meta }: any) => (
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
              <Grid item>
                <Field name='description'>
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
              <Grid item display={'flex'}>
                <Field name='logo'>
                  {(fieldProps: FieldProps) => (
                    <>
                      <SelectAvatar formProp={fieldProps} title={'Chọn hình ảnh đại diện'} />
                    </>
                  )}
                </Field>
              </Grid>
            </Grid>

            {/* <Field name='location'>
              {({ field, meta }: any) => (
                <TextField
                  {...field}
                  sx={{ mt: 5, mb: 4 }}
                  label='Địa điểm'
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <LocationOnOutlinedIcon />
                      </InputAdornment>
                    )
                  }}
                  error={meta.touched && !!meta.error}
                  helperText={meta.touched && meta.error ? meta.error : ''}
                />
              )}
            </Field> */}
            <Grid container justifyContent={'center'} spacing={3}>
              <Grid item>
                <Button
                  color='secondary'
                  fullWidth
                  type='button'
                  disabled={loading}
                  onClick={() => {
                    handleChangeTab(nameBackTab, formikRef.current?.values)
                  }}
                >
                  Quay lại
                </Button>
              </Grid>
              <Grid item>
                <Button fullWidth type='submit' variant='contained' disabled={loading}>
                  Tiếp theo
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Paper>
  )
}

export default CreateCharityView
