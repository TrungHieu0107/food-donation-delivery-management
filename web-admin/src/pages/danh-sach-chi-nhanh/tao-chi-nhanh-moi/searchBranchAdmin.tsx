import * as React from 'react'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress'

// import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
// import { InputAdornment } from '@mui/material'
import axiosClient from 'src/api-client/ApiClient'

export default function SearchBranchAdmin({
  dataSearch,
  setDataSearch,
  setDataSearchSelected
}: // dataSearchSelected,
// type
any) {
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  let timeoutId: NodeJS.Timeout
  const fetchData = async (s: string) => {
    try {
      const res = await axiosClient.get(`/users/branch-admin?searchStr=${s}`)
      if (res.data) setDataSearch(res.data)
      else setDataSearch([])
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(true)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearTimeout(timeoutId)

    timeoutId = setTimeout(() => {
      const inputValue = e.target.value
      if (inputValue !== '') {
        setLoading(true)
        fetchData(e.target.value)
      }
    }, 1000)
  }

  return (
    <Autocomplete
      id='asynchronous-demo'
      open={open}
      fullWidth
      autoHighlight
      onOpen={() => {
        setOpen(true)
      }}
      onClose={() => {
        setOpen(false)
      }}
      onChange={(event, value: any) => {
        console.log(event, value)
        if (value) {
          setDataSearchSelected([value])
        }

        // const valueAddNew = [value[value.length - 1]]
        // setDataSearchSelected(value)
        // console.log(valueAddNew)
        // const filteredArray = dataSearch.filter((item1: any) => !value.some((item2: any) => item2.id === item1.id))
      }}
      isOptionEqualToValue={(option, value) => option === value}
      getOptionLabel={(option: any) => (option?.fullName ? option?.fullName + ' - ' + option?.email : '')}
      options={dataSearch}
      loading={loading}
      freeSolo
      filterOptions={options => options}
      renderInput={params => (
        <TextField
          {...params}
          onChange={handleChange}
          placeholder='Tìm quản trị viên chi nhánh theo từ khóa...'
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <>
                {params.InputProps.startAdornment}
              </>
            ),
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color='inherit' size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            )
          }}
        />
      )}
    />
  )
}
