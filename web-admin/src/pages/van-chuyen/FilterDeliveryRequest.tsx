import { Autocomplete, Box, Grid, TextField, Typography } from '@mui/material'
import { Fragment, SyntheticEvent, useEffect, useState } from 'react'
import { BranchAPI } from 'src/api-client/Branch'
import { KEY } from 'src/common/Keys'
import { BranchModel, QueryBranchModel } from 'src/models/Branch'
import { CommonRepsonseModel } from 'src/models/common/CommonResponseModel'
import moment from 'moment'
import CalendarMonthSharpIcon from '@mui/icons-material/CalendarMonthSharp'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DatePicker, { registerLocale } from 'react-datepicker'
import vi from 'date-fns/locale/vi'

import SearchTextField, { DataSearchByKeyword } from 'src/layouts/components/search/SearchTextField'
import { LIST_DELIVERY_STATUS } from 'src/common/delivery-status'
import { ObjectLabel } from 'src/models/common/CommonModel'
import { ItemAPI } from 'src/api-client/Item'
import { ItemSearchKeywordModel } from 'src/models/Item'
import { FilterDeliveryRequestList } from 'src/models/DeliveryRequest'
import SearchTextFieldOnEnter from 'src/layouts/components/search/SearchTextFieldOnEnter'

registerLocale('vi', vi)
export interface IFilterDeliveryRequestProps {
  setFilterObject: (value: FilterDeliveryRequestList) => void
  filterObject: FilterDeliveryRequestList | undefined
  type: string
}

export default function FilterDeliveryRequest(props: IFilterDeliveryRequestProps) {
  const [branches, setBranches] = useState<BranchModel[]>([])
  const [items, setItems] = useState<ItemSearchKeywordModel[]>([])
  const [address, setAddress] = useState<string>('')

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

  const handleSearchItem = async (keyword: string) => {
    try {
      const response = await ItemAPI.searchItemWithKeyword({
        searchKeyWord: keyword,
        pageSize: 10000
      })
      const commonReponse = new CommonRepsonseModel<ItemSearchKeywordModel[]>(response)
      setItems(commonReponse.data || [])
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Fragment>
      <DatePickerWrapper>
        <Grid container spacing={3} justifyContent={'flex-end'}>
          <Grid item lg={3} md={6} sm={6} xs={6} key={'search-pick-point'}>
            <SearchTextFieldOnEnter
              handleChangeValue={function (name: string | undefined): void {
                props.setFilterObject({
                  ...props.filterObject,
                  page: 1,
                  keyWord: name
                } as FilterDeliveryRequestList)
              }}
              label={
                props.type === KEY.DELIVERY_TYPE.DONATED_REQUEST_TO_BRANCH
                  ? 'Tên người dùng'
                  : props.type === KEY.DELIVERY_TYPE.BRANCH_TO_AID_REQUEST
                  ? 'Tên tổ chức'
                  : 'Tên đơn vị'
              }
              value={''}
              placeholder={''}
            />
          </Grid>
          {props.type === KEY.DELIVERY_TYPE.DONATED_REQUEST_TO_BRANCH && [
            <Grid item lg={3} md={6} sm={6} xs={6} key={'search-delivery-point'}>
              <Autocomplete
                fullWidth
                noOptionsText='Không có dữ liệu'
                renderInput={params => (
                  <TextField
                    {...params}
                    name='pick-up'
                    placeholder='Chi nhánh thực hiện'
                    label='Chi nhánh thực hiện'
                    size='small'
                    fullWidth
                  />
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
                  props.setFilterObject({
                    ...props.filterObject,
                    branchId: newValue?.id
                  } as FilterDeliveryRequestList)
                }}
              />
            </Grid>
          ]}

          {props.type === KEY.DELIVERY_TYPE.BRANCH_TO_AID_REQUEST && [
            <Grid item lg={3} md={6} sm={6} xs={6} key={'search-pick-point'}>
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
                  props.setFilterObject({
                    ...props.filterObject,
                    branchId: newValue?.id
                  } as FilterDeliveryRequestList)
                }}
              />
            </Grid>
          ]}

          <Grid item lg={3} md={6} sm={6} xs={6}>
            <SearchTextField
              handleChangeValue={function (valueId: string | undefined): void {
                props.setFilterObject({
                  ...props.filterObject,
                  itemId: valueId,
                  page: 1
                } as FilterDeliveryRequestList)
              }}
              label={'Vật phẩm'}
              data={items.map(item => {
                const attribute = item.attributes?.map(x => x.attributeValue || '').join(', ') || ''

                let name = item.name || ''
                if (attribute.length > 0) {
                  name = name + ' (' + attribute + ')'
                }

                return {
                  id: item.itemTemplateId || '',
                  name: name
                } as DataSearchByKeyword
              })}
              callAPI={handleSearchItem}
              value={''}
              placeholder={''}
            />
          </Grid>

          <Grid item lg={3} md={6} sm={6} xs={6}>
            <TextField
              fullWidth
              size='small'
              name='address'
              label='Địa chỉ'
              placeholder='Địa chỉ'
              onChange={e => {
                setAddress(e.target.value)
              }}
              onBlur={() => {
                if (!!address) {
                  props.setFilterObject({
                    ...props.filterObject,
                    address: address
                  } as FilterDeliveryRequestList)
                  setAddress('')
                }
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  props.setFilterObject({
                    ...props.filterObject,
                    address: address
                  } as FilterDeliveryRequestList)
                  setAddress('')
                }
              }}
            />
          </Grid>
          <Grid item lg={3} md={6} sm={6} xs={6}>
            <Autocomplete
              fullWidth
              renderInput={params => (
                <TextField
                  {...params}
                  name='status-delivery'
                  placeholder='Trạng thái'
                  label='Trạng thái'
                  size='small'
                  fullWidth
                />
              )}
              getOptionLabel={option => (option as ObjectLabel).label || KEY.DEFAULT_VALUE}
              options={LIST_DELIVERY_STATUS}
              renderOption={(props, option) => (
                <Box component='li' {...props}>
                  <Typography ml={1} variant='body2' fontWeight={450}>
                    {(option as ObjectLabel).label}
                  </Typography>
                </Box>
              )}
              onChange={(_: SyntheticEvent, newValue: ObjectLabel | null) => {
                props.setFilterObject({
                  ...props.filterObject,
                  status: newValue?.value
                } as FilterDeliveryRequestList)
              }}
            />
          </Grid>
          <Grid item lg={3} md={6} sm={6} xs={6}>
            <DatePicker
              locale={'vi'}
              selected={props.filterObject?.startDate ? moment(props.filterObject?.startDate).toDate() : null}
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
                props.setFilterObject({
                  ...props.filterObject,
                  startDate: date?.toISOString() ?? ''
                } as FilterDeliveryRequestList)
              }}
              todayButton='Hôm nay'
              isClearable
            />
          </Grid>
          <Grid item lg={3} md={6} sm={6} xs={6}>
            <DatePicker
              locale={'vi'}
              selected={props.filterObject?.endDate ? moment(props.filterObject?.endDate).toDate() : null}
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
                props.setFilterObject({
                  ...props.filterObject,
                  endDate: date?.toISOString() ?? ''
                } as FilterDeliveryRequestList)
              }}
              todayButton='Hôm nay'
              isClearable
            />
          </Grid>
        </Grid>
      </DatePickerWrapper>
    </Fragment>
  )
}
