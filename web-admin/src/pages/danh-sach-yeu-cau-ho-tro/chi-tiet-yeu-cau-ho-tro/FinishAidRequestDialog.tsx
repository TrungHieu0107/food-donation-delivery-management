import { Box, Button, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { Fragment, useState } from 'react'
import { toast } from 'react-toastify'
import DialogCustom from 'src/@core/layouts/components/shared-components/Dialog'
import { AidRequestAPI } from 'src/api-client/AidRequest'
import BackDrop from 'src/layouts/components/loading/BackDrop'
import { CommonRepsonseModel } from 'src/models/common/CommonResponseModel'

export interface IFinishAidRequestDialogProps {
  id: string
}

export default function FinishAidRequestDialog(props: IFinishAidRequestDialogProps) {
  const { id } = props

  const [open, setOpen] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const router = useRouter()

  const handleFinishDeliveryRequest = async () => {
    try {
      setIsSubmitting(true)
      const response = await AidRequestAPI.finishDeliveryRequest(id)
      toast.success(new CommonRepsonseModel<any>(response).message)
      setOpen(false)
      router.push('/danh-sach-yeu-cau-ho-tro')
    } catch (error) {
      console.log(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Fragment>
      <Button
        variant='contained'
        onClick={() => {
          setOpen(true)
        }}
      >
        Kết thúc cho đồ
      </Button>
      <DialogCustom
        content={
          <Box padding={'10px'} display={'flex'} flexDirection={'column'} gap={3}>
            <Typography fontWeight={500}>
              Bạn có chắc chắn muốn kết thúc hỗ trợ cho yêu cầu hỗ trợ này không?{' '}
            </Typography>
            <Box display={'flex'} justifyContent={'center'} gap={5}>
              <Button disabled={isSubmitting}>Không</Button>
              <Button
                onClick={() => {
                  handleFinishDeliveryRequest()
                }}
                variant='contained'
                color='success'
                disabled={isSubmitting}
              >
                Đồng ý
              </Button>
            </Box>
          </Box>
        }
        handleClose={handleClose}
        open={open}
        title={'Xác nhận'}
      />
      {isSubmitting && <BackDrop open />}
    </Fragment>
  )
}
