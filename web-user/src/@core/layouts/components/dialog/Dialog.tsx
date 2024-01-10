import { Dialog, DialogProps, Typography } from '@mui/material'
import * as React from 'react'
import { TransitionProps } from '@mui/material/transitions'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Slide from '@mui/material/Slide'
import PerfectScrollbar from 'react-perfect-scrollbar'

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} />
})

export interface DialogCustomProps extends DialogProps {
  content: React.ReactNode
  actionTitle?: React.ReactNode
  handleClose: (value?: any) => void
  open: boolean
  title: string
  action: React.ReactNode
  width?: number
  height?: number
}

export default function DialogCustom(props: DialogCustomProps) {
  const { content, actionTitle, handleClose, open, title, action, width, height, ...dialogProps } = props

  return (
    <Dialog
      {...dialogProps}
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby='alert-dialog-slide-description'
      sx={{
        p: 10,
        '& .MuiDialog-paper': {
          width: width ?? 'auto',
          maxWidth: '80vw',
          height: 'auto',
          maxHeight: '80vh'
        }
      }}
    >
      <DialogTitle>
        <Typography variant='inherit' fontWeight={600}>
          {title}
        </Typography>
        {actionTitle}
      </DialogTitle>
      <DialogContent
        id='alert-dialog-slide-description'
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          height: `${height}px !important` ?? 'auto',
          padding: '20px'
        }}
      >
        <PerfectScrollbar>{content}</PerfectScrollbar>
      </DialogContent>
      <DialogActions
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 3
        }}
      >
        {action}
      </DialogActions>
    </Dialog>
  )
}
