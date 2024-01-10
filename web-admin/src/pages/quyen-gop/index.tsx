import { Autocomplete, Divider, FormControl, Grid, Paper, Stack, TextField, styled } from '@mui/material'
import moment from 'moment'
import useSession from 'src/@core/hooks/useSession'
import { ReactNode, useEffect, useState } from 'react'
import { BranchAPI } from 'src/api-client/Branch'
import { KEY } from 'src/common/Keys'
import { BranchModel, QueryBranchModel } from 'src/models/Branch'
import { DonatedRequestStatus, QuueryDonatedRequestModel } from 'src/models/DonatedRequest'
import { CommonRepsonseModel } from 'src/models/common/CommonResponseModel'
import CalendarMonthSharpIcon from '@mui/icons-material/CalendarMonthSharp'
import RoofingSharpIcon from '@mui/icons-material/RoofingSharp'

import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DatePicker, { registerLocale } from 'react-datepicker'
import vi from 'date-fns/locale/vi'
import TableDataDonatedRequest from './TableDataDonatedRequest'
import UserLayout from 'src/layouts/UserLayout'

registerLocale('vi', vi)

export const Page = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: 'center',
  color: theme.palette.text.secondary,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  padding: 20,
  minHeight: '500px'
}))

export default function DonatedRequestPage() {
  const { session }: any = useSession()
  const role = session?.user.role ?? ''
  const [dataSearch, setDataSearch] = useState<QuueryDonatedRequestModel>(new QuueryDonatedRequestModel())
  const [branches, setBranches] = useState<BranchModel[]>([])

  useEffect(() => {
    try {
      if (session?.user){
        fetchallBranch()
      } 
    } catch (err) {
      console.log(err)
    }
  }, [session])

  const fetchallBranch = async () => {
    try {
      const response = await BranchAPI.getBranches(new QueryBranchModel({}))

      const commonReponse = new CommonRepsonseModel<BranchModel[]>(response)
      setBranches(commonReponse.data ?? [])
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Page elevation={3}>
      <Stack flexDirection={'column'} divider={<Divider />}>
        <Grid container flexDirection={'column'}>
          <Grid item>
            <DatePickerWrapper>
              <Grid container spacing={3} justifyContent={'flex-start'} mt={2}>
                {role === KEY.ROLE.SYSTEM_ADMIN && (
                  <Grid item lg={3} md={5} sm={5} xs={6}>
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
                            name='branch'
                            placeholder='Tên chi nhánh'
                            label='Chi nhánh'
                            fullWidth
                          />
                        )}
                        defaultValue={branches.filter(branch => branch.id === dataSearch?.branchId).at(0)}
                        getOptionLabel={option => option.name ?? '_'}
                        options={branches}
                        onChange={(_: React.SyntheticEvent, newValue) => {
                          const newQuery = new QuueryDonatedRequestModel({
                            ...dataSearch,
                            branchId: newValue?.id
                          })
                          setDataSearch(newQuery)
                        }}
                      />
                    </FormControl>
                  </Grid>
                )}
                <Grid item lg={3} md={5} sm={5} xs={6}>
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
                      value={DonatedRequestStatus.filter(branch => branch.id === dataSearch?.status).at(0) || null}
                      getOptionLabel={option => option.label ?? '_'}
                      options={DonatedRequestStatus}
                      onChange={(_, newValue) => {
                        const newQuery = new QuueryDonatedRequestModel({
                          ...dataSearch,
                          status: newValue?.id
                        })
                        setDataSearch(newQuery)
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item lg={3} md={5} sm={5} xs={6}>
                  <DatePicker
                    locale={'vi'}
                    selected={dataSearch?.startDate ? moment(dataSearch?.startDate).toDate() : null}
                    showYearDropdown
                    id='start-date'
                    showMonthDropdown
                    placeholderText='Ngày-Tháng-Năm'
                    dateFormat={'dd-MM-yyyy'}
                    customInput={
                      <TextField
                        InputProps={{
                          startAdornment: <CalendarMonthSharpIcon color='primary' />
                        }}
                        label='Ngày bắt đầu'
                        fullWidth
                        size='small'
                      />
                    }
                    onChange={(date: Date | null) => {
                      const newQuery = new QuueryDonatedRequestModel({
                        ...dataSearch,
                        startDate: date?.toISOString() ?? ''
                      })

                      setDataSearch(newQuery)
                    }}
                    todayButton='Hôm nay'
                    isClearable
                  />
                </Grid>
                <Grid item lg={3} md={5} sm={5} xs={6}>
                  <DatePicker
                    locale={'vi'}
                    selected={dataSearch?.endDate ? moment(dataSearch?.endDate).toDate() : null}
                    showYearDropdown
                    id='end-date'
                    showMonthDropdown
                    placeholderText='Ngày-Tháng-Năm'
                    dateFormat={'dd-MM-yyyy'}
                    customInput={
                      <TextField
                        InputProps={{
                          startAdornment: <CalendarMonthSharpIcon color='primary' />
                        }}
                        label='Ngày kết thúc'
                        fullWidth
                        size='small'
                      />
                    }
                    onChange={(date: Date | null) => {
                      const newQuery = new QuueryDonatedRequestModel({
                        ...dataSearch,
                        endDate: date?.toISOString() ?? ''
                      })

                      setDataSearch(newQuery)
                    }}
                    todayButton='Hôm nay'
                    isClearable
                  />
                </Grid>
              </Grid>
            </DatePickerWrapper>
          </Grid>
        </Grid>
        <Grid container flexDirection={'column'}>
          <TableDataDonatedRequest dataSearch={dataSearch} />
        </Grid>
      </Stack>
    </Page>
  )
}

DonatedRequestPage.auth = [KEY.ROLE.BRANCH_ADMIN, KEY.ROLE.SYSTEM_ADMIN]
DonatedRequestPage.getLayout = (children: ReactNode) => {
  return <UserLayout pageTile='Danh sách yêu cầu quyên góp'>{children}</UserLayout>
}
