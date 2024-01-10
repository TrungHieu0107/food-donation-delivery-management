import { Box, Button, Grid, TextField } from '@mui/material'
import { Field, FieldProps, Form, Formik, FormikProps } from 'formik'
import { Fragment, useRef, useState } from 'react'
import DialogCustom from 'src/@core/layouts/components/dialog/Dialog'
import * as Yup from 'yup'
import BackDrop from '../../loading/BackDrop'
import { DeleiveryRequestAPI } from 'src/api-client/DeliveryRequest'
import { toast } from 'react-toastify'
import { CommonRepsonseModel } from 'src/models'

const validationSchema = Yup.object<{
	title: string
	content: string
}>().shape({
	title: Yup.string().required('Hãy nhập mục đích bạn muốn báo cáo.'),
	content: Yup.string()
		.min(10, 'Nội dung báo cáo phải có ít nhất 10 kí tự')
		.max(150, 'Nội dung không được vượt quá 150 kí tự')
		.required('Hãy nhập nội dung chi tiết bạn muốn báo cáo.')
})

export interface IReportDialogProps {
	id: string
}

interface FormValue {
	title: string
	content: string
}

export default function ReportDialog(props: IReportDialogProps) {
	const { id } = props
	const [dialogOpen, setDialogOpen] = useState<boolean>(false)
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
	const formikRef = useRef<FormikProps<FormValue>>(null)

	const handleClose = () => {
		setDialogOpen(false)
		formikRef.current?.resetForm()
	}

	const handleSubmit = async (value: FormValue) => {
		console.log({ value, id })
		try {
			setIsSubmitting(true)

			const response = await DeleiveryRequestAPI.reportDeliveryRequest(
				id,
				value.title,
				value.content
			)

			toast.success(new CommonRepsonseModel<any>(response).message)
			handleClose()
		} catch (error) {
			console.log(error)
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<Fragment>
			<Button
				size='small'
				variant='contained'
				color='warning'
				onClick={() => {
					setDialogOpen(true)
				}}
			>
				Báo cáo
			</Button>
			<DialogCustom
				content={
					<Formik
						innerRef={formikRef}
						initialValues={
							{
								title: '',
								content: ''
							} as FormValue
						}
						validationSchema={validationSchema}
						onSubmit={handleSubmit}
					>
						{() => {
							return (
								<Form>
									<Grid container spacing={2} flexDirection={'column'} padding={5}>
										<Grid item>
											<Field name='title'>
												{({ field, meta }: FieldProps) => {
													return (
														<TextField
															label='Lí do báo cáo'
															autoComplete='off'
															InputProps={{
																autoComplete: 'off'
															}}
															fullWidth
															{...field}
															error={meta.touched && !!meta.error}
															helperText={meta.touched && !!meta.error ? meta.error : ''}
														/>
													)
												}}
											</Field>
										</Grid>
										<Grid item>
											<Field name='content'>
												{({ field, meta }: FieldProps) => {
													return (
														<TextField
															{...field}
															fullWidth
															InputProps={{
																autoComplete: 'off'
															}}
															autoComplete='off'
															label='Nội dung chi tiết'
															multiline
															minRows={3}
															maxRows={5}
															error={meta.touched && !!meta.error}
															helperText={meta.touched && !!meta.error ? meta.error : ''}
														/>
													)
												}}
											</Field>
										</Grid>
									</Grid>
								</Form>
							)
						}}
					</Formik>
				}
				handleClose={handleClose}
				open={dialogOpen}
				title={'Báo cáo'}
				action={
					<Box display={'flex'} gap={5}>
						<Button onClick={handleClose}>Đóng</Button>
						<Button
							variant='contained'
							color='success'
							onClick={() => {
								formikRef.current?.values && handleSubmit(formikRef.current?.values)
							}}
						>
							Gửi
						</Button>
					</Box>
				}
				width={700}
			/>
			{isSubmitting && <BackDrop open />}
		</Fragment>
	)
}
