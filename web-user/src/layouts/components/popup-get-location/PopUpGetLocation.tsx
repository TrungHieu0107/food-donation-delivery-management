'use client'

import * as React from 'react'
import Button, { ButtonProps } from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContentText from '@mui/material/DialogContentText'
import dynamic from 'next/dynamic'
import { toast } from 'react-toastify'
import { LatLngExpression, LatLngTuple } from 'leaflet'
import { Box, FormControl, Grid, TextField } from '@mui/material'
import { AddressModel } from 'src/models/common/Address'
import axios from 'axios'
import { UserModel } from 'src/models/User'
import DialogCustom from 'src/@core/layouts/components/dialog/Dialog'
import { FieldProps } from 'formik'
import FilterAddress from './FilterAddress'

const MyMap = dynamic(() => import('src/layouts/components/map/PickLocationOnMap'), { ssr: false })

interface GetLocationDialogProps {
	handleChangeAddress: (value: UserModel) => void
	setLatlng: (value: LatLngExpression) => void
	location?: LatLngExpression
	buttonProps?: ButtonProps
	textButton?: string
	fieldProps?: FieldProps
	clickNode?: React.ReactNode
	userModel?: UserModel
	withoutLabel?: boolean
}

interface AddressLeaflet {
	'ISO3166-2-lvl4': string
	city: string
	country: string // Quốc gia
	country_code: string //mã quốc gia
	house_number: string // số nhà
	locality: string
	postcode: string
	suburb: string
	amenity: string
	road: string // đường
	quarter: string
	village: string //xã
	county: string // huyện
	state: string // tỉnh
	town: string //thị trấn
}

