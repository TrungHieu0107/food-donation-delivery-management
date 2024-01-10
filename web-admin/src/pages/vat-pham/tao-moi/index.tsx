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
  UnitModel,
  AttributeTemplate,
  AttributeValue
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
import UserLayout from 'src/layouts/UserLayout'
import { findAllDuplicates } from 'src/@core/layouts/utils'

export class ItemTemplateCreatingModelForm extends ItemTemplateCreatingModel {
  key?: string
  imageData?: FileList | any
  attributes?: AttributeTemplate[]

  constructor(value?: Partial<ItemTemplateCreatingModelForm>) {
    super(value)
    this.imageData = value?.imageData
    this.attributes = value?.attributes
    this.key = value?.key ?? ''
  }
}

export class AttributeTemplateModelForm extends AttributeTemplate {
  key?: string
  constructor(value?: Partial<AttributeTemplateModelForm>) {
    super(value)
    this.key = value?.key
  }
}

const validationSchema = Yup.object<FormValues>({
  name: Yup.string().required('Tên vật phẩm bắt buộc có'),
  unit: Yup.object<UnitModel>().required('Đơn vị bắt buộc phải có'),
  category: Yup.object<Category>().required('Loại vật phẩm là bắt buộc'),
  mainImage: Yup.mixed().required('Hãy chọn 1 hình ảnh'),
  attributes: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required('Tên thuộc tính là bắt buộc'),
      attributeValues: Yup.array()
        .of(
          Yup.object({
            name: Yup.string().required('Tên của giá trị là bắt buộc')
          })
        )
        .min(1, 'Giá trị của thuộc tính là bắt buộc')
        .test('unique', 'Giá trị thuộc tính không được trùng nhau.', array => {
          const set = new Set(array)

          return array && set.size === array?.length
        })
        .required('Giá trị của thuộc tính là bắt buộc')
    })
  ),
  itemTemplate: Yup.array()
    .of(
      Yup.object().shape({
        estimatedExpirationDays: Yup.number().min(1, 'Giá trị nhỏ nhất phải là 1.'),
        maximumTransportVolume: Yup.number()
          .min(1, 'Giá trị nhỏ nhất phải là 1.')
          .required('Hãy điền số lượng có thể vận chuyển trong 1 chuyến'),
        imageData: Yup.mixed().required('Hãy chọn 1 hình ảnh'),
        note: Yup.string().required('Hãy nhập mô tả vật phẩm.')
      })
    )
    .required('Phải có ít nhất 1 mẫu vật phẩm')
    .test('length', 'Phải có ít nhất 1 mẫu vật phẩm', value => value.length > 0)
})

const Label = styled(Typography)<TypographyProps>(({ theme }) => ({
  ...theme.typography.h6,
  fontWeight: 600
}))

interface FormValues {
  name: string
  unit: UnitModel
  category: Category
  description: string
  mainImage: any
  attributes: Attribute[]
  estimatedExpirationDays: number
  itemTemplate: ItemTemplateCreatingModelForm[]
}

