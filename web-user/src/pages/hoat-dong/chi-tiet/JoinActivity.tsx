'use client'

import {
	Box,
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	TextField,
	Typography
} from '@mui/material'
import { Field, Form, Formik } from 'formik'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import axiosClient from 'src/api-client/ApiClient'
import * as Yup from 'yup'

const validationSchema = Yup.object({
	description: Yup.string()
		.required('Mô tả bắt buộc có')
		.min(10, 'Mô tả ít nhất cần có 10 kí tự')
		.max(500, 'Mô tả nhiều nhất 500 kí tự'),
	roleMemberId: Yup.string().required('Vai trò tham gia bắt buộc phải có')
})

function JoinActivity() {
	const [open, setOpen] = useState(false)
	const router = useRouter()
	const [listRoles, setListRoles] = useState<any>([])
	const [loading, setLoading] = useState<boolean>(true)
	const { slug } = router.query
	const handleClickOpen = () => {
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
	}
	useEffect(() => {
		const fetchData = async () => {
			setLoading(true)
			try {
				const reponseRoles = await axiosClient.get(`/activity-roles/${slug}`)
				console.log(reponseRoles.data)
				setListRoles(reponseRoles.data || [])
			} catch (error) {
				setListRoles([])
				console.log(error)
			} finally {
				setLoading(false)
			}
		}
		if (slug) {
			fetchData()
		}
	}, [slug])

	return (
		<Box>
			<Button onClick={handleClickOpen} variant='contained' color='info'>
				Tham gia
			</Button>
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby='alert-dialog-title'
				aria-describedby='alert-dialog-description'
				sx={{
					'& .MuiPaper-root': {
						minWidth: '500px'
					}
				}}
			>
				<DialogTitle id='alert-dialog-title' sx={{ textAlign: 'center' }}>
					{'Tạo yêu cầu tham gia hoạt động'}
				</DialogTitle>
				<DialogContent>
					{listRoles?.length === 0 && <Typography align='center' color={"error"}>Hiện tại chưa thể tham gia hoạt động này vì hoạt động chưa cập nhật công việc để bạn có thể tham gia</Typography>}
					{loading === false && (
						<Formik
							initialValues={{
								description: '',
								roleMemberId: listRoles[0]?.id || ''
							}}
							validationSchema={validationSchema}
							onSubmit={async (values) => {
								try {
									const dataSubmit = { ...values, activityId: slug }
									const res: any = await axiosClient.post(`/activity-members`, dataSubmit)
									console.log(res)
									setOpen(false)
									toast.success(
										'Yêu cầu tham gia của bạn đã được chúng tôi ghi nhận. Vui lòng chờ hệ thống duyệt.'
									)
								} catch (error) {
									console.log(error)
									toast.error('Tạo yêu cầu tham gia không thành công')
								}
							}}
						>
							{({}) => (
								<Form>
									<Field name='description'>
										{({ field, meta }: any) => (
											<TextField
												{...field}
												label='Mô tả'
												multiline
												rows={3}
												error={meta.touched && !!meta.error}
												helperText={meta.touched && meta.error ? meta.error : ''}
												fullWidth
												placeholder='Nhập mô tả của bạn ở đây...'
												sx={{ mt: 5 }}
											/>
										)}
									</Field>

									<Box sx={{ mt: 5 }}>
										<FormControl sx={{ width: '100%' }}>
											<InputLabel id='demo-simple-select-label'>Chọn vai trò</InputLabel>
											<Field
												name={`roleMemberId`}
												as={Select}
												label='Chọn vai trò'
												labelId='demo-simple-select-label'
												id='demo-simple-select'
												fullWidth
											>
												{listRoles?.map((r: any) => (
													<MenuItem key={r.id} value={r.id}>
														{r.name}
													</MenuItem>
												))}
											</Field>
										</FormControl>
									</Box>
									<Button
										type='submit'
										variant='contained'
										color='info'
										fullWidth
										disabled={listRoles?.length === 0}
										sx={{ mt: 5, mb: 5 }}
									>
										Nộp
									</Button>
								</Form>
							)}
						</Formik>
					)}
				</DialogContent>
			</Dialog>
		</Box>
	)
}

export default JoinActivity
