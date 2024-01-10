import {
	Avatar,
	Box,
	Button,
	FormHelperText,
	Typography,
	TypographyProps,
	styled
} from '@mui/material'
import { FieldProps } from 'formik'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { generateUUID } from 'src/@core/layouts/utils'

const Label = styled(Typography)<TypographyProps>(() => ({
	textAlign: 'left',
	fontWeight: 550
}))

export interface SelectImageProps {
	formProp?: FieldProps
	title?: string
	avatarSrc?: string
	size?: number
	handleChangeImage?: (value: File) => void
}

export default function UpdateAvatar(props: SelectImageProps) {
	const { field, form, meta } = props.formProp || {}
	const { title, formProp, avatarSrc, handleChangeImage } = props
	const size = props.size || 200

	const [imgSrc, setImgSrc] = useState<string>(avatarSrc || '')
	const [id, setId] = useState<string>('')

	useEffect(() => {
		if (field && field.value) {
			if (typeof field.value === 'string') {
				setImgSrc(field.value)

				return
			}
			const reader = new FileReader()
			reader.onload = () => {
				setImgSrc(reader.result as string)
			}
			reader.readAsDataURL(field.value)
		}
	}, [field])

	useEffect(() => {
		console.log(avatarSrc)
		setImgSrc(avatarSrc || '')
	}, [avatarSrc])

	useEffect(() => {
		console.log({ imgSrc })
	}, [imgSrc])

	useEffect(() => {
		setId('update-avatar' + generateUUID())
	}, [])

	return (
		<Box>
			{title && <Label>{title}</Label>}
			<Box
				display={'flex'}
				flexDirection={'row'}
				gap={3}
				justifyContent={'center'}
				borderRadius={'50%'}
			>
				<Button
					color='secondary'
					component='label'
					variant='contained'
					htmlFor={id}
					sx={{
						height: `${size}px`,
						width: `${size}px`,
						borderRadius: '50%',
						padding: 0,
						position: 'relative'
					}}
				>
					<Avatar
						src={imgSrc}
						sx={{
							height: `${size}px`,
							width: `${size}px`
						}}
					/>
					<Box
						sx={{
							height: `${size}px`,
							width: `${size}px`,
							borderRadius: '50%',
							position: 'absolute',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							background: (theme) => hexToRGBA(theme.palette.grey[100], 0.3)
						}}
					>
						<CloudUploadIcon
							sx={{
								width: 75,
								height: 75
							}}
						/>
					</Box>

					<input
						hidden
						type='file'
						id={id}
						accept='image/png, image/jpeg'
						onChange={(event) => {
							const files = event.currentTarget.files
							if (files) {
								formProp && form && field && form.setFieldValue(field.name, files[0])

								handleChangeImage && handleChangeImage(files[0])
							}
						}}
					/>
				</Button>
			</Box>
			{meta?.touched && meta?.error && <FormHelperText error={true}>{meta?.error}</FormHelperText>}
		</Box>
	)
}
