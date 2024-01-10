import { Avatar, Box, Button, Grid, Typography } from '@mui/material'
import DialogCustom from 'src/@core/layouts/components/shared-components/Dialog'
import { CharityUnitModel } from 'src/models/Charity'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { LatLngExpression } from 'leaflet'
import { CharityStatus } from '../TableListCharities'
import DetailHistoryCharityUnit from './DetailHistoryDialog'
import DisplayFile from 'src/layouts/components/file/DisplayFile'

export interface ICharityUnitDetailDialogProps {
  charityUnit: CharityUnitModel
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
              <Grid container spacing={3}>
                <Grid item>
                  <Typography variant='h6' fontWeight={550} textAlign={'left'} sx={{ mt: 5 }}>
                    {charityUnit?.name}
                  </Typography>
                </Grid>
                <Grid item>
                  <Box sx={{ mt: 5 }}>{CharityStatus[charityUnit?.status ?? '']}</Box>
                </Grid>
              </Grid>
              <Grid container>
                <Typography fontWeight={550} textAlign={'left'}>
                  {`Email : `}
                </Typography>
                <Typography textAlign={'left'} pl={2}>
                  {charityUnit?.email ?? '_'}
                </Typography>
              </Grid>
              <Grid container>
                <Typography fontWeight={550} textAlign={'left'}>
                  {`Số điện thoại : `}
                </Typography>
                <Typography textAlign={'left'} pl={2}>
                  {charityUnit?.phone ?? '_'}
                </Typography>
              </Grid>
              <Grid container>
                <Typography fontWeight={550} textAlign={'left'}>
                  {`Địa chỉ : `}
                </Typography>
                <Typography textAlign={'left'} pl={2}>
                  {charityUnit?.address ?? '_'}
                </Typography>
              </Grid>
              <Grid container>
                <DetailHistoryCharityUnit id={charityUnit?.id} />
              </Grid>
            </Grid>
          </Grid>
          <Box pt={3} paddingX={5}>
            <Typography fontWeight={550} textAlign={'left'}>
              {`Mô tả : `}
            </Typography>
            <Typography textAlign={'left'} pl={2}>
              {' '}
              {charityUnit?.description ?? '_'}
            </Typography>
          </Box>
          {location && (
            <Box width={'100%'} paddingX={5} marginTop={2}>
              <Typography fontWeight={550} textAlign={'left'}>
                {`Vị trí : `}
              </Typography>
              <DetailLocation selectedPosition={location} />
            </Box>
          )}
          <Box sx={{
            paddingY: '10px'
          }}> 
            <DisplayFile fileLink={charityUnit?.legalDocuments || ''} />
          </Box>
        </Grid>
      }
      handleClose={handleClose}
      open={open}
      title={'Thông tin chi tiết đơn vị'}
      actionDialog={
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
