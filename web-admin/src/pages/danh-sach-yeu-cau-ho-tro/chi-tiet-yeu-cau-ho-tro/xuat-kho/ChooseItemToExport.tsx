import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Checkbox,
  Chip,
  Grid,
  Skeleton,
  Typography,
  TypographyProps,
  styled
} from '@mui/material'
import { Fragment } from 'react'
import { customColor } from 'src/@core/theme/color'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { AidItemResponseModel } from 'src/models/AidRequest'
import { ItemAvaliableInStockModel } from 'src/models/Item'
import { MapItemAvaiableStock } from 'src/pages/van-chuyen/tao-moi/ChooseItemDelivery'

export interface IChooseItemToExportProps {
  items: AidItemResponseModel[]
  isLoading: boolean
  itemSelected: ItemExportForAidRequestSelfShipping
  setItemSelected: (value: ItemExportForAidRequestSelfShipping) => void
  isFindingStock: boolean
  stockAvailable: MapItemAvaiableStock
}

const Label = styled(Typography)<TypographyProps>(() => ({
  textAlign: 'left',
  fontWeight: 550,
  whiteSpace: 'nowrap',
  paddingRight: '5px'
}))

export type ItemExportForAidRequestSelfShipping = {
  [key: string]: {
    quantity: number
    itemId: string
    note: string
    itemInfo: ItemAvaliableInStockModel
  }
}

export default function ChooseItemToExport(props: IChooseItemToExportProps) {
  const {
    items = [],
    isLoading,
    itemSelected = {},
    setItemSelected,
    isFindingStock,
    stockAvailable = new Map<string, ItemAvaliableInStockModel>()
  } = props

  const isSelected = (itemId: string) => {
    const result = itemSelected[itemId]

    return !!result
  }

  const handleSelectItem = (itemId: string) => {
    if (isSelected(itemId)) {
      const tmp = {... itemSelected}
      delete tmp[itemId]

      setItemSelected({...tmp})
      
    } else {
      const item = stockAvailable.get(itemId)

      const newValue = {
        ...itemSelected,
        [itemId]: {
          quantity: 1,
          itemId: itemId,
          note: '',
          itemInfo: item
        }
      } as ItemExportForAidRequestSelfShipping

      setItemSelected(newValue)
    }
  }

  return (
    <Fragment>
      <Card>
        <CardHeader
          title={
            <Typography
              fontWeight={600}
              sx={{
                color: customColor.secondary
              }}
            >
              Vật phẩm cần hỗ trợ
            </Typography>
          }
        />
        <CardContent>
          <Grid container spacing={3} alignItems={'stretch'}>
            {!isLoading && items
              ? items?.map((item, index) => {
                const quantityStock = stockAvailable.get(item?.itemResponse?.id || '')?.quantity || 0

                  return (
                    <Grid item key={index} xl={4} lg={4} md={6} xs={12} sm={12}>
                      <Grid
                        container
                        sx={{
                          width: 'auto',
                          height: 'auto',
                          minHeight: '150px',
                          padding: '3px',
                          borderRadius: '5px',
                          backgroundColor: customColor.itemTagColor,
                          position: 'relative',
                          ...(quantityStock > 0
                            ? {
                                cursor: 'pointer',
                                ':hover': {
                                  backgroundColor: () => hexToRGBA(customColor.primary, 0.5),
                                  backgroundPosition: 'cover'
                                }
                              }
                            : {
                                cursor: 'not-allowed'
                              })
                        }}
                        alignItems={'center'}
                        flexWrap={'nowrap'}
                        className='shadow'
                        onClick={() => {
                          if (quantityStock === 0) return
                          handleSelectItem(item.itemResponse?.id || '')
                        }}
                      >
                        <Checkbox
                          checked={isSelected(item.itemResponse?.id || '')}
                          sx={{
                            position: 'absolute',
                            right: 10
                          }}
                        />
                        {item.status === 'REPLACED' && (
                          <Chip
                            color='success'
                            label={
                              <Typography
                                fontWeight={600}
                                variant='caption'
                                sx={{
                                  color: theme => theme.palette.common.white
                                }}
                              >
                                Vật phẩm thay thế
                              </Typography>
                            }
                            size='small'
                            sx={{
                              position: 'absolute',
                              bottom: 5,
                              left: 3
                            }}
                          />
                        )}
                        <Grid
                          item
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%'
                          }}
                        >
                          <Box
                            sx={{
                              padding: '5px',
                              borderRadius: '5px',
                              width: '130px',
                              height: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              backgroundColor: theme => theme.palette.background.paper
                            }}
                          >
                            <CardMedia
                              image={item?.itemResponse?.image}
                              component={'img'}
                              sx={{
                                maxWidth: '130px',
                                borderRadius: '5px'
                              }}
                            />
                          </Box>
                        </Grid>
                        <Grid
                          item
                          container
                          flexDirection={'column'}
                          sx={{
                            paddingLeft: '10px'
                          }}
                        >
                          <Grid item display={'flex'} gap={1}>
                            <Typography
                              variant='body1'
                              sx={{
                                verticalAlign: 'middle'
                              }}
                              fontWeight={700}
                            >
                              {item?.itemResponse?.name}
                            </Typography>
                          </Grid>
                          <Grid item display={'flex'} gap={2}>
                            {item?.itemResponse?.attributeValues &&
                              item?.itemResponse?.attributeValues.length > 0 &&
                              item?.itemResponse.attributeValues.map((item, index) => (
                                <Chip
                                  key={index}
                                  label={item}
                                  color='success'
                                  size='small'
                                  sx={{
                                    minWidth: '50px'
                                  }}
                                ></Chip>
                              ))}
                          </Grid>
                          <Grid item display={'flex'}>
                            <Label variant='body2'>Cần hỗ trợ : </Label>
                            <Typography
                              variant='body2'
                              sx={{
                                verticalAlign: 'middle'
                              }}
                            >
                              {`${item?.quantity}`}
                            </Typography>
                          </Grid>
                          <Grid item display={'flex'} key={'exported'}>
                            <Label variant='body2'>Đã hỗ trợ : </Label>
                            <Typography
                              variant='body2'
                              sx={{
                                verticalAlign: 'middle'
                              }}
                            >
                              {item?.exportedQuantity}
                              <Typography component={'span'}>({item?.itemResponse?.unit})</Typography>
                            </Typography>
                          </Grid>
                          <Grid item display={'flex'} key={'stock'}>
                            <Label variant='body2'>Tồn kho : </Label>
                            {!isFindingStock ? (
                              <Typography
                                variant='body2'
                                sx={{
                                  verticalAlign: 'middle'
                                }}
                              >
                                {`${quantityStock}`}
                              </Typography>
                            ) : (
                              <Typography
                                variant='caption'
                                sx={{
                                  verticalAlign: 'middle'
                                }}
                              >
                                Đang tìm...
                              </Typography>
                            )}
                          </Grid>
                          <Grid item display={'flex'}>
                            <Label variant='body2'>Vận chuyển tối đa : </Label>
                            <Typography
                              variant='body2'
                              sx={{
                                verticalAlign: 'middle'
                              }}
                            >
                              {`${item?.itemResponse?.maximumTransportVolume}`}
                              <Typography component={'span'}>({item?.itemResponse?.unit})</Typography>
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  )
                })
              : [0, 1].map(item => (
                  <Card key={item}>
                    <Skeleton width={'450px'} height={'200px'} />
                  </Card>
                ))}
          </Grid>
        </CardContent>
      </Card>
    </Fragment>
  )
}
