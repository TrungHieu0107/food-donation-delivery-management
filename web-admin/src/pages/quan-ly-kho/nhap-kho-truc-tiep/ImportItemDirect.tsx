'use client'

import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import {
    Box,
    Button,
    IconButton,
    InputAdornment,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from '@mui/material'
import { Field, FieldArray, Form, Formik, FormikProps, FormikValues } from 'formik'
import moment from 'moment'
import Link from 'next/link'
import { useRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { toast } from 'react-toastify'
import axiosClient from 'src/api-client/ApiClient'
import * as Yup from 'yup'
import SearchItemForDonated from './SearchItemForDonated'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

const validationSchema = Yup.object({
  bigNote:Yup.string().max(200, "Ghi chú không được quá 200 kí tự"),
  listItemSelected: Yup.array().of(
    Yup.object().shape({
      quantity: Yup.number().integer('Số lượng phải là số nguyên.').min(1, 'Số lượng ít nhất là 1').required('Số lượng bắt buộc phải có'),
      note:Yup.string().max(500, "Ghi chú tối đa 500 kí tự!"),
      expirationDate: Yup.date()
      .required('Ngày bắt đầu (dự kiến) bắt buộc có')
      .min(new Date(Date.now() + 864e5), 'Ngày hết hạn phải sau ngày hôm nay 2 ngày!'),
    })
  )
})

const DirectImportItem = () => {
  const [loading, setIsLoading] = useState(false)
  const [itemSelected, setItemSelected] = useState<any>([])
  const formikRef = useRef<FormikProps<FormikValues>>(null)

  return (
    <Box component={Paper} sx={{ p: 10 }}>
      <Formik
        innerRef={formikRef}
        initialValues={{
          bigNote:"",
          listItemSelected: []
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {
          if(itemSelected?.length === 0){
            toast.error("Vui lòng chọn vật phẩm nhập kho!")

            return;
          }
          setIsLoading(true)
          const listItem = values.listItemSelected.map((i: any)=>{
            return {
              itemId: i.id,
              quantity: i.quantity,
              note: i.note,
              expirationDate:moment(i.expirationDate)           
              .format("YYYY-MM-DD"),
            }
          })

          try {
            const data: any = await axiosClient.post('/stock-updated-histories/import', {
                note: values.bigNote,
                directDonationRequests: listItem
            })
            toast.success(data.message)
            resetForm();
          } catch (error: any) {
            console.log('err nè: ', error)
            toast.error("Thao tác không thành công")
          }finally{
            setIsLoading(false)
          }
        }}
      >
        {({ values }) => (
            <DatePickerWrapper>
          <Form>          
            <SearchItemForDonated itemSelected={itemSelected} setItemSelected={setItemSelected} formikRef={formikRef} />
            {itemSelected.length > 0 && (
              <Box sx={{ mb: 10 }}>
                <TableContainer>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell> #</TableCell>
                        <TableCell>Tên vật phẩm</TableCell>
                        <TableCell>Số lượng</TableCell>
                        <TableCell>Đơn vị</TableCell>
                        <TableCell align='center'>Ghi chú</TableCell>
                        <TableCell align='center'>Ngày hết hạn</TableCell>
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
                                    {({ field, meta }: any) => (
                                      <TextField
                                        {...field}
                                        type='number'
                                        size='small'
                                        label='Số lượng'
                                        error={meta.touched && !!meta.error}
                                        helperText={meta.touched && meta.error ? meta.error : ''}
                                      />
                                    )}
                                  </Field>
                                </TableCell>
                                <TableCell>{data.unit}</TableCell>
                                <TableCell>
                                  <Field name={`listItemSelected.${index}.note`}>
                                    {({ field, meta }: any) => (
                                      <TextField
                                        {...field}
                                        label='Ghi chú'
                                        size='small'
                                        multiline
                                        rows={3}
                                        error={meta.touched && !!meta.error}
                                        helperText={meta.touched && meta.error ? meta.error : ''}
                                        fullWidth
                                      />
                                    )}
                                  </Field>
                                </TableCell>
                                <TableCell>
                                  <Field name={`listItemSelected.${index}.expirationDate`}>
                                    {({ field, meta, form: { setFieldValue } }: any) => (
                                      <DatePicker
                                        {...field}
                                        customInput={
                                          <TextField
                                            {...field}
                                            inputProps={{
                                              autoComplete: 'off'
                                            }}
                                            fullWidth
                                            size='small'
                                            label='Ngày hết hạn'
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
                                            helperText={meta.touched && meta.error ? meta.error : ''}
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
            )}    
             <Field name='bigNote'>
                  {({ field, meta }: any) => (
                    <TextField
                      {...field}
                      label='Ghi chú'                    
                      error={meta.touched && !!meta.error}
                      helperText={meta.touched && meta.error ? meta.error : ''}
                      fullWidth
                      multiline
                      rows={4}
                      sx={{mt: 7}}
                    />
                  )}
                </Field>      
            <Stack direction={'row'} justifyContent={'space-between'} spacing={5} sx={{ mb: 10, mt: 15 }}>
              <Button fullWidth type='submit' color='info' variant='contained' disabled={loading}>
                Nộp biểu mẫu
              </Button>
            </Stack>
            <Link
              style={{
                textDecoration: 'none'
              }}
              href='/quan-ly-kho/danh-sach'
            >
              Trở về danh sách vật phẩm trong kho
            </Link>
          </Form>
          </DatePickerWrapper>
        )}
      </Formik>
    </Box>
  )
}

export default DirectImportItem

