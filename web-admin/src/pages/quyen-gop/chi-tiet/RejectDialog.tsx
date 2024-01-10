import { Box, Button, ButtonProps, TextField } from '@mui/material'
import { useRouter } from 'next/router'
import * as React from 'react'
import { toast } from 'react-toastify'
import DialogCustom from 'src/@core/layouts/components/shared-components/Dialog'
import { DonatedRequestAPI } from 'src/api-client/DonatedRequest'
import { CommonRepsonseModel } from 'src/models/common/CommonResponseModel'

export interface IRejectDialogProps extends ButtonProps {
  donatedId: string
}

export default function RejectDialog(props: IRejectDialogProps) {
  const buttonProps = { ...props } as ButtonProps

  const [isOpen, setIsOpen] = React.useState<boolean>(false)
  const [reason, setReason] = React.useState<string>()
  const [isError, setIsError] = React.useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)
  const router = useRouter()

  const handleClose = () => {
    setIsOpen(false)
    setIsError(false)
    setReason('')
  }

  const handleSubmit = () => {
    setIsError(true)
    setIsSubmitting(true)
    if (!reason) {
      setIsSubmitting(false)

      return
    }

    DonatedRequestAPI.rejectDonatedRequest({ id: props.donatedId, rejectingReason: reason })
      .then(res => {
        router.push('/quyen-gop')
        const commonReponse = new CommonRepsonseModel<any>(res)
        toast.success(commonReponse.message)
      })
      .catch(err => {
        console.log(err)
      })
      .then(() => {
        setIsSubmitting(false)
      })
  }

  return (
    <>
      <Button
        {...buttonProps}
        onClick={() => {
          setIsOpen(true)
        }}
      >
        Từ chối
      </Button>
      <DialogCustom
        content={
          <Box
            p={3}
            sx={{
              minWidth: 400
            }}
          >
            {isOpen && (
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
        handleClose={handleClose}
        open={isOpen}
        title={'Từ chối yêu cầu quyên góp'}
        actionDialog={
          <>
            <Button onClick={handleClose} color='secondary'>
              Đóng
            </Button>
            <Button variant='contained' color='primary' onClick={handleSubmit}>
              Xác nhận
            </Button>
          </>
        }
      />
    </>
  )
}
