import { Fragment, useEffect, useState } from 'react'
import { DeliveryRequestAPI } from 'src/api-client/DeliveryRequest'
import { DeliveryRequestDetailModel } from 'src/models/DeliveryRequest'
import { CommonRepsonseModel } from 'src/models/common/CommonResponseModel'
import DialogCustom from 'src/@core/layouts/components/shared-components/Dialog'
import { Box, Button, Divider, Stack, Typography } from '@mui/material'

import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency'
import ImportStockInfo from './InportStockInfo'
import InfoColaborator from './InfoColaborator'

export interface IImportStockDialogProps {
  id: string
}

export default function ImportStockDialog(props: IImportStockDialogProps) {
  const { id = '4f1c34b7-6276-ee11-9f24-005056c00008' } = props

  //states
  const [data, setData] = useState<DeliveryRequestDetailModel>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [open, setOpen] = useState<boolean>(false)

  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const response = await DeliveryRequestAPI.getDetailOfDeliveryRequest(id)

      setData(new CommonRepsonseModel<DeliveryRequestDetailModel>(response).data)
    } catch (error) {
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setOpen(false)
    setData(undefined)
  }

  return (
    <Fragment>
      <Button
        onClick={() => {
          setOpen(true)
        }}
      >
        Nhập kho
      </Button>
      <DialogCustom
        content={
          <Stack
            divider={<Divider />}
            sx={{
              padding: '10px'
            }}
            flexDirection={'column'}
          >
            <Stack
              divider={<Divider orientation='vertical' flexItem />}
              sx={{
                padding: '10px'
              }}
              flexDirection={'row'}
              flexWrap={'nowrap'}
              gap={2}
            >
              <Box display={'flex'} flexDirection={'column'} gap={3}>
                <Box display={'flex'} gap={2}>
                  <ContactEmergencyIcon color='secondary' />
                  <Typography
                    fontWeight={600}
                    sx={{
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    Thông tin quyên góp
                  </Typography>
                </Box>
                <ImportStockInfo
                  data={{
                    name: data?.pickUpPoint?.name,
                    address: data?.pickUpPoint?.address,
                    avatar: data?.pickUpPoint?.avatar,
                    phone: data?.pickUpPoint?.phone
                  }}
                  isLoading={isLoading}
                />
              </Box>
              <Box display={'flex'} flexDirection={'column'} gap={3}>
                <Box display={'flex'} gap={2}>
                  <ContactEmergencyIcon color='secondary' />
                  <Typography
                    fontWeight={600}
                    sx={{
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    Thông tin người vận chuyển
                  </Typography>
                </Box>
                <InfoColaborator
                  data={{
                    name: data?.collaborator?.name,
                    avatar: data?.collaborator?.avatar,
                    phone: data?.collaborator?.phone
                  }}
                  isLoading={isLoading}
                />
              </Box>
            </Stack>
            <Box>
              <Box display={'flex'} gap={2}>
                <ContactEmergencyIcon color='secondary' />
                <Typography
                  fontWeight={600}
                  sx={{
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis'
                  }}
                >
                  Thông tin nhập kho
                </Typography>
              </Box>
            </Box>
          </Stack>
        }
        handleClose={handleClose}
        open={open}
        title={'Nhập kho hàng'}
        actionDialog={undefined}
      />
    </Fragment>
  )
}
