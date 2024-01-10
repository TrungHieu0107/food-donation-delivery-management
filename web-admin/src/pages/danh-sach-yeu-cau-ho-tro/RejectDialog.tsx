import { Box, Button, TextField } from '@mui/material'
import { useRouter } from 'next/router'
import * as React from 'react'
import { toast } from 'react-toastify'
import DialogCustom from 'src/@core/layouts/components/shared-components/Dialog'
import { AidRequestAPI } from 'src/api-client/AidRequest'
import { CommonRepsonseModel } from 'src/models/common/CommonResponseModel'

export interface IRejectAidRequestDialogProps {
  aidRequestId: string
  open: boolean
  handleClose?: (value: boolean) => void
}

export default function RejectAidRequestDialog(props: IRejectAidRequestDialogProps) {
  const [isOpen, setIsOpen] = React.useState<boolean>(props.open)
  const [reason, setReason] = React.useState<string>()
  const [isError, setIsError] = React.useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)
  const router = useRouter()

  React.useEffect(() => {
    setIsOpen(props.open)
  }, [props.open])

  const handleClose = () => {
    setIsOpen(false)
    setIsError(false)
    setReason('')
    props.handleClose && props.handleClose(false)
  }

  const handleSubmit = async () => {
    setIsError(true)
    setIsSubmitting(true)
    if (!reason) {
      setIsSubmitting(false)

      return
    }

    try {
      const res = await AidRequestAPI.rejectAidRequest(props.aidRequestId, reason)
      const commonReponse = new CommonRepsonseModel<any>(res)
      toast.success(commonReponse.message)
      router.push('/danh-sach-yeu-cau-ho-tro')
    } catch (error) {
      console.log(error)
    } finally {
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
      handleClose={() => {
        handleClose()
      }}
      open={isOpen}
      title={'Từ chối yêu cầu quyên góp'}
      actionDialog={
        <>
          <Button
            onClick={() => {
              handleClose()
            }}
            color='info'
          >
            Đóng
          </Button>
          <Button variant='contained' color='primary' onClick={handleSubmit}>
            Xác nhận
          </Button>
        </>
      }
    />
  )
}
