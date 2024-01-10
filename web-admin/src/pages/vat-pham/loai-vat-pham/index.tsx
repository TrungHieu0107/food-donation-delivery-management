'use client'

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography
} from '@mui/material'
import { Box } from '@mui/system'
import { Field, Form, Formik, FormikProps } from 'formik'
import { DotsVertical, Plus } from 'mdi-material-ui'
import * as React from 'react'
import { ChangeEvent, useMemo, useState } from 'react'
import DialogCustom from 'src/@core/layouts/components/shared-components/Dialog'
import { CategoryAPI } from 'src/api-client/Category'
import { KEY } from 'src/common/Keys'
import BackDrop from 'src/layouts/components/loading/BackDrop'
import { CommonRepsonseModel } from 'src/models/common/CommonResponseModel'
import { Category } from 'src/models/Item'
import { HeadCell } from 'src/models/common/CommonModel'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import useSession from 'src/@core/hooks/useSession'

const HeaderCell: HeadCell<Category>[] = [
  {
    id: 'name',
    label: 'Tên',
    minWidth: 150
  },
  {
    id: 'type',
    label: 'Thực phẩm',
    minWidth: 100,
    format: val => {
      return <Checkbox checked={val.type === 0} />
    }
  }
]

const validationSchema = Yup.object<Category>({
  name: Yup.string().required('Tên của loại vật phẩm là bắt buộc')
})

const CategoryList = () => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const { session }: any = useSession()
  const [dialogAddNewCategory, setDialogAddNewCategory] = useState(false)
  const formikRef = React.useRef<FormikProps<Category>>(null)
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  React.useEffect(() => {
    setLoading(true)
    try {
      fetchData()
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const visibleData = useMemo(() => {
    const data = [...categories]

    return data.splice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  }, [categories, rowsPerPage, page])

  const handleOpenDialogAddNewCategory = () => {
    setDialogAddNewCategory(true)
  }

  const handleCloseDialogAddNewCategory = () => {
    setDialogAddNewCategory(false)
  }

  const handleSubmit = (values: Category) => {
    CategoryAPI.addNew({
      name: values.name,
      type: values.type ?? 0
    })
      .then(async () => {
        toast.success('Tạo mới thành công')
        setDialogAddNewCategory(false)
        const categoryReponse = await CategoryAPI.getAllCategories()

        const dataCategoryList = new CommonRepsonseModel(categoryReponse).data as Category[]

        setCategories(dataCategoryList)
      })
      .catch(err => {
        setLoading(false)
        console.error(err)
      })
  }

  const fetchData = async () => {
    const categoryReponse = await CategoryAPI.getAllCategories()
    const dataCategoryList = new CommonRepsonseModel<Category[]>(categoryReponse).data
    setCategories(dataCategoryList ?? [])
  }

  return (
    <Card>
      <CardHeader
        title={
          <Box display={'flex'} justifyContent={'space-between'}>
            <Typography variant='h5' fontWeight={700}>
              Danh sách thể loại của vật phẩm
            </Typography>
            {session?.user.role === 'SYSTEM_ADMIN' && (
              <Button
                startIcon={<Plus />}
                color='info'
                variant='contained'
                onClick={handleOpenDialogAddNewCategory}
                disabled={loading}
              >
                Thêm
              </Button>
            )}
          </Box>
        }
      />
      <CardContent>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                {HeaderCell.map(item => (
                  <TableCell key={item.id}> {item.label}</TableCell>
                ))}
                <TableCell
                  sx={{
                    width: 50
                  }}
                ></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleData.map((value, index) => {
                return (
                  <TableRow key={value.id}>
                    <TableCell>{index + 1}</TableCell>
                    {HeaderCell.map(item => (
                      <TableCell key={item.id}> {item.format ? item.format(value) : value[item.id]}</TableCell>
                    ))}
                    <TableCell>
                      {session?.user.role === 'SYSTEM_ADMIN' && (
                        <IconButton>
                          <DotsVertical />
                        </IconButton>
                      )}
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
          count={categories.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </CardContent>
      <DialogCustom
        content={
          <Box display={'flex'} justifyContent={'center'}>
            <Formik
              innerRef={formikRef}
              initialValues={{
                id: '',
                name: '',
                type: 0
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({}) => (
                <Form
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column'
                  }}
                >
                  <Field name='name'>
                    {({ field, meta }: any) => (
                      <TextField
                        {...field}
                        sx={{ mt: 3 }}
                        name='name'
                        label='Tên thể loại'
                        error={meta.touched && !!meta.error}
                        helperText={meta.touched && !!meta.error ? meta.error : ''}
                      />
                    )}
                  </Field>
                  <Field name='type' type='checkbox'>
                    {({ field, form, meta }: any) => (
                      <FormControl>
                        <FormControlLabel
                          label={'Thực phẩm'}
                          control={
                            <Checkbox
                              {...field}
                              name='type'
                              error={meta.touched && !!meta.error}
                              helperText={meta.touched && !!meta.error ? meta.error : ''}
                              onChange={e => {
                                form.setFieldValue(field.name, e.target.checked ? 0 : 1)
                              }}
                              checked={form.values.type === 0}
                            />
                          }
                        ></FormControlLabel>
                      </FormControl>
                    )}
                  </Field>
                </Form>
              )}
            </Formik>
          </Box>
        }
        handleClose={handleCloseDialogAddNewCategory}
        open={dialogAddNewCategory}
        title={'Tạo mới loại vật phẩm'}
        actionDialog={
          <>
            <Button color='info' variant='outlined' onClick={handleCloseDialogAddNewCategory} disabled={loading}>
              Đóng
            </Button>
            <Button
              variant='contained'
              color='info'
              onClick={() => {
                formikRef.current?.submitForm()
              }}
              disabled={loading}
            >
              Lưu
            </Button>
          </>
        }
        width={400}
      />
      <BackDrop open={loading} />
    </Card>
  )
}

CategoryList.auth = [KEY.ROLE.SYSTEM_ADMIN, KEY.ROLE.BRANCH_ADMIN]

export default CategoryList

CategoryList.auth = [KEY.ROLE.SYSTEM_ADMIN, KEY.ROLE.BRANCH_ADMIN]
