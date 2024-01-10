'use client'

import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  Grid,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { format } from 'date-fns'
import { Field, FieldArray, Form, Formik, FormikProps, FormikValues } from 'formik'
import { DateTime } from 'luxon'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { toast } from 'react-toastify'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import axiosClient from 'src/api-client/ApiClient'
import * as Yup from 'yup'

const validationSchema = Yup.object({
  listPhases: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required('Tên vai trò bắt buộc phải có'),

      // start: Yup.string().required('Ngày bắt đầu (dự kiến) bắt buộc có'),
      // end: Yup.string().required('Ngày kết thúc (dự kiến) bắt buộc có'),

      start: Yup.date()
        .nullable()
        .required('Ngày bắt đầu (dự kiến) bắt buộc có'),

        // .min(new Date(), 'Ngày bắt đầu (dự kiến) phải sau ngày hôm nay'),

      end: Yup.date()
        .required('Ngày kết thúc (dự kiến) bắt buộc có')
        .min(Yup.ref('start'), 'Ngày kết thúc (dự kiến) phải từ ngày bắt đầu (dự kiến)')
    })
  )
})

const ActivityPhases = () => {
  const router = useRouter()
  const formikRef = useRef<FormikProps<FormikValues>>(null)
  const [initValue, setInitValue] = useState<any>(null)
  const { slug } = router.query
  const [loading, setIsLoading] = useState(false)
  const fetchData = async () => {
    try {
      const responsePhases = await axiosClient.get(`/phases/activity/${slug}`)
      console.log(responsePhases.data)
      const newData = responsePhases.data?.map((p: any) => ({
        id: p.id,
        name: p.name,
        start: new Date(p.estimatedStartDate),
        end: new Date(p.estimatedEndDate),
        realStart: p.startDate ? p.startDate : '',
        realEnd: p.endDate ? p.endDate : '',
        status: p.status,
        isNew: false,
        isChangeStatus: false
      }))
      setInitValue(newData || [])
    } catch (error) {    
      setInitValue([])
      console.log(error)
    }
  }
  const handleDeletePhase = async (id: any) => {
    try {
      const response = await axiosClient.delete(`/phases/${id}`)
      console.log(response)
      fetchData()
      toast.success('Deleted successfully.')
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    if (slug) {
      fetchData()
    }
  }, [slug])

  if (initValue) {
    return (
      <Paper sx={{ p: 5 }}>
        <Formik
          innerRef={formikRef}
          initialValues={{
            listPhases: initValue
          }}
          validationSchema={validationSchema}
          onSubmit={async values => {
            //setIsLoading(true)
            console.log("data submit: ",values)
            const updatePhases = values.listPhases
              .filter((phase: any) => phase.isNew === false)
              .map(
                (phase: any) => {
                  if (phase.status === 'NOT_STARTED') {
                    return {
                      id: phase.id,
                      name: phase.name,
                      estimatedStartDate: DateTime.fromJSDate(new Date(phase.start), {
                        zone: 'Asia/Ho_Chi_Minh'
                      }).toISODate(),
                      estimatedEndDate: DateTime.fromJSDate(new Date(phase.end), {
                        zone: 'Asia/Ho_Chi_Minh'
                      }).toISODate(),
                      status:
                        phase.isChangeStatus === false
                          ? null
                          : phase.isChangeStatus === true && phase.status === 'STARTED'
                          ? 0
                          : 1
                    }
                  }else if(phase.status === 'STARTED' && phase.isChangeStatus === true) {
                    return {
                      id: phase.id,
                      name: phase.name,
                      estimatedStartDate: DateTime.fromJSDate(new Date(phase.start), {
                        zone: 'Asia/Ho_Chi_Minh'
                      }).toISODate(),
                      estimatedEndDate: DateTime.fromJSDate(new Date(phase.end), {
                        zone: 'Asia/Ho_Chi_Minh'
                      }).toISODate(),
                      status:
                        phase.isChangeStatus === false
                          ? null
                          : phase.isChangeStatus === true && phase.status === 'STARTED'
                          ? 0
                          : 1
                    }
                  }
                  
                  else{
                    return {
                      id: phase.id,
                      name: phase.name,
                      status:
                        phase.isChangeStatus === false
                          ? null
                          : phase.isChangeStatus === true && phase.status === 'STARTED'
                          ? 0
                          : 1
                    }
                  }
                }

                // ({
                //   id: phase.id,
                //   name: phase.name,
                //   estimatedStartDate: DateTime.fromJSDate(new Date(phase.start), {
                //     zone: 'Asia/Ho_Chi_Minh'
                //   }).toISODate(),
                //   estimatedEndDate: DateTime.fromJSDate(new Date(phase.end), { zone: 'Asia/Ho_Chi_Minh' }).toISODate(),
                //   status:
                //     phase.isChangeStatus === false
                //       ? null
                //       : phase.isChangeStatus === true && phase.status === 'STARTED'
                //       ? 0
                //       : 1
                // })
              )

            // const updateStatusOfPhases = updatePhases.map((newData:any) => {
            //   const correspondingItem = initValue.find((oldData:any) => oldData.id === newData.id);

            //   if (correspondingItem && correspondingItem.status !== newData.status) {
            //     return { ...newData, status: newData.status === "STARTED" ? 0 : 1 };
            //   } else {
            //     return { ...newData, status: null };
            //   }
            // });

            const newPhases = values.listPhases
              .filter((phase: any) => phase.isNew === true)
              .map((phase: any) => ({
                name: phase.name,
                estimatedStartDate: DateTime.fromJSDate(new Date(phase.start), {
                  zone: 'Asia/Ho_Chi_Minh'
                }).toISODate(),
                estimatedEndDate: DateTime.fromJSDate(new Date(phase.end), { zone: 'Asia/Ho_Chi_Minh' }).toISODate()
              }))

            console.log('new', newPhases, 'update', updatePhases)

            try {
              if (updatePhases.length > 0) {
                const dataUpdate = await axiosClient.put(`/phases`, updatePhases)
                console.log(dataUpdate)
              }
              if (newPhases.length > 0) {
                const dataAdd = await axiosClient.post(`/phases`, {
                  activityId: slug,
                  phaseRequests: newPhases
                })
                console.log(dataAdd)
              }
              fetchData()
              setIsLoading(false)
              toast.success('Cập nhật vai trò cho hoạt động thành công')
            } catch (error: any) {
              console.log('err nè: ', error)
              setIsLoading(false)
            }
          }}
        >
          {({ values }) => (
             <DatePickerWrapper>
            <Form>
               <Stack direction={"column"} sx={{minHeight:"75vh"}} justifyContent={"space-between"}>
              <Box>
              <FieldArray name='listPhases'>
                {({ push, remove }: any) => (
                  <>
                    <Grid container>
                      {values.listPhases.map((phase: any, index: any) => (
                        <Grid item xs={12} md={12} key={index} sx={{ mt: 5, mb: 5 }}>
                          <Typography sx={{ fontWeight: 700, mb: 2 }}>Giai đoạn {index + 1}</Typography>
                          <Grid container spacing={5}>
                            <Grid item xs={12} md={12} lg={12}>
                              {phase.status === 'STARTED' &&<FormControl sx={{width:"100%"}}> <TextField fullWidth value={phase.name} label="Tên giai đoạn" disabled/></FormControl> }
                              {phase.status === 'ENDED' && (
                               <FormControl sx={{width:"100%"}}> <TextField fullWidth value={phase.name} label="Tên giai đoạn" disabled/></FormControl>
                              )}
                              {phase.status === 'NOT_STARTED' && (
                                <Field name={`listPhases.${index}.name`}>
                                  {({ field, meta }: any) => (
                                    <TextField
                                      {...field}
                                      label='Tên giai đoạn'
                                      fullWidth
                                      error={meta.touched && !!meta.error}
                                      helperText={meta.touched && !!meta.error ? meta.error : ''}
                                    />
                                  )}
                                </Field>
                              )}
                            </Grid>
                            <Grid item xs={12} md={4} lg={4}>
                              {phase.status === 'STARTED' && phase.isChangeStatus === false && (
                                <FormControl>
                                <TextField size='small' value={format(new Date(phase.realStart), 'dd/MM/yyyy')} disabled label="Ngày bắt đầu"/>
                                </FormControl>
                              )}
                              {phase.status === 'ENDED' && phase.isChangeStatus === false && (
                                <FormControl>
                                <TextField size='small' value={format(new Date(phase.realStart), 'dd/MM/yyyy')} disabled label="Ngày bắt đầu"/>
                                </FormControl>
                              )}
                               {(phase.status === 'STARTED' && phase.isChangeStatus === true) && (
                                <FormControl>
                                <TextField size='small' value={format(new Date (phase.start), 'dd/MM/yyyy')} disabled label="Ngày bắt đầu (dự kiến)"/>
                                </FormControl>
                              )}   
                              {phase.status === 'ENDED' && phase.isChangeStatus === true && (
                                <FormControl>
                                <TextField size='small' value={format(new Date(phase.realStart), 'dd/MM/yyyy')} disabled label="Ngày bắt đầu"/>
                                </FormControl>
                              )}                      
                              {phase.status === 'NOT_STARTED' && (
                                <Field name={`listPhases.${index}.start`}>
                                  {({ field, meta, form: { setFieldValue } }: any) => (
                                    <DatePicker
                                      {...field}
                                      customInput={
                                        <TextField
                                          {...field}
                                          fullWidth
                                          inputProps={{
                                            autoComplete: 'off'
                                          }}
                                          size='small'
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
                                      placeholderText='Chọn thời gian'
                                      dateFormat='dd/MM/yyyy'
                                    />
                                  )}
                                </Field>
                              )}
                            </Grid>
                            <Grid item xs={12} md={4} lg={4}>
                              {phase.status === 'STARTED' && phase.isChangeStatus === false && (
                                <FormControl>
                                <TextField size='small' value={format(new Date(phase.end), 'dd/MM/yyyy')} disabled label="Ngày kết thúc (dự kiến)"/>
                                </FormControl>
                              )}
                              {phase.status === 'ENDED' && phase.isChangeStatus === false && (
                                 <FormControl>
                                 <TextField size='small' value={format(new Date(phase.realEnd), 'dd/MM/yyyy')} disabled label="Ngày kết thúc"/>
                                 </FormControl>
                              )}
                               {(phase.status === 'STARTED' && phase.isChangeStatus === true) && (
                                <FormControl>
                                <TextField size='small' value={format(new Date (phase.end), 'dd/MM/yyyy')} disabled label="Ngày kết thúc (dự kiến)"/>
                                </FormControl>
                              )}   
                              {phase.status === 'ENDED' && phase.isChangeStatus === true && (
                                 <FormControl>
                                 <TextField size='small' value={format(new Date(phase.end), 'dd/MM/yyyy')} disabled label="Ngày kết thúc"/>
                                 </FormControl>
                              )} 
                              {phase.status === 'NOT_STARTED' && (
                                <Field name={`listPhases.${index}.end`}>
                                  {({ field, meta, form: { setFieldValue } }: any) => (
                                    <DatePicker
                                      {...field}
                                      customInput={
                                        <TextField
                                          {...field}
                                          size='small'
                                          fullWidth
                                          inputProps={{
                                            autoComplete: 'off'
                                          }}
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
                              )}
                            </Grid>
                            <Grid item xs={12} md={4} lg={4}>
                              <Field name={`listPhases.${index}.status`}>
                                {({ field }: any) => (
                                  <Box>
                                    {phase.status === 'NOT_STARTED' && phase.isNew === false && phase.isChangeStatus === false && (
                                      <Button
                                        variant='contained'
                                        color='info'
                                        onClick={() => {
                                          const confirmed = window.confirm(
                                            `Bạn có chắc chắn thay đổi trạng thái của giai đoạn ${index + 1} này không?`
                                          )
                                          if (confirmed) {
                                          formikRef.current?.setFieldValue(field.name, 'STARTED')
                                          formikRef.current?.setFieldValue(`listPhases.${index}.isChangeStatus`, true)
                                          }
                                        }}
                                      >
                                        Bắt Đầu
                                      </Button>
                                    )}

                                    {phase.status === 'STARTED' && phase.isChangeStatus === false && (
                                      <Button
                                        variant='contained'
                                        color='info'
                                        onClick={() => {
                                          const confirmed = window.confirm(
                                            `Bạn có chắc chắn thay đổi trạng thái của giai đoạn ${index + 1} này không?`
                                          )
                                          if (confirmed) {
                                          formikRef.current?.setFieldValue(field.name, 'ENDED')
                                          formikRef.current?.setFieldValue(`listPhases.${index}.isChangeStatus`, true)
                                          }
                                         
                                        }}
                                      >
                                        Kết thúc
                                      </Button>
                                    )}
                                    {phase.isChangeStatus === true && phase.status === 'STARTED' && (
                                      <Chip
                                        icon={<CheckCircleOutlineOutlinedIcon />}
                                        size='medium'
                                        sx={{ p: 5 }}
                                        label={'Bắt Đầu'}
                                        color='success'
                                      />
                                    )}
                                    {phase.isChangeStatus === true && phase.status === 'ENDED' && (
                                      <Chip
                                        icon={<CheckCircleOutlineOutlinedIcon />}
                                        size='medium'
                                        sx={{ p: 5 }}
                                        label={'Kết thúc'}
                                        color='info'
                                      />
                                    )}
                                    {phase.isChangeStatus === false && phase.status === 'ENDED' && (
                                      <Chip
                                        icon={<CheckCircleOutlineOutlinedIcon />}
                                        size='medium'
                                        sx={{ p: 5 }}
                                        label={'Kết thúc'}
                                        color='info'
                                      />
                                    )}
                                  </Box>
                                )}
                              </Field>
                            </Grid>

                        {phase.status === "NOT_STARTED" &&  
                        <Grid item xs={12} md={12} lg={12}>
                              {' '}
                              <Button
                                variant='outlined'
                                color='error'
                                endIcon={<DeleteForeverOutlinedIcon />}
                                onClick={() => {
                                  const confirmed = window.confirm(
                                    `Bạn có chắc chắn xóa giai đoạn ${index + 1} này không?`
                                  )
                                  if (confirmed) {
                                    if (phase.isNew === false) {
                                      handleDeletePhase(phase.id)
                                    }
                                    remove(index)
                                  }
                                }}
                              >
                                Xóa
                              </Button>
                            </Grid>
                            }
                          </Grid>
                        </Grid>
                      ))}
                    </Grid>

                    <Button
                      type='button'
                      variant='outlined'
                      color='info'
                      sx={{ mb: 10, mt: 5 }}
                      onClick={() =>
                        push({
                          name: '',
                          start: null,
                          end: null,
                          status: 'NOT_STARTED',
                          isNew: true,
                          isChangeStatus: false
                        })
                      }
                    >
                      Thêm mới
                    </Button>
                  </>
                )}
              </FieldArray>
              </Box>
              <Stack direction={'row'} justifyContent={'space-between'} spacing={5} sx={{ mb: 10 }}>
                <Button fullWidth type='submit' color='info' variant='contained' disabled={loading}>
                  Nộp biểu mẫu
                </Button>
              </Stack>
              </Stack>
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

export default ActivityPhases

