import { Paper, Typography, TextField, Button, Grid, Divider } from '@mui/material'
import { Formik, Form, Field, FieldProps, FormikProps, FieldInputProps } from 'formik'
import { CharityCreatingModel, CharityUnitModel } from 'src/models/Charity'
import * as Yup from 'yup'
import { useRef, useState } from 'react'
import { Plus } from 'mdi-material-ui'
import GetLocationDialog from '../../popup-get-location/PopUpGetLocation'
import { LatLngExpression, LatLngTuple } from 'leaflet'
import { UserModel } from 'src/models/User'
import SelectOneFile from '../../image/SelectOneFile'
import SelectOneImageView from '../../image/SelectOneImage'

export interface ICreateCharityUnitViewProps {
  nameBackTab: string
  charityModel: CharityCreatingModel
  handleChangeTab: (tabName: string, charityModel?: CharityCreatingModel) => void
}

const validationSchema = Yup.object({
	charityUnits: Yup.array()
		.of(
			Yup.object({
				email: Yup.string()
					.email('Email không khả dụng.')
					.required('Hãy chọn điền email của đơn vị tổ chức'),
				phone: Yup.string()
					.matches(
						/(03|05|07|08|09|01|3|5|7|8|9|1[2|6|8|9])+([0-9]{8})\b/,
						'Số điện thoại không hợp lệ.'
					)
					.required('Hãy điền số điện thoại của đơn vị tổ chức'),
				name: Yup.string()
					.min(5, 'Tên của đơn vị tổ chức phải ít nhất 5 kí tự.')
					.max(100, 'Tên của đơn vị tổ chức không vượt quá 100 kí tự.')
					.required('Hãy điền tên của đơn vị tổ chức.'),
				image: Yup.mixed().required('Hãy chọn 1 ảnh đại diện của đơn vị'),

				// image: Yup.array()
				//   .of(Yup.mixed())
				//   .min(1, 'Hãy chọn ít nhất 1 ảnh đại diện của đơn vị')
				//   .required('Hãy chọn ít nhất 1 ảnh đại diện của đơn vị'),
				legalDocument: Yup.mixed().required('Hãy chọn 1 tài liệu đăng ký hoạt động của đơn vị'),

				// legalDocuments: Yup.array()
				//   .of(Yup.mixed())
				//   .min(1, 'Hãy chọn ít nhất 1 tài liệu đăng ký hoạt động của đơn vị')
				//   .required('Hãy chọn ít nhất 1 tài liệu đăng ký hoạt động của đơn vị'),
				address: Yup.string().required('Hãy chọn địa chỉ của đơn vị tổ chức'),
				location: Yup.array().of(Yup.string()).required('Hãy chọn địa vị của đơn vị tổ chức.'),
				description: Yup.string().min(50, 'Nội dung mô tả phải có ít nhất 50 kí tự.')
			})
		)
		.min(1, 'Hãy tạo ít nhất 1 đơn vị tổ chức')
		.required('Hãy tạo ít nhất 1 đơn vị tổ chức')
})

interface State {
  [key: string]: string
}

