import { styled } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import { Avatar, Box, Button, Grid, Typography, TypographyProps } from '@mui/material'
import { Plus } from 'mdi-material-ui'
import { Fragment, useEffect, useState } from 'react'
import DialogSelectItemTemplate from './DialogSelectItemTemplate'
import { CharityItemModel } from 'src/models/Item'
import moment from 'moment'
import { KEY } from 'src/common/Keys'
import { TargetProcessResponse } from 'src/models/Activity'
import SelectActivityItemDialog from '../../donated-request/create/SelectActivityItemDialog'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { VolunteerDonateItem } from 'src/pages/tao-yeu-cau-quyen-gop'

const Label = styled(Typography)<TypographyProps>(() => ({
	textAlign: 'left',
	fontWeight: 550,
	minWidth: 125
}))

const SelectedItemTag = ({
	item,
	isAidScreen,
	handleRemoveItem,
	handleEditItem
}: {
	item?: VolunteerDonateItem
	isAidScreen: boolean
	handleRemoveItem: (value?: string) => void
	handleEditItem: (value?: VolunteerDonateItem) => void
}) => {
	const itemTemplate = item?.item
	const [displayOption, setDisplayAction] = useState<boolean>(false)
	const [nameItem, setNameItem] = useState<string>('')

	useEffect(() => {
		if (itemTemplate) {
			let name: string = itemTemplate.name ?? ''
			if (itemTemplate?.attributeValues && itemTemplate?.attributeValues?.length > 0) {
				name += `(${itemTemplate.attributeValues.join(', ')})`
			}

			setNameItem(name)
		}
	}, [itemTemplate])

	return (
		<Paper
			elevation={4}
			sx={{
				position: 'relative',
				display: 'flex',
				flexDirection: 'row',
				flexWrap: 'nowrap',
				padding: '10px',
				gap: 3,
				width: '100%',
				backgroundColor: (theme) => hexToRGBA(theme.palette.secondary.light, 0.1),
				height: '100%'
			}}
			onMouseEnter={() => {
				setDisplayAction(true)
			}}
			onMouseLeave={() => {
				setDisplayAction(false)
			}}
		>
			<Avatar
				variant='square'
				src={itemTemplate?.image}
				alt={(itemTemplate as any)?.id}
				style={{
					width: 75,
					height: 'auto',
					borderRadius: '7px'
				}}
			/>
			<Grid container md={9} flexDirection={'column'}>
				<Grid item display={'flex'}>
					<Label>Tên vật phẩm</Label>
					<Typography
						variant='body1'
						sx={{
							verticalAlign: 'middle',
							overflow: 'hidden',
							textOverflow: 'ellipsis'
						}}
					>
						{nameItem}
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
						{`${item?.quantity} (${item?.unit})`}
					</Typography>
				</Grid>
				{!isAidScreen && (
					<Grid item display={'flex'}>
						<Label>Hạn sử dụng</Label>
						<Typography
							variant='body1'
							sx={{
								verticalAlign: 'middle'
							}}
						>
							{moment(item?.initialExpirationDate).format(KEY.FORMAT_DATE_d_m_y)}
						</Typography>
					</Grid>
				)}
			</Grid>
			<Box
				display={displayOption ? 'flex' : 'none'}
				justifyContent={'center'}
				sx={{
					position: 'absolute',
					top: 0,
					bottom: 0,
					left: 0,
					right: 0,
					backgroundColor: '#96969691',
					borderRadius: '6px'
				}}
			>
				<Grid container justifyContent={'center'} alignItems={'center'} gap={3}>
					<Button
						color='secondary'
						variant='contained'
						size='small'
						sx={{
							height: '30px',
							textTransform: 'none'
						}}
						onClick={() => {
							handleRemoveItem(item?.itemTemplateId)
						}}
					>
						Xóa
					</Button>
					<Button
						variant='contained'
						size='small'
						sx={{
							height: '30px',
							textTransform: 'none'
						}}
						onClick={() => {
							handleEditItem(item)
						}}
					>
						Chỉnh sửa
					</Button>
				</Grid>
			</Box>
		</Paper>
	)
}

export interface SelectItemViewProps {
	itemTemplatesSelected: VolunteerDonateItem[]
	handleSelectItemTemplate: (isSelect: boolean, value: VolunteerDonateItem, id?: string) => void
	isAidScreen: boolean
	activityItem?: TargetProcessResponse[]
}

export default function SelectedItemsView(props: SelectItemViewProps) {
	const { itemTemplatesSelected, handleSelectItemTemplate, isAidScreen, activityItem } = props
	const [open, setOpen] = useState<boolean>(false)
	const [charityItemSelected, setCharityItemSelected] = useState<VolunteerDonateItem>()

	const handleEditItem = (value?: CharityItemModel) => {
		setCharityItemSelected(new VolunteerDonateItem(value))
		setOpen(true)
	}

	return (
		<Fragment>
			<Grid
				container
				flexDirection={'row'}
				p={5}
				spacing={3}
				alignItems={'stretch'}
				justifyContent={{
					xl: 'flex-start',
					lg: 'flex-start',
					md: 'flex-start',
					sm: 'center',
					xs: 'center'
				}}
			>
				{itemTemplatesSelected.map((item) => {
					return (
						<Grid
							item
							key={item.itemTemplateId}
							xl={5}
							lg={5}
							md={6}
							sm={8}
							xs={12}
							sx={{
								height: 'auto',
							}}
						>
							<SelectedItemTag
								item={item}
								isAidScreen={isAidScreen}
								handleRemoveItem={(value?: string) => {
									if (value) {
										handleSelectItemTemplate(
											false,
											itemTemplatesSelected.filter((item) => item.itemTemplateId === value).at(0) ??
												new VolunteerDonateItem()
										)
									}
								}}
								handleEditItem={handleEditItem}
							/>
						</Grid>
					)
				})}
				<Grid
					item
					xl={5}
					lg={5}
					md={6}
					sm={8}
					xs={12}
					display={'flex'}
					justifyContent={'center'}
					alignContent={'center'}
				>
					<Button
						startIcon={<Plus />}
						fullWidth
						color='secondary'
						variant='contained'
						sx={{
							height: '100%'
						}}
						onClick={() => {
							setOpen(true)
						}}
					>
						Thêm
					</Button>
				</Grid>
			</Grid>
			{activityItem ? (
				<SelectActivityItemDialog
					activityItems={activityItem}
					open={open}
					handleClose={() => {
						setOpen(false)
					}}
					itemTemplatesSelected={itemTemplatesSelected}
					handleSelectItemTemplate={handleSelectItemTemplate}
					isAidScreen={isAidScreen}
					charityItemSelected={charityItemSelected}
				/>
			) : (
				<DialogSelectItemTemplate
					open={open}
					handleClose={() => {
						setOpen(false)
					}}
					itemTemplatesSelected={itemTemplatesSelected}
					handleSelectItemTemplate={handleSelectItemTemplate}
					isAidScreen={isAidScreen}
					charityItemSelected={charityItemSelected}
				/>
			)}
		</Fragment>
	)
}
