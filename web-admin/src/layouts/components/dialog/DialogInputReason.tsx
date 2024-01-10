import { Box, TextField, Typography, Grid, Button } from '@mui/material'
import * as React from 'react'
import DialogCustom from 'src/@core/layouts/components/shared-components/Dialog'
import { useState } from 'react'
import ItemTag, { ItemTagModel } from 'src/layouts/components/transfer-list/ItemTag'

export interface IDialogInputReasonProps {
  open: boolean
  handleClose: () => void
  donatedItems: ItemTagModel[]
  handleSubmit: (value: string) => void
}

export default function DialogInputReason(props: IDialogInputReasonProps) {
  const { open, handleClose, donatedItems = [], handleSubmit } = props
  const [reason, setReason] = useState<string>('')
  const [error, setError] = useState<string>('')

  return (
    <DialogCustom
      content={
        <Box
          display={'flex'}
          flexDirection={'column'}
          gap={2}
          paddingX={3}
          sx={{
            maxWidth: '1000px',
            position: 'relative'
          }}
        >
          <Typography fontWeight={550}>Bạn đã từ chối các món đồ sau: </Typography>
          <Box display={'flex'} flexWrap={'wrap'} gap={3} paddingX={3} justifyContent={'center'}>
            {donatedItems.map((item, index) => (
              <ItemTag key={index} itemData={item} />
            ))}
          </Box>
          <Box
            pt={3}
            sx={{
              position: 'sticky',
              bottom: 0,
              backgroundColor: 'white'
            }}
          >
            <Typography fontWeight={550}>Nếu đồng ý bạn hãy nhập lí do</Typography>
            <TextField
              fullWidth
              multiline
              maxRows={5}
              label='Lí do'
              placeholder='Lí do'
              value={reason}
              onChange={e => {
                setError('')
                setReason(e.target.value)
              }}
              sx={{
                mt: 2
              }}
              error={!!error}
              helperText={error}
            />
          </Box>
        </Box>
      }
      handleClose={handleClose}
      open={open}
      title={'Xác nhận'}
      actionDialog={
        <Grid container justifyContent={'center'} gap={3}>
          <Grid item>
            <Button size='small' onClick={handleClose}>
              Quay lại
            </Button>
          </Grid>
          <Grid item>
            <Button
              size='small'
              variant='contained'
              onClick={() => {
                if (!!reason) {
                  handleSubmit(reason)

                  return
                }

                setError('Hãy nhập lí do')
              }}
            >
              Đồng ý
            </Button>
          </Grid>
        </Grid>
      }
    />
  )
}
