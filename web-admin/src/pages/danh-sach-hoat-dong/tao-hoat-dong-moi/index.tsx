'use client'

import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import {
  Box,
  Button,
  Card,
  CardMedia,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material'
import { SelectChangeEvent } from '@mui/material/Select'
import { Theme, useTheme } from '@mui/material/styles'
import { Field, FieldArray, FieldProps, Form, Formik, FormikProps, FormikValues } from 'formik'
import moment from 'moment'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { toast } from 'react-toastify'
import useSession from 'src/@core/hooks/useSession'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import axiosClient from 'src/api-client/ApiClient'
import { KEY } from 'src/common/Keys'
import UserLayout from 'src/layouts/UserLayout'
import SimpleDialogDemo from 'src/layouts/components/PopUpGetLocation/PopUpGetLocation'
import * as Yup from 'yup'
import PopupGetItemByBranchAdmin from './PopUpChooseItem'
import SearchItem from './SearchItem'
import vi from 'date-fns/locale/vi'
import { UserContextModel, UserModel } from 'src/models/User'
import { UserAPI } from 'src/api-client/User'
import { CommonRepsonseModel } from 'src/models/common/CommonResponseModel'
import { isInteger } from 'src/@core/layouts/utils'

registerLocale('vi', vi)
const validationSchema = Yup.object({
  title: Yup.string()
    .required('Tiêu đề bắt buộc có')
    .min(10, 'Tên ít nhất 10 kí tự')
    .max(100, 'Tên nhiều nhất 100 kí tự'),
  mainImage: Yup.mixed().required('Hình ảnh cho hoạt động cần phải có'),
  description: Yup.string()
    .required('Mô tả bắt buộc có')
    .min(50, 'Mô tả ít nhất 50 kí tự'),
  start: Yup.date()
    .required('Ngày bắt đầu (dự kiến) bắt buộc có')
    .min(new Date(Date.now() - 864e5), 'Ngày bắt đầu (dự kiến) không được là ngày trong quá khứ!'),
  end: Yup.date()
    .required('Ngày kết thúc (dự kiến) bắt buộc có')
    .min(Yup.ref('start'), 'Ngày kết thúc (dự kiến) phải sau ngày bắt đầu (dự kiến)'),
  atLocation: Yup.boolean(),
  listItemSelected: Yup.array().of(
    Yup.object().shape({
      quantity: Yup.number().min(1, 'Số lượng ít nhất là 1').required('Số lượng bắt buộc phải có')
    })
  )
})
const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
}

function getStyles(name: string, selectName: readonly string[], theme: Theme) {
  return {
    fontWeight: selectName.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium
  }
}

