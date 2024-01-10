import * as React from 'react'
import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import { ScheduledTime } from 'src/models/DonatedRequest'
import { Typography } from '@mui/material'
import {
  ChevronDoubleLeft,
  ChevronDoubleRight,
  ChevronLeft,
  ChevronRight,
  ClipboardTextClockOutline
} from 'mdi-material-ui'

interface TransferDateSelectedProps {
  scheduleTimes: ScheduledTime[]
  handleChangeItemSelected: (value: ScheduledTime[], isAdding: boolean) => void
  timeLeft: ScheduledTime[]
  timeRight: ScheduledTime[]
}

export default function TransferDateSelected({
  scheduleTimes,
  handleChangeItemSelected,
  timeLeft,
  timeRight
}: TransferDateSelectedProps) {
  const [leftChecked, setLeftChecked] = React.useState<ScheduledTime[]>([])
  const [rightChecked, setRightChecked] = React.useState<ScheduledTime[]>([])

  const handleCheckedRight = (item: ScheduledTime, isChecked: boolean) => {
    if (isChecked) {
      setRightChecked([...rightChecked.filter(i => i.day !== item.day)])

      return
    }
    setRightChecked([...rightChecked, item])
  }

  const handleCheckedLeft = (item: ScheduledTime, isChecked: boolean) => {
    if (isChecked) {
      setLeftChecked([...leftChecked.filter(i => i.day !== item.day)])

      return
    }
    setLeftChecked([...leftChecked, item])
  }

  const handleAllLeft = () => {
    handleChangeItemSelected(scheduleTimes, false)
    setLeftChecked([])
    setRightChecked([])
  }

  const handleAllRight = () => {
    handleChangeItemSelected(scheduleTimes, true)
    setLeftChecked([])
    setRightChecked([])
  }

  const customList = (items: ScheduledTime[], isLeft: boolean) => (
    <Grid
      item
      lg
      md
      sm
      xs
      container
      justifyContent={'space-between'}
      flexDirection={'column'}
      flexWrap={'nowrap'}
      sx={{
        maxHeight: '400px',
        minHeight: '170px'
      }}
      alignSelf={'stretch'}
    >
      <Grid item>
        <Typography fontWeight={500} my={2} textAlign={'center'}>
          {isLeft ? 'Từ chối' : 'Chấp nhận'} {`(${items.length})`}
        </Typography>
      </Grid>
      {items?.length === 0 ? (
        <Grid
          item
          container
          lg
          md
          sm
          xs
          justifyContent={'space-between'}
          flexDirection={'column'}
          height={'100%'}
          flexWrap={'nowrap'}
          sx={{ borderRadius: '6px', border: '1px solid', backgroundColor: theme => theme.palette.common.white }}
        >
          <Grid item></Grid>
          <Grid item></Grid>
        </Grid>
      ) : (
        <List
          dense
          component='div'
          role='list'
          sx={{
            height: '100%',
            maxHeight: '400px',
            overflow: 'auto',
            borderRadius: '6px',
            border: '1px solid',
            backgroundColor: theme => theme.palette.common.white
          }}
        >
          {items?.map(value => {
            const labelId = `transfer-list-item-${value}-label`
            const isChecked = isLeft
              ? leftChecked.filter(val => val.day === value.day)?.length > 0
              : rightChecked.filter(val => val.day === value.day)?.length > 0

            return (
              <ListItem
                key={value.day}
                role='listitem'
                button
                onClick={() => {
                  if (isLeft) {
                    handleCheckedLeft(value, isChecked)
                  } else {
                    handleCheckedRight(value, isChecked)
                  }
                }}
               
              >
                <ListItemIcon>
                  <Checkbox
                    checked={isChecked}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{
                      'aria-labelledby': labelId
                    }}
                  />
                </ListItemIcon>
                <Grid container spacing={3} alignItems={'center'}>
                  <Grid item>
                    <ClipboardTextClockOutline />
                  </Grid>
                  <Grid item>{value.day}</Grid>
                  <Grid item>{`${value.startTime} - ${value.endTime}`}</Grid>
                </Grid>
              </ListItem>
            )
          })}
        </List>
      )}
    </Grid>
  )

  return (
    <Grid container spacing={2} justifyContent='center' alignItems='center'>
      {customList(timeLeft, true)}
      <Grid item height={'100%'}>
        <Grid container direction='column' alignItems='center' height={'100%'}>
          <Button
            sx={{ my: 0.5, backgroundColor: theme => theme.palette.common.white }}
            variant='outlined'
            size='small'
            onClick={handleAllRight}
            disabled={timeLeft?.length === 0}
            aria-label='move all right'
          >
            <ChevronDoubleRight />
          </Button>
          <Button
            sx={{ my: 0.5, backgroundColor: theme => theme.palette.common.white }}
            variant='outlined'
            size='small'
            onClick={() => {
              handleChangeItemSelected(leftChecked, true)
              setLeftChecked([])
            }}
            disabled={leftChecked?.length === 0}
            aria-label='move selected right'
          >
            <ChevronRight />
          </Button>
          <Button
            sx={{ my: 0.5, backgroundColor: theme => theme.palette.common.white }}
            variant='outlined'
            size='small'
            onClick={() => {
              handleChangeItemSelected(rightChecked, false)
              setRightChecked([])
            }}
            disabled={rightChecked?.length === 0}
            aria-label='move selected left'
          >
            <ChevronLeft />
          </Button>
          <Button
            sx={{ my: 0.5, backgroundColor: theme => theme.palette.common.white }}
            variant='outlined'
            size='small'
            onClick={handleAllLeft}
            disabled={timeRight?.length === 0}
            aria-label='move all left'
          >
            <ChevronDoubleLeft />
          </Button>
        </Grid>
      </Grid>
      {customList(timeRight, false)}
    </Grid>
  )
}
