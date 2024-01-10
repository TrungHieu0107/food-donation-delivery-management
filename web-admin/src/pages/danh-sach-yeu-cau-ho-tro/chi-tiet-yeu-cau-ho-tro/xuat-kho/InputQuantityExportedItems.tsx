import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Chip,
  Grid,
  IconButton,
  TextField,
  Typography
} from '@mui/material'
import { ItemExportForAidRequestSelfShipping } from './ChooseItemToExport'
import { Fragment } from 'react'
import { customColor } from 'src/@core/theme/color'
import { Minus, Plus, TrashCan } from 'mdi-material-ui'
import { isNumber } from 'src/@core/layouts/utils'

export interface IInputQuantityExportedItemsProps {
  items: ItemExportForAidRequestSelfShipping
  setItemSelected: (value: ItemExportForAidRequestSelfShipping) => void

  // stock: MapItemAvaiableStock
  // handleSearchItemsStock: (value: string[]) => void
}

export default function InputQuantityExportedItems(props: IInputQuantityExportedItemsProps) {
  const {
    items = {} as ItemExportForAidRequestSelfShipping,
    setItemSelected,
  } = props

  const hanleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 0) {
      setItemSelected({
        ...items,
        [itemId]: {
          ...items[itemId],
          quantity: 0
        }
      })

      return
    }

    setItemSelected({
      ...items,
      [itemId]: {
        ...items[itemId],
        quantity: quantity
      }
    })
  }

  return (
    <Fragment>
      <Card
        sx={{
          mt: 5
        }}
      >
        <CardHeader
          title={
            <Typography
              fontWeight={600}
              sx={{
                color: customColor.secondary
              }}
            >
              Thông tin vật phẩm chọn
            </Typography>
          }
        />
      </Card>
      <Grid container spacing={3} mt={2} alignItems={'stretch'} justifyContent={'space-between'}>
        {Object.entries(items).map(([key, value]) => {
          const itemInfo = value.itemInfo.item || {}

          return (
            <Grid item key={key} xl={6} lg={6} md={10} xs={11} sm={10} height={'auto'}>
              <Card
                sx={{
                  height: '100%'
                }}
              >
                <CardContent
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    padding: '5px',
                    height: '100%'
                  }}
                >
                  <Box display={'flex'} flexDirection={'column'} width={'100%'}>
                    <Box display={'flex'}>
                      <Box
                        width={'200px'}
                        height={'100px'}
                        padding={'5px'}
                        sx={{
                          backgroundColor: theme => theme.palette.background.paper,
                          borderRadius: '5px'
                        }}
                      >
                        <CardMedia
                          component={'img'}
                          image={itemInfo.image}
                          alt={itemInfo.name}
                          sx={{
                            borderRadius: '15px'
                          }}
                        />
                      </Box>
                      <Box
                        padding={'5px'}
                        sx={{
                          borderRadius: '5px',
                          width: '100%',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <Typography fontWeight={600} variant='h6'>
                          {itemInfo.name}
                        </Typography>
                        <Box display={'flex'} gap={2} flexWrap={'wrap'}>
                          {itemInfo.attributeValues &&
                            itemInfo.attributeValues?.map((item, index) => (
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
                        </Box>

                        <Box display={'flex'} key={'stock'}>
                          <Typography fontWeight={550} variant='body2'>
                            Tồn kho :{' '}
                          </Typography>
                          <Typography
                            variant='body2'
                            sx={{
                              verticalAlign: 'middle'
                            }}
                          >
                            {value.itemInfo?.quantity}
                          </Typography>
                          <Typography
                            variant='body2'
                            sx={{
                              verticalAlign: 'middle'
                            }}
                          >
                            ({itemInfo?.unit})
                          </Typography>
                        </Box>

                        <Box display={'flex'}>
                          <Typography fontWeight={550} variant='body2'>
                            Vận chuyển tối đa :{' '}
                          </Typography>
                          <Typography
                            variant='body2'
                            sx={{
                              verticalAlign: 'middle'
                            }}
                          >
                            {`${itemInfo?.maximumTransportVolume}`}
                          </Typography>
                          <Typography
                            variant='body2'
                            sx={{
                              verticalAlign: 'middle'
                            }}
                          >
                            ({itemInfo?.unit})
                          </Typography>
                        </Box>
                      </Box>

                      <Box
                        width={'200px'}
                        padding={'5px'}
                        sx={{
                          borderRadius: '5px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'stretch'
                        }}
                      >
                        <Typography fontWeight={550} textAlign={'center'}>
                          Số lượng cho
                        </Typography>
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            height: '100%',
                            alignItems: 'center',
                            gap: 1
                          }}
                        >
                          <IconButton
                            onClick={() => hanleUpdateQuantity(key, value.quantity - 1)}
                            disabled={value.quantity === 0}
                          >
                            <Minus />
                          </IconButton>
                          <TextField
                            size='small'
                            inputProps={{
                              style: {
                                textAlign: 'center'
                              }
                            }}
                            sx={{
                              width: '70px'
                            }}
                            value={value.quantity}
                            onChange={e => {
                              if (!e.target.value) {
                                hanleUpdateQuantity(key, 0)
                              }

                              if (isNumber(e.target.value)) {
                                hanleUpdateQuantity(
                                  key,
                                  +e.target.value > (value.itemInfo.quantity || 0)
                                    ? value.itemInfo.quantity || 0
                                    : +e.target.value
                                )
                              }
                            }}
                          />
                          <IconButton
                            onClick={() => {
                              hanleUpdateQuantity(key, value.quantity + 1)
                            }}
                            disabled={value.quantity === (value.itemInfo.quantity || 0)}
                          >
                            <Plus />
                          </IconButton>
                        </Box>
                      </Box>
                    </Box>

                    <Box display={'flex'} width={'100%'}>
                      <TextField
                        multiline
                        maxRows={5}
                        minRows={1}
                        label='Ghi chú'
                        fullWidth
                        onChange={e => {
                          if (e.target.value.length >= 500) return
                          setItemSelected({
                            ...items,
                            [key]: {
                              ...items[key],
                              note: e.target.value
                            }
                          })
                        }}
                      />
                    </Box>
                  </Box>
                  <Box display={'flex'} alignItems={'center'} padding={'10px'} width={'50px'}>
                    <IconButton
                      onClick={() => {
                        const newItems = { ...items }
                        delete newItems[key]
                        setItemSelected({
                          ...newItems
                        })
                      }}
                    >
                      <TrashCan color='error' />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )
        })}
        
        {/* <Grid item xl={6} lg={6} md={10} xs={11} sm={10} height={'auto'}>
          <Card
            sx={{
              height: '100%',
              minHeight: '70px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <AddOtherItems
              stock={stock}
              handleSelectItem={function (itemId: string) {
                const item = stock.get(itemId)

                const newValue = {
                  ...items,
                  [itemId]: {
                    quantity: 1,
                    itemId: itemId,
                    note: '',
                    itemInfo: item
                  }
                } as ItemExportForAidRequestSelfShipping

                setItemSelected(newValue)
              }}
              itemSelected={items}
              handleSearchItemsStock={handleSearchItemsStock}
            />
          </Card>
        </Grid> */}
      </Grid>
    </Fragment>
  )
}
