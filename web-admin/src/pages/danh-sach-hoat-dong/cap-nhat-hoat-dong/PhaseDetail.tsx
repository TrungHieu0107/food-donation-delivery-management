import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined'
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'
import {
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Card,
  CardContent,
  CardHeader,
  Collapse,
  Typography
} from '@mui/material'
import { format } from 'date-fns'
import { Field, FieldArray, Form, Formik, FormikProps, FormikValues } from 'formik'
import { useRouter } from 'next/router'
import * as React from 'react'
import { toast } from 'react-toastify'
import axiosClient from 'src/api-client/ApiClient'
import * as Yup from 'yup'

const validationSchema = Yup.object({
  listTasks: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required('Tên công việc bắt buộc phải có'),
      description: Yup.string().required('Mô tả công việc bắt buộc phải có')
    })
  )
})

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 200
    }
  }
}

export default function PhaseDetail({ phase, roles }: any) {
  const [expanded, setExpanded] = React.useState(false)
  const formikRef = React.useRef<FormikProps<FormikValues>>(null)
  const router = useRouter()
  const { slug } = router.query
  const [disabled, setDisabled] = React.useState<any>(false)
  const [listTasks, setListTasks] = React.useState<any>()

  const [listRolesChosen, setListRolesChoses] = React.useState<object[]>([])
  const roleForChoose = roles?.map((r: any) => ({
    description: r?.description,
    id: r?.id,
    name: r?.name,
    status: r?.status
  }))

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }
  const handleDeleteTask = async (id: any) => {
    try {
      const response = await axiosClient.delete(`/activity-tasks/${id}`)
      console.log(response)
      fetchData()
      toast.success('Deleted successfully.')
    } catch (error) {
      console.log(error);
    }
  }
  const fetchData = async () => {
    try {
      const response = await axiosClient.get(`/activity-tasks/?activityId=${slug}&phaseId=${phase.id}`)
      console.log(response.data)
      if (response.data) {
        const newData = response.data?.map((t: any) => ({
          ...t,
          isNew: false,
          isChangeStatus: false
        }))
        setListTasks(newData || [])
      } else {
        setListTasks(response.data || [])
      }
    } catch (error) {
      console.log(error)
      toast.error('Lỗi tải dữ liệu từ server')
    }
  }
  React.useEffect(() => {
    if (slug) {
      fetchData()
    }
  }, [slug])

  if (phase && roles) {
    return (
      <Card sx={{ mt: 10, mb: 10 }}>
        <CardHeader />
        <CardContent>
          <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
            <Box>
              <Typography>Tên giai đoạn: {phase?.name}</Typography>

              {phase.status === 'NOT_STARTED' && (
                <Typography>
                  Thời gian bắt đầu (dự kiến): {format(new Date(phase.estimatedStartDate), 'dd/MM/yyyy')}
                </Typography>
              )}
              {phase.status === 'STARTED' && (
                <Typography>Thời gian bắt đầu: {format(new Date(phase.startDate), 'dd/MM/yyyy')}</Typography>
              )}
              {phase.status === 'ENDED' && (
                <Typography>Thời gian bắt đầu: {format(new Date(phase.startDate), 'dd/MM/yyyy')}</Typography>
              )}
              {phase.status === 'NOT_STARTED' && (
                <Typography>
                  Thời gian kết thúc (dự kiến): {format(new Date(phase.estimatedEndDate), 'dd/MM/yyyy')}
                </Typography>
              )}
              {phase.status === 'STARTED' && (
                <Typography>
                  Thời gian kết thúc (dự kiến): {format(new Date(phase.estimatedEndDate), 'dd/MM/yyyy')}
                </Typography>
              )}
              {phase.status === 'ENDED' && phase.endDate && (
                <Typography>Thời gian kết thúc: {format(new Date(phase.endDate), 'dd/MM/yyyy')}</Typography>
              )}
              {phase.status === 'NOT_STARTED' && <Chip label='Chưa bắt đầu' color='primary' sx={{ mt: 3, p: 3 }} />}
              {phase.status === 'STARTED' && <Chip label='Đã bắt đầu' color='success' sx={{ mt: 3, p: 3 }} />}
              {phase.status === 'ENDED' && <Chip label='Đã kết thúc' color='info' sx={{ mt: 3, p: 3 }} />}
            </Box>
            <Box>
              {expanded === false && (
                <Button
                  variant='contained'
                  color='info'
                  endIcon={<ExpandMoreOutlinedIcon />}
                  onClick={handleExpandClick}
                >
                  Chi tiết
                </Button>
              )}
              {expanded === true && (
                <Button
                  variant='contained'
                  color='info'
                  endIcon={<ExpandLessOutlinedIcon />}
                  onClick={handleExpandClick}
                >
                  Thu gọn
                </Button>
              )}
            </Box>
          </Stack>
        </CardContent>
        <Collapse in={expanded} timeout='auto' unmountOnExit>
          <CardContent>
            <Formik
              innerRef={formikRef}
              initialValues={{
                listTasks: listTasks
              }}
              validationSchema={validationSchema}
              onSubmit={async values => {
                //setIsLoading(true)
                console.log(values)

                const updatePhase = values.listTasks
                  .filter((p: any) => p.isNew === false)
                  .map((p: any) => ({
                    id: p.id,
                    name: p.name,
                    phaseId: phase.id,
                    description: p.description,
                    activityRoleIds: p.activityRole.map((r: any) => r.id),
                    status:
                      p.isChangeStatus === false ? null : p.isChangeStatus === true && p.status === 'ACTIVE' ? 0 : 1
                  }))

                const newPhase = values.listTasks
                  .filter((phase: any) => phase.isNew === true)
                  .map((phase: any) => ({
                    name: phase.name,
                    description: phase.description,
                    activityRoleIds: phase.activityRole.map((r: any) => r.id)
                  }))

                console.log('new', newPhase, 'update', updatePhase)

                try {
                  if (updatePhase.length > 0) {
                    const dataUpdate = await axiosClient.put(`/activity-tasks`, updatePhase)
                    console.log(dataUpdate)
                  }
                  if (newPhase.length > 0) {
                    const dataAdd = await axiosClient.post(`/activity-tasks`, {
                      phaseId: phase.id,
                      taskRequests: newPhase
                    })
                    console.log(dataAdd)
                  }

                  setDisabled(false)
                  toast.success('Cập nhật vai trò cho hoạt động thành công')
                } catch (error: any) {
                  console.log('err nè: ', error)
                  setDisabled(false)
                }
              }}
            >
              {({ values }) => (
                <Form>
                  <FieldArray name='listTasks'>
                    {({ push, remove }: any) => (
                      <>
                        <Grid container>
                          {values.listTasks?.map((task: any, index: any) => (
                            <Grid item xs={12} md={12} key={index} sx={{ mt: 5, mb: 5 }}>
                              <Typography sx={{ fontWeight: 700, mb: 2 }}>Công việc {index + 1}</Typography>
                              <Grid container spacing={5}>
                                <Grid item xs={12} md={12} lg={12}>
                                  <Field name={`listTasks.${index}.name`}>
                                    {({ field, meta }: any) => (
                                      <TextField
                                        {...field}
                                        label='Tên công việc'
                                        disabled={task.status === 'ACTIVE' || task.status === 'DONE' ? true : false}
                                        fullWidth
                                        error={meta.touched && !!meta.error}
                                        helperText={meta.touched && !!meta.error ? meta.error : ''}
                                      />
                                    )}
                                  </Field>
                                </Grid>
                                <Grid item xs={12} md={12} lg={12}>
                                  <Field name={`listTasks.${index}.description`}>
                                    {({ field, meta }: any) => (
                                      <TextField
                                        {...field}
                                        label='Mô tả công việc'
                                        disabled={task.status === 'ACTIVE' || task.status === 'DONE' ? true : false}
                                        multiline
                                        rows={5}
                                        fullWidth
                                        error={meta.touched && !!meta.error}
                                        helperText={meta.touched && !!meta.error ? meta.error : ''}
                                      />
                                    )}
                                  </Field>
                                </Grid>

                                <Grid item xs={12} md={6} lg={6}>
                                  <FormControl sx={{ width: '100%' }}>
                                    <InputLabel id='roles_of_task'>Vai trò tham gia</InputLabel>
                                    <Select
                                    
                                      //  name={`listTasks.${index}.activityRole`}
                                      //  as={Select}
                                      value={listRolesChosen}
                                      fullWidth
                                      labelId='roles_of_task'
                                      label='Vai trò tham gia'
                                      size='small'
                                      multiple
                                      input={<OutlinedInput label='Tag' />}
                                      onChange={(event: SelectChangeEvent<typeof listRolesChosen>) => {
                                        const {
                                          target: { value }
                                        } = event
                                        if (typeof value !== 'string') {
                                          setListRolesChoses([])
                                          value?.map((r: any) => {
                                            const check = task.activityRole.find((c: any) => c.id === r.id)
                                            if (check) {
                                              const newValue = task.activityRole.filter((role: any) => role.id !== r.id)
                                              formikRef.current?.setFieldValue(
                                                `listTasks.${index}.activityRole`,
                                                newValue
                                              )
                                            } else {
                                              const newValue = [...task.activityRole, ...value]
                                              formikRef.current?.setFieldValue(
                                                `listTasks.${index}.activityRole`,
                                                newValue
                                              )
                                            }
                                          })
                                        }
                                      }}
                                      renderValue={(selected: any) => {
                                        const valueToRender = selected.map((s: any) => s?.name)

                                        return valueToRender.join(', ')
                                      }}
                                      MenuProps={MenuProps}
                                    >
                                      {roleForChoose?.map((r: any) => (
                                        <MenuItem key={r.id} value={r}>
                                          <Checkbox checked={task.activityRole.some((item: any) => item.id === r.id)} />
                                          <ListItemText primary={r?.name} />
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6} lg={6}>
                                  <Field name={`listTasks.${index}.status`}>
                                    {({ field }: any) => (
                                      <Box>
                                        {task.status === 'NOT_STARTED' &&
                                          task.isNew === false &&
                                          task.isChangeStatus === false &&
                                          phase?.status !== 'ENDED' && (
                                            <Button
                                              variant='contained'
                                              color='info'
                                              onClick={() => {
                                                const confirmed = window.confirm(
                                                  `Bạn có chắc chắn thay đổi trạng thái của công việc ${
                                                    index + 1
                                                  } này không?`
                                                )
                                                if (confirmed) {
                                                  formikRef.current?.setFieldValue(field.name, 'ACTIVE')
                                                  formikRef.current?.setFieldValue(
                                                    `listTasks.${index}.isChangeStatus`,
                                                    true
                                                  )
                                                }
                                              }}
                                            >
                                              Bắt Đầu
                                            </Button>
                                          )}
                                        {task.status === 'NOT_STARTED' && phase?.status === 'ENDED' && (
                                          <Button variant='contained' color='info' disabled>
                                            Chưa bắt đầu
                                          </Button>
                                        )}
                                        {task.status === 'ACTIVE' && phase?.status === 'ENDED' && (
                                          <Button variant='contained' color='info' disabled>
                                            Đang diễn ra
                                          </Button>
                                        )}
                                        {task.status === 'ACTIVE' &&
                                          task.isChangeStatus === false &&
                                          phase?.status !== 'ENDED' &&
                                          phase?.status !== 'ENDED' && (
                                            <Button
                                              variant='contained'
                                              color='info'
                                              onClick={() => {
                                                const confirmed = window.confirm(
                                                  `Bạn có chắc chắn thay đổi trạng thái của công việc ${
                                                    index + 1
                                                  } này không?`
                                                )
                                                if (confirmed) {
                                                  formikRef.current?.setFieldValue(field.name, 'DONE')
                                                  formikRef.current?.setFieldValue(
                                                    `listTasks.${index}.isChangeStatus`,
                                                    true
                                                  )
                                                }
                                              }}
                                            >
                                              Kết thúc
                                            </Button>
                                          )}
                                        {task.isChangeStatus === true && task.status === 'ACTIVE' && (
                                          <Chip
                                            icon={<CheckCircleOutlineOutlinedIcon />}
                                            size='medium'
                                            sx={{ p: 5 }}
                                            label={'Đang diễn ra'}
                                            color='success'
                                          />
                                        )}
                                        {task.isChangeStatus === true && task.status === 'DONE' && (
                                          <Chip
                                            icon={<CheckCircleOutlineOutlinedIcon />}
                                            size='medium'
                                            sx={{ p: 5 }}
                                            label={'Kết thúc'}
                                            color='info'
                                          />
                                        )}
                                        {task.isChangeStatus === false && task.status === 'DONE' && (
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
                                <Grid item xs={12} md={12} lg={12}>
                                  {' '}
                                  {phase?.status !== 'ENDED' && (
                                    <Button
                                      variant='outlined'
                                      color='error'
                                      endIcon={<DeleteForeverOutlinedIcon />}
                                      onClick={() => {
                                        const confirmed = window.confirm(
                                          `Bạn có chắc chắn xóa công việc ${index + 1} này không?`
                                        )
                                        if (confirmed) {
                                          remove(index)
                                          handleDeleteTask(task.id)
                                        }
                                      }}
                                    >
                                      Xóa
                                    </Button>
                                  )}
                                </Grid>
                              </Grid>
                            </Grid>
                          ))}
                        </Grid>

                        {phase?.status !== 'ENDED' && (
                          <Button
                            type='button'
                            variant='outlined'
                            color='info'
                            sx={{ mb: 10, mt: 5 }}
                            onClick={() =>
                              push({
                                name: '',
                                description: '',
                                activityRole: [],
                                status: 0,
                                isNew: true,
                                isChangeStatus: false
                              })
                            }
                          >
                            Thêm mới
                          </Button>
                        )}
                      </>
                    )}
                  </FieldArray>
                  {phase?.status !== 'ENDED' && (
                    <Button
                      sx={{ mb: 10 }}
                      fullWidth
                      type='submit'
                      color='info'
                      variant='contained'
                      disabled={disabled}
                    >
                      Lưu với {phase?.name}
                    </Button>
                  )}
                </Form>
              )}
            </Formik>
          </CardContent>
        </Collapse>
      </Card>
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
