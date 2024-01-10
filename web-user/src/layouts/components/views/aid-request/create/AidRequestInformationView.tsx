import { Typography, TypographyProps, styled } from '@mui/material'
import * as React from 'react'
import { UserModel } from 'src/models/User'

export interface AidRequestInformationViewProps {
  profile: UserModel
	isAidRequest?: boolean
}

const TRow = styled('tr')(() => ({
  verticalAlign: 'top',
  padding: '10px'
}))

const Label = styled(Typography)<TypographyProps>(() => ({
  textAlign: 'left',
  fontWeight: 550
}))

export default function AidRequestInformationView({ profile, isAidRequest = false }: AidRequestInformationViewProps) {
	return (
		<table>
			<thead>
				<tr>
					<td
						style={{
							width: '200px',
							minWidth: '100px'
						}}
					></td>
					<td
						style={{
							minWidth: '200px'
						}}
					></td>
				</tr>
			</thead>
			<tbody>
				<TRow>
					<td>
						<Label>{isAidRequest ? 'Tên tổ chức cần hỗ trợ' :'Người quyên góp'}</Label>
					</td>
					<td>
						<Typography textAlign={'left'} ml={3} width={'100%'}>
							{profile.name ?? '_'}
						</Typography>
					</td>
				</TRow>
				<TRow>
					<td>
						<Label>Số điện thoại</Label>
					</td>
					<td>
						<Typography textAlign={'left'} ml={3}>
							{profile.phone ?? '_'}
						</Typography>
					</td>
				</TRow>
				<TRow>
					<td>
						<Label>Thông tin liên lạc khác</Label>
					</td>
					<td>
						<Typography textAlign={'left'} ml={3}>
							{profile.email ?? '_'}
						</Typography>
					</td>
				</TRow>
				<TRow>
					<td>
						<Label>Địa chỉ</Label>
					</td>
					<td>
						<Typography textAlign={'left'} ml={3}>
							{profile.address}
						</Typography>
					</td>
				</TRow>
			</tbody>
		</table>
	)
}
