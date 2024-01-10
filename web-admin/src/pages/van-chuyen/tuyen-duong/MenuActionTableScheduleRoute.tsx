import { Menu, MenuItem, Typography } from '@mui/material'
import * as React from 'react'
import { ScheduleRoute } from 'src/models/DeliveryRequest'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { useRouter } from 'next/router'

export interface IMenuActionTableScheduleRouteProps {
  currentSelected: ScheduleRoute | undefined
  ancholEl: Element | undefined
  handleClonseActionMenu: () => void
}

export default function MenuActionTableScheduleRoute(props: IMenuActionTableScheduleRouteProps) {
  const router = useRouter()

  return (
    <Menu
      anchorEl={props.ancholEl}
      open={!!props.ancholEl && !!props.currentSelected}
      onClose={props.handleClonseActionMenu}
      anchorOrigin= {
        {
          vertical: 'center',
          horizontal: 'center'
        }
      }
    >
      <MenuItem
        sx={{
          display: 'flex',
          gap: 2
        }}
        onClick={() => {
          router.push('/van-chuyen/tuyen-duong/chi-tiet/' + props.currentSelected?.id)
        }}
      >
        <InfoOutlinedIcon color='success' />
        <Typography fontWeight={450}>Chi tiết</Typography>
      </MenuItem>
    </Menu>
  )
}
