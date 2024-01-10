import { Box, Button, Card, CardMedia, FormHelperText, Typography, TypographyProps, styled } from '@mui/material'
import { FieldProps } from 'formik'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { useEffect, useState } from 'react'
import { generateUUID } from 'src/@core/layouts/utils'

const Label = styled(Typography)<TypographyProps>(() => ({
  textAlign: 'left',
  fontWeight: 550
}))

export interface SelectImageProps {
  formProp: FieldProps
  title: string
}

export default function SelectOneImageView(props: SelectImageProps) {
  const { field, form, meta }: FieldProps = props.formProp
  const { title } = props
  const key = field?.name || `select-image${generateUUID()}`

  const [imgSrc, setImgSrc] = useState<string>()

  useEffect(() => {
    if (field.value) {
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
  }, [field.value])

  return (
		<Box sx={{ mt: 3 }}>
			<Label>{title}</Label>
			<Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 3 }}>
				{imgSrc && (
					<Card
						sx={{
							width: 'fit-content'
						}}
					>
						<CardMedia
							component='img'
							image={imgSrc}
							alt='Paella dish'
							sx={{
								height: '200px',
								width: 'auto'
							}}
						/>
					</Card>
				)}
			</Box>
			<Box display={'flex'} flexDirection={'column'} width={400}>
				<Typography variant='body2' sx={{ marginTop: 5, color: 'black' }}>
					Allowed PNG or JPEG. Max size of 800K.
				</Typography>
				<Box display={'flex'} flexDirection={'row'} gap={3} justifyContent={'center'}>
					<Button
						color='secondary'
						component='label'
						variant='contained'
						htmlFor={key}
						startIcon={<CloudUploadIcon />}
					>
						Chọn hình
						<input
							value={''}
							hidden
							type='file'
							id={key}
							accept='image/png, image/jpeg'
							onChange={(event) => {
								const files = event.currentTarget.files
								if (files) {
									const reader = new FileReader()
									reader.onload = () => {
										setImgSrc(reader.result as string)
									}
									if (files) {
										reader.readAsDataURL(files[0])
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
