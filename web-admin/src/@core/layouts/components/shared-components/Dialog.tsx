import { Dialog, DialogProps, IconButton, Typography } from '@mui/material'
import * as React from 'react'
import { TransitionProps } from '@mui/material/transitions'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Slide from '@mui/material/Slide'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Close } from 'mdi-material-ui'

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
  actionDialog?: React.ReactNode
  width?: number
  height?: number
}

export default function DialogCustom(props: DialogCustomProps) {
  const { content, actionTitle, handleClose, open, title, actionDialog, width, height, ...dialogProps } = props

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
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle
        sx={{
          position: 'relative'
        }}
      >
        <Typography variant='inherit' fontWeight={600}>
          {title}
        </Typography>
        {actionTitle}
        <IconButton
        onClick={() => {
          handleClose()
        }}
          sx={{
            display: 'flex',
            position: 'absolute',
            top: 10,
            right: 10
          }}
        >
          <Close />
        </IconButton>
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
      {actionDialog && (
        <DialogActions
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 3
          }}
        >
          {actionDialog}
        </DialogActions>
      )}
    </Dialog>
  )
}
