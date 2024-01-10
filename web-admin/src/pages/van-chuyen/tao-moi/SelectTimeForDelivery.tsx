import { Card, Typography } from '@mui/material'
import moment from 'moment'
import { Fragment, useEffect, useState } from 'react'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import TransferDateSelected from 'src/layouts/components/transfer-list/TransferDateSelected'
import { ScheduledTime } from 'src/models/DonatedRequest'

export interface ISelectTimeForDeliveryProps {
  scheduleTimes: ScheduledTime[]
  setItemSelected: (value: ScheduledTime[]) => void
  error?: string
}

export default function SelectTimeForDelivery(props: ISelectTimeForDeliveryProps) {
  const [scheduleLeft, setScheduleLeft] = useState<ScheduledTime[]>([])
  const [scheduleRight, setScheduleRight] = useState<ScheduledTime[]>([])
  const [listSchedule, setListSchedule] = useState<ScheduledTime[]>([])

  useEffect(() => {
    console.log(props.scheduleTimes)
    const now = moment()
    const newList = [...props.scheduleTimes].filter(scheduledTime => {
      return moment(scheduledTime.day).isAfter(now)
    })
    setListSchedule(newList)
    setScheduleLeft(newList)
  }, [props.scheduleTimes])

  const handleScheduleRightChange = (value: ScheduledTime[]) => {
    props.setItemSelected(value)
    setScheduleRight(value)
  }

  const handleChangeScheduleSelected = (value: ScheduledTime[], isAdding: boolean) => {
    if (value.length === props.scheduleTimes.length) {
      if (isAdding) {
        handleScheduleRightChange([...props.scheduleTimes])
        setScheduleLeft([])
      } else {
        setScheduleLeft([...props.scheduleTimes])
        handleScheduleRightChange([])
      }

      return
    }

    if (isAdding) {
      const newItemSelected: ScheduledTime[] = scheduleRight ?? []
      const newItemUnSelected: ScheduledTime[] = []
      scheduleLeft.map(item => {
        const itemSelected = value.filter(i => item.day === i.day).at(0)
        if (itemSelected) {
          newItemSelected.push(item)
        } else {
          newItemUnSelected.push(item)
        }
      })

      handleScheduleRightChange([...newItemSelected])
      setScheduleLeft([...newItemUnSelected])
    } else {
      const newItemSelected: ScheduledTime[] = []
      const newItemUnSelected: ScheduledTime[] = scheduleLeft

      scheduleRight.map(item => {
        const itemSelected = value.filter(i => item.day === i.day).at(0)
        if (itemSelected) {
          newItemUnSelected.push(item)
        } else {
          newItemSelected.push(item)
        }
      })
      handleScheduleRightChange([...newItemSelected])
      setScheduleLeft([...newItemUnSelected])
    }
  }

  return (
    <Fragment>
      <Card sx={{
        paddingBottom: '10px',
        paddingX: '10px',
        backgroundColor: theme => `${hexToRGBA(theme.palette.secondary[theme.palette.mode], 0.1)}`
      }}>
        <TransferDateSelected
          scheduleTimes={listSchedule}
          handleChangeItemSelected={handleChangeScheduleSelected}
          timeLeft={scheduleLeft}
          timeRight={scheduleRight}
        />
        {props.error && <Typography color={'error'}>{props.error}</Typography>}
      </Card>
    </Fragment>
  )
}
