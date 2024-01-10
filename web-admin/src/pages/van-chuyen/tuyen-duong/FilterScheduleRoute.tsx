import { Autocomplete, Box, Button, Grid, TextField, Typography } from '@mui/material'
import { ObjectFilterScheduledRoute } from 'src/models/DeliveryRequest'
import { RadioGroup, FormControlLabel, Radio } from '@mui/material'
import { scheduleRouteStatus } from 'src/common/delivery-status'
import CalendarMonthSharpIcon from '@mui/icons-material/CalendarMonthSharp'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DatePicker, { registerLocale } from 'react-datepicker'
import vi from 'date-fns/locale/vi'
import moment from 'moment'
import { SyntheticEvent, useEffect, useState } from 'react'
import { BranchAPI } from 'src/api-client/Branch'
import { KEY } from 'src/common/Keys'
import { BranchModel, QueryBranchModel } from 'src/models/Branch'
import { CommonRepsonseModel } from 'src/models/common/CommonResponseModel'
import useSession from 'src/@core/hooks/useSession'

registerLocale('vi', vi)

export interface IFilterScheduleRouteProps {
  filterObject: ObjectFilterScheduledRoute | undefined
  handleChangeFilter: (value: ObjectFilterScheduledRoute | undefined) => void
}

export default function FilterScheduleRoute(props: IFilterScheduleRouteProps) {
  const [branches, setBranches] = useState<BranchModel[]>([])
  const { session }: any = useSession()
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.handleChangeFilter({
      ...props.filterObject,
      status: +(event.target as HTMLInputElement).value === -1 ? undefined : +(event.target as HTMLInputElement).value,
      page: 1,
      pageSize: 10
    })
  }

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    await fetchDataBranch()
  }

  const fetchDataBranch = async () => {
    try {
      const response = await BranchAPI.getBranches(
        new QueryBranchModel({
          pageSize: 1000
        })
      )
      setBranches(new CommonRepsonseModel<BranchModel[]>(response).data || [])
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <DatePickerWrapper>
      <Grid container flexDirection={{ xl: 'column', lg: 'column', md: 'row', xs: 'row' }} flexWrap={'nowrap'} gap={4}>
        <Grid item xl={12} lg={12} md={3} sm={4} container gap={2} flexDirection={'column'}>
          <Grid item display={'flex'} flexDirection={'column'} gap={2}>
            <Typography fontWeight={550}> Loại</Typography>
            <Grid container flexDirection={'row'} width={'100%'} gap={2}>
              <Grid item xl lg md sm xs>
                <Button
                  fullWidth
                  variant={props.filterObject?.stockUpdatedHistoryType === 0 ? 'contained' : 'outlined'}
                  sx={{
                    borderRadius: '50px',
                    textTransform: 'none'
                  }}
                  onClick={() => {
                    props.handleChangeFilter({
                      ...props.filterObject,
                      stockUpdatedHistoryType: 0
                    })
                  }}
                >
                  Nhận hàng
                </Button>
              </Grid>
              <Grid item xl lg md sm xs>
                <Button
                  fullWidth
                  variant={props.filterObject?.stockUpdatedHistoryType === 1 ? 'contained' : 'outlined'}
                  sx={{
                    borderRadius: '50px',
                    textTransform: 'none'
                  }}
                  onClick={() => {
                    props.handleChangeFilter({
                      ...props.filterObject,
                      stockUpdatedHistoryType: 1
                    })
                  }}
                >
                  Xuất hàng
                </Button>
              </Grid>
            </Grid>
          </Grid>
          {session?.user.role === KEY.ROLE.SYSTEM_ADMIN && (
            <Grid item display={'flex'} flexDirection={'column'} gap={2}>
              <Typography fontWeight={550}>Chi nhánh thực hiện</Typography>
              <Autocomplete
                fullWidth
                noOptionsText='Không có dữ liệu'
                renderInput={params => (
                  <TextField {...params} name='pick-up' placeholder='Nơi lấy' label='Nơi lấy' size='small' fullWidth />
                )}
                getOptionLabel={option => (option as BranchModel).name || KEY.DEFAULT_VALUE}
                options={branches}
                renderOption={(props, option) => (
                  <Box component='li' {...props}>
                    <Typography ml={1} variant='body2' fontWeight={450}>
                      {(option as BranchModel).name}
                    </Typography>
                  </Box>
                )}
                onChange={(_: SyntheticEvent, newValue: BranchModel | null) => {
                  props.handleChangeFilter({
                    ...props.filterObject,
                    branchId: newValue?.id
                  } as ObjectFilterScheduledRoute)
                }}
              />
            </Grid>
          )}
        </Grid>

        <Grid item xl={12} lg={12} md={3} sm={4} display={'flex'} flexDirection={'column'} gap={2}>
          <Typography fontWeight={550}>Trạng thái</Typography>
          <RadioGroup value={props.filterObject?.status} onChange={handleChange}>
            <FormControlLabel value={'-1'} control={<Radio size='small' />} label={'Tất cả'} />
            {scheduleRouteStatus.map(item => (
              <FormControlLabel
                key={item.key}
                value={`${item.value}`}
                control={<Radio size='small' />}
                label={item.label}
              />
            ))}
          </RadioGroup>
        </Grid>
        <Grid item xl={12} lg={12} md={3} sm={4} display={'flex'} flexDirection={'column'} gap={2}>
          <Typography fontWeight={550}>Khoảng thời gian</Typography>
          <DatePicker
            locale={'vi'}
            selected={props.filterObject?.startDate ? moment(props.filterObject?.startDate).toDate() : undefined}
            showYearDropdown
            id='start-date'
            showMonthDropdown
            placeholderText='Ngày-Tháng-Năm'
            dateFormat={'dd/MM/yyyy'}
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
              props.handleChangeFilter({
                ...props.filterObject,
                startDate: date ? moment(date?.toString()).startOf('day').format('YYYY-MM-DDTHH:mm:ss') : ''
              } as ObjectFilterScheduledRoute)
            }}
            todayButton='Hôm nay'
            isClearable
          />
          <DatePicker
            locale={'vi'}
            selected={props.filterObject?.endDate ? moment(props.filterObject?.endDate).toDate() : null}
            showYearDropdown
            id='end-date'
            showMonthDropdown
            placeholderText='Ngày-Tháng-Năm'
            dateFormat={'dd/MM/yyyy'}
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
              props.handleChangeFilter({
                ...props.filterObject,
                endDate: date ? moment(date?.toString()).startOf('day').format('YYYY-MM-DDTHH:mm:ss') : ''
              } as ObjectFilterScheduledRoute)
            }}
            todayButton='Hôm nay'
            isClearable
          />
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}
