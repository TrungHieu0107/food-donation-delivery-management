'use client'

import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import { Box, Grid, InputAdornment, Pagination, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import axiosClient from 'src/api-client/ApiClient'
import CharityView from './CharityView'

interface filter {
	page: number
	name: string
	charityStatus: number
	pageSize: number
}

function ListCharity() {
	const [filterObject, setFilterObject] = useState<filter>({
		name: '',
		charityStatus: 1,
		page: 1,
		pageSize: 20
	})
	const [data, setData] = useState<any>()
	const [dataPagination, setDataPagination] = useState<any>()

	const handlePageChange = (event: any, page: any) => {
		setFilterObject({
			...filterObject,
			page: page
		})
	}

	const handleNameChange = (e: any) => {
		setFilterObject({
			...filterObject,
			name: e.target.value
		})
	}

	useEffect(() => {
		const fetchData = async () => {
			try {
				const apiUrl = `/charities`
				const response: any = await axiosClient.get(apiUrl, {
					params: {
						...filterObject
					}
				})
				console.log(response.data)
				setData(response.data)
				setDataPagination(response.pagination)
			} catch (error) {
				console.log(error)
			}
		}
		fetchData()
	}, [filterObject])

	return (
		<Box
			sx={{
				paddingY: 5,
				paddingX: 10,
				width: '80%',
				m: 'auto'
			}}
		>
			<Box
				sx={{
					height: '40px',
					mb: 5,
					width: '100%',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center'
				}}
			>
				<Typography variant='h5' fontWeight={600}>
					Danh sách các tổ chức từ thiện
				</Typography>
			</Box>
					<TextField
                       sx={{mt: 5, mb: 10}}
						autoComplete='off'
						size='small'
						placeholder='Tìm theo tên tổ chức'
						label='Tên tổ chức'
						onBlur={handleNameChange}
                        fullWidth
						InputProps={{
							startAdornment: (
								<InputAdornment position='start'>
									<SearchOutlinedIcon />
								</InputAdornment>
							)
						}}
					/>


			<Grid container spacing={10}>
				{data?.map((c: any) => (
					<CharityView key={c.id} charity={c} />
				))}
			</Grid>

			<Box
				justifyContent={'center'}
				alignItems='center'
				display={'flex'}
				sx={{
					margin: '20px 0px'
				}}
			>
				<Pagination
					color='primary'
					count={Math.ceil(dataPagination?.total ? dataPagination?.total / 10 : 0)}
					onChange={handlePageChange}
					page={dataPagination?.currentPage || 0}
				/>
			</Box>
		</Box>
	)
}

export default ListCharity
