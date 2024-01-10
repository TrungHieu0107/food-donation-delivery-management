'use client'

import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import { Box, Grid, InputAdornment, Pagination, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import axiosClient from 'src/api-client/ApiClient'
import BranchData from './BranchData'

interface filter {
	page: number
	name: string
	address: string
	pageSize: number
}

function ListBranch() {
	const [filterObject, setFilterObject] = useState<filter>({
		name: '',
		address: '',
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
	const handleAddressChange = (e: any) => {
		console.log(e.target.value)

		setFilterObject({
			...filterObject,
			address: e.target.value
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
				const apiUrl = `/branches`
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
					Danh sách các chi nhánh
				</Typography>
			</Box>

			<Grid container spacing={5} sx={{ mb: 10 }}>
				<Grid item xs={12} md={6}>
					<TextField
						autoComplete='off'
						size='small'
						placeholder='Tìm theo tên chi nhánh'
						label='Tên chi nhánh'
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
				</Grid>
				<Grid item xs={12} md={6}>
					
					<TextField
						autoComplete='off'
						size='small'
						placeholder='Tìm theo địa chỉ'
						label='Địa chỉ'
						onBlur={handleAddressChange}
						fullWidth
						InputProps={{
							startAdornment: (
								<InputAdornment position='start'>
									<SearchOutlinedIcon />
								</InputAdornment>
							)
						}}
					/>
				</Grid>
			</Grid>

			<Grid container spacing={10}>
				{data?.map((b: any) => (
					<BranchData key={b.id} branch={b} />
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
					count={Math.ceil(dataPagination?.total / 10)}
					onChange={handlePageChange}
					page={dataPagination?.currentPage}
				/>
			</Box>
		</Box>
	)
}

export default ListBranch
