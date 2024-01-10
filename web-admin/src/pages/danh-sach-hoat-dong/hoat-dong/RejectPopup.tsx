import { Box, Button, TextField } from '@mui/material'
import * as React from 'react'
import { toast } from 'react-toastify'
import DialogCustom from 'src/@core/layouts/components/shared-components/Dialog'
import axiosClient from 'src/api-client/ApiClient'

export default function RejectVolunteerDialog(props: any) {
  const [reason, setReason] = React.useState<string>()
  const [isError, setIsError] = React.useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const handleClose = () => {
    props.setIsOpen(false)
    setIsError(false)
    setReason('')
  }

  const handleSubmit = async () => {
    setIsError(true)
    setIsSubmitting(true)
    if (!reason) {
      setIsSubmitting(false)

      return
    }

    try {
      const res: any = await axiosClient.put(`/activity-members/${props.id}`, {
        isAccept: false,
        reason: reason
      })
      console.log(res)

      toast.success(res.message)
      props.fetchData()
    } catch (error) {
      console.log(error)

      toast.error('Thao tác không thành công')
    } finally {
      props.setIsOpen(false)
      setIsSubmitting(false)
    }
  }

  return (
    <DialogCustom
      content={
        <Box
          p={3}
          sx={{
            minWidth: 400
          }}
        >
          {props.isOpen && (
            <TextField
              label='Lí do từ chối'
              placeholder='Lí do từ chối'
              fullWidth
              multiline
              minRows={3}
              maxRows={5}
              error={isError && !reason}
              helperText={isError && !reason ? 'Hãy nhập lí do từ chối.' : ''}
              onChange={e => {
                !isSubmitting && setReason(e.target.value)
              }}
              disabled={isSubmitting}
            />
          )}
        </Box>
      }
      handleClose={() => {
        handleClose()
      }}
      open={props.isOpen}
      title={'Từ chối tình nguyện viên tham gia hoạt động'}
      actionDialog={
        <>
          <Button variant='contained' color='primary' onClick={handleSubmit}>
            Xác nhận
          </Button>
          <Button
            onClick={() => {
              handleClose()
            }}
            color='info'
          >
            Đóng
          </Button>
        </>
      }
    />
  )
}
