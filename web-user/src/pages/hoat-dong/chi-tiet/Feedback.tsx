'use client'

import {
	Box,
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	Rating,
	Stack,
	TextField,
	Typography
} from '@mui/material'
import { Field, Form, Formik } from 'formik'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import axiosClient from 'src/api-client/ApiClient'
import * as Yup from 'yup'

const validationSchema = Yup.object({
	content: Yup.string()
		.required('Nội dung phản hồi bắt buộc có')
		.min(5, 'Nội dung phản hồi ít nhất cần có 5 kí tự')
		.max(500, 'Nội dung phản hồi nhiều nhất 500 kí tự')
})

function FeedbackActivity() {
	const [open, setOpen] = useState(false)
	const router = useRouter()
	const [dataFeedBack, setDataFeedBack] = useState<any>()
	const {status} = useSession()
	const { slug } = router.query
	const handleClickOpen = () => {
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
	}

	const fetchData = async () => {
		try {
			const reponse = await axiosClient.get(`/activity-feedbacks/activity?activityId=${slug}`)
			console.log(reponse.data)
			setDataFeedBack(reponse.data || null)
		} catch (error) {
			setDataFeedBack(null)
			console.log(error)
		}
	}

	useEffect(() => {
		if (slug && status === 'authenticated') {
			fetchData()
		}
	}, [slug, status])

	return (
		<Box>
			<Button onClick={handleClickOpen} color='secondary' variant='contained'>
				Phản hồi
			</Button>
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby='alert-dialog-title'
				aria-describedby='alert-dialog-description'
				sx={{
					'& .MuiPaper-root': {
						minWidth: '600px'
					}
				}}
			>
				<DialogTitle id='alert-dialog-title' sx={{ textAlign: 'center' }}>
					{'Gửi phản hồi về hoạt động'}
				</DialogTitle>
				<DialogContent>
					{dataFeedBack ? (
						<Formik
							initialValues={{
								content: dataFeedBack.content,
								rating: dataFeedBack.rating
							}}
							validationSchema={validationSchema}
							onSubmit={async (values) => {
								try {
									const dataSubmit = { ...values, activityId: slug }
									const res: any = await axiosClient.put(`/activity-feedbacks`, dataSubmit)
									console.log(res)
									setOpen(false)
									toast.success('Phản hồi của bạn đã được hệ thống ghi nhận')
									fetchData()
								} catch (error) {
									console.log(error)
									toast.error('Phản hồi không thành công')
								}
							}}
						>
							{({}) => (
								<Form>
									<Field name='content'>
										{({ field, meta }: any) => (
											<TextField
												{...field}
												label='Nội dung'
												multiline
												rows={3}
												error={meta.touched && !!meta.error}
												helperText={meta.touched && meta.error ? meta.error : ''}
												fullWidth
												placeholder='Vui lòng nhập phản hồi của bạn...'
												sx={{ mt: 5 }}
											/>
										)}
									</Field>
									<Stack direction={'row'} spacing={3} sx={{ mt: 3 }}>
										<Typography component='legend'>Đánh giá</Typography>
										<Field name='rating'>
											{({ field, form }: any) => (
												<Rating
													{...field}
													name='simple-controlled'
													onChange={(event, newValue) => {
														form.setFieldValue('rating', newValue)
													}}
												/>
											)}
										</Field>
									</Stack>
									<Button
										type='submit'
										variant='contained'
										color='info'
										fullWidth
										disabled={dataFeedBack?.length === 0}
										sx={{ mt: 7 }}
									>
										Gửi đánh giá
									</Button>
								</Form>
							)}
						</Formik>
					) : (
						<Typography align='center' sx={{ fontWeight: 550 }} color={'error'}>
							Hiện tại bạn chưa thể phản hồi với hoạt động này
						</Typography>
					)}
				</DialogContent>
			</Dialog>
		</Box>
	)
}

export default FeedbackActivity
