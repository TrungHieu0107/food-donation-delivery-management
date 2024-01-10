import { Grid, Typography, TypographyProps, styled } from '@mui/material'
import { LatLngExpression } from 'leaflet'
import { useState } from 'react'
import GetLocationDialog from 'src/layouts/components/popup-get-location/PopUpGetLocation'
import { UserModel } from 'src/models/User'

export interface DonatedRequestInformationViewProps {
  profile: UserModel
  handleChangeProfile: (profile: UserModel) => void
}

const TRow = styled('tr')(() => ({
  verticalAlign: 'top',
  padding: '10px'
}))

const Label = styled(Typography)<TypographyProps>(() => ({
  textAlign: 'left',
  fontWeight: 550
}))

export default function DonatedRequestInformationView({
  profile,
  handleChangeProfile
}: DonatedRequestInformationViewProps) {
  const [currentLocation, setCurrentLocation] = useState<LatLngExpression>()

  const handleChangeCurrentAddress = (value: UserModel) => {
    handleChangeProfile({
      ...profile,
      address: value.address,
      location: value.location
    })
  }

  return (
    <table>
      <thead>
        <tr>
          <td
            style={{
              width: '200px',
              minWidth: '100px'
            }}
          ></td>
          <td
            style={{
              minWidth: '200px'
            }}
          ></td>
        </tr>
      </thead>
      <tbody>
        <TRow>
          <td>
            <Label>Người quyên góp</Label>
          </td>
          <td>
            <Typography textAlign={'left'} ml={3} width={'100%'}>
              {profile.name ?? '_'}
            </Typography>
          </td>
        </TRow>
        <TRow>
          <td>
            <Label>Số điện thoại</Label>
          </td>
          <td>
            <Typography textAlign={'left'} ml={3}>
              {profile.phone ?? '_'}
            </Typography>
          </td>
        </TRow>
        <TRow>
          <td>
            <Label>Thông tin liên lạc khác</Label>
          </td>
          <td>
            <Typography textAlign={'left'} ml={3}>
              {profile.email ?? '_'}
            </Typography>
          </td>
        </TRow>
        <TRow>
          <td>
            <Label>Địa chỉ quyên góp</Label>
          </td>
          <td>
            <Grid container justifyContent={'space-between'}>
              <Grid item p={0}>
                <Typography textAlign={'left'} ml={3}>
                  {profile.address}
                </Typography>
              </Grid>
              <Grid item mx={3} p={0}>
                <GetLocationDialog
                  buttonProps={{
                    size: 'small',
                    sx: {
                      p: 0,
                      textTransform: 'none'
                    },
                    variant: 'text'
                  }}
                  textButton='Điều chỉnh'
                  handleChangeAddress={handleChangeCurrentAddress}
                  setLatlng={setCurrentLocation}
                  location={currentLocation}
                />
              </Grid>
            </Grid>
          </td>
        </TRow>
      </tbody>
    </table>
  )
}