export default function GetLocationDialog({
	handleChangeAddress,
	setLatlng,
	location,
	buttonProps,
	textButton,
	fieldProps,
	clickNode,
	userModel,
	withoutLabel
}: GetLocationDialogProps) {
	const [selectedPosition, setSelectedPosition] = React.useState<LatLngExpression>()
	const [open, setOpen] = React.useState(false)
	const [addressSearching, setAddressSearching] = React.useState<AddressModel>()
	const [listMarkers, setListMarkers] = React.useState<any[]>([])
	const [center, setCenter] = React.useState<LatLngExpression>()
	const [confirmDialogOpen, setConfirmDialogOpen] = React.useState<boolean>(false)
	const [currentUser, setCurrentUser] = React.useState<UserModel>(userModel || {})
	const [isSelected, setIsSelected] = React.useState<boolean>(false)

	React.useEffect(() => {
		try {
			const [lat, lng] = (location || [0, 0]) as LatLngTuple
			console.log('rerender')

			if (location && lat !== 0 && lng !== 0) {
				setCenter(location)
				setSelectedPosition(location as LatLngExpression)
			} else {
				if ('geolocation' in navigator) {
					navigator.geolocation.getCurrentPosition((position) => {
						const { latitude, longitude } = position.coords
						const cureentLocation = [latitude, longitude] as LatLngExpression
						setCenter(cureentLocation)
					})
				} else {
					console.error('Geolocation is not available in this browser.')
					setCenter([10.8619439, 106.8069608])
				}
			}
		} catch (error) {
			console.log(error)
		}
	}, [location])

	const handleClickOpen = () => {
		setOpen(true)
		try {
			const [lat, lng] = (location || [0, 0]) as LatLngTuple
			console.log('click ')

			if (location && lat !== 0 && lng !== 0) {
				setCenter(location)
				setSelectedPosition(location as LatLngExpression)
				setCurrentUser({
					...currentUser,
					address: fieldProps?.field.value || userModel?.address,
					location: location
				})
			} else {
				setCurrentUser({
					...currentUser,
					address: fieldProps?.field.value || userModel?.address
				})
				if ('geolocation' in navigator) {
					navigator.geolocation.getCurrentPosition((position) => {
						const { latitude, longitude } = position.coords
						const cureentLocation = [latitude, longitude] as LatLngExpression
						setCenter(cureentLocation)
					})
				} else {
					console.error('Geolocation is not available in this browser.')
					setCenter([10.8619439, 106.8069608])
				}
			}
		} catch (error) {
			console.log(error)
		}
	}

	const handleConfirm = () => {
		if ((fieldProps && fieldProps.field.value) || (currentUser?.location && currentUser.address)) {
			if (currentUser) {
				setConfirmDialogOpen(false)
				handleExit()
				handleChangeAddress(currentUser)
				setIsSelected(false)
				currentUser.location && setLatlng(currentUser.location)
			}
		}
	}

	const getAddressFromCoordinates = async (latlng: LatLngExpression) => {
		const [lat, lng] = (latlng ?? [0, 0]) as LatLngTuple
		await axios
			.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
			.then((response) => {
				const data: any = response.data
				console.log({ data })

				if (!!data.address) {
					const addr = data.address as AddressLeaflet
					const addrList = [] as string[]
					addr.house_number && addrList.push(addr.house_number)
					addr.amenity && addrList.push(addr.amenity)
					addr.road && addrList.push(addr.road)
					addr.town && addrList.push(addr.town)
					addr.quarter && addrList.push(addr.quarter)
					addr.village && addrList.push(addr.village)
					addr.county && addrList.push(addr.county)
					addr.state && addrList.push(addr.state)
					addr.suburb && addrList.push(addr.suburb)
					addr.city && addrList.push(addr.city)
					addr.country && addrList.push(addr.country)

					const userWithNewAddress = new UserModel({
						...currentUser,
						location: selectedPosition,
						address: addrList.join(', ')
					})

					console.log(userWithNewAddress)

					setCurrentUser(userWithNewAddress)
					setConfirmDialogOpen(true)
				} else {
					toast.error('Không tìm thấy được địa chỉ.')
				}
			})
			.catch((error) => {
				console.error('Lỗi khi lấy địa chỉ: ', error)
				const queryList: string[] = []

				addressSearching?.street && queryList.push(addressSearching?.street)
				addressSearching?.ward?.name && queryList.push(addressSearching?.ward?.name)
				addressSearching?.district?.name && queryList.push(addressSearching?.district?.name)
				addressSearching?.province?.name && queryList.push(addressSearching?.province?.name)

				const userWithNewAddress = new UserModel({
					...currentUser,
					location: selectedPosition,
					address: queryList.join(', ')
				})
				setCurrentUser(userWithNewAddress)
				setConfirmDialogOpen(true)
			})
	}

	const handleClose = async () => {
		if (!selectedPosition) {
			toast.warning('Vui lòng chọn vị trí')

			return
		}

		if ((fieldProps && fieldProps.field.value) || selectedPosition) {
			if (isSelected) {
				await getAddressFromCoordinates(selectedPosition)
			} else {
				fieldProps?.form.setFieldValue(fieldProps?.field.name, currentUser?.address)
				handleChangeAddress(currentUser)
			}

			setOpen(false)
		}
	}
	const handleExit = () => {
		setOpen(false)
		setAddressSearching(undefined)
	}

	const handleSelectPosition = (selected: LatLngExpression) => {
		console.log({ selected })
		setSelectedPosition(selected)
		setIsSelected(true)
	}

	return (
		<React.Fragment>
			{fieldProps ? (
				<TextField
					autoComplete='off'
					{...fieldProps.field}
					{...(!withoutLabel ? { label: 'Địa chỉ' } : null)}
					error={fieldProps.meta.touched && !!fieldProps.meta.error}
					helperText={fieldProps.meta.touched && fieldProps.meta.error ? fieldProps.meta.error : ''}
					fullWidth
					onChange={(e) => {
						e.preventDefault()
					}}
					onClick={handleClickOpen}
					multiline
					InputProps={{
						endAdornment: (
							<Button variant='outlined' {...buttonProps} onClick={handleClickOpen}>
								{textButton ?? 'Vị trí'}
							</Button>
						)
					}}
				/>
			) : !!clickNode ? (
				<Box component={'span'} onClick={handleClickOpen}>
					{clickNode}
				</Box>
			) : (
				<Button variant='outlined' {...buttonProps} onClick={handleClickOpen}>
					{textButton ?? 'Chọn vị trí trên bản đồ'}
				</Button>
			)}

			<Dialog
				open={open}
				onClose={handleExit}
				aria-labelledby='alert-dialog-title'
				aria-describedby='alert-dialog-description'
				sx={{
					'& .MuiDialog-paper': {
						minWidth: '70vw'
					}
				}}
			>
				<DialogTitle id='alert-dialog-title'>{'Chọn vị trí bạn muốn quyên góp'}</DialogTitle>
				<DialogContent>
					<Grid container flexDirection={{ md: 'row', sm: 'column' }} spacing={2}>
						<Grid
							item
							lg={3}
							md={4}
							display={'flex'}
							flexDirection={'column'}
							gap={2}
							mt={3}
							sx={{
								maxHeight: '400px',
								overflow: 'auto'
							}}
						>
							<FilterAddress
								setIsSelected={setIsSelected}
								setSelectedPosition={setSelectedPosition}
								selectedPosition={selectedPosition}
								setCenter={setCenter}
								setCurrentUser={setCurrentUser}
								currentUser={currentUser}
								addressSearching={addressSearching}
								setAddressSearching={setAddressSearching}
								listMarkers={listMarkers}
								setListMarkers={setListMarkers}
							/>
						</Grid>
						<Grid item lg={9} md={8}>
							<TextField
								{...fieldProps?.field}
								autoComplete='off'
								value={currentUser?.address}
								label='Địa chỉ'
								error={fieldProps?.meta.touched && !!fieldProps?.meta.error}
								helperText={
									fieldProps?.meta.touched && fieldProps?.meta.error ? fieldProps?.meta.error : ''
								}
								fullWidth
								onChange={(e) => {
									setCurrentUser({
										...currentUser,
										address: e.target.value
									})
								}}
								onClick={handleClickOpen}
								sx={{
									mt: 3,
									mb: 2
								}}
							/>
							{center && (
								<MyMap
									selectedPosition={selectedPosition}
									setSelectedPosition={handleSelectPosition}
									listMarkers={listMarkers}
									center={center}
								/>
							)}
							<DialogContentText sx={{ mt: 3, fontSize: '14px', fontWeight: 700, color: 'black' }}>
								Vui lòng chọn vị trí trên bản đồ trước khi xác nhận để chúng tôi có thể ghi nhận vị
								trí mà bạn muốn chọn
							</DialogContentText>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions
					sx={{
						display: 'flex',
						gap: 1
					}}
				>
					<Button
						sx={{
							width: 100
						}}
						size='small'
						color='secondary'
						onClick={() => {
							handleExit()
						}}
					>
						Đóng
					</Button>
					<Button
						sx={{
							width: 100
						}}
						size='small'
						variant='contained'
						onClick={handleClose}
						disabled={!selectedPosition || currentUser.address?.length === 0}
					>
						Xác nhận
					</Button>
				</DialogActions>
			</Dialog>
			<DialogCustom
				title='Xác nhận địa chỉ'
				content={
					<FormControl fullWidth>
						<TextField
						multiline
							autoComplete='off'
							value={currentUser?.address}
							fullWidth
							label='Địa chỉ đang chọn'
							sx={{
								my: 3
							}}
							onChange={(e) => {
								const newUserWithAddress: UserModel = {
									...currentUser,
									address: e.target.value
								}

								setCurrentUser(newUserWithAddress)
							}}
							error={currentUser?.address?.length === 0}
							helperText={currentUser?.address?.length === 0 ? 'Hãy nhập địa chỉ' : ''}
						/>
					</FormControl>
				}
				handleClose={() => {
					setOpen(true)
					setConfirmDialogOpen(false)
				}}
				width={500}
				open={confirmDialogOpen}
				action={
					<>
						<Button
							sx={{
								width: 100
							}}
							size='small'
							color='secondary'
							onClick={() => {
								setOpen(true)
								setConfirmDialogOpen(false)
							}}
						>
							Đóng
						</Button>
						<Button
							sx={{
								width: 100
							}}
							size='small'
							variant='contained'
							onClick={handleConfirm}
							disabled={currentUser?.address?.length === 0}
						>
							Xác nhận
						</Button>
					</>
				}
			/>
		</React.Fragment>
	)
}
