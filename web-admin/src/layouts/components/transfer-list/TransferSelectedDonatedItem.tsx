import * as React from 'react'
import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import { Box, Paper, Typography } from '@mui/material'
import ItemTag from './ItemTag'
import { customColor } from 'src/@core/theme/color'
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft'
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import { TransferItemListObject } from 'src/models/common/CommonResponseModel'

interface TransferSelectedDonatedItemProps {
  donatedItems: TransferItemListObject[]
  handleChangeItemSelected: (value: TransferItemListObject[], isAdding: boolean) => void
  donatedItemLeft: TransferItemListObject[]
  donatedItemRight: TransferItemListObject[]
}

export default function TransferSelectedDonatedItem({
  handleChangeItemSelected,
  donatedItemLeft,
  donatedItemRight
}: TransferSelectedDonatedItemProps) {
  const [leftChecked, setLeftChecked] = React.useState<TransferItemListObject[]>([])
  const [rightChecked, setRightChecked] = React.useState<TransferItemListObject[]>([])

  const handleCheckedRight = (item: TransferItemListObject, isChecked: boolean) => {
    if (isChecked) {
      setRightChecked([...rightChecked.filter(i => i.id !== item.id)])

      return
    }
    setRightChecked([...rightChecked, item])
  }

  const handleCheckedLeft = (item: TransferItemListObject, isChecked: boolean) => {
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

  const customList = (items: TransferItemListObject[] = [], isLeft: boolean) => (
    <Paper
      sx={{
        height: '100%',
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '16px',
        backgroundImage: customColor.primaryGradient
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
                  <ItemTag itemData={value} />
                </ListItem>
              )
            })}
        </List>
      </Box>
    </Paper>
  )

  return (
    <Grid container gap={2} justifyContent='center' alignItems='stretch'>
      <Grid
        item
        sx={{
          width: '510px',
          height: 'auto'
        }}
      >
        {customList(donatedItemLeft, true)}
      </Grid>

      <Grid
        item
        sx={{
          height: 'auto',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column'
        }}
      >
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
      <Grid
        item
        sx={{
          width: '510px',
          height: 'auto'
        }}
      >
        {customList(donatedItemRight, false)}
      </Grid>
    </Grid>
  )
}
