import {
	Box,
	Button,
	Card,
	CardContent,
	CardMedia,
	FormHelperText,
	Grid,
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
import { generateUUID } from 'src/@core/layouts/utils'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

const Label = styled(Typography)<TypographyProps>(() => ({
	textAlign: 'left',
	fontWeight: 550
}))

export interface SelectOneFileProps {
	formProp: FieldProps
	title: string
}

const FileView = (props: { file: File; handleRemoveItem: () => void }) => {
	const { file, handleRemoveItem } = props
	const [hover, setHover] = useState<boolean>(false)

	return (
		<Card
			sx={{
				width: 'fit-content',
				position: 'relative'
			}}
			onMouseOver={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
		>
			<CardMedia
				component='img'
				image='/images/avatars/folder.png'
				alt='File'
				sx={{
					height: '200px',
					width: 'auto'
				}}
			/>
			<CardContent>
				<Typography>{file.name}</Typography>
			</CardContent>
			<Box
				display={hover ? 'flex' : 'none'}
				justifyContent={'center'}
				sx={{
					position: 'absolute',
					top: 0,
					bottom: 0,
					left: 0,
					right: 0,
					backgroundColor: (theme) => hexToRGBA(theme.palette.grey[400], 0.5),
					borderRadius: '6px'
				}}
			>
				<Grid container justifyContent={'center'} alignItems={'center'} gap={3}>
					<IconButton
						sx={{
							'&.MuiIconButton-root:hover': {
								backgroundColor: (theme) => `${theme.palette.error[theme.palette.mode]} !important`
							}
						}}
						onClick={() => {
							handleRemoveItem()
						}}
					>
						<TrashCan
							sx={{
								color: 'white'
							}}
						/>
					</IconButton>
				</Grid>
			</Box>
		</Card>
	)
}

export default function SelectOneFile(props: SelectOneFileProps) {
	const { field, form, meta }: FieldProps = props.formProp
	const { title } = props

	const [fileSrc, setFileSrc] = useState<string>()
	const key = field?.name || `select-file-${generateUUID()}`

	React.useEffect(() => {
		if (field.value) {
			const reader = new FileReader()
			reader.onload = () => {
				setFileSrc(reader.result as string)
			}
			reader.readAsDataURL(field.value)
		}
	}, [field.value])

	const handleRemoveItem = () => {
		form.setFieldValue(field.name, null)
		setFileSrc(undefined)
	}

	return (
		<Box sx={{ mt: 3 }}>
			<Label>{title}</Label>
			<Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 3 }}>
				{fileSrc && <FileView file={field.value} handleRemoveItem={handleRemoveItem} />}
			</Box>
			<Box display={'flex'} flexDirection={'column'} width={400}>
				<Typography variant='body2' sx={{ marginTop: 5, color: 'black' }}>
					Kích thước nhỏ hơn 10MB
				</Typography>
				<Box display={'flex'} flexDirection={'row'} gap={3} justifyContent={'center'}>
					{fileSrc ? (
						<Button
							color='error'
							sx={{ ml: 3 }}
							onClick={() => {
								setFileSrc('')
								form.setFieldValue(field.name, null)
							}}
						>
							Xóa
						</Button>
					) : null}
					<Button
						component='label'
						variant='contained'
						htmlFor={key}
						startIcon={<PictureInPictureBottomRight />}
					>
						Chọn tài liệu
						<input
							value={''}
							multiple
							hidden
							type='file'
							id={key}
							accept='.doc, .docx, .pdf'
							onChange={(event) => {
								console.log(field.value)
								const files = event.currentTarget.files
								if (files) {
									const len = files.length
									if (len > 1) {
										toast.error('Chỉ được chọn 1 tài liệu.')
										form.setFieldError(field.name, 'Chỉ được chọn 1 tài liệu.')

										return
									}
									if (files[0].size / 1048576 > 10) {
										toast.error('Kích thước tài liệu tối đa là 10MB')

										return
									}

									form.setFieldValue(field.name, files[0])
								}
							}}
						/>
					</Button>
				</Box>
				{meta.touched && meta.error && <FormHelperText error={true}>{meta.error}</FormHelperText>}
			</Box>
		</Box>
	)
}
