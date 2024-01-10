'use client'

import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Grid,
  Card,
  CardMedia,
  Autocomplete,
  FormHelperText,
  FormControl,
  CardHeader,
  CardContent,
  Skeleton,
  TableContainer,
  AutocompleteRenderInputParams,
  Chip,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  CircularProgress,
  FormControlLabel,
  styled,
  TypographyProps
} from '@mui/material'
import { Field, Form, Formik, FormikErrors, FormikProps } from 'formik'
import { ChangeEvent, KeyboardEvent, ReactNode, SyntheticEvent, useEffect, useRef, useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import * as Yup from 'yup'
import { useRouter } from 'next/router'
import {
  Category,
  Attribute,
  ItemCreatingModel,
  ItemTemplateCreatingModel,
  AttributeTemplate,
  AttributeValue,
  Item,
  UnitModel
} from 'src/models/Item'
import { PictureInPictureBottomRight, Plus, TrashCan } from 'mdi-material-ui'
import { CategoryAPI } from 'src/api-client/Category'
import { CommonRepsonseModel } from 'src/models/common/CommonResponseModel'
import { ImageAPI } from 'src/api-client/Image'
import { KEY } from 'src/common/Keys'
import { ItemAPI } from 'src/api-client/Item'
import BackDrop from 'src/layouts/components/loading/BackDrop'
import { toast } from 'react-toastify'
import GenerateItemTemplateForUpdating from 'src/layouts/components/item/GenerateItemTemplateForUpdating'
import Checkbox from '@mui/material/Checkbox'
import UserLayout from 'src/layouts/UserLayout'
import { findAllDuplicates } from 'src/@core/layouts/utils'


const Label = styled(Typography)<TypographyProps>(({ theme }) => ({
  ...theme.typography.h6,
  fontWeight: 600
}))

export class ItemTemplateUpdatingModelForm extends ItemTemplateCreatingModel {
  key?: string
  imageData?: FileList | any
  oldImageUrl?: string
  attributes?: AttributeTemplate[]

  constructor(value?: Partial<ItemTemplateUpdatingModelForm>) {
    super(value)
    this.imageData = value?.imageData
    this.attributes = value?.attributes
    this.key = value?.attributes
      ?.filter(attribute => attribute && attribute.attributeValue && attribute.attributeValue.value)
      .map(item => `${item.name}_${item.attributeValue?.value}`)
      .join('_')
    this.oldImageUrl = value?.oldImageUrl
  }
}

export class AttributeTemplateModelForm extends AttributeTemplate {
  key?: string
  constructor(value?: Partial<AttributeTemplateModelForm>) {
    super(value)
    this.key = value?.key ?? ''
  }
}

const validationSchema = Yup.object({
  name: Yup.string().required('Tên vật phẩm bắt buộc có'),
  unit: Yup.object<UnitModel>().required('Đơn vị bắt buộc phải có'),
  estimatedExpirationDays: Yup.number().min(1, 'Ngày hệt hạn dự đoán phải lớn hơn 1'),
  category: Yup.object<Category>().required('Loại vật phẩm là bắt buộc'),
  attributes: Yup.array().of(
    Yup.object({
      name: Yup.string().required('Tên thuộc tính là bắt buộc'),
      attributeValues: Yup.array()
        .of(
          Yup.object({
            name: Yup.string().required('Tên của giá trị là bắt buộc')
          })
        )
        .min(1, 'Giá trị của thuộc tính là bắt buộc')
        .required('Giá trị của thuộc tính là bắt buộc')
    })
  ),
  itemTemplate: Yup.array()
    .of(
      Yup.object({
        estimatedExpirationDays: Yup.number()
          .min(1, 'Giá trị nhỏ nhất phải là 1.'),
          
          // .required('Hãy điền vào số ngày có thể bảo quản.'),
        maximumTransportVolume: Yup.number()
          .min(1, 'Giá trị nhỏ nhất phải là 1.')
          .required('Hãy điền số lượng có thể vận chuyển trong 1 chuyến'),
        note: Yup.string().required('Hãy nhập thông tin mô tả.')
      })
    )
    .required('Phải có ít nhất 1 mẫu vật phẩm')
    .test('length', 'Phải có ít nhất 1 mẫu vật phẩm', value => value.length > 0)
})
interface FormValues {
  name: string
  unit: any
  category: Category
  description: string
  mainImage: any
  attributes: Attribute[]
  estimatedExpirationDays: number
}

const UpdateItem = () => {
  const [loading, setIsLoading] = useState(true)
  const [imgSrc, setImgSrc] = useState<string>('')
  const router = useRouter()
  const query = router.query
  const formikRef = useRef<FormikProps<FormValues>>(null)
  const [itemTempalte, setItemTempaltes] = useState<ItemTemplateUpdatingModelForm[]>([
    new ItemTemplateUpdatingModelForm({
      key: ''
    })
  ])
  const [attributes, setAttributes] = useState<Attribute[]>()
  const [categories, setCategories] = useState<Category[]>([])
  const [attributeValue, setAttributeValue] = useState<string>('')
  const [open, setOpen] = useState(false)

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [data, setData] = useState<Item>()
  const [oldItemTemplate, setOldItemTemplate] = useState<ItemTemplateUpdatingModelForm[]>([])
  const [units, setUnits] = useState<UnitModel[]>([])
  const [error, setError] = useState<{
    [key: string]: string
  }>({})

  useEffect(() => {
    const fetchData = async () => {
      await fetchDataSetting()
      if (query.id && typeof query.id === 'string') {
        await ItemAPI.getItemDetail(query.id as string)
          .then(itemResponse => {
            const dataResponse = new CommonRepsonseModel<Item>(itemResponse).data

            setData(dataResponse)
            setImgSrc(dataResponse?.image ?? '')
            setAttributes(
              dataResponse?.attributes?.map(item => {
                return new Attribute({
                  ...item,
                  status: item.status === 'ACTIVE' ? 0 : 1
                })
              }) ?? []
            )

            const itemTemplates =
              dataResponse?.itemTemplateResponses?.map(item => {
                return new ItemTemplateUpdatingModelForm({
                  ...item,
                  imageUrl: item.image,
                  oldImageUrl: item.image,
                  status: item.status === 'ACTIVE' ? 0 : 1
                })
              }) ?? []

            console.log(itemTemplates.map(item => item.status))

            dataResponse?.itemTemplateResponses &&
              setItemTempaltes([...itemTemplates].filter(item => item.status === 0))
            dataResponse?.itemTemplateResponses && setOldItemTemplate([...itemTemplates])

            setIsLoading(false)
          })
          .catch(err => {
            setIsLoading(false)
            console.log(err)
          })
      } else {
        router.push('/404')
      }
    }

    fetchData()
  }, [router, query])

  const handleChangeTempalteSelected = (value: ItemTemplateUpdatingModelForm[]) => {
    const oldItemplate = [...oldItemTemplate, ...itemTempalte]
    console.log(oldItemplate.map(item => item.maximumTransportVolume))
    console.log(value.map(item => item.maximumTransportVolume))

    const list = value.map(item => {
      const isSame = oldItemplate.filter(itemTempalte => itemTempalte.key === item.key)
      if (isSame.length > 0) {
        return isSame.at(0) as ItemTemplateUpdatingModelForm
      }

      return item
    })

    if (list.length === 0) {
      list.push(new ItemTemplateUpdatingModelForm())
      setItemTempaltes([
        {
          key: '',
          note: '',
          values: []
        }
      ])
      formikRef.current?.setFieldValue('itemTemplate', [
        {
          estimatedExpirationDays: 0,
          maximumTransportVolume: 0,
          imageData: null
        }
      ])
    } else {
      if (formikRef.current) {
        const data = list.map(itemTempalte => {
          return {
            mainImage: itemTempalte.imageData,
            maximumTransportVolume: itemTempalte.maximumTransportVolume,
            estimatedExpirationDays: itemTempalte.estimatedExpirationDays
          }
        })
        console.log(data)

        formikRef.current.setFieldValue('itemTemplate', data)
      }
    }

    setItemTempaltes(list)
  }

  const handledeleteAttribute = (index: number) => {
    const attribute = attributes?.at(index)

    if (attribute && attribute.id) {
      const newAttributes = [...(attributes ?? [])]
      newAttributes[index] = {
        ...newAttributes[index],
        status: 1
      }

      setAttributes([...newAttributes])
      formikRef.current?.setFieldValue('attributes', [...newAttributes])
    } else {
      const newAttributes = [...(attributes ?? [])].filter((item, i) => i !== index)

      setAttributes([...newAttributes])
      formikRef.current?.setFieldValue('attributes', [...newAttributes])
    }
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    console.log(newPage)
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleAddNewAttributeValue = (e: KeyboardEvent<HTMLDivElement>, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (attributeValue !== '') {
        const isSameAttriute = formikRef.current?.values.attributes
          .at(index)
          ?.attributeValues?.filter(atrValue => atrValue.value === attributeValue)
        if (isSameAttriute && isSameAttriute?.length > 0) {
          toast.error('Giá trị thuộc tính đã tồn tại')
        } else {
          const newAttributes = formikRef.current?.values.attributes
          console.log(newAttributes)

          if (newAttributes) {
            newAttributes[index].attributeValues = [
              ...(newAttributes[index]?.attributeValues || []),
              new AttributeValue({
                value: attributeValue
              })
            ]

            formikRef.current?.setFieldValue('attributes', [...newAttributes])

            setAttributeValue('')
            setAttributes([...newAttributes])
          }
        }
      }
    }
  }

  const handleSubmit = async (values: FormValues) => {
    if (attributes) {
      if (attributes?.length > 0 && itemTempalte.length === 0) {
        toast.error('Phải có ít nhất 1 mẫu vật phẩm.')

        return
      }
    }

    const newImage: string[] = []
    const oldImage: string[] = []
    
    try {
      setIsLoading(true)
      const payload = new ItemCreatingModel({
        ...data,
        imageUrl: data?.image,
        name: values.name,
        itemUnitId: values.unit.id,
        estimatedExpirationDays: values.estimatedExpirationDays,
        note: values.description,
        attributes: attributes?.map(
          attribute =>
            new Attribute({
              ...attribute,
              attributeValues: attribute.attributeValues.map(
                item =>
                  new AttributeValue({
                    ...item,
                    name: item.value
                  })
              )
            })
        ),
        status: 0,
        itemcategoryId: values.category?.id,
        itemTemplates: itemTempalte.map(
          item =>
            new ItemTemplateCreatingModel({
              ...item,
              values: item.attributes?.map(attr => attr.attributeValue?.value ?? '') ?? []
            })
        )
      })

      if (values.mainImage) {
        payload.imageUrl && oldImage.push(payload.imageUrl)

        const formData = new FormData()
        formData.append(`image`, values.mainImage)

        const imageResposne = await ImageAPI.upload(formData)
        const urlImage = new CommonRepsonseModel<string>(imageResposne).data
        if (urlImage) {
          newImage.push(urlImage)
          payload.imageUrl = urlImage
        }
      }

      const itemTemplateAfterupload = await itemTempalte.map(async (itemTempalte, index) => {
        if (itemTempalte.imageData) {
          const formData = new FormData()
          formData.append(`image`, itemTempalte.imageData)

          const urlImageResposne = await ImageAPI.upload(formData)
          const urlImageItemTemplate = new CommonRepsonseModel<string>(urlImageResposne).data
          urlImageItemTemplate && newImage.push(urlImageItemTemplate)
          itemTempalte.oldImageUrl && oldImage.push(itemTempalte.oldImageUrl)

          if (payload.itemTemplates && payload.itemTemplates[index]) {
            payload.itemTemplates[index] = {
              ...payload.itemTemplates[index],
              imageUrl: urlImageItemTemplate ?? itemTempalte.imageUrl
            }

            return payload.itemTemplates[index]
          }
        }

        return payload.itemTemplates?.at(index) ?? new ItemTemplateCreatingModel()
      })

      const promiseData = await Promise.all(itemTemplateAfterupload)
      payload.itemTemplates = promiseData
      const itemTempalteInActive = oldItemTemplate.filter(item => {
        const temp = itemTempalte?.filter(x => x.key === item.key)

        if (temp && temp.length > 0) {
          return false
        } else {
          return true
        }
      })
      console.log('herer');
      

      payload.itemTemplates = [
        ...payload.itemTemplates,
        ...itemTempalteInActive.map(item => {
          return new ItemTemplateCreatingModel({
            ...item,
            values: item.attributes?.map(attr => attr.attributeValue?.value ?? '') ?? [],
            status: 1
          })
        })
      ]

      console.log(payload)

      await ItemAPI.updateItem(payload)
        .then(async response => {
          const dataResponse = new CommonRepsonseModel<any>(response)
          const message = dataResponse.message ? dataResponse.message : KEY.MESSAGE.COMMON_ERROR
          toast.success(message)
          if (oldImage.length > 0) {
            try {
              oldImage.map(async (item, index) => {
                await ImageAPI.delete(item)
                oldImage.splice(index, 1)
              })
            } catch (e) {
              console.log(e)
              oldImage.map(async (item, index) => {
                await ImageAPI.delete(item)
                oldImage.splice(index, 1)
              })
            }
          }

          router.push('/vat-pham/danh-sach')
        })
        .catch(async err => {
          console.error(err)
        })
    } catch (err) {
      console.log('Error in item updating', err)
      if (newImage.length > 0) {
        try {
          newImage.map(async (item, index) => {
            await ImageAPI.delete(item)
            newImage.splice(index, 1)
          })
        } catch (e) {
          console.log(e)
          newImage.map(async (item, index) => {
            await ImageAPI.delete(item)
            newImage.splice(index, 1)
          })
        }
      }
    } finally {
      setIsLoading(false)
    }
  }


  const fetchDataSetting = async () => {
    await fetchDataCategories()
    await fetchUnits()
  }

  const fetchDataCategories = async () => {
    const categoryReponse = await CategoryAPI.getAllCategories()

    setCategories(categoryReponse.data ?? [])
    setIsLoading(false)
  }

  const fetchUnits  = async () => {
    const response = await ItemAPI.getAllUnit()
      const commonResponse = new CommonRepsonseModel<UnitModel[]>(response)
      setUnits(commonResponse.data ?? [])
  }

  const handleDeleteAttributeValue = (optionItem: AttributeValue, index: number) => {
    const newAttributes = attributes ?? []
    newAttributes[index].attributeValues = newAttributes[index].attributeValues?.filter(item => {
      return item.value !== optionItem.value
    })
    const newItemTemplate = [
      ...itemTempalte.filter(item => {
        const itemContainDeleteAttr = item.attributes?.filter(
          subItem => subItem.attributeValue?.value === optionItem.value
        )

        if (itemContainDeleteAttr && itemContainDeleteAttr.length > 0) {
          return false
        }

        return true
      })
    ]

    setItemTempaltes([...newItemTemplate])
    setAttributes([...newAttributes])
    formikRef.current?.setFieldValue('attributes', [...newAttributes])
    formikRef.current?.setFieldValue('itemTemplate', [...newItemTemplate])
  }

  const handleChangeAttributeValue = (value: AttributeValue[], index: number) => {
    const newAttributes = formikRef.current?.values.attributes

    if (newAttributes) {
      newAttributes[index] = { ...newAttributes[index], attributeValues: value }

      const newItemTemplate = [
        ...itemTempalte.filter(item => {
          if (item.attributes && item.attributes?.length > 0) {
            const itemContainDeleteAttr = item.attributes.filter(subItem => {
              console.log(subItem)

              if (subItem.name === newAttributes[index].name) {
                const data = value.filter(newAttributeValue => {
                  console.log(newAttributeValue.value, subItem.attributeValue?.value)

                  return newAttributeValue.value === subItem.attributeValue?.value
                })
                console.log('chứa', data)

                return data.length > 0 ? true : false
              }
              console.log('không chứa')

              return true
            })

            console.log(itemContainDeleteAttr)

            if (itemContainDeleteAttr && itemContainDeleteAttr.length === item.attributes.length) {
              return true
            }

            return false
          }

          return true
        })
      ]

      setItemTempaltes([...newItemTemplate])
      formikRef.current?.setFieldValue('itemTemplate', [...newItemTemplate])

      setAttributes([...newAttributes])
      formikRef.current?.setFieldValue('attributes', [...newAttributes])
    }
  }

  return (
    <Box>
      {data && attributes && categories ? (
        <>
          <Formik
            innerRef={formikRef}
            initialValues={
              {
                name: data?.name,
                unit: units.filter(item => data.unit?.id === item.id).at(0),
                category: categories.filter(item => data.itemCategoryResponse?.id === item.id).at(0),
                attributes: attributes,
                description: data?.note,
                mainImage: null,
                itemTemplate: data?.itemTemplateResponses?.map(item => {
                  return {
                    estimatedExpirationDays: item.estimatedExpirationDays,
                    maximumTransportVolume: item.maximumTransportVolume,
                    imageData: null
                  }
                })
              } as unknown as FormValues
            }
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            validate={({ attributes }) => {
              const err: FormikErrors<FormValues> = {}
              if (attributes) {
                const listOfDuplicatesIndex = findAllDuplicates(attributes.map(item => item.name))
                const newError: {
                  [key: string]: string
                } = {}
                for (const [key] of listOfDuplicatesIndex) {
                  newError[key] = 'Tên thuộc tính không được giống nhau.'
                }
                setError(newError)
              }

              return err
            }}
          >
            {({}) => (
              <Form
                style={{
                  display: 'flex',
                  gap: 10,
                  flexDirection: 'column'
                }}
              >
                <Grid container flexDirection={'row'} gap={3} alignItems={'stretch'}>
                  <Grid item xl lg md={12} sm={12} xs={12} display={'flex'} flexDirection={'column'} gap={3}>
                    <Card>
                      <CardHeader title={<Label>Thông tin của vật phẩm</Label>} />
                      <CardContent>
                        <Field name='name'>
                          {({ field, meta }: any) => (
                            <TextField
                              {...field}
                              label='Tên vật phẩm'
                              error={meta.touched && !!meta.error}
                              helperText={meta.touched && !!meta.error ? meta.error : ''}
                              fullWidth
                            />
                          )}
                        </Field>

                        <Grid container spacing={3} sx={{ mt: 1 }}>
                          <Grid item xl lg md={6 } xs={6}>
                            <Field name='unit'>
                              {({ field, meta }: any) => (
                                <Autocomplete
                                  {...field}
                                  disablePortal
                                  fullWidth
                                  defaultValue={units.filter(item => data.unit?.id === item.id).at(0) || null}
                                  renderInput={params => (
                                    <TextField
                                      {...params}
                                      {...field}
                                      name='unit'
                                      placeholder='Đơn vị'
                                      label='Đơn vị'
                                      fullWidth
                                      error={meta.touched && !!meta.error}
                                      helperText={meta.touched && !!meta.error ? meta.error : ''}
                                    />
                                  )}
                                  getOptionLabel={option => (option as UnitModel).name}
                                  options={units}
                                  renderOption={(props, option) => (
                                    <Box component='li' {...props}>
                                      <Typography ml={1} variant='body2'>
                                        {(option as UnitModel).name}
                                      </Typography>
                                    </Box>
                                  )}
                                  onChange={(_: SyntheticEvent, newValue: UnitModel | null) => {
                                    newValue &&
                                      formikRef.current?.setValues({
                                        ...formikRef.current?.values,
                                        unit: newValue
                                      })
                                  }}
                                />
                              )}
                            </Field>
                          </Grid>
                          <Grid item xl lg md={6} xs={6}>
                            <Field name='category'>
                              {({ field, meta }: any) =>
                                !loading && (
                                  <Autocomplete
                                    {...field}
                                    disablePortal
                                    fullWidth
                                    defaultValue={
                                      categories.find(item => formikRef.current?.values.category?.id === item.id) || null
                                    }
                                    renderInput={params => (
                                      <TextField
                                        {...params}
                                        {...field}
                                        name='category'
                                        placeholder='Loại vật phẩm'
                                        label='Loại'
                                        fullWidth
                                        error={meta.touched && !!meta.error}
                                        helperText={meta.touched && !!meta.error ? meta.error : ''}
                                      />
                                    )}
                                    getOptionLabel={option => (option as Category).name}
                                    options={categories}
                                    renderOption={(props, option) => (
                                      <Box component='li' {...props}>
                                        <Typography ml={1} variant='body2'>
                                          {(option as Category).name}
                                        </Typography>
                                      </Box>
                                    )}
                                    onChange={(_: SyntheticEvent, newValue: Category | null) => {
                                      newValue &&
                                        formikRef.current?.setValues({
                                          ...formikRef.current?.values,
                                          category: newValue
                                        })
                                    }}
                                  />
                                )
                              }
                            </Field>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xl lg md={12} sm={12} xs={12}>
                    <Card>
                      <CardHeader title={<Label>Hình ảnh chung </Label>} />
                      <CardContent>
                        <Field name='mainImage'>
                          {({ form, meta }: any) => (
                            <FormControl
                              sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                flexDirection: 'column'
                              }}
                            >
                              <Box display={'flex'} justifyContent={'center'}>
                                {imgSrc && (
                                  <Card
                                    sx={{
                                      width: 'fit-content'
                                    }}
                                  >
                                    <CardMedia
                                      component='img'
                                      image={imgSrc}
                                      alt='Paella dish'
                                      sx={{
                                        maxHeight: '100px',
                                        width: 'auto'
                                      }}
                                    />
                                  </Card>
                                )}
                                <Typography variant='body2' sx={{ marginTop: 5, color: 'black' }}></Typography>
                              </Box>
                              <Box display={'flex'} flexDirection={'column'} alignItems={'center'} mt={2}>
                                <Button
                                  size='small'
                                  component='label'
                                  variant='contained'
                                  htmlFor='mainImage'
                                  color='info'
                                  sx={{ width: '160px' }}
                                  startIcon={<PictureInPictureBottomRight />}
                                >
                                  Chọn hình
                                  <input
                                    hidden
                                    type='file'
                                    id='mainImage'
                                    accept='image/png, image/jpeg'
                                    value={''}
                                    onChange={async (event: any) => {
                                      const files = event.currentTarget.files

                                      const readNextFile = () => {
                                        const reader = new FileReader()
                                        reader.onload = () => {
                                          // setImgSrc([...imgSrc, reader.result as string])
                                          setImgSrc(reader.result as string)
                                        }
                                        reader.readAsDataURL(files[0])
                                      }
                                      readNextFile()
                                      form.setFieldValue('mainImage', files[0])
                                    }}
                                  />
                                </Button>
                                <FormHelperText>Chọn hình ảnh có phần mở rộng là .png hoặc .jpeg</FormHelperText>
                                {meta.touched && !!meta.error && (
                                  <FormHelperText error={true}>{meta.error}</FormHelperText>
                                )}
                              </Box>
                            </FormControl>
                          )}
                        </Field>
                      </CardContent>
                      {/* <label htmlFor='mainImage' style={{ fontSize: '16px', marginRight: '10px' }}>
                        Hình ảnh đại diện
                      </label>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: '100vw' }}>
                          {imgSrc && (
                            <Card
                              sx={{
                                width: 'fit-content'
                              }}
                            >
                              <CardMedia
                                component='img'
                                image={imgSrc}
                                alt='Paella dish'
                                sx={{
                                  height: '50%',
                                  maxHeight: '200px',
                                  width: 'auto'
                                }}
                              />
                            </Card>
                          )}
                        </Box>
                      </Box>
                      <Field name='mainImage'>
                        {({ form, meta }: any) => (
                          <FormControl>
                            <Button
                              component='label'
                              color='info'
                              variant='contained'
                              htmlFor='mainImage'
                              startIcon={<PictureInPictureBottomRight />}
                            >
                              Chọn hình
                              <input
                                hidden
                                type='file'
                                id='mainImage'
                                accept='image/png, image/jpeg'
                                value={''}
                                onChange={async (event: any) => {
                                  const files = event.currentaTrget.files

                                  const readNextFile = () => {
                                    const reader = new FileReader()
                                    reader.onload = () => {
                                      // setImgSrc([...imgSrc, reader.result as string])
                                      setImgSrc(reader.result as string)
                                    }
                                    reader.readAsDataURL(files[0])
                                  }
                                  readNextFile()
                                  form.setFieldValue('mainImage', files[0])
                                }}
                              />
                            </Button>
                            <FormHelperText>
                              Chọn hình ảnh có phần mở rộng là .png hoặc .jpeg. Kích thước lớn nhất là 800K.
                            </FormHelperText>
                            {meta.touched && !!meta.error && <FormHelperText error={true}>{meta.error}</FormHelperText>}
                          </FormControl>
                        )}
                      </Field> */}
                    </Card>
                  </Grid>
                </Grid>

                <Card>
                  <CardHeader title={<Label>Thông tin mô tả</Label>} />
                  <CardContent>
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
                          sx={{ mt: 3 }}
                        />
                      )}
                    </Field>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader title={<Label>Tạo thuộc tính của vật phẩm</Label>} />
                  <CardContent>
                    <Box
                      sx={{
                        width: '100%',
                        ml: 5,
                        mr: 5
                      }}
                      display={'flex'}
                      flexDirection={'column'}
                      gap={2}
                    >
                      {attributes.map((attribute, index) => {
                        return (
                          <>
                            {attribute.id ? (
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={attribute.status === 'ACTIVE' || attribute.status === 0}
                                    onChange={e => {
                                      const newAttributes = [...attributes]
                                      newAttributes[index] = {
                                        ...newAttributes[index],
                                        status: e.target.checked ? 0 : 1
                                      }
                                      setAttributes([...newAttributes])
                                      formikRef.current?.setFieldValue('attributes', [...newAttributes])

                                      if (!e.target.checked) {
                                        const newItemTemplate = itemTempalte.filter(item => {
                                          const itemContainAttribute = item.attributes?.filter(
                                            subItem => subItem.name === attribute.name
                                          )

                                          return itemContainAttribute && itemContainAttribute.length === 0
                                        })
                                        setItemTempaltes(newItemTemplate)
                                      }
                                    }}
                                  />
                                }
                                label={`Thuộc tính ${index + 1}`}
                              />
                            ) : (
                              <Typography>{`Thuộc tính ${index + 1}`}</Typography>
                            )}
                            <Grid container spacing={2} key={index} alignItems={'top'} justifyContent={'start'}>
                              <Grid item xs={12} md={3}>
                                <Field name={`attributes[${index}].name`}>
                                  {({ field, meta }: any) => (
                                    <TextField
                                      {...field}
                                      name={`attributes[${index}].name`}
                                      value={attributes[index].name}
                                      label='Thuộc tính'
                                      type='text'
                                      fullWidth
                                      onKeyPress={e => {
                                        if (e.key === 'Enter') {
                                          e.preventDefault()
                                        }
                                      }}
                                      onChange={e => {
                                        const newValue = e.target.value
                                        const newAttributes = [...attributes]
                                        newAttributes[index] = {
                                          ...newAttributes[index],
                                          name: newValue
                                        }

                                        setAttributes(newAttributes)
                                        formikRef.current?.setFieldValue('attributes', newAttributes)
                                      }}
                                      error={(meta.touched && !!meta.error) || !!error[field.value || '']}
                                      helperText={meta.touched && !!meta.error ? meta.error : error[field.value || '']}
                                    />
                                  )}
                                </Field>
                              </Grid>
                              <Grid item xs={12} md={8}>
                                <Field name={`attributes[${index}].attributeValues`}>
                                  {({ field, meta }: any) => (
                                    <Autocomplete
                                      autoComplete={false}
                                      options={[
                                        new AttributeValue({ value: attributeValue, itemTemplateAttributeId: '1' })
                                      ]}
                                      multiple={true}
                                      value={attributes[index].attributeValues}
                                      getOptionLabel={option => option?.value || ''}
                                      renderTags={option => {
                                        return option.map((optionItem, i) => {
                                          return (
                                            <Chip
                                              key={i}
                                              label={optionItem.value}
                                              onDelete={() => {
                                                handleDeleteAttributeValue(optionItem, index)
                                              }}
                                            />
                                          )
                                        })
                                      }}
                                      onChange={(e, value) => {
                                        handleChangeAttributeValue(value, index)
                                      }}
                                      renderInput={function (params: AutocompleteRenderInputParams): ReactNode {
                                        return (
                                          <TextField
                                            {...params}
                                            {...field}
                                            fullWidth
                                            name={`attributes[${index}].attributeValues`}
                                            label='Giá trị của thuộc tính'
                                            onChange={e => {
                                              setAttributeValue(e.target.value)
                                            }}
                                            onKeyPress={e => handleAddNewAttributeValue(e, index)} //
                                            error={meta.touched && !!meta.error}
                                            helperText={meta.touched && !!meta.error ? meta.error : ''}
                                            onBlur={() => {
                                              setAttributeValue('')
                                            }}
                                          />
                                        )
                                      }}
                                      sx={{
                                        minWidth: 200
                                      }}
                                    />
                                  )}
                                </Field>
                              </Grid>
                              {!attribute.id && (
                                <Grid item>
                                  <IconButton
                                    onClick={() => {
                                      handledeleteAttribute(index)

                                      const newItemTemplate = itemTempalte.filter(item => {
                                        const itemContainAttribute = item.attributes?.filter(
                                          subItem => subItem.name === attribute.name
                                        )

                                        return itemContainAttribute && itemContainAttribute.length === 0
                                      })
                                      setItemTempaltes(newItemTemplate)
                                    }}
                                  >
                                    <TrashCan />
                                  </IconButton>
                                </Grid>
                              )}
                            </Grid>

                            <Divider
                              sx={{
                                borderWidth: 1
                              }}
                            />
                          </>
                        )
                      })}
                    </Box>
                    <Grid container>
                      <Button
                        startIcon={<Plus />}
                        size='small'
                        color='info'
                        onClick={() => {
                          setAttributes([...attributes, new Attribute()])
                          formikRef.current?.setFieldValue('attributes', [
                            ...(formikRef.current?.values?.attributes ?? []),
                            new Attribute()
                          ])
                        }}
                      >
                        Thêm thuộc tính
                      </Button>
                    </Grid>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader
                    title={
                      <Box
                        display={'flex'}
                        justifyContent={'space-between'}
                        alignItems={'center'}
                        flexDirection={'row'}
                      >
                        <Label>Danh sách các thuộc tính đã chọn</Label>
                        <Button
                          variant='outlined'
                          color='info'
                          startIcon={<Plus />}
                          onClick={() => {
                            handleClickOpen()
                          }}
                        >
                          Thêm mẫu
                        </Button>
                      </Box>
                    }
                  />
                  <CardContent>
                    {!loading ? (
                      <Box sx={{ mt: 3 }}>
                        <>
                          <Box ml={10}>
                            <Box
                              display={'flex'}
                              justifyContent={'space-between'}
                              alignItems={'center'}
                              flexDirection={'row'}
                              mt={3}
                            ></Box>
                            {itemTempalte.length > 0 && (
                              <>
                                <TableContainer
                                  sx={{
                                    height: '500px',
                                    minWidth: '1000px',
                                    borderRadius: '1px solid',
                                    border: 1
                                  }}
                                >
                                  <Table stickyHeader>
                                    <TableHead>
                                      <TableRow>
                                        <TableCell
                                          sx={{
                                            verticalAlign: 'top',
                                            width: 50
                                          }}
                                        >
                                          {' '}
                                          #
                                        </TableCell>
                                        <TableCell
                                          sx={{
                                            verticalAlign: 'top',
                                            width: 200
                                          }}
                                        >
                                          Thuộc tính
                                        </TableCell>
                                        <TableCell
                                          sx={{
                                            verticalAlign: 'top',
                                            width: 200
                                          }}
                                        >
                                          {' '}
                                          Hình ảnh
                                        </TableCell>
                                        <TableCell
                                          sx={{
                                            verticalAlign: 'top',
                                            width: 150
                                          }}
                                        >
                                          {' '}
                                          Số lượng tối đa vận chuyển
                                        </TableCell>
                                        <TableCell
                                          sx={{
                                            verticalAlign: 'top',
                                            width: 150
                                          }}
                                        >
                                          {' '}
                                          Ngày bảo quản (dự đoán)
                                        </TableCell>
                                        <TableCell
                                          sx={{
                                            verticalAlign: 'top',
                                            width: 300
                                          }}
                                        >
                                          {' '}
                                          Mô tả
                                        </TableCell>
                                        <TableCell></TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {[...itemTempalte]
                                        .splice(page * rowsPerPage, (page + 1) * rowsPerPage)
                                        .map((item, index) => {
                                          return (
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
                                                {item.attributes?.map(
                                                  subItem =>
                                                    (
                                                      <Typography variant='body2'>
                                                        {`${subItem.name} : ${subItem.attributeValue?.value}`}
                                                      </Typography>
                                                    ) ?? '-'
                                                )}
                                              </TableCell>

                                              <TableCell
                                                sx={{
                                                  verticalAlign: 'top'
                                                }}
                                              >
                                                <Field name={`itemTemplate[${index}].imageData`}>
                                                  {({ meta }: any) => (
                                                    <>
                                                      {item.imageUrl && (
                                                        <Box
                                                          sx={{
                                                            height: 'auto',
                                                            minHeight: '100px',
                                                            maxHeight: '200px !important',
                                                            width: 'auto',
                                                            backgroundImage: `url(${item.imageUrl})`,
                                                            backgroundSize: 'contain',
                                                            backgroundRepeat: 'no-repeat'
                                                          }}
                                                        ></Box>
                                                      )}
                                                      <FormControl>
                                                        <Button
                                                          size='small'
                                                          variant='contained'
                                                          color='info'
                                                          startIcon={<PictureInPictureBottomRight />}
                                                          sx={{
                                                            color: 'white !important',
                                                            whiteSpace: 'nowrap'
                                                          }}
                                                          component={'label'}
                                                          htmlFor={`image-${index}`}
                                                        >
                                                          Chọn hình
                                                          <input
                                                            hidden
                                                            name={`itemTemplate[${index}].imageData`}
                                                            multiple
                                                            type='file'
                                                            id={`image-${index}`}
                                                            accept='image/png, image/jpeg'
                                                            value={''}
                                                            onChange={async (event: any) => {
                                                              const files = event.currentTarget.files
                                                              if (files.length > 0 && files[0]) {
                                                                const newData = [...itemTempalte]

                                                                const readNextFile = () => {
                                                                  const reader = new FileReader()
                                                                  reader.readAsDataURL(files[0])
                                                                  newData[index] = {
                                                                    ...newData[index],
                                                                    imageData: files[0]
                                                                  }
                                                                  reader.onload = () => {
                                                                    newData[index] = {
                                                                      ...newData[index],
                                                                      imageUrl: reader.result as string
                                                                    }
                                                                    setItemTempaltes(newData)
                                                                    formikRef.current?.setFieldValue(
                                                                      'itemTemplate',
                                                                      newData
                                                                    )
                                                                  }
                                                                }
                                                                await readNextFile()
                                                              }
                                                            }}
                                                          />
                                                        </Button>
                                                        {meta.touched && !!meta.error && (
                                                          <FormHelperText error={true}>{meta.error}</FormHelperText>
                                                        )}
                                                      </FormControl>
                                                    </>
                                                  )}
                                                </Field>
                                              </TableCell>

                                              <TableCell
                                                sx={{
                                                  verticalAlign: 'top'
                                                }}
                                              >
                                                <Field name={`itemTemplate[${index}].maximumTransportVolume`}>
                                                  {({ field, meta }: any) => (
                                                    <TextField
                                                      {...field}
                                                      fullWidth
                                                      size='small'
                                                      type='number'
                                                      value={item.maximumTransportVolume ?? 0}
                                                      name={`itemTemplate[${index}].maximumTransportVolume`}
                                                      onChange={e => {
                                                        const newValue = e.target.value

                                                        const newData = itemTempalte

                                                        newData[index] = {
                                                          ...newData[index],
                                                          maximumTransportVolume: Number(newValue)
                                                        }

                                                        setItemTempaltes(newData)
                                                        formikRef.current?.setFieldValue('itemTemplate', newData)
                                                      }}
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
                                                <Field name={`itemTemplate[${index}].estimatedExpirationDays`}>
                                                  {({ field, meta }: any) => (
                                                    <TextField
                                                      {...field}
                                                      fullWidth
                                                      name={`itemTemplate[${index}].estimatedExpirationDays`}
                                                      value={item.estimatedExpirationDays ?? 0}
                                                      size='small'
                                                      type='number'
                                                      InputLabelProps={{
                                                        shrink: true
                                                      }}
                                                      onChange={e => {
                                                        const newValue = e.target.value

                                                        const newData = itemTempalte

                                                        newData[index] = {
                                                          ...newData[index],
                                                          estimatedExpirationDays: Number(newValue)
                                                        }

                                                        setItemTempaltes(newData)
                                                        formikRef.current?.setFieldValue('itemTemplate', newData)
                                                      }}
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
                                                <TextField
                                                  fullWidth
                                                  multiline
                                                  value={item.note}
                                                  size='small'
                                                  onChange={e => {
                                                    const newValue = e.target.value

                                                    const newData = itemTempalte
                                                    newData[index] = {
                                                      ...newData[index],
                                                      note: newValue
                                                    }
                                                    setItemTempaltes([...newData])
                                                  }}
                                                  maxRows={5}
                                                />
                                              </TableCell>
                                              <TableCell>
                                                <IconButton
                                                  disabled={itemTempalte.length <= 1}
                                                  onClick={() => {
                                                    const newData = itemTempalte.filter((item, i) => {
                                                      return index !== i
                                                    })

                                                    setItemTempaltes([...newData])
                                                  }}
                                                >
                                                  <TrashCan
                                                    sx={{
                                                      color: itemTempalte.length <= 1 ? 'gray' : 'red'
                                                    }}
                                                  />
                                                </IconButton>
                                              </TableCell>
                                            </TableRow>
                                          )
                                        })}
                                    </TableBody>
                                  </Table>
                                </TableContainer>
                                <TablePagination
                                  labelRowsPerPage='Hàng trên trang'
                                  labelDisplayedRows={({ from, to, count }) => {
                                    return `${from}–${to} / ${count !== -1 ? count : `nhiều hơn ${to}`}`
                                  }}
                                  rowsPerPageOptions={[10, 20, 30]}
                                  component='div'
                                  count={itemTempalte.length}
                                  rowsPerPage={rowsPerPage}
                                  page={page}
                                  onPageChange={handleChangePage}
                                  onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                              </>
                            )}
                          </Box>
                          <GenerateItemTemplateForUpdating
                            reload={open}
                            attributes={attributes.filter(
                              item => item.name && item.attributeValues && item.attributeValues?.length > 0 && item.status === 0
                            )}
                            setTemplateSelected={handleChangeTempalteSelected}
                            templateSelected={itemTempalte}
                            handleClose={handleClose}
                          />
                        </>
                      </Box>
                    ) : (
                      <Skeleton width={'100%'} height={200} />
                    )}
                  </CardContent>
                </Card>
              </Form>
            )}
          </Formik>

          <Stack direction={'row'} justifyContent={'space-between'} spacing={5} sx={{ mb: 10, mt: 5 }}>
            <Button fullWidth variant='outlined' color='info' onClick={() => router.back()}>
              Quay lại
            </Button>
            <Button
              fullWidth
              variant='contained'
              color='info'
              disabled={loading}
              onClick={e => {
                e.preventDefault()
                formikRef.current?.values && handleSubmit(formikRef.current?.values)
              }}
            >
              Chỉnh sửa
            </Button>
          </Stack>
        </>
      ) : (
        <Box display={'flex'} height={'400px'} justifyContent={'center'} alignItems={'center'}>
          <CircularProgress color='info' />
        </Box>
      )}
      <BackDrop open={loading} />
    </Box>
  )
}
UpdateItem.auth = [KEY.ROLE.SYSTEM_ADMIN, KEY.ROLE.SYSTEM_ADMIN]
UpdateItem.getLayout = (children: ReactNode) => {
  return <UserLayout pageTile='Chỉnh sửa vật phẩm'>{children}</UserLayout>
}
export default UpdateItem
