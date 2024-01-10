import { Verified } from '@mui/icons-material'
import { Autocomplete, Grid, IconButton, TextField } from '@mui/material'
import { Account, Magnify } from 'mdi-material-ui'
import * as React from 'react'
import { LIST_COLLABORATOR_STATUS } from 'src/common/constants'

export interface IFilterCollaboratorsProps {
  filter: any
  setFilter: (value: any) => void
}

export default function FilterCollaborators(props: IFilterCollaboratorsProps) {
  const { filter, setFilter } = props

  const [name, setName] = React.useState<string>(filter?.name)

  return (
    <Grid container spacing={2} mb={3} justifyContent={'flex-start'}>
      <Grid item xl={3} lg={3} md={4} sm={6} xs={12}>
        <TextField
          value={name}
          size='small'
          label='Tên cộng tác viên'
          placeholder='Tên cộng tác viên'
          fullWidth
          onChange={e => {
            setName(e.target.value)
          }}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              setFilter({
                ...filter,
                name: name
              })
            }
          }}
          InputProps={{
            startAdornment: <Account color='primary' />
          }}
        />
      </Grid>
      <Grid item xl={3} lg={3} md={4} sm={6} xs={12}>
        <Autocomplete
          size='small'
          disablePortal
          fullWidth
          renderInput={params => (
            <TextField
              {...params}
              InputProps={{
                ...params.InputProps,
                startAdornment: <Verified color='primary' />
              }}
              name='unit'
              placeholder='Trạng thái'
              label='Trạng thái'
              fullWidth
            />
          )}
          getOptionLabel={option => option.label ?? '_'}
          options={LIST_COLLABORATOR_STATUS}
          onChange={(_: React.SyntheticEvent, newValue) => {
            setFilter({
              ...filter,
              status: newValue?.value
            })
          }}
        />
      </Grid>
      <Grid item>
        <IconButton color='primary'>
          <Magnify />
        </IconButton>
      </Grid>
    </Grid>
  )
}
