import { Box, Chip, Grid, Paper, Typography } from '@mui/material'
import * as React from 'react'
import { DeliveryRequestModelForList } from 'src/models/DeliveryRequest'
import GpsFixedIcon from '@mui/icons-material/GpsFixed'
import { statusDeliveryMap } from 'src/pages/van-chuyen'

export interface IDeliveryTagProps {
  data: DeliveryRequestModelForList
  isActive: boolean | undefined
  handleSelected: (value: DeliveryRequestModelForList) => void
}

export default function DeliveryTag(props: IDeliveryTagProps) {
  return (
    <Paper
      elevation={3}
      sx={{
        ...(props.isActive && {
          backgroundImage:
            'linear-gradient(to right bottom, #7869c4, #6a6ac4, #5a6bc4, #496cc3, #356dc1, #286dbe, #196ebb, #006eb8, #006db3, #006dae, #006ca9, #006ba4);'
        }),
        cursor: 'pointer',
        ':hover': {
          background:
            'linear-gradient(to right bottom, #7869c47f, #6a6ac47f, #5a6bc47f, #496cc37f, #356dc17f, #286dbe7f, #196ebb7f, #006eb87f, #006db37f, #006dae7f, #006ca97f, #006ba47f)'
        }
      }}
      onClick={() => {
        props.handleSelected(props.data)
      }}
    >
      <Box
        display='flex'
        justifyContent={'space-between'}
        flexDirection={'row'}
        sx={{
          padding: '10px !important'
        }}
      >
        <Grid container direction={'column'} flexWrap={'nowrap'}>
          <Grid item>
            <Typography
              sx={{
                ...(props.isActive && {
                  color: theme => theme.palette.common.white
                })
              }}
            >
              {' '}
              {props.data.pickUpPoint?.name}
            </Typography>
          </Grid>
          <Grid item marginTop={'3px'}>
            <Typography
              variant='caption'
              sx={{
                ...(props.isActive && {
                  color: theme => theme.palette.common.white
                }),
                verticalAlign: 'top'
              }}
            >
              <GpsFixedIcon fontSize='small' color={props.isActive ? 'error' : 'action'} />
              {props.data.pickUpPoint?.address}
            </Typography>
          </Grid>
        </Grid>
        <Grid container flexDirection={'column'} justifyContent={'space-between'} alignItems={'end'} width={'auto'}>
          {/* <Grid item display={'flex'} gap={2} alignItems={'center'}>
            <FiberManualRecordIcon
              fontSize='small'
              sx={{
                '&.MuiSvgIcon-root': {
                  fontSize: '11px !important'
                }
              }}
            />
            <Typography
              variant='caption'
              fontWeight={500}
              sx={{
                ...(props.isActive && {
                  color: theme => theme.palette.common.white
                })
              }}
            >
              {BulkyChip[getBulkyLevel(calculateCapacity(deliveryRequest.items))]}
            </Typography> */}
          {/* </Grid> */}

          <Grid item>
            <Chip
              label={
                <Typography
                  variant='caption'
                  fontWeight={500}
                  sx={{
                    color: theme => theme.palette.common.white
                  }}
                >
                  {statusDeliveryMap[props.data.status || ''].label}
                </Typography>
              }
              sx={{
                backgroundColor: statusDeliveryMap[props.data.status || ''].backgroundColor
              }}
              variant='outlined'
            ></Chip>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  )
}
