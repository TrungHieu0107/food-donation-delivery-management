import * as React from 'react'
import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import { DonatedItemResponseModel } from 'src/models/DonatedRequest'
import DonatedItemTag from '../chi-tiet/DonatedItemTag'
import { Box, Paper, Typography } from '@mui/material'
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft'
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import { customColor } from 'src/@core/theme/color'

interface TransferSelectedDonatedItemProps {
  donatedItems: DonatedItemResponseModel[]
  handleChangeItemSelected: (value: DonatedItemResponseModel[], isAdding: boolean) => void
  donatedItemLeft: DonatedItemResponseModel[]
  donatedItemRight: DonatedItemResponseModel[]
}

export default function TransferSelectedDonatedItem({
  handleChangeItemSelected,
  donatedItemLeft,
  donatedItemRight
}: TransferSelectedDonatedItemProps) {
  const [leftChecked, setLeftChecked] = React.useState<DonatedItemResponseModel[]>([])
  const [rightChecked, setRightChecked] = React.useState<DonatedItemResponseModel[]>([])

  const handleCheckedRight = (item: DonatedItemResponseModel, isChecked: boolean) => {
    if (isChecked) {
      setRightChecked([...rightChecked.filter(i => i.id !== item.id)])

      return
    }
    setRightChecked([...rightChecked, item])
  }

  const handleCheckedLeft = (item: DonatedItemResponseModel, isChecked: boolean) => {
    if (isChecked) {
      setLeftChecked([...leftChecked.filter(i => i.id !== item.id)])

      return
    }
    setLeftChecked([...leftChecked, item])
  }

  const handleAllLeft = () => {
    handleChangeItemSelected(donatedItemRight, false)
    setLeftChecked([])
    setRightChecked([])
  }

  const handleAllRight = () => {
    handleChangeItemSelected(donatedItemLeft, true)
    setLeftChecked([])
    setRightChecked([])
  }

  const customList = (items: DonatedItemResponseModel[] = [], isLeft: boolean) => (
    <Paper
      sx={{
        height: '100%',
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '16px',
        backgroundImage:
          customColor.primaryGradient
      }}
      elevation={6}
    >
      <Typography fontWeight={700} m={2} textAlign={'center'} color={'white'}>
        {isLeft ? 'Từ chối' : 'Chấp nhận'}({items.length})
      </Typography>
      <Box
        flexGrow={1}
        sx={{
          maxHeight: '400px',
          minHeight: '170px',
          overflow: 'auto',
          borderRadius: '6px',
          border: '1px solid',
          borderColor: theme => theme.palette.grey[500],
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'stretch'
        }}
      >
        <List
          dense
          component='div'
          role='list'
          sx={{
            height: '100%'
          }}
        >
          {items &&
            items?.map(value => {
              const labelId = `transfer-list-item-${value}-label`
              const isChecked = isLeft
                ? leftChecked.filter(val => val.id === value.id)?.length > 0
                : rightChecked.filter(val => val.id === value.id)?.length > 0

              return (
                <ListItem
                  key={value.id}
                  role='listitem'
                  sx={{
                    paddingLeft: 0
                  }}
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
                    color={'secondary'}
                      checked={isChecked}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{
                        'aria-labelledby': labelId
                      }}
                    />
                  </ListItemIcon>
                  <DonatedItemTag donatedItem={value} />
                </ListItem>
              )
            })}
        </List>
      </Box>
    </Paper>
  )

  return (
    <Grid container gap={2} justifyContent='center' alignItems='center'>
      <Grid
        item
        sx={{
          width: '510px',
          height: '100%'
        }}
      >
        {customList(donatedItemLeft, true)}
      </Grid>
      <Grid item>
        <Grid container direction='column' alignItems='center'>
          <Button
            sx={{ my: 0.5, ...(donatedItemLeft?.length === 0 && { cursor: 'not-allowed' }) }}
            variant='contained'
            color='secondary'
            size='small'
            onClick={handleAllRight}
            disabled={donatedItemLeft?.length === 0}
            aria-label='move all right'
          >
            <KeyboardDoubleArrowRightIcon />
          </Button>
          <Button
            sx={{ my: 0.5, ...(leftChecked?.length === 0 && { cursor: 'not-allowed' }) }}
            variant='contained'
            color='secondary'
            size='small'
            onClick={() => {
              handleChangeItemSelected(leftChecked, true)
              setLeftChecked([])
            }}
            disabled={leftChecked?.length === 0}
            aria-label='move selected right'
          >
            <KeyboardArrowRightIcon />
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant='contained'
            color='secondary'
            size='small'
            onClick={() => {
              handleChangeItemSelected(rightChecked, false)
              setRightChecked([])
            }}
            disabled={rightChecked?.length === 0}
            aria-label='move selected left'
          >
            <KeyboardArrowLeftIcon />
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant='contained'
            color='secondary'
            size='small'
            onClick={handleAllLeft}
            disabled={donatedItemRight?.length === 0}
            aria-label='move all left'
          >
            <KeyboardDoubleArrowLeftIcon />
          </Button>
        </Grid>
      </Grid>
      <Grid
        item
        sx={{
          width: '510px',
          height: '100%'
        }}
      >
        {customList(donatedItemRight, false)}
      </Grid>
    </Grid>
  )
}
