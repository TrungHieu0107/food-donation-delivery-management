'use client'

import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { Field, FieldArray, Form, Formik, FormikProps, FormikValues } from 'formik'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import { toast } from 'react-toastify'
import axiosClient from 'src/api-client/ApiClient'
import * as Yup from 'yup'

const validationSchema = Yup.object({
  listRoles: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required('Tên vai trò bắt buộc phải có'),
      description: Yup.string().required('Mô tả cho vai trò bắt buộc phải có'),
    })
  )
})

const ActivityRoles = () => {
  const router = useRouter()
  const formikRef = useRef<FormikProps<FormikValues>>(null)
  const [initValue, setInitValue] = useState<any>()
  const { slug } = router.query
  const [loading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reponseRoles = await axiosClient.get(`/activity-roles/${slug}`)
        console.log(reponseRoles.data)
        const newData = reponseRoles.data?.map((p: any) => ({
          ...p,
          isNew: false
        }))
        console.log(newData)
        setInitValue(newData || [])
      } catch (error) {
        setInitValue([])
        console.log(error)
      }
    }
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
            listRoles: initValue
          }}
          validationSchema={validationSchema}
          onSubmit={async values => {
            //setIsLoading(true)
            console.log(values)
            const updateRoles = values.listRoles.filter((role: any) => role.isNew === false).map((role: any)=>(
              {
                id: role.id,
                name: role.name,
                description: role.description,
                isDefault: role.isDefault
              }
            ))
            const newRoles = values.listRoles.filter((role: any) => role.isNew === true).map((role: any)=>(
              {
                name: role.name,
                description: role.description,
                isDefault: role.isDefault
              }
            ))
            console.log('new', newRoles,"update", updateRoles)         

            try {
              if(updateRoles.length > 0) {
              const dataUpdate = await axiosClient.put(`/activity-roles?activityId=${slug}`, updateRoles)
              console.log(dataUpdate)
              }
              if(newRoles.length > 0) {
              const dataAdd = await axiosClient.post(`/activity-roles`, {
                activityId: slug,
                activityRoleRequests: newRoles
              }
              )
              console.log(dataAdd)
            }
              
              setIsLoading(false)
              toast.success('Cập nhật vai trò cho hoạt động thành công')
            } catch (error: any) {
              console.log('err nè: ', error)
              setIsLoading(false)
            }
          }}
        >
          {({ values }) => (
            <Form>
              <Stack direction={"column"} sx={{minHeight:"75vh"}} justifyContent={"space-between"}>
              <Box>
              <FieldArray name='listRoles'>
                {({ push, remove }: any) => (
                  <>
                    <Grid container>
                      {values.listRoles.map((role: any, index: any) => (
                        <Grid item xs={12} md={12} key={index} sx={{ mt: 5, mb: 5 }}>
                          <Typography sx={{ fontWeight: 700, mb: 5 }}>
                            Vai trò {index + 1} {role.isNew ? '( Thêm mới )' : ''}
                          </Typography>
                          <Grid container spacing={5}>
                            <Grid item xs={12} md={12} lg={12}>
                              <Field name={`listRoles.${index}.name`}>
                                {({ field, meta }: any) => (
                                  <TextField
                                    {...field}
                                    label='Tên vai trò'
                                    fullWidth
                                    error={meta.touched && !!meta.error}
                                    helperText={meta.touched && !!meta.error ? meta.error : ''}
                                  />
                                )}
                              </Field>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12}>
                              <Field name={`listRoles.${index}.description`}>
                                {({ field, meta }: any) => (
                                  <TextField
                                    {...field}
                                    label='Mô tả'
                                    multiline
                                    rows={5}
                                    fullWidth
                                    error={meta.touched && !!meta.error}
                                    helperText={meta.touched && !!meta.error ? meta.error : ''}
                                  />
                                )}
                              </Field>
                            </Grid>
                     {/* {role.isNew === false &&   <Grid item xs={6} md={6} lg={6}>
                              <FormControl>
                                <InputLabel id='status_of_role'>Trạng thái</InputLabel>
                                <Field
                                  name={`listRoles.${index}.status`}
                                  as={Select}
                                  labelId='status_of_role'
                                  id='demo-simple-select'
                                  label='Trạng thái'
                                  size='small'
                                  defaultValue={`listRoles.${index}.status`}
                                >
                                  <MenuItem value='ACTIVE'>Hoạt động</MenuItem>
                                  <MenuItem value='INACTIVE'>Ngưng hoạt động</MenuItem>
                                </Field>                               
                              </FormControl>
                            </Grid>
                              } */}
                            <Grid item xs={6} md={6} lg={6}>
                              <Field name={`listRoles.${index}.isDefault`}>
                                {({ field, form: { setFieldValue } }: any) => (
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        {...field}
                                        checked={field.value}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                          console.log(field.value)
                                          setFieldValue(field.name, event.target.checked)
                                        }}
                                      />
                                    }
                                    label='Mặc định'
                                  />
                                )}
                              </Field>
                            </Grid>

                            {role.isNew && (
                              <Grid item xs={12} md={6} lg={6}>
                                {' '}
                                <Button
                                  variant='outlined'
                                  color='error'
                                  endIcon={<DeleteForeverOutlinedIcon />}
                                  onClick={() => {
                                  const confirmed = window.confirm(`Bạn có chắc chắn xóa vai trò này không?`)
                                  if (confirmed) {
                                  remove(index)
                                  }
                                  }}
                                >
                                  Xóa
                                </Button>
                              </Grid>
                            )}
                          </Grid>
                        </Grid>
                      ))}
                    </Grid>

                    <Button
                      type='button'
                      variant='outlined'
                      color='info'
                      sx={{ mb: 10, mt: 5 }}
                      onClick={() => push(
                        { name: '', 
                        description: '', 
                        isDefault: false, 

                        // status: "ACTIVE", 
                        isNew: true 
                      })}
                    >
                      Thêm mới
                    </Button>
                  </>
                )}
              </FieldArray>
              </Box>
              <Stack direction={'row'} justifyContent={'space-between'} spacing={5} sx={{ mb: 10 }}>
                <Button fullWidth type='submit' color='info' variant='contained' disabled={loading}>
                  Lưu thay đổi
                </Button>
              </Stack>
              </Stack>
            </Form>
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

export default ActivityRoles


