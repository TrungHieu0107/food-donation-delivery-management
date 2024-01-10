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

const Label = styled(Typography)<TypographyProps>(() => ({
  textAlign: 'left',
  fontWeight: 550
}))

export interface SelectImageProps {
  formProp: FieldProps
  title: string
}

export default function SelectAvatar(props: SelectImageProps) {
  const { field, form, meta }: FieldProps = props.formProp
  const { title } = props

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
    <Box >
      <Label>{title}</Label>
      <Box display={'flex'} flexDirection={'row'} gap={3} justifyContent={'center'} borderRadius={'50%'}>
        <Button
          color='secondary'
          component='label'
          variant='contained'
          htmlFor={props.title.replaceAll(' ', '-')}
          sx={{
            height: '200px',
            width: '200px',
            borderRadius: '50%',
            padding: 0
          }}
        >
          {imgSrc ? (
            <Avatar
              src={imgSrc}
              sx={{
                height: '200px',
                width: '200px',
                borderRadius: '50%'
              }}
            />
          ) : (
            <CloudUploadIcon
              sx={{
                width: 75,
                height: 75
              }}
            />
          )}

          <input
            value={''}
            hidden
            type='file'
            id={props.title.replaceAll(' ', '-')}
            accept='image/png, image/jpeg'
            onChange={event => {
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
  )
}
