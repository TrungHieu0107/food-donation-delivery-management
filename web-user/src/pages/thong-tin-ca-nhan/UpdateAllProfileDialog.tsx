import { EditOutlined } from '@mui/icons-material'
import {
	Avatar,
	Box,
	Button,
	Divider,
	FormControlLabel,
	FormGroup,
	Grid,
	Stack,
	Switch,
	Typography
} from '@mui/material'
import { Fragment, useEffect, useState } from 'react'
import DialogCustom from 'src/@core/layouts/components/dialog/Dialog'
import { UserModel } from 'src/models/User'
import UpdateAvatarDialog from './UpdateAvatarDialog'
import { UserAPI } from 'src/api-client/User'
import { toast } from 'react-toastify'
import { CommonRepsonseModel } from 'src/models/common/CommonResponseModel'
import UpdateNameDialog from './UpdateNameDialog'
import GetLocationDialog from 'src/layouts/components/popup-get-location/PopUpGetLocation'
import { KEY } from 'src/common/Keys'
import { LatLngExpression } from 'leaflet'
import ConfirmChangeDeliveryStatus from 'src/@core/layouts/components/shared-components/ConfirmChangeCollaboratorStatus'

export interface IUpdateAllProfileDialogProps {
	userLogin: UserModel
	updateUserLogin: (value: UserModel) => void
	isCollaborator: boolean
	location: LatLngExpression
}

export default function UpdateAllProfileDialog(props: IUpdateAllProfileDialogProps) {
	const [editOpen, setEditOpen] = useState<boolean>(false)
	const [isEdited, setIsEdited] = useState<boolean>(false)
	const [user, setUser] = useState<UserModel>()
	const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false)
	const [currentLocation, setCurrentLocation] = useState<LatLngExpression>(props.location || [0, 0])

	useEffect(() => {
		setUser(props.userLogin)
		setCurrentLocation(props.location)
	}, [props])

	const handleChangeLocation = async (value: UserModel) => {
		if (!value?.address || !value.location) return

		try {
			const response = await UserAPI.updateProfile({
				address: value.address,
				location: value.location
			})
			setUser(value)

			toast.success(new CommonRepsonseModel<any>(response).message)
		} catch (error) {
			console.error(error)
		}
	}

	const handleClose = () => {
		setEditOpen(false)
		if (isEdited) {
			user && props.updateUserLogin(user)
		}
	}

	const handleOpen = () => {
		setEditOpen(true)
		setUser(props.userLogin)
		setCurrentLocation(props.location)
	}

	const handleChangeAvatar = async (value: string, fileData: File): Promise<boolean> => {
		try {
			const reponse = await UserAPI.updateProfile({
				avatar: fileData
			})
			setIsEdited(true)
			toast.success(new CommonRepsonseModel<any>(reponse).message)
			setUser(
				new UserModel({
					...user,
					avatar: value
				})
			)

			return true
		} catch (error) {
			console.log(error)

			return false
		}
	}

	const handleUpdateName = async (value: string): Promise<boolean> => {
		try {
			const response = await UserAPI.updateProfile({
				name: value
			})
			toast.success(new CommonRepsonseModel<any>(response).message)
			setUser({
				...user,
				name: value
			})
			
			return true
		} catch (error) {
			console.log(error)

			return false
		}
	}

	return (
		<Fragment>
			<Grid item>
				<Button variant='contained' startIcon={<EditOutlined />} onClick={handleOpen}>
					Chỉnh sửa thông tin
				</Button>
			</Grid>
			<DialogCustom
				content={
					<Stack direction={'column'} divider={<Divider />} paddingX={2}>
						<Grid container direction={'column'}>
							<Grid item>
								<Typography variant='h6' fontWeight={600}>
									Ảnh đại diện
								</Typography>
							</Grid>
							<Grid item display={'flex'} justifyContent={'center'}>
								<Box
									sx={{
										position: 'relative'
									}}
								>
									<Avatar
										key={'avatar'}
										alt={user?.name}
										src={user?.avatar || '/images/avatars/1.png'}
										sx={{
											width: 185,
											height: 185,
											border: (theme) => `0.25rem solid ${theme.palette.common.white}`
										}}
									/>
									<UpdateAvatarDialog
										avatar={(props.userLogin?.avatar as string) || ''}
										handleChangeAvatar={handleChangeAvatar}
										top={140}
										left={130}
									/>
								</Box>
							</Grid>
						</Grid>
						<Grid container direction={'column'} alignItems={'center'}>
							<Grid item width={'100%'}>
								<Typography variant='h6' fontWeight={600}>
									Tên
								</Typography>
							</Grid>
							<Grid item>
								<Typography
									variant='h6'
									fontWeight={550}
									sx={{
										position: 'relative'
									}}
								>
									{user?.name || ''}
									<UpdateNameDialog name={user?.name || ''} updateName={handleUpdateName} />
								</Typography>
							</Grid>
						</Grid>

						<Grid container direction={'column'} alignItems={'center'}>
							<Grid item width={'100%'}>
								<Typography variant='h6' fontWeight={600}>
									Vị trí
								</Typography>
							</Grid>
							<Grid item>
								<Typography>
									{`Hoạt động tại ${user?.address || KEY.DEFAULT_VALUE}`}
									{user && (
										<GetLocationDialog
											location={currentLocation}
											userModel={user}
											handleChangeAddress={handleChangeLocation}
											setLatlng={(value: LatLngExpression) => {
												setCurrentLocation(value)
											}}
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
									)}
								</Typography>
							</Grid>
						</Grid>
						{props.isCollaborator && (
							<Grid container direction={'column'}>
								<Grid item width={'100%'}>
									<Typography variant='h6' fontWeight={600}>
										Trạng thái hoạt động
									</Typography>
								</Grid>
								<Grid item>
									<FormGroup>
										<FormControlLabel
											control={<Switch checked={user?.collaboratorStatus === 'ACTIVE'} />}
											label='Đang rảnh'
											onChange={() => {
												setConfirmDialogOpen(true)
											}}
										/>
									</FormGroup>
								</Grid>
							</Grid>
						)}
					</Stack>
				}
				width={500}
				handleClose={handleClose}
				open={editOpen}
				title={'Cập nhật thông tin'}
				action={<Button onClick={handleClose}>Đóng</Button>}
			/>
			{props.isCollaborator && (
				<ConfirmChangeDeliveryStatus
					status={user?.collaboratorStatus ?? KEY.DEFAULT_VALUE}
					dialogOpen={confirmDialogOpen}
					onClose={function (): void {
						setConfirmDialogOpen(false)
					}}
					updateCallback={() => {
						setUser({
							...user,
							collaboratorStatus: user?.collaboratorStatus === 'INACTIVE' ? 'ACTIVE' : 'INACTIVE'
						})
					}}
				/>
			)}
		</Fragment>
	)
}
