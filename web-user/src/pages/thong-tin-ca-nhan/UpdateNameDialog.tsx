import { Box, Button, TextField, Grid } from '@mui/material'
import { PencilBoxMultiple } from 'mdi-material-ui'
import { ChangeEvent, Fragment, useState } from 'react'
import DialogCustom from 'src/@core/layouts/components/dialog/Dialog'

export interface IUpdateNameDialogProps {
	name: string
	updateName: (value: string) => Promise<boolean>
}

export default function UpdateNameDialog(props: IUpdateNameDialogProps) {
	const [editOpen, setEditOpen] = useState<boolean>(false)
	const [name, setName] = useState<string>(props.name || '')
	const [error, setError] = useState<string>('')

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setName(e.target.value)
		if (!e.target.value) {
			setError('Tên là bắt buộc.')
		} else if (e.target.value.length < 8 || e.target.value.length > 60) {
			setError('Tên phải dài từ 8 đến 60 kí tự.')
		} else {
			setError('')
		}
	}

	const handleClose = () => {
		setEditOpen(false)
	}

	const handleSubmit = async () => {
		try {
			const result = await props.updateName(name)
			if (result) {
				setEditOpen(false)
			}
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<Fragment>
			<PencilBoxMultiple
				sx={{
					position: 'absolute',
					right: -25,
					bottom: -3,
					backgroundColor: (theme) => theme.palette.common.white,
					':hover': {
						cursor: 'pointer'
					}
				}}
				color='primary'
				onClick={() => {
					setEditOpen(true)
				}}
			/>
			<DialogCustom
				content={
					<Box paddingY={5}>
						<TextField
							label='Tên'
							fullWidth
							value={name}
							onChange={handleChange}
							error={!!error}
							helperText={error}
						/>
					</Box>
				}
				handleClose={handleClose}
				open={editOpen}
				title={'Thay đổi tên'}
				action={
					<Grid container justifyContent={'flex-end'}>
						<Grid item>
							<Button size='small' fullWidth variant='text' onClick={handleClose}>
								Đóng
							</Button>
						</Grid>
						<Grid item>
							<Button size='small' fullWidth variant='contained' onClick={handleSubmit}>
								Cập nhật
							</Button>
						</Grid>
					</Grid>
				}
				width={400}
			/>
		</Fragment>
	)
}
