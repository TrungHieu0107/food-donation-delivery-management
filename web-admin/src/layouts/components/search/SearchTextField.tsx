import { Autocomplete, Box, TextField, Typography } from '@mui/material'
import { SyntheticEvent, useEffect, useState } from 'react'
import { KEY } from 'src/common/Keys'

export interface ISearchTextFieldProps {
  handleChangeValue: (valueId: string | undefined, name: string | undefined) => void
  label: string
  data: DataSearchByKeyword[]
  callAPI: (name: string) => void
  size?: 'small' | 'medium'
  value: string
  placeholder: string | undefined
}

export type DataSearchByKeyword = {
  id: string
  name: string
}

export default function SearchTextField(props: ISearchTextFieldProps) {
  const [isFetching, setIsFetching] = useState<boolean>(false)
  const [keyword, setKeyword] = useState<string>('')
  const [data, setData] = useState<DataSearchByKeyword[]>(props.data || [])

  useEffect(() => {
    setData(props.data)
  }, [props.data])
  const handleKeyDown = async (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      try {
        setIsFetching(true)
        setData([])

        await props.callAPI(keyword)
      } catch (error) {
        console.log(error)
      } finally {
        setIsFetching(false)
      }
    }
  }

  return (
    <Autocomplete
      fullWidth
      loading={isFetching}
      loadingText='Đang tìm kiếm...'
      noOptionsText='Không có dữ liệu'
      renderInput={params => (
        <TextField
          {...params}
          name='pick-up'
          placeholder={props.placeholder}
          label={props.label}
          size='small'
          fullWidth
          onChange={e => {
            setKeyword(e.target.value)
          }}
          onKeyDown={handleKeyDown}
        />
      )}
      getOptionLabel={option => (option as DataSearchByKeyword).name || KEY.DEFAULT_VALUE}
      options={data}
      renderOption={(props, option) => (
        <Box component='li' {...props} key={option.id}>
          <Typography ml={1} variant='body2' fontWeight={450}>
            {(option as DataSearchByKeyword).name}
          </Typography>
        </Box>
      )}
      onChange={(_: SyntheticEvent, newValue: DataSearchByKeyword | null) => {
        props.handleChangeValue(newValue?.id, newValue?.id)
        setData([])
      }}
      clearText='Xóa'
    />
  )
}