const CreateNewItem = () => {
  const [loading, setIsLoading] = useState(true)
  const [imgSrc, setImgSrc] = useState<string>('')
  const router = useRouter()
  const formikRef = useRef<FormikProps<FormValues>>(null)
  const [itemTempalte, setItemTempaltes] = useState<ItemTemplateCreatingModelForm[]>([
    new ItemTemplateCreatingModelForm({
      key: ''
    })
  ])
  const [attributes, setAttributes] = useState<Attribute[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [attributeValue, setAttributeValue] = useState<string>('')
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [units, setUnits] = useState<UnitModel[]>([])
  const [error, setError] = useState<{
    [key: string]: string
  }>({})


  const handleChangeTempalteSelected = (value: ItemTemplateCreatingModelForm[]) => {
    const oldItemTemplate = [...itemTempalte]

    const list = value.map(item => {
      const isSame = oldItemTemplate.filter(itemTempalte => itemTempalte.key === item.key)
      if (isSame.length > 0) {
        return isSame.at(0) as ItemTemplateCreatingModelForm
      }

      return item
    })

    if (list.length === 0) {
      list.push(new ItemTemplateCreatingModelForm())
      setItemTempaltes([
        {
          key: '',
          note: '',
          maximumTransportVolume: 0,
          estimatedExpirationDays: 0,
          imageData: null,

          values: []
        }
      ])
      formikRef.current?.setFieldValue('itemTemplate', [
        {
          estimatedExpirationDays: 0,
          maximumTransportVolume: 0,
          imageData: null,
          note: ''
        }
      ])
    } else {
      if (formikRef.current) {
        const data = list.map(itemTempalte => {
          return {
            mainImage: itemTempalte.imageData,
            maximumTransportVolume: itemTempalte.maximumTransportVolume,
            estimatedExpirationDays: itemTempalte.estimatedExpirationDays,
            note: ''
          }
        })
        console.log(data)

        formikRef.current.setFieldValue('itemTemplate', data)
      }
    }

    setItemTempaltes(list)
  }

  const handleChangePage = (event: unknown, newPage: number) => {
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
      console.log(formikRef.current?.values)

      if (attributeValue !== '') {
        const isSameAttriute = formikRef.current?.values.attributes
          .at(index)
          ?.attributeValues?.filter(atrValue => atrValue.value === attributeValue)
        if (isSameAttriute && isSameAttriute?.length > 0) {
          toast.error('Giá trị thuộc tính đã tồn tại')
        } else {
          const newAttributes = formikRef.current?.values.attributes
          if (newAttributes) {
            newAttributes[index].attributeValues = [
              ...(newAttributes[index].attributeValues || []),
              new AttributeValue({
                itemTemplateAttributeId: `attrValue${index}_${newAttributes[index].attributeValues?.length}`,
                value: attributeValue,
                name: attributeValue
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

  useEffect(() => {
    console.log(formikRef.current?.values)
  }, [formikRef.current?.values])

  const handleSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true)
      console.log(values)

      const formData = new FormData()
      formData.append(`image`, values.mainImage)

      await ImageAPI.upload(formData)
        .then(async imageResposne => {
          const urlImage = new CommonRepsonseModel<string>(imageResposne).data

          const payload = new ItemCreatingModel({
            name: values.name,
            imageUrl: urlImage,
            itemUnitId: values.unit.id,
            estimatedExpirationDays: values.estimatedExpirationDays,
            note: values.description,
            attributes: attributes.map(
              attribute =>
                new Attribute({
                  name: attribute.name,
                  attributeValues: attribute.attributeValues.map(
                    item =>
                      new AttributeValue({
                        name: item.value
                      })
                  )
                })
            ),
            status: 0,
            itemcategoryId: values.category.id,
            itemTemplates: itemTempalte.map(
              item =>
                new ItemTemplateCreatingModel({
                  note: item.note,
                  values: item.attributes?.map(attr => attr.attributeValue?.value ?? '') ?? [],
                  estimatedExpirationDays: item.estimatedExpirationDays,
                  imageUrl: item.imageUrl,
                  maximumTransportVolume: item.maximumTransportVolume
                })
            )
          })

          const itemTemplateAfterupload = itemTempalte.map(async (itemTempalte, index) => {
            if (itemTempalte.imageData) {
              const formData = new FormData()
              formData.append(`image`, itemTempalte.imageData)
              const urlImageResposne = await ImageAPI.upload(formData)
              const urlImage = new CommonRepsonseModel<string>(urlImageResposne).data
              if (payload.itemTemplates && payload.itemTemplates.at(index)) {
                payload.itemTemplates[index] = {
                  ...payload.itemTemplates[index],
                  imageUrl: urlImage
                }

                return payload.itemTemplates[index]
              }
            }

            return new ItemTemplateCreatingModel()
          })

          try {
            const promiseData = await Promise.all(itemTemplateAfterupload)
            await ItemAPI.addNew({
              ...payload,
              itemTemplates: promiseData
            })
              .then(async response => {
                const dataResponse = new CommonRepsonseModel<any>(response)
                const message = dataResponse.message ? dataResponse.message : KEY.MESSAGE.COMMON_ERROR
                toast.success(message)

                router.push('/vat-pham/danh-sach')
              })
              .catch(async err => {
                urlImage && (await ImageAPI.delete(urlImage))
                payload.itemTemplates?.map(item => {
                  item.imageUrl && ImageAPI.delete(item.imageUrl)
                })
                console.error(err)
              })
          } catch (e) {
            console.log('Error add new item', e)
          }
        })
        .catch(err => {
          console.log(err)
        })
    } catch (e) {
      console.log(e)
    } finally {
      setIsLoading(false)
    }
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

  useEffect(() => {
    try {
      fetchData()
      fetchUnits()
    } catch (err) {
      console.log('Error get categories', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchData = async () => {
    const categoryReponse = await CategoryAPI.getAllCategories()
    setCategories(categoryReponse.data ?? [])
  }

  const fetchUnits = () => {
    ItemAPI.getAllUnit().then(response => {
      const commonResponse = new CommonRepsonseModel<UnitModel[]>(response)
      setUnits(commonResponse.data ?? [])
    })
  }

  const handleDeleteAttributeValue = (optionItem: AttributeValue, index: number) => {
    console.log(optionItem)
    const newAttributes = attributes ?? []
    newAttributes[index].attributeValues = newAttributes[index].attributeValues?.filter(item => {
      return item.value !== optionItem.value
    })
    console.log([...newAttributes])
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
    console.log(newItemTemplate)

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
    <Formik
      innerRef={formikRef}
      initialValues={
        {
          name: '',
          unit: null,
          category: null,
          description: '',
          mainImage: null,
          itemTemplate: itemTempalte,
          attributes: []
        } as unknown as FormValues
      }
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      validateOnChange={false}
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
      {({ values, errors }) => {
        console.log({ errors, values, itemTempalte })

        return (
          <Form
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10
            }}
          >
            <Grid container spacing={3} alignItems={'stretch'}>
              <Grid
                item
                xl
                lg
                md
                sm={12}
                xs={12}
                sx={{
                  height: 'auto'
                }}
              >
                <Card
                  sx={{
                    height: '100%'
                  }}
                >
                  <CardHeader title={<Label>Thông tin của vật phẩm</Label>} />
                  <CardContent>
                    <Field name='name'>
                      {({ field, meta }: any) => (
                        <TextField
                          {...field}
                          label='Tên vật phẩm'
                          error={meta.touched && !!meta.error}
                          helperText={meta.touched && !!meta.error ? meta.error : ''}
                          autoComplete='off'
                          fullWidth
                        />
                      )}
                    </Field>

                    <Grid container spacing={3} sx={{ mt: 1 }}>
                      <Grid item md={6} xs={6}>
                        <Field name='unit'>
                          {({ field, meta }: any) => (
                            <Autocomplete
                              {...field}
                              disablePortal
                              fullWidth
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
                              getOptionLabel={option => (option as UnitModel).name || ''}
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
                      <Grid item md={6} xs={6}>
                        <Field name='category'>
                          {({ field, meta, form }: any) =>
                            !loading && (
                              <Autocomplete
                                {...field}
                                disablePortal
                                fullWidth
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
                                getOptionLabel={option => (option as Category).name || ''}
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
                                    form.setValues({
                                      ...form.values,
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
              <Grid
                item
                xl
                lg
                md
                sm={12}
                xs={12}
                sx={{
                  height: 'auto'
                }}
              >
                <Card
                  sx={{
                    height: '100%'
                  }}
                >
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
                            {meta.touched && !!meta.error && <FormHelperText error={true}>{meta.error}</FormHelperText>}
                          </Box>
                        </FormControl>
                      )}
                    </Field>
                  </CardContent>
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
                  {values.attributes?.map((attribute, index) => {
                    return (
                      <Box key={index}>
                        <Typography
                          variant='body2'
                          sx={{
                            mb: 2
                          }}
                        >
                          Thuộc tính {index + 1}
                        </Typography>
                        <Grid container spacing={2} key={index} alignItems={'top'} justifyContent={'center'}>
                          <Grid item xs={12} md={3}>
                            <Field name={`attributes[${index}].name`}>
                              {({ field, meta }: any) => (
                                <TextField
                                  {...field}
                                  autoComplete='off'
                                  label='Thuộc tính'
                                  type='text'
                                  fullWidth
                                  onKeyPress={e => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault()
                                    }
                                  }}
                                  error={(meta.touched && !!meta.error) || !!error[field.value || '']}
                                  helperText={meta.touched && !!meta.error ? meta.error : error[field.value || '']}
                                />
                              )}
                            </Field>
                          </Grid>
                          <Grid item xs={12} md={8}>
                            <Field name={`attributes[${index}].attributeValues`}>
                              {({ meta }: any) => (
                                <Autocomplete
                                  options={[
                                    new AttributeValue({ value: attributeValue, itemTemplateAttributeId: '1' })
                                  ]}
                                  multiple={true}
                                  value={attribute.attributeValues}
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
                          <Grid item>
                            <IconButton
                              onClick={() => {
                                handledeleteAttribute(index)
                                console.log(itemTempalte)

                                const newItemTemplate = itemTempalte.filter(item => {
                                  if (item.attributes) {
                                    const itemContainThisAttribute = item.attributes.filter(
                                      subItem => subItem.name === attribute.name
                                    )

                                    return itemContainThisAttribute && itemContainThisAttribute.length === 0
                                  }

                                  return true
                                })
                                setItemTempaltes(newItemTemplate)
                              }}
                            >
                              <TrashCan />
                            </IconButton>
                          </Grid>
                        </Grid>

                        <Divider
                          sx={{
                            borderWidth: 1
                          }}
                        />
                      </Box>
                    )
                  })}
                  <Grid container>
                    <Button
                      startIcon={<Plus />}
                      variant='contained'
                      color='info'
                      sx={{ mt: 3 }}
                      onClick={() => {
                        setAttributes([...(formikRef.current?.values?.attributes ?? []), new Attribute()])
                        formikRef.current?.setFieldValue('attributes', [
                          ...(formikRef.current?.values?.attributes ?? []),
                          new Attribute()
                        ])
                      }}
                    >
                      Thêm thuộc tính
                    </Button>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
            <Card>
              <CardHeader
                title={
                  <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} flexDirection={'row'}>
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
                    <TableContainer
                      sx={{
                        maxHeight: '500px',
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
                              Hình ảnh
                            </TableCell>
                            <TableCell
                              sx={{
                                verticalAlign: 'top',
                                width: 150
                              }}
                            >
                              Số lượng tối đa vận chuyển
                            </TableCell>
                            <TableCell
                              sx={{
                                verticalAlign: 'top',
                                width: 150
                              }}
                            >
                              Ngày bảo quản (dự đoán)
                            </TableCell>
                            <TableCell
                              sx={{
                                verticalAlign: 'top',
                                width: 300
                              }}
                            >
                              Mô tả
                            </TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {[...itemTempalte].splice(page * rowsPerPage, (page + 1) * rowsPerPage).map((item, index) => {
                            const currentIndex = page * rowsPerPage + index

                            return (
                              <TableRow hover role='checkbox' key={currentIndex} tabIndex={-1}>
                                <TableCell
                                  sx={{
                                    verticalAlign: 'top'
                                  }}
                                >
                                  {currentIndex + 1}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    verticalAlign: 'top'
                                  }}
                                >
                                  {item.attributes?.map((subItem, i) => (
                                    <Typography key={i} variant='body2'>
                                      {`${subItem.name} : ${subItem.attributeValue?.value}`}
                                    </Typography>
                                  ))}
                                </TableCell>

                                <TableCell
                                  sx={{
                                    verticalAlign: 'top'
                                  }}
                                >
                                  <Field name={`itemTemplate[${currentIndex}].imageData`}>
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
                                              backgroundRepeat: 'no-repeat',
                                              mb: 1
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
                                            htmlFor={`image-${currentIndex}`}
                                          >
                                            Chọn hình
                                            <input
                                              hidden
                                              name={`itemTemplate[${currentIndex}].imageData`}
                                              multiple
                                              type='file'
                                              id={`image-${currentIndex}`}
                                              accept='image/png, image/jpeg'
                                              value={''}
                                              onChange={async (event: any) => {
                                                const files = event.currentTarget.files
                                                if (files.length > 0 && files[0]) {
                                                  const newData = [...itemTempalte]

                                                  const readNextFile = () => {
                                                    const reader = new FileReader()
                                                    reader.readAsDataURL(files[0])
                                                    newData[currentIndex] = {
                                                      ...newData[currentIndex],
                                                      imageData: files[0]
                                                    }
                                                    reader.onload = () => {
                                                      newData[currentIndex] = {
                                                        ...newData[currentIndex],
                                                        imageUrl: reader.result as string
                                                      }
                                                      setItemTempaltes(newData)
                                                      formikRef.current?.setFieldValue('itemTemplate', newData)
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
                                  <Field name={`itemTemplate[${currentIndex}].maximumTransportVolume`}>
                                    {({ field, meta }: any) => (
                                      <TextField
                                        {...field}
                                        value={item.maximumTransportVolume}
                                        fullWidth
                                        size='small'
                                        type='number'
                                        onChange={e => {
                                          const newValue = e.target.value

                                          const newData = itemTempalte

                                          newData[currentIndex] = {
                                            ...newData[currentIndex],
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
                                  <Field name={`itemTemplate[${currentIndex}].estimatedExpirationDays`}>
                                    {({ field, meta }: any) => (
                                      <TextField
                                        {...field}
                                        fullWidth
                                        value={item.estimatedExpirationDays}
                                        size='small'
                                        type='number'
                                        InputLabelProps={{
                                          shrink: true
                                        }}
                                        onChange={e => {
                                          const newValue = e.target.value

                                          const newData = itemTempalte

                                          newData[currentIndex] = {
                                            ...newData[currentIndex],
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
                                  <Field name={`itemTemplate[${currentIndex}].note`}>
                                    {({ field, meta }: any) => (
                                      <TextField
                                        {...field}
                                        value={item.note}
                                        fullWidth
                                        multiline
                                        size='small'
                                        maxRows={5}
                                        onChange={e => {
                                          const newValue = e.target.value

                                          const newData = itemTempalte
                                          newData[currentIndex] = {
                                            ...newData[currentIndex],
                                            note: newValue
                                          }
                                          setItemTempaltes([...newData])
                                        }}
                                        error={meta.touched && !!meta.error}
                                        helperText={meta.touched && !!meta.error ? meta.error : ''}
                                      />
                                    )}
                                  </Field>
                                </TableCell>
                                <TableCell>
                                  <IconButton
                                    disabled={itemTempalte.length <= 1}
                                    onClick={() => {
                                      if (itemTempalte.length <= 1) return
                                      const newData = itemTempalte.filter((item, i) => {
                                        return currentIndex !== i
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
                    <GenerateItemTemplateForUpdating
                      attributes={attributes.filter(
                        item => item.name && item.attributeValues && item.attributeValues?.length > 0
                      )}
                      setTemplateSelected={handleChangeTempalteSelected}
                      templateSelected={itemTempalte}
                      handleClose={handleClose}
                      reload={open}
                    />
                  </Box>
                ) : (
                  <Skeleton width={'100%'} height={200} />
                )}
              </CardContent>
            </Card>
            <Stack direction={'row'} justifyContent={'space-between'} spacing={5} sx={{ mb: 10, mt: 5 }}>
              <Button fullWidth variant='outlined' color='info' onClick={() => router.back()}>
                Quay lại
              </Button>
              <Button fullWidth variant='contained' color='info' disabled={loading} type='submit'>
                Tạo mới
              </Button>
            </Stack>
            <BackDrop open={loading} />
          </Form>
        )
      }}
    </Formik>
  )
}
CreateNewItem.auth = [KEY.ROLE.SYSTEM_ADMIN, KEY.ROLE.SYSTEM_ADMIN]
CreateNewItem.getLayout = (children: ReactNode) => {
  return <UserLayout pageTile='Tạo vật phẩm mới'>{children}</UserLayout>
}

export default CreateNewItem
