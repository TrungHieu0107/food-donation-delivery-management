import { TextField } from '@mui/material'
import { useState } from 'react'

export interface ISearchTextFieldProps {
  handleChangeValue: (value: string | undefined) => void
  label: string
  size?: 'small' | 'medium'
  value: string
  placeholder: string | undefined
}

export default function SearchTextFieldOnEnter(props: ISearchTextFieldProps) {
  const [keyword, setKeyword] = useState<string>('')

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      props.handleChangeValue(keyword)
    }
  }

  return (
    <TextField
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
  )
}
