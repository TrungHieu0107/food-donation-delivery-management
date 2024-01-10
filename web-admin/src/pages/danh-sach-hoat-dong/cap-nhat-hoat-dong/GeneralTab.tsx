'use client'

import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import {
  Box,
  Button,
  Card,
  CardMedia,
  Checkbox,
  Chip,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { SelectChangeEvent } from '@mui/material/Select'
import { Theme, useTheme } from '@mui/material/styles'
import { Field, Form, Formik, FormikProps, FormikValues } from 'formik'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { toast } from 'react-toastify'
import useSession from 'src/@core/hooks/useSession'
import axiosClient from 'src/api-client/ApiClient'
import { KEY } from 'src/common/Keys'
import SimpleDialogDemo from 'src/layouts/components/PopUpGetLocation/PopUpGetLocation'
import * as Yup from 'yup'

// import PopupGetItemByBranchAdmin from '../tao-hoat-dong-moi/PopUpChooseItem'
import moment from 'moment'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// import SearchItem from '../tao-hoat-dong-moi/SearchItem'

const validationSchema = Yup.object({
  title: Yup.string()
    .required('Tiêu đề bắt buộc có')
    .min(10, 'Tên ít nhất 10 kí tự')
    .max(100, 'Tên nhiều nhất 100 kí tự'),
  description: Yup.string()
    .required('Mô tả bắt buộc có')
    .min(50, 'Mô tả ít nhất 50 kí tự')
    .max(2000, 'Mô tả nhiều nhất 2000 kí tự'),
  start: Yup.date().required('Ngày bắt đầu bắt buộc có'),
  end: Yup.date().required('Ngày kết thúc bắt buộc có')
  .min(Yup.ref('start'), 'Ngày kết thúc phải sau ngày bắt đầu'),
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
const ActivityGeneralInformation = () => {
  const router = useRouter()
  const formikRef = useRef<FormikProps<FormikValues>>(null)
  const [initValue, setInitValue] = useState<any>()
  const [showItem, setShowItem] = useState(false)
  const [isChoose, setIsChoose] = useState<boolean>(true)
  const [isCheckLocation, setIsCheckLocation] = useState<boolean>(false)
  const [addressActivity, setAddressActivity] = useState<any>()
  const [itemSelected, setItemSelected] = useState<any>([])
  const [latlng, setLatlng] = useState<any>({ lat: '', lng: '' })
  const { slug } = router.query
  const { session }: any = useSession()
  const [loading, setIsLoading] = useState(false)
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
      name: 'Loading Branche',
      addresses: 'addresses',
      images: 'images',
      status: 'active',
      createdDate: 'createdDate'
    }
  ])
  const [selectedType, setSelectedType] = useState<string[]>([])
  const [selectedBranches, setSelectedBranches] = useState<string[]>([])
  const [selectedScope, setSelectedScope] = useState<string>('0')
  const [selectedStatusActi, setSelectedStatusActi] = useState<string>('')
  const [imgSrc, setImgSrc] = useState<string[]>([])
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
        const res = await axiosClient.get(`/activities/${slug}`)
        const responseTypes = await axiosClient.get('/activity-types')
        const responseBranches = await axiosClient.get('/branches')
        console.log('res: ', res)
        const branchesAtive = responseBranches.data.filter((d: any) => d.status === 'ACTIVE')
        setDataBranches(branchesAtive)
        setData(responseTypes.data)
        if (res.data.activityTypeComponents) {
          const dataSelectTypeBefore: any = responseTypes.data
            .filter((item: any) => res.data.activityTypeComponents.includes(item.name))
            .map((item: any) => item.id)
          setSelectedType(dataSelectTypeBefore)
        }
        if (res.data.branchResponses) {
          const dataSelectBranchesBefore: any = res.data.branchResponses.map((b: any) => b.id)
          setSelectedBranches(dataSelectBranchesBefore)
        }
        if (res.data.location != null) {
          const location = res.data.location.split(',')
          setLatlng({ lat: location[0], lng: location[1] })
          setIsCheckLocation(true)
        }
        if (res.data.targetProcessResponses.length > 0) {
          const listSelectedItem = res.data.targetProcessResponses.map((item: any) => {
            let strName = ''
            for (let i = 0; i < item.itemTemplateResponse.attributeValues.length; i++) {
              if (item.itemTemplateResponse.attributeValues.length === 1) {
                strName += item.itemTemplateResponse.attributeValues[i]
              } else if (
                item.itemTemplateResponse.attributeValues.length > 1 &&
                i === item.itemTemplateResponse.attributeValues.length - 1
              ) {
                strName += item.itemTemplateResponse.attributeValues[i]
              } else {
                strName += item.itemTemplateResponse.attributeValues[i] + ','
              }
            }

            return {
              name: item.itemTemplateResponse.name + ' ( ' + strName + ' ) ',
              id: item.itemTemplateResponse.id,
              quantity: item.target,
              unit: item.itemTemplateResponse.unit
            }
          })
          setItemSelected(listSelectedItem)
          setShowItem(true)
        }
        if (res.data.address != null) {
          setAddressActivity(res.data.address)
        }
        setSelectedScope(res.data.scope === 'PUBLIC' ? '0' : '1')
        setSelectedStatusActi(res.data.status === 'NOT_STARTED' ? '0' : res.data.status === 'STARTED' ? '1' : '2')
        setInitValue(res.data)
      } catch (error) {
        console.log(error)
      }
    }
    if (slug) {
      fetchData()
    }
  }, [slug])
  if (initValue) {
    const start = new Date(initValue.estimatedStartDate)
    const end = new Date(initValue.estimatedEndDate)
    const deliveryDate = new Date(initValue.deliveringDate)

    return (
      <Paper sx={{ p: 5 }}>
        {/* <Typography variant='h4' sx={{ mb: 10, textAlign: 'center' }}>
          ꧁༺ CẬP NHẬT HOẠT ĐỘNG ༻꧂
        </Typography> */}
        <Formik
          innerRef={formikRef}
          initialValues={{
            title: initValue.name,
            description: initValue.description,
            mainImage: [],
            start: start,
            end: end,
            deliveryDate: deliveryDate,
            atLocation: isCheckLocation,
            listItemSelected: itemSelected
          }}
          validationSchema={validationSchema}
          onSubmit={async values => {
            setIsLoading(true)
            if (!addressActivity && values.atLocation == true) {
              setIsLoading(false)
              toast.error('Khi chọn vị trí bắt buộc phải có địa chỉ dạng văn bản đi kèm!')

              return
            }
            if(selectedBranches?.length === 0 && session?.user.role === "SYSTEM_ADMIN"){
              toast.error('Vui lòng chọn chi nhánh tham gia!')
              setIsLoading(false)
        
              return
            }
            if(selectedType?.length === 0){
              toast.error('Vui lòng chọn loại hoạt động!')
              setIsLoading(false)
        
              return
            }
            const formData = new FormData()
            if (slug !== undefined) {
              formData.append('Id', slug as string)
            }
            formData.append('Name', values.title)
            formData.append(
              'EstimatedStartDate',
              moment(values.start).format("YYYY-MM-DD")
            )
            formData.append(
              'EstimatedEndDate',
              moment(values.end).format("YYYY-MM-DD")
            )
            if(values.deliveryDate){
              formData.append(
                'DeliveringDate',
                moment(values.deliveryDate).format("YYYY-MM-DD")
              )
            }
            formData.append('Description', values.description)
            if (values.mainImage.length > 0) {
              for (let i = 0; i < values.mainImage.length; i++) {
                formData.append(`Images`, values.mainImage[i])
              }
            } else {
              formData.append(`Images`, '')
            }
            formData.append('Scope', parseInt(selectedScope, 10).toString())
            formData.append('Status', parseInt(selectedStatusActi, 10).toString())
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
              const data = await axiosClient.put(`/activities`, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              })
              console.log(data)
              setIsLoading(false)
              toast.success('Cập nhật hoạt động thành công')

              router.push('/danh-sach-hoat-dong')
            } catch (error: any) {
              console.log('err nè: ', error)
              setIsLoading(false)
              if (error.response.data) {
                if (error.response.data?.errors?.DeliveringDate) {
                  console.log('2')
                  for (let i = 0; i < error.response.data?.errors?.DeliveringDate?.length; i++) {
                    toast.error(error.response.data?.errors?.DeliveringDate[i])
                  }
                }
                if (error.response.data?.errors?.Address) {
                  console.log('3')
                  for (let i = 0; i < error.response.data?.errors?.Address?.length; i++) {
                    toast.error(error.response.data?.errors?.Address[i])
                  }
                }
               
                if (error.response.data?.errors?.EstimatedStartDate) {
                  console.log('5')
                  for (let i = 0; i < error.response.data?.errors?.EstimatedStartDate?.length; i++) {
                    toast.error(error.response.data?.errors?.EstimatedStartDate[i])
                  }
                }
                if (error.response.data?.errors?.EstimatedEndDate) {
                  console.log('6')
                  for (let i = 0; i < error.response.data?.errors?.EstimatedEndDate?.length; i++) {
                    toast.error(error.response.data?.errors?.EstimatedEndDate[i])
                  }
                }
                if (error.response.data?.errors?.Description) {
                  console.log('7')
                  for (let i = 0; i < error.response.data?.errors?.Description?.length; i++) {
                    toast.error(error.response.data?.errors?.Description[i])
                  }
                }
                if (error.response.data?.errors?.Images) {
                  console.log('8')
                  for (let i = 0; i < error.response.data?.errors?.Images?.length; i++) {
                    toast.error(error.response.data?.errors?.Images[i])
                  }
                }
                if (error.response.data.errors.Status) {
                  console.log('9')
                  for (let i = 0; i < error.response.data?.errors?.Status?.length; i++) {
                    toast.error(error.response.data?.errors?.Status[i])
                  }
                }
              } else {
                console.log('9')
                toast.error('Cập nhật  hoạt động thất bại')
              }
            }finally{
              setIsLoading(false)
            }
            
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
                <label htmlFor='mainImage' style={{ fontSize: '16px', marginRight: '10px' }}>
                  Hình ảnh đại diện
                </label>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, mt: 3 }}>
                  <Box sx={{ width: '100vw' }}>
                    <Grid container spacing={3}>
                      {isChoose &&
                        initValue.images.map((src: string, index: any) => (
                          <Grid item lg={2.4} md={3} xs={12} key={index}>
                            <Card>
                              <CardMedia component='img' height='200' image={src} alt='image alt text' />
                            </Card>
                          </Grid>
                        ))}
                      {imgSrc.map((src, index) => (
                        <Grid item lg={2.4} md={3} xs={12} key={index}>
                          <Card>
                            <CardMedia component='img' height='200' image={src} alt='Paella dish' />
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Box>
                <Field name='mainImage'>
                  {({ field, form, meta }: any) => (
                    <>
                      <Button component='label' color='info' variant='contained' htmlFor='mainImage'>
                        Chọn hình mới
                        <input
                          hidden
                          multiple
                          type='file'
                          id='mainImage'
                          accept='image/png, image/jpeg'
                          onChange={(event: any) => {
                            setIsChoose(false)
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
                      {imgSrc.length > 0 && (
                        <Button
                          color='error'
                          sx={{ ml: 3 }}
                          variant='outlined'
                          onClick={() => {
                            setImgSrc([])
                            form.setFieldValue(field.name, [])
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
              <Stack
                direction={'row'}
                alignItems={'center'}
                spacing={10}
                justifyContent={'flex-start'}
                sx={{ mt: 10, mb: 5 }}
              >
                <Field name='start'>
                  {({ field, meta, form: { setFieldValue } }: any) => (
                    <DatePicker
                      {...field}
                      customInput={
                        <TextField
                          {...field}
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
                        console.log(val)
                        setFieldValue(field.name, val)
                      }}
                      placeholderText='Chọn thời gian'
                      dateFormat='dd/MM/yyyy'
                    />
                  )}
                </Field>
                <Field name='end'>
                  {({ field, meta, form: { setFieldValue } }: any) => (
                    <DatePicker
                      {...field}
                      customInput={
                        <TextField
                          {...field}
                          fullWidth
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
                      onChange={val => {
                        setFieldValue(field.name, val)
                      }}
                      placeholderText='Chọn thời gian'
                      dateFormat='dd/MM/yyyy'
                    />
                  )}
                </Field>
                <Field name='deliveryDate'>
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
                </Field>
              </Stack>
              <Grid container spacing={5} sx={{ mb: 5, mt: 10 }}>
                <Grid item xs={12} sm={12} md={3}>
                  <InputLabel htmlFor='scope' sx={{ fontWeight: 700 }}>
                    Phạm vi hoạt động
                  </InputLabel>
                  <Select
                    id='scope'
                    value={selectedScope}
                    size='small'
                    onChange={e => setSelectedScope(e.target.value)}
                    fullWidth
                  >
                    <MenuItem value={'0'}>{'Cộng đồng'}</MenuItem>
                    <MenuItem value={'1'}>{'Nội bộ'}</MenuItem>
                  </Select>
                </Grid>

                <Grid item xs={12} sm={12} md={3}>
                  <InputLabel htmlFor='scope' sx={{ fontWeight: 700 }}>
                    Trạng thái hoạt động
                  </InputLabel>
                  <Select
                    id='scope'
                    value={selectedStatusActi}
                    size='small'
                    onChange={e => setSelectedStatusActi(e.target.value)}
                    fullWidth
                  >
                    <MenuItem value={'0'} disabled={selectedStatusActi === "1"}>{'Chưa bắt đầu'}</MenuItem>
                    <MenuItem value={'1'}>{'Đang hoạt động'}</MenuItem>
                    <MenuItem value={'2'}>{'Đã kết thúc'}</MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                  <InputLabel id='activity_type' sx={{ fontWeight: 700 }}>
                    Loại hoạt động
                  </InputLabel>
                  <Select
                    labelId='activity_type'
                    multiple
                    fullWidth
                    size='small'
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
                    sx={{ minWidth: '200px' }}
                  >
                    {data.map(item => (
                      <MenuItem key={item.id} value={item.id} style={getStyles(item.name, selectedType, theme)}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              </Grid>

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
                    label='Tổ chức tại vị trị'
                  />
                )}
              </Field>

              {values.atLocation && (
                <Box sx={{ mt: 2, mb: 5 }}>
                  <SimpleDialogDemo
                    setAddressActivity={setAddressActivity}
                    setLatlng={setLatlng}
                    location={
                      latlng.lat !== '' ? { lat: latlng.lat, lng: latlng.lng } : { lat: 10.7768, lng: 106.7298 }
                    }
                  />
                  {addressActivity && (
                    <FormControl>
                      <Typography sx={{ mt: 1, mb: 3 }}>Tọa độ của bạn chọn đã được ghi nhận</Typography>
                      <TextField
                        label='Địa chỉ'
                        value={addressActivity}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                          setAddressActivity(event.target.value)
                        }}
                        fullWidth
                        helperText={'Vui lòng kiểm tra địa chỉ trước khi nộp biểu mẫu'}
                        sx={{ mb: 3, mt: 3, width: '70vw' }}
                      />
                    </FormControl>
                  )}
                </Box>
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
              {/* {showItem && (
                <SearchItem itemSelected={itemSelected} setItemSelected={setItemSelected} formikRef={formikRef} />
              )} */}
              {/* {session?.user.role === 'BRANCH_ADMIN' && showItem === true && (
                <PopupGetItemByBranchAdmin
                  formikRef={formikRef}
                  itemSelected={itemSelected}
                  setItemSelected={setItemSelected}
                />
              )} */}
              {/* {itemSelected.length > 0 && (
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
                                  <TableCell
                                    sx={{
                                      verticalAlign: 'top'
                                    }}
                                  >
                                    {' '}
                                    {index + 1}
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      verticalAlign: 'top'
                                    }}
                                  >
                                    {data.name}
                                  </TableCell>

                                  <TableCell
                                    sx={{
                                      verticalAlign: 'top'
                                    }}
                                  >
                                    <Field name={`listItemSelected.${index}.quantity`}>
                                      {({ field, meta }: any) => (
                                        <TextField
                                          {...field}
                                          type='number'
                                          size='small'
                                          label='Số lượng'
                                          error={meta.touched && !!meta.error}
                                          helperText={meta.touched && !!meta.error ? meta.error : ''}
                                        />
                                      )}
                                    </Field>
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      verticalAlign: 'top'
                                    }}
                                  >
                                    {data.unit}
                                  </TableCell>
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
              )} */}
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
  } else {
    return (
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', height: '70vh', alignItems: 'center' }}>
      <CircularProgress color='info' />
      <Typography>Đang tải dữ liệu...</Typography>
    </Box>
    )   
  }
}

export default ActivityGeneralInformation
ActivityGeneralInformation.auth = {
  role: [KEY.ROLE.BRANCH_ADMIN, KEY.ROLE.SYSTEM_ADMIN]
}
