import {
	Box,
	Button,
	Card,
	CardMedia,
	FormHelperText,
	IconButton,
	Typography,
	TypographyProps,
	styled
} from '@mui/material'
import { FieldProps } from 'formik'
import { PictureInPictureBottomRight, TrashCan } from 'mdi-material-ui'
import * as React from 'react'
import { useState } from 'react'
import { toast } from 'react-toastify'

const Label = styled(Typography)<TypographyProps>(() => ({
	textAlign: 'left',
	fontWeight: 550
}))

export interface SelectImageProps {
	formProp: FieldProps
	title: string
}

export default function SelectImageView(props: SelectImageProps) {
	const { field, form, meta }: FieldProps = props.formProp
	const { title } = props

	const [imgSrc, setImgSrc] = useState<string[]>([])

	return (
		<Box sx={{ mt: 3 }}>
			<Label>{title}</Label>
			<Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 3 }}>
				{imgSrc.map((item, index) => (
					<Card
						key={index}
						sx={{
							width: 'fit-content',
							position: 'relative'
						}}
					>
						<CardMedia
							component='img'
							image={item}
							alt='Paella dish'
							sx={{
								height: '200px',
								width: 'auto'
							}}
						/>
						<IconButton
							sx={{
								position: 'absolute',
								top: 5,
								right: 5
							}}
							onClick={() => {
								setImgSrc(imgSrc.filter((item, i) => i !== index))
                const newImage = field.value as File[]
              
								form.setFieldValue(field.name,newImage.filter((item, i) => i !== index))
							}}
						>
							<TrashCan color='error' />
						</IconButton>
					</Card>
				))}
				<Box display={'flex'} flexDirection={'row'} gap={3} justifyContent={'center'}>
					<Button
						component='label'
						variant='outlined'
						htmlFor={field.name}
						startIcon={<PictureInPictureBottomRight />}
						sx={{
							height: '200px'
						}}
					>
						Thêm hình
						<input
							value={''}
							multiple
							hidden
							type='file'
							id={field.name}
							accept='image/png, image/jpeg'
							onChange={(event) => {
								console.log(field.value)
								const files = event.currentTarget.files
								if (files) {
									const updatedImgSrcArray = [...imgSrc]
									const len = files.length + imgSrc.length
									if (len > 5) {
										toast.error('Chỉ được chọn 5 hỉnh.')
										form.setFieldError(field.name, 'Chỉ được chọn 5 hỉnh.')

										return
									}
									const listFile = field.value as File[]
									for (let i = 0; i < len; i++) {
										const reader = new FileReader()
										reader.onload = () => {
											updatedImgSrcArray.push(reader.result as string)
											if (i === len - 1) {
												setImgSrc(updatedImgSrcArray)
											}
										}
										listFile.push(files[i])
										reader.readAsDataURL(files[i])
									}

									form.setFieldValue(field.name, listFile)
								}
							}}
						/>
					</Button>
				</Box>
			</Box>
			<Box display={'flex'} flexDirection={'column'}>
				<Typography
					variant='body2'
					sx={{ marginTop: 5, color: (theme) => theme.palette.warning.light }}
				>
					<Typography
						component={'span'}
						fontWeight={550}
						sx={{
							color: (theme) => theme.palette.warning.light
						}}
					>
						Chú ý:
					</Typography>
					Chỉ được chọn hình có phần mở rộng là [.png] hoặc [.jpeg] và kích thước nhỏ hơn 10MB
				</Typography>

				{meta.touched && meta.error && <FormHelperText error={true}>{meta.error}</FormHelperText>}
			</Box>
		</Box>
	)
}
