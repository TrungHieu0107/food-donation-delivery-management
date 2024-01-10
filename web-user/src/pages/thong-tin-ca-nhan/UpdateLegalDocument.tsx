import { Button, Grid } from '@mui/material'
import { PictureInPictureBottomRight } from 'mdi-material-ui'
import { Fragment, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import DialogCustom from 'src/@core/layouts/components/dialog/Dialog'
import { generateUUID } from 'src/@core/layouts/utils'
import DisplayFile from 'src/layouts/components/file/DisplayFile'

export interface IUpdateLegalDocumentProps {
	legalDocumentUrl: string
	updateLegalDocument: (value: File) => Promise<boolean>
}

const key = generateUUID()

export default function UpdateLegalDocument({
	legalDocumentUrl,
	updateLegalDocument
}: IUpdateLegalDocumentProps) {
	const [documentData, setDocumentData] = useState<File | null>()
	const [editOpen, setEditOpen] = useState<boolean>(false)
	const [src, setSrc] = useState<string>()

	useEffect(() => {
		if (documentData) {
			const reader = new FileReader()
			reader.onload = () => {
				setSrc(reader.result as string)
			}
			reader.readAsDataURL(documentData)
		}
	}, [documentData])

	const handleSubmit = async () => {
		if (!documentData) {
			setEditOpen(false)

			return
		}
		const result = await updateLegalDocument(documentData)
		if (result) {
			handleCloseEdit()
		}
	}

	const handleCloseEdit = () => {
		setEditOpen(false)
		clearData()
	}

	const handleOpenEdit = () => {
		setEditOpen(true)
	}

	const clearData = () => {
		setSrc(undefined)
		setDocumentData(null)
	}

	return (
		<Fragment>
			<Button onClick={handleOpenEdit}> Cập nhật</Button>
			<DialogCustom
				content={
					<Grid container flexDirection={'column'} alignItems={'center'} spacing={3} paddingX={10} paddingY={5}>
						<Grid item>
							<DisplayFile fileLink={src || legalDocumentUrl} />
						</Grid>
						<Grid item>
							<Button
								component='label'
								variant='contained'
								htmlFor={key}
								startIcon={<PictureInPictureBottomRight />}
							>
								Chọn tài liệu
								<input
									value={''}
									multiple
									hidden
									type='file'
									id={key}
									accept='.doc, .docx, .pdf'
									onChange={(event) => {
										const files = event.currentTarget.files
										if (files) {
											const len = files.length
											if (len > 1) {
												toast.error('Chỉ được chọn 1 tài liệu.')

												return
											}
											if (files[0].size / 1048576 > 10) {
												toast.error('Kích thước tài liệu tối đa là 10MB')

												return
											}

											setDocumentData(files[0])
										}
									}}
								/>
							</Button>
						</Grid>
					</Grid>
				}
				handleClose={handleCloseEdit}
				open={editOpen}
				title={'Thay đổi tài liệu đăng ký'}
				action={
					<Grid container>
						<Grid item>
							<Button onClick={handleCloseEdit}>Đóng</Button>
						</Grid>
						<Grid item>
							<Button onClick={handleSubmit}>Cập nhật</Button>
						</Grid>
					</Grid>
				}
			/>
		</Fragment>
	)
}
