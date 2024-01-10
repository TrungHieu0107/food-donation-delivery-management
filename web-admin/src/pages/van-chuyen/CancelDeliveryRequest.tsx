import { Box, Button, TextField, Typography } from '@mui/material'
import { Fragment, useState } from 'react'
import { toast } from 'react-toastify'
import useSession from 'src/@core/hooks/useSession'
import DialogCustom from 'src/@core/layouts/components/shared-components/Dialog'
import { DeliveryRequestAPI } from 'src/api-client/DeliveryRequest'
import { CommonRepsonseModel } from 'src/models/common/CommonResponseModel'

export interface ICancelDeliveryRequestDialogProps {
  id: string
  fetchDetail: () => void
  fetchData: () => void
}

export default function CancelDeliveryRequestDialog(props: ICancelDeliveryRequestDialogProps) {
  const { id, fetchData } = props
  const {session}: any = useSession()
  const [open, setOpen] = useState<boolean>(false)
  const [reason, setReason] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [isCheck, setIsCheck] = useState<boolean>(false)

  const handleClose = () => {
    setOpen(false)
    setReason('')
  }

  const handleSubmit = async () => {
    if (!!error) return

    try {
      const response = await DeliveryRequestAPI.cancelDeliveryRequest(id, reason)
      toast.success(new CommonRepsonseModel<any>(response).message)
      handleClose()
      fetchData()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Fragment>
     {session?.user.role === "BRANCH_ADMIN" &&  <Button color='error' onClick={() => setOpen(true)} variant='contained' size='small'>
        Hủy
      </Button>}
      <DialogCustom
        content={
          <Box padding={3}>
            <Typography padding={'5px'}>Bạn có chắc chắn muốn hủy yêu cầu vận chuyển này không?. Nếu đồng ý hãy nhập lí do.</Typography>
            <TextField
              multiline
              fullWidth
              value={reason}
              onChange={e => {
                const value = e.target.value || ''
                if (value.length > 500) return

                if (value.length < 10) {
                  setError('Hãy nhấp ít nhất 10 kí tự.')
                } else {
                  setError('')
                }
                setReason(value)
              }}
              minRows={3}
              onBlur={() => setIsCheck(true)}
              maxRows={5}
              error={isCheck && !!error}
              helperText={isCheck ? error : ''}
              label='Lí do hủy'
              sx={{
                mt:'5px'
              }}
            />
          </Box>
        }
        handleClose={handleClose}
        open={open}
        title={'Nhập lí do hủy'}
        width={500}
        actionDialog={
          <Box display={'flex'} gap={5} justifyContent={'flex-end'}>
            <Button onClick={handleClose} color='info'>
              Hủy
            </Button>
            <Button variant='contained' onClick={handleSubmit}>
              Gửi
            </Button>
          </Box>
        }
      />
    </Fragment>
  )
}
