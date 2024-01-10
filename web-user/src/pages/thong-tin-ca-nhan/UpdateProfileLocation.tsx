import * as React from 'react'
import { toast } from 'react-toastify'
import { Typography } from '@mui/material'
import { LatLngExpression } from 'leaflet'

import GetLocationDialog from 'src/layouts/components/popup-get-location/PopUpGetLocation'
import { UserModel } from 'src/models/User'
import { KEY } from 'src/common/Keys'

export interface IUpdateProfileLocationProps {
	address: string
	location: LatLngExpression | undefined
	updateLocation: (address: string, location: LatLngExpression) => void
}

export default function UpdateProfileLocation({
	address,
	location,
	updateLocation
}: IUpdateProfileLocationProps) {
	const [currentLocation, setCurrentLocation] = React.useState<LatLngExpression>(location || [0, 0])

	const handleChangeLocation = async (value: UserModel) => {
		if (value.address && value.location) {
			updateLocation(value.address, value.location)
		} else {
			toast.warn('Lấy địa chỉ không thành công')
		}
	}

	return (
		<React.Fragment>
			<Typography>
				{`Hoạt động tại ${address || KEY.DEFAULT_VALUE}`}
				<GetLocationDialog
					location={currentLocation}
					handleChangeAddress={handleChangeLocation}
					setLatlng={setCurrentLocation}
					clickNode={
						<Typography
							component={'span'}
							fontWeight={550}
							variant='body2'
							sx={{
								color: (theme) => theme.palette.primary[theme.palette.mode],
								'&:hover': {
									textDecoration: 'underline',
									cursor: 'pointer'
								}
							}}
						>
							Cập nhật
						</Typography>
					}
				/>
			</Typography>
		</React.Fragment>
	)
}
