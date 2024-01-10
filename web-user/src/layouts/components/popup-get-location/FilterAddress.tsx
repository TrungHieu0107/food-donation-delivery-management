import {
	FormControl,
	Autocomplete,
	TextField,
	Button,
	Typography,
	Skeleton,
	Grid
} from '@mui/material'
import axios from 'axios'
import { LatLngExpression } from 'leaflet'
import { Magnify } from 'mdi-material-ui'
import * as React from 'react'
import { AddressAPI } from 'src/api-client/Address'
import { KEY } from 'src/common/Keys'
import { UserModel } from 'src/models/User'
import { AddressModel, DistrictModel, ProvinceModel, WardModel } from 'src/models/common/Address'

export interface IFilterAddressProps {
	setIsSelected: (value: boolean) => void
	setSelectedPosition: (value: LatLngExpression | undefined) => void
	selectedPosition: LatLngExpression | undefined
	setCenter: (value: LatLngExpression) => void
	setCurrentUser: (value: UserModel) => void
	currentUser: UserModel
	addressSearching: AddressModel | undefined
	setAddressSearching: (value: AddressModel) => void
	listMarkers: any[]
	setListMarkers : (value: any[]) => void
}

export default function FilterAddress(props: IFilterAddressProps) {
	const {
		setIsSelected,
		setSelectedPosition,
		selectedPosition,
		setCenter,
		setCurrentUser,
		currentUser,
		addressSearching,
		setAddressSearching,
		listMarkers,
		setListMarkers
	} = props

	const [provinces, setProvinces] = React.useState<ProvinceModel[]>([])
	const [districts, setDistricts] = React.useState<DistrictModel[]>([])
	const [wards, setWards] = React.useState<WardModel[]>([])
	const [isLoading, setIsLoading] = React.useState<boolean>(false)

	const getAllProvince = async () => {
		setProvinces(await AddressAPI.getAllProvince())
	}

	const getDistrictOfProvince = async (province: ProvinceModel) => {
		province?.code && setDistricts(await AddressAPI.getDistrictOfProvince(province?.code))
	}

	const getWardsOfDistrict = async (district: DistrictModel) => {
		district?.code && setWards(await AddressAPI.getWardsOfDistrict(district?.code))
	}

	React.useEffect(() => {
		getAllProvince()
	}, [])

	const handleSearchItem = () => {
		const queryList: string[] = []
		addressSearching?.street && queryList.push(addressSearching?.street)
		addressSearching?.ward?.name && queryList.push(addressSearching?.ward?.name)
		addressSearching?.district?.name && queryList.push(addressSearching?.district?.name)
		addressSearching?.province?.name && queryList.push(addressSearching?.province?.name)

		const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${queryList.join(',')}`
		axios
			.get(apiUrl)
			.then((response) => {
				console.log(response.data)
				setListMarkers(response.data)
				if (response.data.at(0)) {
					setSelectedPosition(undefined)
					setCenter([response.data.at(0).lat, response.data.at(0)?.lon])
				}
			})
			.catch((err) => {
				console.log(err)
			})
			.finally(() => {
				setIsLoading(false)
			})
	}

	return (
		<React.Fragment>
			<FormControl size='small'>
				<Autocomplete
					disabled={isLoading}
					size='small'
					disablePortal
					fullWidth
					renderInput={(params) => (
						<TextField
							{...params}
							name='province'
							placeholder='tỉnh/thành phố'
							label='Tỉnh/Thành phố'
						/>
					)}
					value={addressSearching?.province || null}
					getOptionLabel={(option) => option.name ?? '_'}
					options={provinces}
					onChange={(_: React.SyntheticEvent, newValue) => {
						const newAddress = new AddressModel({
							province: newValue
						})
						setAddressSearching(newAddress)
						newValue && getDistrictOfProvince(newValue)
					}}
				/>
			</FormControl>
			{addressSearching?.province && districts.length > 0 && (
				<FormControl fullWidth size='small'>
					<Autocomplete
						disabled={isLoading}
						size='small'
						disablePortal
						fullWidth
						renderInput={(params) => (
							<TextField
								{...params}
								name='district'
								placeholder='quận/huyện'
								label='Quận/Huyện'
								fullWidth
							/>
						)}
						getOptionLabel={(option) => option.name ?? '_'}
						options={districts}
						value={addressSearching.district || null}
						onChange={(_: React.SyntheticEvent, newValue) => {
							const newAddress = new AddressModel({
								province: addressSearching.province,
								district: newValue
							})
							setAddressSearching(newAddress)
							newValue && getWardsOfDistrict(newValue)
						}}
					/>
					{/* <InputLabel id='activity-type'></InputLabel> */}
				</FormControl>
			)}
			{addressSearching?.province && addressSearching.district && wards.length > 0 && (
				<FormControl fullWidth size='small'>
					<Autocomplete
						disabled={isLoading}
						size='small'
						disablePortal
						fullWidth
						renderInput={(params) => (
							<TextField
								{...params}
								name='district'
								placeholder='phường/xã'
								label='Phường/Xã'
								fullWidth
							/>
						)}
						value={addressSearching.ward || null}
						getOptionLabel={(option) => option.name ?? '_'}
						options={wards}
						onChange={(_: React.SyntheticEvent, newValue) => {
							const newAddress = new AddressModel({
								...addressSearching,
								street: '',
								ward: newValue
							})
							setAddressSearching(newAddress)
						}}
					/>
				</FormControl>
			)}
			{addressSearching?.province && addressSearching.district && addressSearching.ward && (
				<FormControl size='small'>
					<TextField
						size='small'
						label='Địa chỉ'
						placeholder='123 Trần Phú'
						onChange={(e) => {
							const newAddress = new AddressModel({
								...addressSearching,
								street: e.target.value
							})
							setAddressSearching(newAddress)
						}}
					/>
				</FormControl>
			)}
			<Button
				size='small'
				startIcon={<Magnify />}
				onClick={() => {
					setIsLoading(true)
					setListMarkers([])
					handleSearchItem()
				}}
				disabled={isLoading}
			>
				Tìm kiếm
			</Button>
			<Typography variant='caption' fontWeight={800}>
				Kết quả tìm kiếm ({listMarkers.length})
			</Typography>

			<Grid container gap={1} mt={0.5}>
				{isLoading && <Skeleton variant='rectangular' height={50} width={'100%'} />}
				{listMarkers.map((item, index) => {
					return (
						<Grid
							item
							key={index}
							display={'flex'}
							alignItems={'center'}
							sx={{
								border: '1px solid #d4d4d4',
								borderRadius: '8px',
								width: '100%',
								p: '0px !important',
								backgroundColor:
									selectedPosition?.toString() ===
									([item.lat, item.lon] as LatLngExpression).toString()
										? KEY.COLOR.MENU_COLOR
										: 'inherit'
							}}
							onClick={() => {
								console.log([item.lat, item.lon])
								setIsSelected(true)
								setSelectedPosition([item.lat, item.lon])
								setCenter([item.lat, item.lon])
								setCurrentUser({
									...currentUser,
									address: item.display_name,
									location: [item.lat, item.lon]
								})
							}}
						>
							<img src='/images/location-icon.png' alt={item.display_name} height={50} />
							<Typography variant='body2' fontWeight={600}>
								{item.display_name}
							</Typography>
						</Grid>
					)
				})}
			</Grid>
		</React.Fragment>
	)
}
