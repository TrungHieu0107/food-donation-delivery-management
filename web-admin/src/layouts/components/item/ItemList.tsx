import { TabContext, TabList, TabPanel } from '@mui/lab'
import * as React from 'react'
import { SyntheticEvent, useRef, useState } from 'react'
import { styled } from '@mui/material/styles'
import { Autocomplete, Box, Button, Card, CardHeader, Grid, Tab, TextField, Typography } from '@mui/material'
import { KEY } from 'src/common/Keys'
import { Field, Form, Formik, FormikProps } from 'formik'
import { Magnify, Plus } from 'mdi-material-ui'
import { Category } from 'src/models/Item'
import ItemListTable from '../table/ItemListTable'
import { useRouter } from 'next/router'
import { SearchItemParamsModel } from 'src/models/common/CommonModel'
import { BranchModel } from 'src/models/Branch'

const TabName = styled('span')(() => ({
  lineHeight: 1.71,
  fontSize: '0.875rem',
  maxWidth: '125px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  wordBreak: 'unset',
  whiteSpace: 'nowrap'
}))

interface ItemTemplateListPageProps {
  tabs: BranchModel[]
  categories: Category[]
}

type FormValues = {
  name: string
  category: Category | null
}

export default function ItemTemplateListPage(props: ItemTemplateListPageProps) {
  const [currentTab, setCurrentTab] = useState<string>('0')
  const [dataSearch, setDataSearch] = useState<SearchItemParamsModel>(new SearchItemParamsModel())
  const formikRef = useRef<FormikProps<FormValues>>(null)
  const router = useRouter()

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue)
    setDataSearch({
      ...dataSearch,
      categoryType: newValue === '1' ? 0 : newValue === '2' ? 1 : undefined
    })
  }

  const handleClickAddNewButton = () => {
    router.push('/vat-pham/tao-moi')
  }

  return (
    <Card>
      <CardHeader
        title={
          <Grid container justifyContent={'space-between'} spacing={{ sm: 2, md: 1 }}>
            <Grid item sm={6} md={4} lg={4}>
              <Typography variant='h5' fontWeight={700}>Danh sách vật phẩm</Typography>
            </Grid>
            <Grid item sm={6} md={8}>
              <Box display={'flex'} justifyContent={'flex-end'}>
                <Button variant='contained'  color="secondary" startIcon={<Plus></Plus>} onClick={handleClickAddNewButton}>
                  Thêm mới
                </Button>
              </Box>
            </Grid>
          </Grid>
        }
      ></CardHeader>
      
      <TabContext value={currentTab}>
        <TabList
          onChange={handleChange}
          aria-label='account-settings tabs'
          sx={{
            borderBottom: theme => `1px solid ${theme.palette.divider}`,
            overflow: 'auto',
            '& .css-1a4uxel-MuiTabs-indicator': {
              backgroundColor: `${KEY.COLOR.SECONDARY}`
            },
            '& .Mui-selected': {
              color: `${KEY.COLOR.SECONDARY} !important`
            }
          }}
          scrollButtons='auto'
          variant='scrollable'
        >
          {props.tabs.map((item, index) => (
            <Tab
              key={index}
              value={item.id}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TabName>{item.name}</TabName>
                </Box>
              }
            />
          ))}
        </TabList>
        <TabPanel value={currentTab} >
          {/* Filter  */}
          <Grid container justifyContent={'space-between'} spacing={{ sm: 2, md: 1 }}>
            <Grid item sm={12} md={4} lg={4}>
              <Typography variant='h6'>Danh sách tất cả các item</Typography>
            </Grid>
            <Grid item sm={12} md={8}>
              <Formik
                innerRef={formikRef}
                initialValues={{
                  name: '',
                  category: null
                }}
                onSubmit={values => {
                  setDataSearch({
                    ...dataSearch,
                    categoryType: currentTab === '1' ? 0 : currentTab === '2' ? 1 : undefined,
                    itemCategoryId: values.category?.id,
                    name: values.name
                  })
                }}
              >
                {({}) => (
                  <Form>
                    <Grid container spacing={2} justifyContent={'flex-end'} alignItems={'center'}>
                      <Grid item>
                        <Field name='name'>
                          {({ field, meta }: any) => (
                            <TextField
                              {...field}
                              name='name'
                              placeholder='Tên vật phẩm'
                              label='Tên vật phẩm'
                              size='small'
                              error={meta.touched && !!meta.error}
                              helperText={meta.touched && !!meta.error ? meta.error : ''}
                            />
                          )}
                        </Field>
                      </Grid>
                      <Grid item>
                        <Field name='category'>
                          {({ field, meta }: any) => (
                            <Autocomplete
                              {...field}
                              disablePortal
                              fullWidth
                              renderInput={params => (
                                <TextField
                                  {...params}
                                  name='category'
                                  placeholder='Loại vật phẩm'
                                  label='Loại'
                                  size='small'
                                  fullWidth
                                  error={meta.touched && !!meta.error}
                                  helperText={meta.touched && !!meta.error ? meta.error : ''}
                                />
                              )}
                              getOptionLabel={option => (option as Category).name}
                              options={props.categories?.filter(item => {
                                if (currentTab === '0') {
                                  return true
                                } else if (currentTab === '1') {
                                  return item.type === 0
                                } else if (currentTab === '2') {
                                  return item.type === 1
                                } else {
                                  return false
                                }
                              })}
                              renderOption={(props, option) => (
                                <Box component='li' {...props}>
                                  <Typography ml={1} variant='body2'>
                                    {(option as Category).name}
                                  </Typography>
                                </Box>
                              )}
                              onChange={(_: SyntheticEvent, newValue: Category | null) => {
                                formikRef.current?.setValues({
                                  ...formikRef.current?.values,
                                  category: newValue
                                })
                                formikRef.current?.submitForm()
                              }}
                              sx={{
                                width: 200
                              }}
                            />
                          )}
                        </Field>
                      </Grid>
                      <Grid item>
                        <Button type='submit' size='small'>
                          <Magnify />
                        </Button>
                      </Grid>
                    </Grid>
                  </Form>
                )}
              </Formik>
            </Grid>
          </Grid>
          <ItemListTable tableName='Tất cả các vật phẩm' dataSearch={dataSearch} />
        </TabPanel>
      </TabContext>
    </Card>
  )
}
