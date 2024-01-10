import { Box, Button, Grid } from '@mui/material'
import { CameraOutline } from 'mdi-material-ui'
import * as React from 'react'
import DialogCustom from 'src/@core/layouts/components/dialog/Dialog'
import UpdateAvatar from 'src/layouts/components/image/UpdateAvatar'

export interface IUpdateAvatarDialogProps {
	avatar: string
	handleChangeAvatar: (imageSrc: string, imageData: File) => Promise<boolean>
	top?: number
	left?: number
	toogleOpen?: (value: boolean) => void
}

export default function UpdateAvatarDialog(props: IUpdateAvatarDialogProps) {
	const [imageSrc, setImageSrc] = React.useState<string>()
	const [imageData, setImageData] = React.useState<File>()
	const [dialogOpen, setDialogOpen] = React.useState<boolean>(false)
	const top = props.top || 370
	const left = props.left || 195

	React.useEffect(() => {
		setImageSrc(props.avatar)
	}, [props.avatar])

	React.useEffect(() => {
		if (imageData) {
			const reader = new FileReader()
			reader.onload = () => {
				console.log(reader.result as string, imageData)

				setImageSrc(reader.result as string)
			}
			reader.readAsDataURL(imageData)
		}
	}, [imageData])

	const handleClose = () => {
		setDialogOpen(false)
		props.toogleOpen && props.toogleOpen(true)
	}

	const handleChange = (value: File) => {
		setImageData(value)
		
	}

	return (
		<React.Fragment>
			<Box
				key={'edit-icon'}
				borderRadius={'50%'}
				sx={{
					position: 'absolute',
					top: top,
					left: left,
					width: 35,
					height: 35,
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					backgroundColor: (theme) => theme.palette.common.white,
					border: (theme) => `0.25rem solid ${theme.palette.primary[theme.palette.mode]}`
				}}
				onClick={() => {
					setDialogOpen(true)
					setImageSrc(props.avatar)
					props.toogleOpen && props.toogleOpen(false)
				}}
			>
				<CameraOutline color='secondary' />
			</Box>
			<DialogCustom
				width={500}
				content={
					<>
						<UpdateAvatar
							avatarSrc={imageSrc}
							handleChangeImage={handleChange}
							size={400}
							
						/>
					</>
				}
				handleClose={handleClose}
				open={dialogOpen}
				title={'Chỉnh sửa ảnh đại diện'}
				action={
					<Grid container justifyContent={'flex-end'}>
						<Grid item>
							<Button size='small' fullWidth variant='text' onClick={handleClose}>
								Đóng
							</Button>
						</Grid>
						<Grid item>
							<Button
								size='small'
								fullWidth
								variant='contained'
								onClick={async () => {
									if (!imageData || !imageSrc) {
										setDialogOpen(false)
									} else {
										const result = await props.handleChangeAvatar(imageSrc || '', imageData)
										if (result) {
											setDialogOpen(false)
											props.toogleOpen && props.toogleOpen(true)
										}
									}
								}}
							>
								Cập nhật
							</Button>
						</Grid>
					</Grid>
				}
			/>
		</React.Fragment>
	)
}
