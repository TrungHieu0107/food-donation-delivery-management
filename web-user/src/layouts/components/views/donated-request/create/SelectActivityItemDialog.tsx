import { ItemTemplateResponse, TargetProcessResponse } from 'src/models/Activity'
import {
	Button,
	Card,
	CardMedia,
	Checkbox,
	Grid,
	TableContainer,
	Typography,
	TypographyProps,
	styled
} from '@mui/material'
import { useEffect, useState } from 'react'
import DialogCustom from 'src/@core/layouts/components/dialog/Dialog'
import { CharityItemModel } from 'src/models/Item'
import PerfectScrollbar from 'react-perfect-scrollbar'
import InputInformationItemDialog from '../../aid-request/create/InputInformationItemDialog'
import { VolunteerDonateItem } from 'src/pages/tao-yeu-cau-quyen-gop'

export interface DialogSelectItemTemplateProps {
	open: boolean
	handleClose: () => void
	handleSelectItemTemplate: (isSelect: boolean, value: CharityItemModel, id?: string) => void
	itemTemplatesSelected: CharityItemModel[]
	isAidScreen: boolean
	charityItemSelected?: CharityItemModel
}

const Label = styled(Typography)<TypographyProps>(() => ({
	textAlign: 'left',
	fontWeight: 550,
	minWidth: 150
}))

const TargetTag = ({ target }: { target: TargetProcessResponse }) => {
	return (
		<Card
			sx={{
				display: 'flex',
				padding: '10px',
				width: '500px',
				gap: 3
			}}
		>
			<CardMedia
				component={'img'}
				sx={{ maxWidth: 75, maxHeight: 75 }}
				alt={target?.itemTemplateResponse?.name}
				src={target?.itemTemplateResponse?.image}
			/>
			<Grid container md={9} flexDirection={'column'}>
				<Grid item display={'flex'}>
					<Label>Tên vật phẩm</Label>
					<Typography
						variant='body1'
						sx={{
							verticalAlign: 'middle',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis'
						}}
					>
						{`${target.itemTemplateResponse?.name}${
							target.itemTemplateResponse?.attributeValues &&
							target.itemTemplateResponse?.attributeValues.length > 0
								? ' (' + target.itemTemplateResponse.attributeValues.join(', ') + ') '
								: ''
						}`}
					</Typography>
				</Grid>
				<Grid item display={'flex'}>
					<Label>Số lượng</Label>
					<Typography
						variant='body1'
						sx={{
							verticalAlign: 'middle'
						}}
					>
						{`${target?.process}/${target.target}`}
					</Typography>
				</Grid>
			</Grid>
		</Card>
	)
}

export interface SelectActivityItemDialogProps {
	activityItems: TargetProcessResponse[]
	open: boolean
	handleClose: () => void
	handleSelectItemTemplate: (isSelect: boolean, value: VolunteerDonateItem) => void
	itemTemplatesSelected: VolunteerDonateItem[]
	isAidScreen: boolean
	charityItemSelected?: VolunteerDonateItem
}

export default function SelectActivityItemDialog(props: SelectActivityItemDialogProps) {
	const {
		open,
		activityItems,
		handleClose,
		handleSelectItemTemplate,
		itemTemplatesSelected,
		isAidScreen,
		charityItemSelected
	} = props
	const [dialogInputInfoOpen, setDialogInputInfoOpen] = useState<boolean>(false)
	const [itemTemplateSelected, setItemTemplateSelected] = useState<ItemTemplateResponse>()

	useEffect(() => {
		if (charityItemSelected) {
			setDialogInputInfoOpen(true)
		}
	}, [charityItemSelected])

	const handleCloseDialogInput = () => {
		setDialogInputInfoOpen(false)
		setItemTemplateSelected(undefined)
	}

	return (
		<>
			<DialogCustom
				open={open}
				content={
					<PerfectScrollbar>
						<TableContainer
							sx={{
								maxHeight: 370,
								display: 'flex',
								justifyContent: 'center'
							}}
						>
							<table>
								<thead>
									<th></th>
									<th></th>
								</thead>

								<tbody
									style={{
										display: 'flex',
										flexDirection: 'column',
										gap: 8
									}}
								>
									{activityItems?.map((item, index) => {
										return (
											<tr key={index}>
												<td>
													<Checkbox
														checked={
															itemTemplatesSelected.filter(
																(i) => i.itemTemplateId === item.itemTemplateResponse?.id
															).length > 0
														}
														onChange={(e) => {
															if (!e.target.checked) {
																handleSelectItemTemplate(
																	false,
																	itemTemplatesSelected
																		.filter(
																			(i) => i.itemTemplateId === item.itemTemplateResponse?.id
																		)
																		.at(0) ?? new VolunteerDonateItem()
																)

																return
															}
															setItemTemplateSelected(item.itemTemplateResponse)
															setDialogInputInfoOpen(true)
														}}
													/>
												</td>
												<td>
													<TargetTag target={item} />
												</td>
											</tr>
										)
									})}
								</tbody>
							</table>
						</TableContainer>
					</PerfectScrollbar>
				}
				handleClose={handleClose}
				title={isAidScreen ? 'Chọn vật phẩm cần hỗ trợ' : 'Chọn vật phẩm quyên góp'}
				action={
					<>
						<Button onClick={handleClose}>Đóng</Button>
					</>
				}
			/>
			<InputInformationItemDialog
				dialogInputInfoOpen={dialogInputInfoOpen}
				setDialogInputInfoOpen={handleCloseDialogInput}
				handleSelectItemTemplate={handleSelectItemTemplate}
				itemTemplateSelected={itemTemplateSelected}
				isAidScreen={isAidScreen}
				charityItemSelected={charityItemSelected}
			/>
		</>
	)
}
