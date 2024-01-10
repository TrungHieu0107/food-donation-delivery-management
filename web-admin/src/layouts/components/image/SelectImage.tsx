import { Box, Button, Card, CardMedia, FormHelperText, Typography, TypographyProps, styled } from '@mui/material'
import { FieldProps } from 'formik'
import { PictureInPictureBottomRight } from 'mdi-material-ui'
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
              width: 'fit-content'
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
              onError={({ currentTarget }: any) => {
                currentTarget.onerror = null
                currentTarget.src = '/images/cards/paypal.png'
              }}
            />
          </Card>
        ))}
      </Box>
      <Box display={'flex'} flexDirection={'column'} width={400}>
        <Typography variant='body2' sx={{ marginTop: 5, color: 'black' }}>
          Allowed PNG or JPEG. Max size of 800K.
        </Typography>
        <Box display={'flex'} flexDirection={'row'} gap={3} justifyContent={'center'}>
          {imgSrc.length > 0 && (
            <Button
              color='error'            
              sx={{ ml: 3 }}
              onClick={() => {
                setImgSrc([])
                form.setFieldValue(field.name, [])
              }}
            >
              Xóa
            </Button>
          )}
          <Button component='label'  color="info" variant='contained' htmlFor='mainImage' startIcon={<PictureInPictureBottomRight />}>
            Chọn hình
            <input
              value={''}
              multiple
              hidden
              type='file'
              id='mainImage'
              accept='image/png, image/jpeg'
              onChange={event => {
                console.log(field.value)
                const files = event.currentTarget.files
                if (files) {
                  let updatedImgSrcArray: string[] = []
                  const len = files.length
                  if (len > 5) {
                    toast.error('Chỉ được chọn 5 hỉnh.')
                    form.setFieldError(field.name, 'Chỉ được chọn 5 hỉnh.')

                    return
                  }
                  const listFile: File[] = []
                  for (let i = 0; i < len; i++) {
                    const reader = new FileReader()
                    reader.onload = () => {
                      updatedImgSrcArray = [...updatedImgSrcArray, reader.result as string]
                      if (i === len - 1) {
                        setImgSrc(updatedImgSrcArray)
                      }
                    }
                    listFile.push(files[i])
                    reader.readAsDataURL(files[i])
                  }

                  // const reader = new FileReader()

                  // reader.onload = () => {
                  //   setImgSrc([...imgSrc, reader.result as string])
                  // }

                  // if (files) {
                  //   reader.readAsDataURL(files[0])
                  //   setImage(files)
                  // }

                  form.setFieldValue(field.name, listFile)
                }
              }}
            />
          </Button>
        </Box>
        {meta.touched && !!meta.error && <FormHelperText error={true}>{meta.error}</FormHelperText>}
      </Box>
    </Box>
  )
}
