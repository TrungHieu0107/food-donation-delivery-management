import { Avatar, Box, Button, Grid, Typography } from '@mui/material'
import { LatLngExpression } from 'leaflet'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import DialogCustom from 'src/@core/layouts/components/dialog/Dialog'
import { CharityStatus } from './[id]'

export interface ICharityUnitDetailDialogProps {
  charityUnit: any
  open: boolean
  handleClose: () => void
}

const DetailLocation = dynamic(() => import('src/layouts/components/map/DetailCurrentLocation'), { ssr: false })

export default function CharityUnitDetailDialog(props: ICharityUnitDetailDialogProps) {
  const { charityUnit, open, handleClose } = props
  const [location, setLocation] = useState<LatLngExpression>()

  useEffect(() => {
    if (charityUnit?.location && charityUnit?.location !== undefined && charityUnit?.location !== '_') {
      console.log(charityUnit?.location)

      const lat: number = Number.parseFloat(charityUnit?.location?.toString().split(',')[0] || '0')
      const lng: number = Number.parseFloat(charityUnit?.location?.toString().split(',')[1] || '0')
      lat === 0 && lng === 0 ? setLocation(undefined) : setLocation([lat, lng] as LatLngExpression)
    }
  }, [charityUnit])

  return (
    <DialogCustom
      content={
        <Grid
          container
          direction={'column'}
          sx={{
            marginTop: '20px',
            paddingX: '10px'
          }}
        >
          <Grid item container flexDirection={'row'} spacing={5}>
            <Grid
              item
              sx={{
                padding: 0
              }}
            >
              <Avatar
                src={charityUnit?.image}
                sx={{
                  height: 200,
                  width: 200
                }}
              />
            </Grid>
            <Grid item xl lg md sm xs display={'flex'} gap={2} direction={'column'}> 
              <Grid container spacing={3} sx={{mt: 2}}>
                <Grid item>
                  <Typography variant='h6' fontWeight={550} textAlign={'left'}>
                    {charityUnit?.name}
                  </Typography>
                </Grid>
                <Grid item>
                  {CharityStatus[charityUnit?.status ?? '']}
                </Grid>
              </Grid>
              <Grid container sx={{mb: 3}}>
                <Typography fontWeight={550} textAlign={'left'} >
                  {`Email : `}
                </Typography>
                <Typography textAlign={'left'} pl={2}>
                  {charityUnit?.email ?? '_'}
                </Typography>
              </Grid>
              <Grid container sx={{mb: 3}}>
                <Typography fontWeight={550} textAlign={'left'} >
                  {`Số điện thoại : `}
                </Typography>
                <Typography textAlign={'left'} pl={2}>
                  {charityUnit?.phone ?? '_'}
                </Typography>
              </Grid>
              <Grid container sx={{mb: 3}}>
                <Typography fontWeight={550} textAlign={'left'} >
                  {`Địa chỉ : `}
                </Typography>
                <Typography textAlign={'left'} pl={2}>
                  {charityUnit?.address ?? '_'}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Box pt={3} paddingX={5}>
            <Typography fontWeight={550} textAlign={'left'}>
              {`Mô tả : `}
            </Typography>
            <Typography textAlign={'left'} pl={5}>
              
              {charityUnit?.description ?? '_'}
            </Typography>
          </Box>
          {location && (
            <Box width={'100%'} paddingX={5} marginTop={5}>
              <Typography fontWeight={550} textAlign={'left'}>
                {`Vị trí : `}
              </Typography>
              <DetailLocation selectedPosition={location} />
            </Box>
          )}
        </Grid>
      }
      handleClose={handleClose}
      open={open}
      title={'Thông tin chi tiết đơn vị'}
      action={
        <>
          <Button
            onClick={() => {
              handleClose()
            }}
            color='secondary'
          >
            Đóng
          </Button>
        </>
      }
    />
  )
}