export default function CreateCharityUnitView(props: ICreateCharityUnitViewProps) {
  const { nameBackTab, charityModel, handleChangeTab } = props

  const formikRef = useRef<FormikProps<CharityCreatingModel>>(null)

  const [loading, setIsLoading] = useState(false)
  const [stateError, setStateError] = useState<State>({})

  const handleChange = (value: any, field: FieldInputProps<any>, form: FormikProps<any>) => {
    const fieldName = field.name.split('].')[1]
    const valueInOtherUnit = formikRef.current?.values.charityUnits.map((value: any) => value[fieldName])
    const sameValue = valueInOtherUnit?.filter(val => val === value)
    console.log(valueInOtherUnit, sameValue)

    if (sameValue && sameValue.length > 0) {
      setStateError({ ...stateError, [field.name]: 'Giá trị đã được sử dụng tại đơn vị khác.' })
    } else {
      setStateError({ ...stateError, [field.name]: '' })
    }
    form.setFieldValue(field.name, value)
  }

  const handleSubmit = (values: CharityCreatingModel) => {
    setIsLoading(true)
    console.log('data submit: ', values)
    handleChangeTab('submit', values)
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
        ꧁༺TẠO THÔNG TIN ĐƠN VỊ TỔ CHỨC TỪ THIỆN༻꧂
      </Typography>
      <Formik
        innerRef={formikRef}
        initialValues={charityModel}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validate={() => {
          console.log(formikRef.current?.errors)
        }}
      >
        {({ }) => (
          <Form>
            {formikRef.current?.values.charityUnits?.map((item, index) => {
              return (
                <Grid key={index} container spacing={2} direction={'column'}>
                  <Grid item container>
                    <Typography
                      px={3}
                      sx={{
                        color: theme => theme.palette.primary.main
                      }}
                    >
                      {index === 0 ? 'Đơn vị chính' : `Đơn vị ${index}`}
                    </Typography>
                    <Divider
                      sx={{
                        flexGrow: 1
                      }}
                    />
                    {index !== 0 && <Typography
                      px={3}
                      sx={{
                        color: theme => theme.palette.primary.main,
                        cursor: 'pointer'
                      }}
                      onClick={() => {
                        formikRef.current?.setFieldValue('charityUnits', [
                          ...formikRef.current.values.charityUnits.filter((item, i) => {
                            return i !== index
                          })
                        ])
                      }}
                    >
                      Xóa
                    </Typography>}
                  </Grid>
                  <Grid item>
                    <Field name={`charityUnits[${index}].name`}>
                      {({ field, meta }: FieldProps) => (
                        <>
                          <TextField
                            {...field}
                            label='Tên đơn vị'
                            error={(meta.touched && !!meta.error) || !!stateError[field.name]}
                            helperText={meta.touched && meta.error ? meta.error : stateError[field.name]}
                            fullWidth
                          />
                        </>
                      )}
                    </Field>
                  </Grid>
                  <Grid item container spacing={2}>
                    <Grid item xl lg md sm={12} xs={12}>
                      <Field name={`charityUnits[${index}].email`}>
                        {({ field, form, meta }: FieldProps) => (
                          <TextField
                            {...field}
                            label='Email'
                            error={(meta.touched && !!meta.error) || !!stateError[field.name]}
                            helperText={meta.touched && meta.error ? meta.error : stateError[field.name]}
                            fullWidth
                            onChange={e => {
                              handleChange(e.target.value, field, form)
                            }}
                          />
                        )}
                      </Field>
                    </Grid>
                    <Grid item xl lg md sm={12} xs={12}>
                      <Field name={`charityUnits[${index}].phone`}>
                        {({ field, form, meta }: any) => (
                          <TextField
                            {...field}
                            label='Số điện thoại'
                            error={(meta.touched && !!meta.error) || !!stateError[field.name]}
                            helperText={meta.touched && meta.error ? meta.error : stateError[field.name]}
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
                            onChange={e => {
                              handleChange(e.target.value, field, form)
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
                    <Field name={`charityUnits[${index}].address`}>
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
                            const [lat, lng] = value as LatLngTuple
                            form.setFieldValue(`charityUnits[${index}].location`, [
                              lat,
                              lng
                            ])
                          }}
                          fieldProps={{ field, form, meta }}
                          location={formikRef.current?.values.charityUnits[index].location}
                        />
                      )}
                    </Field>
                  </Grid>
                  <Grid item>
                    <Field name={`charityUnits[${index}].description`}>
                      {({ field, meta }: any) => (
                        <TextField
                          {...field}
                          multiline
                          rows={5}
                          label='Mô tả'
                          error={(meta.touched && !!meta.error) || !!stateError[field.name]}
                          helperText={meta.touched && meta.error ? meta.error : stateError[field.name]}
                          fullWidth
                        />
                      )}
                    </Field>
                  </Grid>
                  <Grid item>
                    <Field name={`charityUnits[${index}].image`}>
                      {(fieldProps: FieldProps) => (
                        <SelectOneImageView formProp={fieldProps} title={'Chọn hình ảnh đại diện'} />
                      )}
                    </Field>
                  </Grid>
                  <Grid item>
                    <Field name={`charityUnits[${index}].legalDocument`}>
                      {(fieldProps: FieldProps) => (
                        <SelectOneFile formProp={fieldProps} title={'Chọn tài liệu đăng ký hoạt động'} />
                      )}
                    </Field>
                  </Grid>
                </Grid>
              )
            })}

            <Grid container alignItems={'center'}>
              <Button
                startIcon={<Plus />}
                onClick={() => {
                  formikRef.current?.setFieldValue('charityUnits', [
                    ...formikRef.current.values.charityUnits,
                    new CharityUnitModel()
                  ])
                }}
              >
                Thêm đơn vị
              </Button>
              <Divider
                sx={{
                  flexGrow: 1
                }}
              />
            </Grid>

            {/* <Field name={`charityUnits[${index}].location'>
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
