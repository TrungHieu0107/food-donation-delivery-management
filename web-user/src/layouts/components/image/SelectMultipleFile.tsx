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

const Label = styled(Typography)<TypographyProps>(() => ({
  textAlign: 'left',
  fontWeight: 550
}))

export interface SelectImageProps {
  formProp: FieldProps
  title: string
}

const FileView = (props: { file: File; index: number; handleRemoveItem: (index: number) => void }) => {
  const { file, index, handleRemoveItem } = props
  const [hover, setHover] = useState<boolean>(false)

  return (
    <Card
      key={index}
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
          backgroundColor: '#96969691',
          borderRadius: '6px'
        }}
      >
        <Grid container justifyContent={'center'} alignItems={'center'} gap={3}>
          <Button
            color='secondary'
            variant='contained'
            size='small'
            sx={{
                borderRadius: '50%',
                p: 0
            }}
            onClick={() => {
              handleRemoveItem(index)
            }}
          >
            <IconButton>
              <TrashCan />
            </IconButton>
          </Button>
        </Grid>
      </Box>
    </Card>
  )
}

export default function SelectMultipleFile(props: SelectImageProps) {
  const { field, form, meta }: FieldProps = props.formProp
  const { title } = props

  const [fileSrc, setFileSrc] = useState<string[]>([])

  const handleRemoveItem = (index: number) => {
    form.setFieldValue(
      field.name,
      field.value?.filter((_: any, i: number) => {
        return index !== i
      })
    )
    setFileSrc([
      ...fileSrc.filter((_, i) => {
        return index !== i
      })
    ])
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Label>{title}</Label>
      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 3 }}>
        {fileSrc.map((_, index) => (
          <FileView key={index} file={field.value[0]} index={index} handleRemoveItem={handleRemoveItem} />
        ))}
      </Box>
      <Box display={'flex'} flexDirection={'column'} width={400}>
        <Typography variant='body2' sx={{ marginTop: 5, color: 'black' }}>
          Chọn tối đa 5 hình. Kích thước nhỏ hơn 10MB
        </Typography>
        <Box display={'flex'} flexDirection={'row'} gap={3} justifyContent={'center'}>
          {fileSrc.length > 0 && (
            <Button
              color='error'
              sx={{ ml: 3 }}
              onClick={() => {
                setFileSrc([])
                form.setFieldValue(field.name, [])
              }}
            >
              Xóa
            </Button>
          )}
          <Button
            component='label'
            variant='contained'
            htmlFor={field.name}
            startIcon={<PictureInPictureBottomRight />}
          >
            Chọn tài liệu
            <input
              value={''}
              multiple
              hidden
              type='file'
              id={field.name}
              accept='.doc, .docx, .pdf'
              onChange={event => {
                console.log(field.value)
                const files = event.currentTarget.files
                if (files) {
                  let updatedImgSrcArray: string[] = [...fileSrc]
                  const len = files.length
                  if (len + fileSrc.length > 5) {
                    toast.error('Chỉ được chọn 5 tài liệu.')
                    form.setFieldError(field.name, 'Chỉ được chọn 5 tài liệu.')

                    return
                  }
                  const listFile: File[] = []
                  for (let i = 0; i < len; i++) {
                    if (files[i].size / 1048576 > 10) {
                      toast.error('Kích thước tài liệu tối đa là 10MB')

                      return
                    }
                    const reader = new FileReader()
                    reader.onload = () => {
                      updatedImgSrcArray = [...updatedImgSrcArray, reader.result as string]
                      if (i === len - 1) {
                        setFileSrc(updatedImgSrcArray)
                      }
                    }
                    listFile.push(files[i])
                    console.log(files[i])

                    reader.readAsDataURL(files[i])
                  }

                  form.setFieldValue(field.name, [...field.value, listFile])
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
