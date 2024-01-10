import { Box, Button, Grid, TextField, Typography } from '@mui/material'
import { ArrowLeftBold, ArrowRightBold, DownloadOutline } from 'mdi-material-ui'
import React from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

interface DisplayFileProps {
	fileLink: string | File
	height?: number
}

interface PDFDocument {
	numPages: number
}

const DisplayFile: React.FC<DisplayFileProps> = ({ fileLink, height }) => {
	const [numPages, setNumPages] = React.useState<number>(0)
	const [pageNumber, setPageNumber] = React.useState(1)
	const [pageWidth, setPageWidth] = React.useState(0)

	const containerRef = React.useRef(null)

	React.useEffect(() => {
		if (containerRef.current) {
			setPageWidth((containerRef.current as HTMLDivElement).clientWidth)
		}
	}, [])

	function onDocumentLoadSuccess({ numPages }: PDFDocument) {
		setNumPages(numPages)
	}

	const downloadFile = () => {
		if (typeof fileLink === 'string') window.open(fileLink, '_blank')
	}

	return (
		<Document file={fileLink} onLoadSuccess={onDocumentLoadSuccess}>
			<Box
				component={'div'}
				sx={{
					border: '1px solid',
					borderRadius: '16px',
					paddingX: '5px',
					width: '100%',
					display: 'flex',
					backgroundColor: (theme) => theme.palette.primary[theme.palette.mode]
				}}
			>
				<Grid
					container
					flexDirection={'column'}
					justifyContent={'space-between'}
					sx={{
						backgroundColor: (theme) => theme.palette.primary[theme.palette.mode]
					}}
					flexWrap={'nowrap'}
				>
					<Grid
						item
						display={'flex'}
						justifyContent={'space-between'}
						sx={{
							backgroundColor: (theme) => hexToRGBA(theme.palette.primary[theme.palette.mode], 0),
							borderTopLeftRadius: '16px',
							borderTopRightRadius: '16px',
							paddingX: '20px'
						}}
						alignItems={'center'}
					>
						<Typography
							sx={{
								color: (theme) => theme.palette.primary.contrastText,
								paddingY: '5px'
							}}
							fontWeight={550}
						>
							Tài liệu hợp pháp
						</Typography>
						{typeof fileLink === 'string' && (
							<Button
								onClick={() => {
									downloadFile()
								}}
								sx={{
									color: (theme) => theme.palette.primary.contrastText,
									textTransform: 'none'
								}}
								startIcon={<DownloadOutline />}
								size='small'
							>
								Tải xuống
							</Button>
						)}
					</Grid>
					<Grid
						item
						ref={containerRef}
						sx={{
							height: height || '100%',
							overflow: 'hidden',
							overflowY: 'auto',
							overflowX: 'auto',
							'--scale-factor': 1
						}}
					>
						<Page
							key={'Page'}
							className={'display-file-pdf'}
							pageNumber={pageNumber === 0 ? 1 : pageNumber}
							width={pageWidth}
						/>
					</Grid>
					<Grid
						item
						container
						justifyContent={'center'}
						alignItems={'center'}
						sx={{
							backgroundColor: (theme) => theme.palette.primary[theme.palette.mode],
							paddingY: 1
						}}
					>
						<Grid item>
							<Button
								onClick={() => {
									if (pageNumber === 0) return

									setPageNumber(pageNumber - 1)
								}}
							>
								<ArrowLeftBold
									sx={{
										color: (theme) => theme.palette.primary.contrastText,
										'&:hover': {
											color: (theme) => hexToRGBA(theme.palette.primary.contrastText, 0.5)
										}
									}}
								/>
							</Button>
						</Grid>
						<TextField
							size='small'
							value={pageNumber}
							onChange={(e) => {
								if (isNaN(Number(e.target.value))) return
								if (Number(e.target.value) < 0) return
								if (Number(e.target.value) > numPages) {
									setPageNumber(numPages)
								} else {
									setPageNumber(+e.target.value)
								}
							}}
							inputProps={{
								style: {
									textAlign: 'center'
								}
							}}
							sx={{
								backgroundColor: (theme) => theme.palette.primary.contrastText,
								width: 80
							}}
						/>
						<Typography
							sx={{
								color: (theme) => theme.palette.primary.contrastText,
								paddingLeft: 2
							}}
						>
							/{numPages}
						</Typography>

						<Grid item>
							<Button
								onClick={() => {
									if (pageNumber === numPages) return
									setPageNumber(pageNumber + 1)
								}}
							>
								<ArrowRightBold
									sx={{
										color: (theme) => theme.palette.primary.contrastText,
										'&:hover': {
											color: (theme) => hexToRGBA(theme.palette.primary.contrastText, 0.5)
										}
									}}
								/>
							</Button>
						</Grid>
					</Grid>
				</Grid>
			</Box>
		</Document>
	)
}

export default DisplayFile
