import * as React from 'react'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress'
import axiosClient from 'src/api-client/ApiClient'
import { Box, InputLabel } from '@mui/material'

export default function SearchActivity(props: any) {
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [dataSearch, setDataSearch] = React.useState<any>([])
  let timeoutId: NodeJS.Timeout
  const fetchData = async (s: string) => {
    try {
      const res = await axiosClient.get(`/activities?name=${s}&isJoined=true&branchId=${props.branchId}&pageSize=100`)
      if (res.data) setDataSearch(res.data)
      else setDataSearch([])
      console.log('activities', res.data)
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
    <Box sx={{ mt: 5, mb: 5 }}>
      <InputLabel sx={{ fontWeight: 700 }}>Tìm kiếm hoạt động để quyên góp</InputLabel>
      <Autocomplete
        id='asynchronous-demo'
        open={open}
        onOpen={() => {
          setOpen(true)
        }}
        onClose={() => {
          setOpen(false)
        }}
        autoHighlight
        onChange={(event, value: any) => {
          console.log(event, value)
          if(typeof(value) === "string"){
            
            return
          }
          if (value) {
            const dataAdd = {
              name: value.name,
              id: value.id
            }
            props.setActivitySelected(dataAdd)
          } else {
            props.setActivitySelected(null)
          }
        }}
        isOptionEqualToValue={(option, value) => option === value}
        getOptionLabel={(option: any) => {
          return option?.name ? option?.name : ""
        }}
        options={dataSearch}
        fullWidth
        loading={loading}
        freeSolo
        filterOptions={options => options}
        renderInput={params => (
          <TextField
            {...params}
            fullWidth
            placeholder='Tìm hoạt động quyên góp ở đây...'
            onChange={handleChange}
            InputProps={{
              ...params.InputProps,
              startAdornment: <>{params.InputProps.startAdornment}</>,
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
    </Box>
  )
}