const CreateActivity = () => {
  const router = useRouter()
  const { context, session }: any = useSession()
  const [loading, setIsLoading] = useState(false)
  const [showItem, setShowItem] = useState(false)
  const [addressActivity, setAddressActivity] = useState<any>()
  const [latlng, setLatlng] = useState<any>()
  const [data, setData] = useState<{ id: string; name: string }[]>([
    { id: '1', name: 'Quyên góp' },
    { id: '2', name: 'Hỗ Trợ' }
  ])
  const [dataBranches, setDataBranches] = useState<
    {
      id: string
      name: string
      addresses: string
      images: string
      status: string
      createdDate: string
    }[]
  >([
    {
      id: '1',
      name: 'Branch 1',
      addresses: 'addresses',
      images: 'images',
      status: 'active',
      createdDate: 'createdDate'
    }
  ])
  const formikRef = useRef<FormikProps<FormikValues>>(null)
  const [selectedType, setSelectedType] = useState<string[]>([])
  const [itemSelected, setItemSelected] = useState<any>([])
  const [selectedBranches, setSelectedBranches] = useState<string[]>([])
  const [selectedScope, setSelectedScope] = useState<string>('0')
  const [imgSrc, setImgSrc] = useState<string[]>([])
  const [userLogin, setUserLogin] = useState<UserModel>()

  const theme = useTheme()

  const handleTypeChange = (event: SelectChangeEvent<typeof selectedType>) => {
    const {
      target: { value }
    } = event
    if (typeof value !== 'string') {
      const foundObject = data.find(obj => obj.name === 'Quyên góp')
      const check = value.find((obj: any) => obj === foundObject?.id)
      if (check) {
        setShowItem(true)
      } else {
        setShowItem(false)
      }
    }
    setSelectedType(typeof value === 'string' ? value.split(',') : value)
  }
  const handleBranchChange = (event: SelectChangeEvent<typeof selectedBranches>) => {
    const {
      target: { value }
    } = event
    setSelectedBranches(typeof value === 'string' ? value.split(',') : value)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseTypes = await axiosClient.get('/activity-types')
        const responseBranches = await axiosClient.get('/branches')
        const branchesAtive = responseBranches.data.filter((d: any) => d.status === 'ACTIVE')
        setDataBranches(branchesAtive)
        setData(responseTypes.data)
      } catch (error) {
        console.log(error)
      }
    }

    const fetchDataUserLogin = async () => {
      try {
        console.log('getprofile')
        const data = await UserAPI.getProfileLogin()

        const commonDataResponse = new CommonRepsonseModel<UserModel>(data)
        setUserLogin(commonDataResponse.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchData()
    fetchDataUserLogin()
  }, [])
  const handleSubmitForm = async (values: any) => {
    setIsLoading(true)
    if (!addressActivity && values.atLocation == true) {
      setIsLoading(false)
      toast.error('Khi chọn vị trí bắt buộc phải có địa chỉ dạng văn bản đi kèm!')

      return
    }
    if (showItem === true && itemSelected.length === 0) {
      toast.error('Vui lòng chọn vật phẩm đi kèm loại hoạt động QUYÊN GÓP!')
      setIsLoading(false)

      return
    }
    if (selectedBranches?.length === 0 && session?.user.role === 'SYSTEM_ADMIN') {
      toast.error('Vui lòng chọn chi nhánh tham gia!')
      setIsLoading(false)

      return
    }
    if (selectedType?.length === 0) {
      toast.error('Vui lòng chọn loại hoạt động!')
      setIsLoading(false)

      return
    }
    const formData = new FormData()
    formData.append('Name', values.title)
    formData.append('EstimatedStartDate', moment(values.start).format('YYYY-MM-DD'))
    formData.append('EstimatedEndDate', moment(values.end).format('YYYY-MM-DD'))
    if (values.deliveryDate) {
      formData.append('DeliveringDate', moment(values.deliveryDate).format('YYYY-MM-DD'))
    }

    formData.append('Description', values.description)
    for (let i = 0; i < values.mainImage.length; i++) {
      formData.append(`Images`, values.mainImage[i])
    }
    formData.append('Scope', parseInt(selectedScope, 10).toString())
    for (let i = 0; i < selectedType.length; i++) {
      formData.append(`ActivityTypeIds`, selectedType[i])
    }
    if (selectedBranches.length > 0 && session?.user.role === 'SYSTEM_ADMIN') {
      for (let i = 0; i < selectedBranches.length; i++) {
        formData.append(`BranchIds`, selectedBranches[i])
      }
    }
    if (values.atLocation && addressActivity && latlng) {
      const location = [latlng.lat, latlng.lng]
      for (let i = 0; i < location.length; i++) {
        formData.append(`Location`, location[i])
      }
      formData.append(`address`, addressActivity)
    }
    if (values.listItemSelected.length > 0 && showItem === true) {
      for (let i = 0; i < values.listItemSelected.length; i++) {
        if (values.listItemSelected[i]?.status === 'new_item') {
          const objectNewSend = {
            itemId: values.listItemSelected[i].id,
            quantity: values.listItemSelected[i].quantity
          }
          formData.append(`TargetProcessRequests`, JSON.stringify(objectNewSend))
        } else {
          const objecAvailableSend = {
            aidItemId: values.listItemSelected[i].id,
            quantity: values.listItemSelected[i].quantity
          }
          formData.append(`AidItemForActivityRequests`, JSON.stringify(objecAvailableSend))
        }
      }
    }
    try {
      const data = await axiosClient.post('/activities', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      console.log(data)
      toast.success('Tạo hoạt động thành công')

      router.push(`/danh-sach-hoat-dong/hoat-dong/${data.data}`)
    } catch (error: any) {
      console.log('err nè: ', error)
      if (error.response.data) {
        if (error.response.data.errors.DeliveringDate) {
          for (let i = 0; i < error.response.data.errors.DeliveringDate.length; i++) {
            toast.error(error.response.data.errors.DeliveringDate[i])
          }
        }
        if (error.response.data.errors.Address) {
          console.log('3')
          for (let i = 0; i < error.response.data.errors.Address.length; i++) {
            toast.error(error.response.data.errors.Address[i])
          }
        }
        if (error.response.data.errors.EstimatedStartDate) {
          for (let i = 0; i < error.response.data.errors.EstimatedStartDate.length; i++) {
            toast.error(error.response.data.errors.EstimatedStartDate[i])
          }
        }
        if (error.response.data.errors.EstimatedEndDate) {
          for (let i = 0; i < error.response.data.errors.EstimatedEndDate.length; i++) {
            toast.error(error.response.data.errors.EstimatedEndDate[i])
          }
        }
      }
      if (error.response.data.errors.Images) {
        for (let i = 0; i < error.response.data.errors.Images.length; i++) {
          toast.error(error.response.data.errors.Images[i])
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Paper elevation={6} sx={{ p: 5 }}>
      {/* <Typography variant='h4' sx={{ mb: 10, textAlign: 'center' }}>
        ꧁༺TẠO HOẠT ĐỘNG MỚI༻꧂
      </Typography> */}
      <Formik
        innerRef={formikRef}
        initialValues={{
          title: '',
          description: '',
          mainImage: null,
          start: '',
          end: '',
          deliveryDate: '',
          atLocation: false,
          listItemSelected: [{ name: '', quantity: 1, unit: 'Kg' }]
        }}
        validationSchema={validationSchema}
        validateOnBlur={true}
        validateOnChange={false}
        onSubmit={values => {
          handleSubmitForm(values)
        }}
      >
        {({ values }) => (
          <DatePickerWrapper>
            <Form>
              <Field name='title'>
                {({ field, meta }: any) => (
                  <TextField
                    {...field}
                    label='Tên hoạt động'
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
                    minRows={5}
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
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 3, mb: 4 }}>
                  <Box sx={{ width: '100vw' }}>
                    <Grid container spacing={3}>
                      {imgSrc.map((src, index) => (
                        <Grid item lg={2.4} md={3} xs={12} key={index}>
                          <Card>
                            <CardMedia component='img' height='194' image={src} alt='Paella dish' />
                          </Card>
                        </Grid>
                      ))}
                    </Grid>

                    {/* <Typography variant='body2' sx={{ marginTop: 5, color: 'black' }}>
                    Allowed PNG or JPEG. Max size of 800K.
                  </Typography> */}
                  </Box>
                </Box>
                <Field name='mainImage'>
                  {({ field, form, meta }: any) => (
                    <>
                      <Button component='label' color='info' variant='contained' htmlFor='mainImage'>
                        Chọn hình
                        <input
                          hidden
                          multiple
                          type='file'
                          id='mainImage'
                          accept='image/png, image/jpeg'
                          onChange={(event: any) => {
                            const files = event.currentTarget.files
                            const updatedImgSrcArray: string[] = []
                            const readNextFile = (index: any) => {
                              if (index < files.length) {
                                const reader = new FileReader()
                                reader.onload = () => {
                                  updatedImgSrcArray.push(reader.result as string)
                                  if (updatedImgSrcArray.length === files.length) {
                                    // After all images are loaded, update the state
                                    setImgSrc(updatedImgSrcArray)
                                  } else {
                                    // Read the next file
                                    readNextFile(index + 1)
                                  }
                                }
                                reader.readAsDataURL(files[index])
                              }
                            }

                            // Start reading the first file
                            readNextFile(0)
                            form.setFieldValue(field.name, event.currentTarget.files)
                          }}
                        />
                      </Button>
                      {/* {imgSrc.length > 0 && (
                      <Button
                        color='error'
                        sx={{ ml: 3 }}
                        variant='outlined'
                        onClick={() => {
                          setImgSrc([])
                          form.setFieldValue(field.name, null)
                        }}
                      >
                        Xóa
                      </Button>
                    )} */}
                      {meta.touched && !!meta.error && <div style={{ color: 'red' }}>{meta.error}</div>}
                    </>
                  )}
                </Field>
              </Box>
              <InputLabel sx={{ mt: 10, fontWeight: 700, width: '100%', mb: 2 }}>Thời gian hoạt động</InputLabel>
              <Stack direction={'row'} alignItems={'center'} spacing={10} justifyContent={'flex-start'} sx={{ mb: 5 }}>
                <Field name='start'>
                  {({ field, meta, form: { setFieldValue } }: any) => (
                    <DatePicker
                      {...field}
                      locale={'vi'}
                      customInput={
                        <TextField
                          {...field}
                          inputProps={{
                            autoComplete: 'off'
                          }}
                          fullWidth
                          size='medium'
                          label='Ngày bắt đầu (dự kiến)'
                          sx={{
                            '& .MuiInputBase-root': {
                              borderRadius: 2
                            }
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position='start'>
                                <CalendarTodayIcon />
                              </InputAdornment>
                            )
                          }}
                          error={meta.touched && !!meta.error}
                          helperText={meta.touched && !!meta.error ? meta.error : ''}
                        />
                      }
                      selectsRange={false}
                      selected={field.value || null}
                      onChange={val => {
                        setFieldValue(field.name, val)
                      }}
                      minDate={Date.now()}
                      maxDate={moment().add(3, 'month').toDate()}
                      placeholderText='Chọn thời gian'
                      dateFormat='dd/MM/yyyy'
                    />
                  )}
                </Field>
                <Field name='end'>
                  {({ field, meta, form }: FieldProps) => (
                    <DatePicker
                      {...field}
                      locale={'vi'}
                      customInput={
                        <TextField
                          {...field}
                          fullWidth
                          inputProps={{
                            autoComplete: 'off'
                          }}
                          size='medium'
                          label='Ngày kết thúc (dự kiến)'
                          sx={{
                            '& .MuiInputBase-root': {
                              borderRadius: 2
                            }
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position='start'>
                                <CalendarTodayIcon />
                              </InputAdornment>
                            )
                          }}
                          error={meta.touched && !!meta.error}
                          helperText={meta.touched && !!meta.error ? meta.error : ''}
                        />
                      }
                      selectsRange={false}
                      selected={field.value || null}
                      minDate={!!form.values?.start ? moment(form.values?.start).toDate() : moment().toDate()}
                      maxDate={
                        !!form.values?.start
                          ? moment(form.values?.start).add(3, 'month').toDate()
                          : moment().add(3, 'month').toDate()
                      }
                      onChange={val => {
                        form.setFieldValue(field.name, val)
                      }}
                      placeholderText='Chọn thời gian'
                      dateFormat='dd/MM/yyyy'
                    />
                  )}
                </Field>
                {/* <Field name='deliveryDate'>
                {({ field, meta, form: { setFieldValue } }: any) => (
                  <DatePicker
                    {...field}
                    customInput={
                      <TextField
                        {...field}
                        fullWidth
                        size='medium'
                        label='Ngày bắt đầu giao vật phẩm về nơi kêu gọi'
                        sx={{
                          '& .MuiInputBase-root': {
                            borderRadius: 2
                          }
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>
                              <CalendarTodayIcon />
                            </InputAdornment>
                          )
                        }}
                        error={meta.touched && !!meta.error}
                        helperText={meta.touched && !!meta.error ? meta.error : ''}
                      />
                    }
                    selectsRange={false}
                    selected={field.value || null}
                    onChange={val => {
                      setFieldValue(field.name, val)
                    }}
                    placeholderText='Chọn thời gian'
                    dateFormat='dd/MM/yyyy'
                  />
                )}
              </Field> */}
              </Stack>
              <Grid container sx={{ mb: 5, mt: 5, width: '100%' }} spacing={5} flexDirection={'column'}>
                <Grid item xs={12} sm={12} md={6}>
                  <InputLabel htmlFor='scope' sx={{ fontWeight: 700 }}>
                    Phạm vi hoạt động
                  </InputLabel>
                  <Select
                    id='scope'
                    value={selectedScope}
                    onChange={e => setSelectedScope(e.target.value)}
                    sx={{ width: '100%' }}
                  >
                    <MenuItem value={'0'}>{'Cộng đồng'}</MenuItem>
                    <MenuItem value={'1'}>{'Nội bộ'}</MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                  <InputLabel id='activity_type' sx={{ fontWeight: 700 }}>
                    Loại hoạt động
                  </InputLabel>
                  <Select
                    labelId='activity_type'
                    multiple
                    sx={{ width: '100%' }}
                    value={selectedType}
                    onChange={handleTypeChange}
                    renderValue={selected => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                        {selected.map(value => (
                          <Chip key={value} label={data.find(item => item.id === value)?.name} variant='outlined' />
                        ))}
                      </Box>
                    )}
                    MenuProps={MenuProps}
                  >
                    {data.map(item => (
                      <MenuItem key={item.id} value={item.id} style={getStyles(item.name, selectedType, theme)}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              </Grid>

              <InputLabel sx={{ fontWeight: 700 }}>Địa điểm tổ chức</InputLabel>
              <Field name='atLocation'>
                {({ field, form: { setFieldValue } }: any) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...field}
                        checked={field.value}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                          console.log(event.target.checked)
                          setFieldValue(field.name, event.target.checked)
                        }}
                      />
                    }
                    label='Thay đổi địa điểm tổ chức'
                  />
                )}
              </Field>

              {values.atLocation ? (
                <Box sx={{ mt: 2, mb: 5 }}>
                  <SimpleDialogDemo setAddressActivity={setAddressActivity} setLatlng={setLatlng} />
                  {addressActivity && (
                    <FormControl fullWidth>
                      <TextField
                        label='Địa chỉ'
                        value={addressActivity}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                          setAddressActivity(event.target.value)
                        }}
                        fullWidth
                        helperText={'Vui lòng kiểm tra địa chỉ trước khi nộp biểu mẫu'}
                        sx={{ mb: 3, mt: 3 }}
                      />
                    </FormControl>
                  )}
                </Box>
              ) : new UserContextModel(context).user.role === KEY.ROLE.BRANCH_ADMIN ? (
                <Box sx={{ mt: 2, mb: 5 }}>
                  <Typography sx={{ mt: 1, mb: 3 }}>{userLogin?.address}</Typography>
                </Box>
              ) : (
                ''
              )}
              {session?.user.role === 'SYSTEM_ADMIN' && (
                <Box sx={{ mb: 10 }}>
                  <InputLabel id='branch' sx={{ fontWeight: 700 }}>
                    Chi nhánh tham gia
                  </InputLabel>
                  <Select
                    labelId='branch'
                    multiple
                    value={selectedBranches}
                    onChange={handleBranchChange}
                    MenuProps={MenuProps}
                    sx={{ width: '100%' }}
                  >
                    {dataBranches.map(item => (
                      <MenuItem key={item.id} value={item.id} style={getStyles(item.name, selectedBranches, theme)}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              )}
              {showItem && (
                <SearchItem itemSelected={itemSelected} setItemSelected={setItemSelected} formikRef={formikRef} />
              )}
              {session?.user.role === 'BRANCH_ADMIN' && showItem === true && (
                <PopupGetItemByBranchAdmin
                  formikRef={formikRef}
                  itemSelected={itemSelected}
                  setItemSelected={setItemSelected}
                />
              )}
              {itemSelected.length > 0 && (
                <Box sx={{ mb: 10 }}>
                  <TableContainer>
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell> #</TableCell>
                          <TableCell>Tên vật phẩm</TableCell>
                          <TableCell> Số lượng</TableCell>
                          <TableCell> Đơn vị</TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <FieldArray name='listItemSelected'>
                          {({ remove }: any) => (
                            <>
                              {values.listItemSelected.map((data: any, index: any) => (
                                <TableRow hover role='checkbox' key={index} tabIndex={-1}>
                                  <TableCell> {index + 1}</TableCell>
                                  <TableCell>{data.name}</TableCell>

                                  <TableCell>
                                    <Field name={`listItemSelected.${index}.quantity`}>
                                      {({ field, meta, form }: FieldProps) => (
                                        <TextField
                                          {...field}
                                          type='number'
                                          size='small'
                                          inputProps={{
                                            step: 1
                                          }}
                                          value={+field.value}
                                          label='Số lượng'
                                          onChange={e => {
                                            if(!e.target.value) {
                                              form.setFieldValue(field.name, 0)

                                              return
                                            }

                                            if (isInteger(e.target.value) ) {
                                              form.setFieldValue(field.name, +e.target.value)
                                            }
                                          }} 
                                          error={meta.touched && !!meta.error}
                                          helperText={meta.touched && !!meta.error ? meta.error : ''}
                                        />
                                      )}
                                    </Field>
                                  </TableCell>
                                  <TableCell>{data.unit}</TableCell>
                                  <TableCell>
                                    <IconButton
                                      onClick={() => {
                                        const newData = itemSelected.filter((item: any) => item.id !== data.id)
                                        setItemSelected(newData)
                                        remove(index)
                                      }}
                                    >
                                      <DeleteForeverOutlinedIcon color='error' />
                                    </IconButton>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </>
                          )}
                        </FieldArray>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
              <Stack direction={'row'} justifyContent={'space-between'} spacing={5} sx={{ mb: 10 }}>
                <Button fullWidth type='submit' color='info' variant='contained' disabled={loading}>
                  Nộp biểu mẫu
                </Button>
              </Stack>
              <Link
                style={{
                  textDecoration: 'none'
                }}
                href='/danh-sach-hoat-dong'
              >
                Trở về danh sách các hoạt động
              </Link>
            </Form>
          </DatePickerWrapper>
        )}
      </Formik>
    </Paper>
  )
}

export default CreateActivity

CreateActivity.auth = {
  role: [KEY.ROLE.BRANCH_ADMIN, KEY.ROLE.SYSTEM_ADMIN]
}
CreateActivity.getLayout = (page: React.ReactNode) => <UserLayout pageTile='Tạo hoạt động mới'>{page}</UserLayout>
