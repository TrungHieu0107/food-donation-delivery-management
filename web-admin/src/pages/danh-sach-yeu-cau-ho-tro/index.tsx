'use client'

import RoofingSharpIcon from '@mui/icons-material/RoofingSharp'
import { Autocomplete, FormControl, Grid, Paper, TextField } from '@mui/material'
import useSession from 'src/@core/hooks/useSession'
import { useEffect, useState } from 'react'
import { AidRequestAPI } from 'src/api-client/AidRequest'
import { BranchAPI } from 'src/api-client/Branch'
import { KEY } from 'src/common/Keys'
import UserLayout from 'src/layouts/UserLayout'
import Calendar from 'src/layouts/components/calendar/Calendar'
import { AidRequestListModel, FilterAidRequestModel } from 'src/models/AidRequest'
import { BranchModel, QueryBranchModel } from 'src/models/Branch'
import { AidRequestStatus } from 'src/models/DonatedRequest'
import { PaginationModel } from 'src/models/common/CommonResponseModel'
import AidRequestTable from './AidRequestTable'

function ListAidRequests() {
  const [filterObject, setFilterObject] = useState<FilterAidRequestModel>({
    name: '',
    startDate: '',
    endDate: '',
    branchId: '',
    page: 1,
    orderBy: 'CreatedDate',
    sortType: 1
  })
  const [data, setData] = useState<AidRequestListModel[]>()
  const [dataPagination, setDataPagination] = useState<PaginationModel>(new PaginationModel())
  const [branches, setBranches] = useState<BranchModel[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const { session }: any = useSession()

  useEffect(() => {
    fetchData()
  }, [filterObject])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const response: any = await AidRequestAPI.getListAidRequest(filterObject)
      const responseTypes = await BranchAPI.getBranches(new QueryBranchModel())
      setData(response.data)
      setDataPagination(response.pagination)
      setBranches(responseTypes.data)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Paper
      sx={{
        p: 5
      }}
    >
      <Grid container spacing={3} sx={{ mb: 5, mt: 1 }} justifyContent={'flex-start'}>
        {session?.user.role === KEY.ROLE.SYSTEM_ADMIN && (
          <Grid item xs={12} md={3} lg={3}>
            <FormControl size='small' sx={{ width: '100%' }}>
              <Autocomplete
                size='small'
                disablePortal
                fullWidth
                renderInput={params => (
                  <TextField
                    {...params}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: <RoofingSharpIcon color='primary' />
                    }}
                    name='branch'
                    placeholder='Tên chi nhánh'
                    label='Chi nhánh'
                    fullWidth
                  />
                )}
                defaultValue={branches.filter(branch => branch.id === filterObject?.branchId).at(0)}
                getOptionLabel={option => option.name ?? '_'}
                options={branches}
                onChange={(_: React.SyntheticEvent, newValue) => {
                  setFilterObject(
                    new FilterAidRequestModel({
                      ...filterObject,
                      branchId: newValue?.id
                    })
                  )
                }}
              />
            </FormControl>
          </Grid>
        )}
        <Grid item lg={3} md={3} sm={5} xs={6}>
          <FormControl fullWidth size='small'>
            <Autocomplete
              size='small'
              disablePortal
              fullWidth
              renderInput={params => (
                <TextField
                  {...params}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: <RoofingSharpIcon color='primary' />
                  }}
                  name='status'
                  placeholder='Trạng thái'
                  label='Trạng thái'
                  fullWidth
                />
              )}
              value={AidRequestStatus.filter(branch => branch.id === filterObject?.status).at(0) || null}
              getOptionLabel={option => option.label ?? '_'}
              options={AidRequestStatus}
              onChange={(_, newValue) => {
                const newQuery = new FilterAidRequestModel({
                  ...filterObject,
                  status: newValue?.id
                })
                setFilterObject(newQuery)
              }}
            />
          </FormControl>
        </Grid>

        <Grid item xs={6} md={3}>
          <Calendar label='Ngày bắt đầu' filterObject={filterObject} setFilterObject={setFilterObject}/>
        </Grid>
        <Grid item xs={6} md={3}>
          <Calendar label='Ngày kết thúc' filterObject={filterObject} setFilterObject={setFilterObject} />
        </Grid>
      </Grid>

      <AidRequestTable
        data={data ?? []}
        isLoading={isLoading}
        pagination={dataPagination}
        filterObject={filterObject}
        setFilterObject={setFilterObject}
      />
    </Paper>
  )
}

export default ListAidRequests

ListAidRequests.auth = {
  role: [KEY.ROLE.BRANCH_ADMIN, KEY.ROLE.SYSTEM_ADMIN]
}
ListAidRequests.getLayout = (page: React.ReactNode) => (
  <UserLayout pageTile=' Danh sách yêu cầu hỗ trợ'>{page}</UserLayout>
)
