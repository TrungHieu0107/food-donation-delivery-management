import * as React from 'react'
import DialogCustom from '../dialog/Dialog'
import { Button, Grid, Typography } from '@mui/material'
import { CollaboratorAPI } from 'src/api-client/Collaborator'
import { toast } from 'react-toastify'
import { CommonRepsonseModel } from 'src/models/common/CommonResponseModel'
import BackDrop from 'src/layouts/components/loading/BackDrop'
import { useSession } from 'next-auth/react'

export interface IConfirmChangeDeliveryStatusProps {
  status: string
  dialogOpen: boolean
  onClose: () => void
  updateCallback?: () => void
}

export default function ConfirmChangeDeliveryStatus({
  status,
  dialogOpen,
  onClose,
  updateCallback
}: IConfirmChangeDeliveryStatusProps) {
  const [isOpen, setIsOpen] = React.useState<boolean>(dialogOpen)
  const [messge, setMessage] = React.useState<string>('')
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)
  const {data: session, update} = useSession()

  React.useEffect(() => {
    setIsOpen(dialogOpen)
    setMessage(
      status === 'ACTIVE'
        ? 'Bạn có muốn chuyển sang trạng thái bận rộn? Khi đó, bạn sẽ không nhận đơn vận chuyển nữa?'
        : 'Bạn có muốn chuyển sang trạng thái rãnh? Khi đó, Bạn sẽ có thể nhận được các yêu cầu vận chuyển từ hệ thống'
    )
  }, [dialogOpen, status])

  const handleClose = () => {
    setIsOpen(false)
    onClose()
  }

  const handleAccept = async () => {
    try {
      setIsSubmitting(true)
      const response = await CollaboratorAPI.handleChangeStatus(status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE')
      toast.success(new CommonRepsonseModel<any>(response).message)
      const newSession = {
        ...session,
        user: {
          ...session?.user,
          collaboratorStatus: status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
        }
      }

      updateCallback && updateCallback()

      await update(newSession)
      handleClose()
    } catch (error) {
      console.log(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <React.Fragment>
      <DialogCustom
        content={<Typography fontWeight={550}>{messge}</Typography>}
        handleClose={handleClose}
        open={isOpen}
        title={'Xác nhận'}
        action={
          <Grid container justifyContent={'center'} spacing={3}>
            <Grid item>
              <Button
                fullWidth
                color='secondary'
                variant='text'
                onClick={() => {
                  handleClose()
                }}
              >
                Không
              </Button>
            </Grid>
            <Grid item>
              <Button
                fullWidth
                variant='contained'
                onClick={() => {
                  handleAccept()
                }}
              >
                Đồng ý
              </Button>
            </Grid>
          </Grid>
        }
      />
      <BackDrop open={isSubmitting} />
    </React.Fragment>
  )
}
