import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Checkbox,
  Chip,
  Grid,
  IconButton,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  TypographyProps,
  styled
} from '@mui/material'
import { useEffect, useState } from 'react'
import { KEY } from 'src/common/Keys'
import TableLabel from 'src/layouts/components/table/TableLabel'
import { DeliveryItemModel, DeliveryType } from 'src/models/DeliveryRequest'
import { DonatedItemResponseModel, ItemTemplateResponseModel, ScheduledTime } from 'src/models/DonatedRequest'
import { HeadCell } from 'src/models/common/CommonModel'
import { DeliveryItemsForDeliveryModel } from '../../../models/DeliveryRequest'
import ChooseItemDeliveryForAidRequest from './ChooseItemDeliveryForAidRequest'
import { ItemAvaliableInStockModel } from 'src/models/Item'
import { ItemAPI } from 'src/api-client/Item'
import { CommonRepsonseModel } from 'src/models/common/CommonResponseModel'
import { toast } from 'react-toastify'
import ItemDeliveryTag from './ItemDeliveryTag'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { formateDateDDMMYYYY, getBulkyLevel, isNumber } from 'src/@core/layouts/utils'
import { customColor } from 'src/@core/theme/color'
import { Minus, Plus, TrashCan } from 'mdi-material-ui'
import CreateDeliveryRequestItem from './CreateDeliveryRequestItem'
import { BulkyChip } from '../tuyen-duong/TableDataScheduleRoute'
import ChooseItemDeliveryForDonatedRequest from './ChooseItemDeliveryForDonatedRequest'

const headerCells: HeadCell<DonatedItemResponseModel>[] = [
  new HeadCell({
    id: 'itemTemplateResponse',
    label: <TableLabel title='Tên' />,
    format(val) {
      let name = val?.itemTemplateResponse?.name ?? ''

      if (val?.itemTemplateResponse?.attributeValues && val?.itemTemplateResponse.attributeValues?.length > 0) {
        name += ` (${val.itemTemplateResponse.attributeValues.join(', ')})`
      }

      return <Typography fontWeight={600}>{name}</Typography>
    }
  }),
  new HeadCell({
    id: 'itemTemplateResponse',
    label: <TableLabel title='Ảnh' />,
    format(val) {
      return (
        <Card
          sx={{
            maxHeight: '100px',
            maxWidth: '200px',
            border: '1px solid #dcdcdc'
          }}
        >
          <CardMedia component={'img'} image={val.itemTemplateResponse?.image ?? KEY.DEFAULT_IMAGE} />
        </Card>
      )
    }
  }),
  new HeadCell({
    id: 'itemTemplateResponse',
    label: <TableLabel title='Đơn vị' />,
    maxWidth: 100,
    format(val) {
      return val.itemTemplateResponse?.unit || '_'
    }
  }),
  new HeadCell({
    id: 'quantity',
    label: <TableLabel title='Số lượng' />,
    maxWidth: 100
  }),
  new HeadCell({
    id: 'initialExpirationDate',
    label: <TableLabel title='Ngày hết hạn' />,
    format(val) {
      return formateDateDDMMYYYY(val.initialExpirationDate || '')
    }
  }),
  new HeadCell({
    id: 'itemTemplateResponse',
    label: <TableLabel title='Vận chuyễn tối đa' />,
    width: 200,
    maxWidth: 200,
    format(val) {
      return val.itemTemplateResponse?.maximumTransportVolume
    }
  })
]

const Label = styled(Typography)<TypographyProps>(() => ({
  textAlign: 'left',
  fontWeight: 550,
  whiteSpace: 'nowrap',
  paddingRight: '5px'
}))

export interface DeliveryRequestCreatingModel {
  items: ObjectKeyDataForDeliveryRequestModel
  sameDelivery: number
}

interface ObjectKeyDataForDeliveryRequestModel {
  [key: string]: DeliveryRequestItemModel
}

export interface DeliveryRequestItemModel {
  itemId: string
  quantity: number
  item: DonatedItemResponseModel
}

interface ErrorModel {
  [index: number]: string | undefined
}

export interface IChooseItemDeliveryProps {
  items: DeliveryItemModel[]
  isLoading: boolean
  updateDeliveryItems: (values: DeliveryItemsForDeliveryModel[][]) => void
  type: string
  scheduleTimes: ScheduledTime[]
  toogleLoading: (value: boolean) => void
  handleChangeError: (value: { [key: string]: string }) => void
}
export type MapItemAvaiableStock = Map<string, ItemAvaliableInStockModel>

const handleCountSumDeliveyRequest = (deliveryRequests: DeliveryRequestCreatingModel[] = []) => {
  const sumDelivery = deliveryRequests.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.sameDelivery
  }, 0)

  return (
    <Typography fontWeight={600}>
      Tổng số đơn vận chuyển: <Typography component={'span'} ml={1}>{`${sumDelivery} đơn`}</Typography>
    </Typography>
  )
}

export default function ChooseItemDelivery(props: IChooseItemDeliveryProps) {
  const { items, isLoading, type = '', scheduleTimes = [] } = props
  const [deliveryRequests, setDeliveryRequests] = useState<DeliveryRequestCreatingModel[]>([])
  const [deliveryItems, setDeliveryItems] = useState<DeliveryItemModel[]>([])
  const [dialogAddOpen, setDialogAddOpen] = useState<boolean>(false)
  const [itemStock, setItemStock] = useState<ItemAvaliableInStockModel>()
  const [stockAvailable, setStockAvaiable] = useState<MapItemAvaiableStock>(new Map())
  const [isFindingStock, setIsFindingStock] = useState<boolean>(false)
  const maxCapacity = 100
  const [error, setError] = useState<ErrorModel>({})
  const [errorItem, setErrorItem] = useState<{
    [key: string]: string
  }>({})

  const handleSelectItem = async (itemId: string) => {
    try {
      if (props.scheduleTimes.length === 0) {
        toast.warning('Hãy chọn ít nhất 1 ngày giao đồ.')

        return false
      }
      props.toogleLoading(true)
      const response = await ItemAPI.getItemAvaiableInStock({
        itemId: itemId,
        scheduledTimes: props.scheduleTimes
      })
      const stock = new CommonRepsonseModel<ItemAvaliableInStockModel>(response).data
      if (stock?.totalStock === 0) {
        toast.warn('Đã hết hàng trong kho.')

        return false
      }
      setItemStock(stock)
      setDialogAddOpen(true)

      return true
    } catch (error) {
      console.log(error)
    } finally {
      props.toogleLoading(false)
    }

    return false
  }

  const handleClose = () => {
    setItemStock(undefined)
    setDialogAddOpen(false)
  }

  const handleChangeDeliveryRequests = (values: DeliveryRequestCreatingModel[]) => {
    setDeliveryRequests(values)
    const newError = { ...error }
    const result: DeliveryItemsForDeliveryModel[][] = []

    values.map((item, index) => {
      const listItem: DeliveryItemsForDeliveryModel[] = []
      newError[index] = validateDeliveryRequest(item.items)

      for (const [key, value] of Object.entries(item.items)) {
        if (value.quantity !== 0)
          listItem.push({
            itemId: key,
            quantity: value.quantity
          })
      }
      for (let i = 0; i < item.sameDelivery; i++) {
        result.push(listItem)
      }
    })

    setError(newError)
    const tmp = validateSumQuantityItems(values)
    for (const [key, value] of Object.entries(newError)) {
      if (value !== undefined) {
        tmp[key] = value // Direct assignment
      }
    }
    props.handleChangeError({
      ...tmp
    })
    props.updateDeliveryItems(result)
    setItemStock(undefined)
  }

  const validateSumQuantityItems = (value: DeliveryRequestCreatingModel[]) => {
    const newError = {} as {
      [key: string]: string
    }
    deliveryItems?.map(item => {
      const data = value.reduce((accumulator, currentValue) => {
        return (
          accumulator +
          (currentValue.items[item.itemTemplateResponse?.id ?? '_']?.quantity || 0) * currentValue.sameDelivery
        )
      }, 0)
      if (data !== item.quantity) {
        newError[item.id || ''] = 'Tổng lượng vận chuyển phải bằng số lượng quyên góp'
      }
    })

    setErrorItem(newError)

    return newError
  }

  const handleChangeDeliveryItems = (values: DeliveryItemModel[]) => {
    setDeliveryItems(values)

    const newDeliveryRequests = handleCreateDeliveryRequest(values.map(item => new DonatedItemResponseModel(item)|| []))

    handleChangeDeliveryRequests(newDeliveryRequests)
  }

  useEffect(() => {
    if (props.type === DeliveryType.AID) return
    handleChangeDeliveryItems([...items])
  }, [items])

  useEffect(() => {
    if (props.type === DeliveryType.DONATE) return
    handleChangeDeliveryItems([])

    if (scheduleTimes.length > 0) {
      fetchDataStock(items.map(item => item.itemTemplateResponse?.id || ''))
    }
  }, [scheduleTimes])

  const fetchDataStock = async (listItemId: string[]) => {
    if (!scheduleTimes) return
    if (scheduleTimes.length === 0) return

    try {
      setIsFindingStock(true)
      const response = await ItemAPI.getListStockAvaiableByListItemId(listItemId, scheduleTimes)

      const commonResponseModel = new CommonRepsonseModel<ItemAvaliableInStockModel[]>(response)

      const mapFromList: MapItemAvaiableStock = new Map(stockAvailable)

      for (const obj of commonResponseModel.data || []) {
        mapFromList.set(obj.item?.id || '', obj)
      }

      console.log({ mapFromList })

      setStockAvaiable(mapFromList)
    } catch (error) {
      console.log(error)
    } finally {
      setIsFindingStock(false)
    }
  }

  const handleCreateDeliveryRequest = (
    donatedItemList: DonatedItemResponseModel[],
    currentDelivery?: DeliveryRequestCreatingModel
  ): DeliveryRequestCreatingModel[] => {
    if (donatedItemList.length === 0) {
      return currentDelivery ? [currentDelivery] : []
    }

    let capacity = 0

    if (!!currentDelivery) {
      for (const [, value] of Object.entries(currentDelivery.items)) {
        const max = value.item?.itemTemplateResponse?.maximumTransportVolume || 0
        if (max === 0) throw new Error('Missing maximum transport volume')

        capacity += (value.quantity / max) * 100
      }
    }

    let remainingCapcity = maxCapacity - capacity

    const quantity = donatedItemList[0].quantity || 0
    const maximumTransportVolume = donatedItemList[0].itemTemplateResponse?.maximumTransportVolume || 0

    if (quantity === 0) {
      throw new Error('Missing quantity of donated item')
    }

    const result: DeliveryRequestCreatingModel[] = []
    if (remainingCapcity <= 0) {
      currentDelivery && result.push(currentDelivery)
      remainingCapcity = 100
    }

    if ((quantity / maximumTransportVolume) * 100 === remainingCapcity) {
      console.log('bằng')

      const newDeliveryItem = {
        itemId: donatedItemList[0].itemTemplateResponse?.id || '_',
        quantity: donatedItemList[0].quantity || 0,
        item: donatedItemList[0],
        sameDelivery: 1
      } as DeliveryRequestItemModel
      result.push({
        items: {
          ...currentDelivery?.items,
          [donatedItemList[0].itemTemplateResponse?.id || '_']: newDeliveryItem
        },
        sameDelivery: 1
      } as DeliveryRequestCreatingModel)

      result.push(...handleCreateDeliveryRequest(donatedItemList.splice(1)))
    } else if ((quantity / maximumTransportVolume) * 100 > remainingCapcity) {
      console.log('lớn hơn', { maximumTransportVolume, remainingCapcity, quantity })

      const remaining = Math.floor((maximumTransportVolume * remainingCapcity) / 100)
      const newDeliveryItem = {
        itemId: donatedItemList[0].itemTemplateResponse?.id || '_',
        quantity: remaining,
        item: donatedItemList[0],
        sameDelivery: 1
      } as DeliveryRequestItemModel

      result.push({
        items: {
          ...currentDelivery?.items,
          [donatedItemList[0].itemTemplateResponse?.id || '_']: newDeliveryItem
        },
        sameDelivery: 1
      } as DeliveryRequestCreatingModel)

      const deliveryRequestItem: DeliveryRequestCreatingModel = {
        items: {},
        sameDelivery: 1
      }

      for (let qua = quantity - remaining; qua > 0; qua -= maximumTransportVolume) {
        if (qua >= maximumTransportVolume) {
          const newDeliveryItem = {
            itemId: donatedItemList[0].itemTemplateResponse?.id || '_',
            quantity: maximumTransportVolume,
            item: donatedItemList[0],
            sameDelivery: 1
          } as DeliveryRequestItemModel
          const lastItem = result[result.length - 1]
          if (
            !!lastItem.items[donatedItemList[0].itemTemplateResponse?.id || '_'] &&
            lastItem.items[donatedItemList[0].itemTemplateResponse?.id || '_'].quantity === newDeliveryItem.quantity
          ) {
            console.log('osdhs')

            lastItem.sameDelivery = lastItem.sameDelivery + 1
          } else {
            result.push({
              items: {
                [donatedItemList[0].itemTemplateResponse?.id || '_']: newDeliveryItem
              },
              sameDelivery: 1
            })
          }
        } else {
          deliveryRequestItem.items = {
            ...deliveryRequestItem.items,
            [newDeliveryItem.itemId]: { ...newDeliveryItem, quantity: qua }
          }
        }
      }
      result.push(
        ...handleCreateDeliveryRequest(
          donatedItemList.slice(1),
          Object.entries(deliveryRequestItem.items).length > 0 ? deliveryRequestItem : undefined
        )
      )
    } else {
      console.log('nhỏ hơn')

      const newDeliveryItem = {
        itemId: donatedItemList[0].itemTemplateResponse?.id || '_',
        quantity: quantity,
        item: donatedItemList[0],
        sameDelivery: 1
      } as DeliveryRequestItemModel

      const deliveryRequest = {
        items: {
          ...currentDelivery?.items,
          [donatedItemList[0].itemTemplateResponse?.id || '_']: newDeliveryItem
        },
        sameDelivery: 1
      } as DeliveryRequestCreatingModel
      result.push(...handleCreateDeliveryRequest(donatedItemList.splice(1), deliveryRequest))
    }

    return result
  }

  const validateDeliveryRequest = (deliveryItems: ObjectKeyDataForDeliveryRequestModel) => {
    const capacity = calculateCapacity(deliveryItems)

    if (capacity <= 100) {
      return undefined
    }

    return `Tổng số lượng vận chuyển đã vượt quá quy định cho 1 chuyến xe ${capacity}%`
  }

  const handleChangeSameDeliveryRequest = (value: any, index: number) => {
    if (!deliveryRequests[index].items) {
      toast.warn('Hãy chọn vật phẩm trước để có thể chọn số lần vận chuyển')
    }

    if (!value) {
      const newDeliveryRequests = [...deliveryRequests]
      newDeliveryRequests[index] = {
        ...newDeliveryRequests[index],
        sameDelivery: 0
      }
      handleChangeDeliveryRequests(newDeliveryRequests)
    }

    if (!isNumber(value)) return

    const newDeliveryRequests = [...deliveryRequests]
    newDeliveryRequests[index] = {
      ...newDeliveryRequests[index],
      sameDelivery: +value
    }
    handleChangeDeliveryRequests(newDeliveryRequests)
  }

  const calculateCapacity = (deliveryItems: ObjectKeyDataForDeliveryRequestModel) => {
    let total = 0
    for (const [, value] of Object.entries(deliveryItems)) {
      total += (value.quantity / (value.item?.itemTemplateResponse?.maximumTransportVolume || 0)) * 100
    }

    return Math.floor(total * 100) / 100
  }

  const isSelected = (itemId: string) => {
    const result = deliveryRequests.filter(item => !!item.items[itemId]).at(0)

    return !!result
  }

  const handleAddNewItem = (quantity: number) => {
    if (quantity <= 0) {
      toast.warning('Hãy nhập ít nhất 1 vật phẩm.')

      return
    }
    handleChangeDeliveryItems([
      ...deliveryItems,
      new DeliveryItemModel({
        quantity: quantity,
        itemTemplateResponse: new ItemTemplateResponseModel(itemStock)
      })
    ])

    setDialogAddOpen(false)
  }

  const handleUpdateItem = (quantity: number) => {
    if (quantity <= 0) {
      toast.warning('Hãy nhập ít nhất 1 vật phẩm.')

      return
    }

    const newDeliveryItems = deliveryItems

    const objectMap = new Map<string, DeliveryItemModel>()
    deliveryItems.forEach(obj => objectMap.set(obj.itemTemplateResponse?.id || '', obj))

    const newDeliveryItem = objectMap.get(itemStock?.id || '')
    if (newDeliveryItem) {
      newDeliveryItem.quantity = quantity
    }

    handleChangeDeliveryItems([...newDeliveryItems])

    setDialogAddOpen(false)
  }

  const handleDeleteItem = (itemId: string) => {
    handleChangeDeliveryItems([...deliveryItems.filter(item => item.itemTemplateResponse?.id !== itemId)])
  }
  const hanleUpdateItem = (itemId: string) => {
    handleSelectItem(itemId)
  }

  return (
    <Box display={'flex'} flexDirection={'column'} gap={3} minWidth={'1000px'}>
      <Card>
        <CardHeader
          title={
            <Box display={'flex'} justifyContent={'space-between'}>
              <Typography variant='h6' fontWeight={550}>
                {props.type === DeliveryType.DONATE
                  ? 'Vật phẩm quyên góp'
                  : props.type === DeliveryType.AID
                  ? 'Vật phẩm cần hỗ trợ'
                  : ''}
              </Typography>
              {type === DeliveryType.AID && (
                <Button
                  size='small'
                  variant='contained'
                  color='secondary'
                  onClick={() => {
                    handleChangeDeliveryItems([])
                  }}
                >
                  Chọn lại
                </Button>
              )}
            </Box>
          }
        />
        <CardContent>
          <Grid container spacing={3} alignItems={'stretch'}>
            {!isLoading && items
              ? items?.map((item, index) => {
                  return (
                    <Grid item key={index} xl={4} lg={4} md={6} xs={12} sm={12}>
                      <Grid
                        container
                        sx={{
                          width: 'auto',
                          height: 'auto',
                          minHeight: type === DeliveryType.DONATE ? '115px' : '150px',
                          padding: '3px',
                          borderRadius: '5px',
                          backgroundColor: customColor.itemTagColor,
                          position: 'relative',
                          ...(type === DeliveryType.AID && {
                            cursor: 'pointer',
                            ':hover': {
                              backgroundColor: () => hexToRGBA(customColor.primary, 0.5),
                              backgroundPosition: 'cover'
                            }
                          })
                        }}
                        alignItems={'center'}
                        flexWrap={'nowrap'}
                        className='shadow'
                        onClick={() => {
                          if (isSelected(item.itemTemplateResponse?.id || '')) {
                            const newDeliveryItem = [...deliveryItems].filter(
                              i => item.id !== i.itemTemplateResponse?.id
                            )

                            handleChangeDeliveryItems(newDeliveryItem)
                          } else {
                            handleSelectItem(item.itemTemplateResponse?.id || '')
                          }
                        }}
                      >
                        {type === DeliveryType.AID && (
                          <Checkbox
                            checked={isSelected(item.itemTemplateResponse?.id || '')}
                            sx={{
                              position: 'absolute',
                              right: 10
                            }}
                          />
                        )}
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
                              image={item?.itemTemplateResponse?.image}
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
                              {item?.itemTemplateResponse?.name}
                            </Typography>
                          </Grid>
                          <Grid item display={'flex'} gap={2}>
                            {item?.itemTemplateResponse?.attributeValues &&
                              item?.itemTemplateResponse?.attributeValues.length > 0 &&
                              item?.itemTemplateResponse.attributeValues.map((item, index) => (
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
                            <Label variant='body2'>
                              {props.type === DeliveryType.DONATE
                                ? 'Quyên góp : '
                                : props.type === DeliveryType.AID
                                ? 'Cần hỗ trợ : '
                                : ''}
                            </Label>
                            <Typography
                              variant='body2'
                              sx={{
                                verticalAlign: 'middle',
                                display: 'flex'
                              }}
                            >
                              {`${item?.quantity}`}
                              <Typography variant='body2' component={'span'}>
                                ({item?.itemTemplateResponse?.unit})
                              </Typography>
                            </Typography>
                          </Grid>
                          {type === DeliveryType.AID && [
                            <Grid item display={'flex'} key={'exported'}>
                              <Label variant='body2'>Đã hỗ trợ : </Label>
                              <Typography
                                variant='body2'
                                sx={{
                                  verticalAlign: 'middle'
                                }}
                              >
                                {item?.exportedQuantity}
                              </Typography>
                            </Grid>,
                            <Grid item display={'flex'} key={'stock'}>
                              <Label variant='body2'>Tồn kho : </Label>
                              {!isFindingStock ? (
                                !!scheduleTimes && scheduleTimes.length > 0 ? (
                                  <Typography
                                    variant='body2'
                                    sx={{
                                      verticalAlign: 'middle'
                                    }}
                                  >
                                    {`${stockAvailable.get(item?.itemTemplateResponse?.id || '')?.quantity || 0}`}
                                  </Typography>
                                ) : (
                                  <Typography
                                    variant='caption'
                                    sx={{
                                      verticalAlign: 'middle'
                                    }}
                                  >
                                    (Chọn thời gian để tìm vật phẩm)
                                  </Typography>
                                )
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
                          ]}
                          <Grid item display={'flex'}>
                            <Label variant='body2'>Vận chuyển tối đa : </Label>
                            <Typography
                              variant='body2'
                              sx={{
                                verticalAlign: 'middle'
                              }}
                            >
                              {`${item?.itemTemplateResponse?.maximumTransportVolume}`}
                              <Typography variant='body2' component={'span'}>
                                ({item?.itemTemplateResponse?.unit})
                              </Typography> 
                            </Typography>
                          </Grid>
                          {type === DeliveryType.DONATE && (
                            <Grid item display={'flex'}>
                              <Label variant='body2'>Hạn sử dụng : </Label>
                              <Typography
                                variant='body2'
                                sx={{
                                  verticalAlign: 'middle'
                                }}
                              >
                                {formateDateDDMMYYYY(item?.initialExpirationDate || '')}
                              </Typography>
                            </Grid>
                          )}
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
      {props.type === DeliveryType.AID && (
        <Box display={'flex'} flexDirection={'column'} mt={3} gap={1}>
          <Typography variant='h6' fontWeight={550}>
            {`Vật phẩm vận chuyển đã chọn (${deliveryItems.length})`}
          </Typography>
          <Grid container spacing={3}>
            {deliveryItems?.map((deliveryItem, index) => {
              return (
                <Grid key={index} item xl={4} lg={4} md={6} xs={12} sm={8}>
                  <ItemDeliveryTag
                    deliveryItem={deliveryItem}
                    handleDeleteItem={handleDeleteItem}
                    hanleUpdateItem={hanleUpdateItem}
                  />
                </Grid>
              )
            })}
            {/* <Grid
              item
              xl={4}
              lg={6}
              md={6}
              xs={12}
              sm={8}
              display={'flex'}
              justifyContent={'center'}
              alignItems={'center'}
            >
              <Card
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: '100%',
                  backgroundColor: theme => hexToRGBA(theme.palette.grey[400], 0.3)
                }}
              >
                <AddOtherItems
                  handleSelectItem={handleSelectItem}
                  deliveryItems={deliveryItems}
                  scheduleTimes={props.scheduleTimes}
                  stock={stockAvailable}
                  handleSearchItemsStock={fetchDataStock}
                />
              </Card>
            </Grid> */}
          </Grid>
        </Box>
      )}
      <Card>
        <CardHeader
          title={
            <Box display={'flex'} justifyContent={'space-between'}>
              <Typography variant='h6' fontWeight={550}>
                Các yêu cầu vận chuyển
              </Typography>
              <Box display={'flex'} gap={3}>
                <Button
                  size='small'
                  variant='outlined'
                  onClick={() => {
                    setError({})
                    handleChangeDeliveryRequests(handleCreateDeliveryRequest(deliveryItems?.map(item => new  DonatedItemResponseModel(item)) || []))
                  }}
                >
                  Tạo lại gợi ý
                </Button>
                <Button
                  size='small'
                  variant='outlined'
                  onClick={() => {
                    handleChangeDeliveryRequests([
                      ...deliveryRequests,
                      {
                        items: {},
                        sameDelivery: 0
                      } as DeliveryRequestCreatingModel
                    ])
                  }}
                >
                  Thêm mới
                </Button>
              </Box>
            </Box>
          }
        />
        <CardContent>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Thông tin vận chuyển</TableCell>
                  <TableCell
                    sx={{
                      width: '170px',
                      textAlign: 'left'
                    }}
                  >
                    Số lần vận chuyển
                  </TableCell>
                  <TableCell sx={{
                    textAlign: 'center'
                  }}> Độ cồng kềnh</TableCell>
                  <TableCell
                    sx={{
                      width: '100px'
                    }}
                  ></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!isLoading ? (
                  !!deliveryRequests ? (
                    deliveryRequests.length > 0 ? (
                      [...deliveryRequests]?.map((deliveryRequest, index) => {
                        return (
                          <TableRow key={index} hover>
                            <TableCell
                              sx={{
                                verticalAlign: 'top'
                              }}
                            >
                              <CreateDeliveryRequestItem
                                error={error}
                                indexDelivery={index}
                                deliveryRequest={deliveryRequest}
                                handleChangeDeliveryRequest={function (value: DeliveryRequestCreatingModel): void {
                                  const newDeliveryRequests = [...deliveryRequests]
                                  newDeliveryRequests[index] = value
                                  handleChangeDeliveryRequests(newDeliveryRequests)
                                }}
                              />
                            </TableCell>
                            <TableCell
                              sx={{
                                width: '170px',
                                textAlign: 'center'
                              }}
                            >
                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'center',
                                  flexWrap: 'nowrap'
                                }}
                              >
                                <IconButton
                                  size='small'
                                  onClick={() => {
                                    if (deliveryRequest.sameDelivery === 0) return
                                    handleChangeSameDeliveryRequest(deliveryRequest.sameDelivery - 1, index)
                                  }}
                                >
                                  <Minus />
                                </IconButton>
                                <TextField
                                  autoComplete='off'
                                  value={deliveryRequest.sameDelivery || 0}
                                  inputProps={{
                                    style: {
                                      textAlign: 'center',
                                      height: '100%'
                                    },
                                    min: 0,
                                    onWheel: e => {
                                      e.preventDefault()
                                    },
                                    onScroll: e => {
                                      e.preventDefault()
                                    }
                                  }}
                                  fullWidth
                                  onScroll={e => {
                                    e.preventDefault()
                                    e.currentTarget.blur()
                                  }}
                                  onChange={e => {
                                    handleChangeSameDeliveryRequest(e.target.value, index)
                                  }}
                                  size='small'
                                  sx={{
                                    width: '60px'
                                  }}
                                />
                                <IconButton
                                  size='small'
                                  onClick={() => {
                                    handleChangeSameDeliveryRequest(deliveryRequest.sameDelivery + 1, index)
                                  }}
                                >
                                  <Plus />
                                </IconButton>
                              </Box>
                            </TableCell>
                            <TableCell
                              align='center'
                              sx={{
                                maxWidth: 200,
                                width: 200,
                                ...(error[index]
                                  ? { color: theme => `${theme.palette.error[theme.palette.mode]} !important` }
                                  : null)
                              }}
                            >
                              {BulkyChip[getBulkyLevel(calculateCapacity(deliveryRequest.items))]}
                            </TableCell>
                            <TableCell>
                              <Box display={'flex'} gap={1} flexDirection={'column'}>
                                <Tooltip title='Xóa'>
                                  <IconButton
                                    sx={{
                                      width: '50px',
                                      height: '50px'
                                    }}
                                    onClick={() => {
                                      const newDeliveryRequest = [...deliveryRequests]
                                      newDeliveryRequest.splice(index, 1)
                                      handleChangeDeliveryRequests(newDeliveryRequest)
                                    }}
                                  >
                                    <TrashCan color='error' />
                                  </IconButton>
                                </Tooltip>

                                <ChooseItemDeliveryForDonatedRequest
                                  handleChangeDeliveryRequest={(value: DeliveryRequestCreatingModel) => {
                                    const newDeliveryRequest = [...deliveryRequests]
                                    newDeliveryRequest[index] = value

                                    handleChangeDeliveryRequests(newDeliveryRequest)
                                  }}
                                  deliveryRequest={deliveryRequest}
                                  indexDelivery={index}
                                  items={deliveryItems}
                                />
                              </Box>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    ) : (
                      <TableRow hover>
                        <TableCell
                          colSpan={2 + headerCells.length}
                          sx={{
                            borderBottom: '0px !important'
                          }}
                        >
                          <Typography variant='body1' textAlign={'center'}>
                            Không có dữ liệu
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )
                  ) : (
                    <TableRow hover>
                      <TableCell
                        colSpan={1 + items.length}
                        sx={{
                          borderBottom: '0px !important'
                        }}
                      >
                        <Typography variant='body1' textAlign={'center'}>
                          Không có dữ liệu
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )
                ) : null}
                {!!deliveryItems && deliveryItems.length > 0 && (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Box
                        sx={{
                          display: 'flex',
                          gap: 3,
                          justifyContent: 'flex-end'
                        }}
                      >
                        {handleCountSumDeliveyRequest(deliveryRequests)}
                        <Box display={'flex'} gap={5} alignItems={'top'} flexDirection={'column'}>
                          {deliveryItems?.map(item => {
                            const data = deliveryRequests.reduce((accumulator, currentValue) => {
                              return (
                                accumulator +
                                (currentValue.items[item.itemTemplateResponse?.id ?? '_']?.quantity || 0) *
                                  currentValue.sameDelivery
                              )
                            }, 0)

                            return (
                              <Box key={item.id} display={'flex'} flexDirection={'column'} sx={{
                                paddingBottom: '5px',
                                borderBottom: '1px solid',
                                borderColor: theme => theme.palette.divider
                              }}>
                                <Box
                                  display={'flex'}
                                  flexDirection={'row'}
                                  flexWrap={'nowrap'}
                                  alignItems={'self-end'}
                                  justifyContent={'space-between'}
                                  gap={10}
                                >
                                  <Box display={'flex'}>
                                    <Box
                                      sx={{
                                        maxWidth: '100px',
                                        maxHeight: '50px'
                                      }}
                                      display={'flex'}
                                      gap={2}
                                    >
                                      <CardMedia component={'img'} image={item?.itemTemplateResponse?.image} />
                                    </Box>
                                    <Box display={'flex'} flexDirection={'column'}>
                                      <Typography
                                        fontWeight={600}
                                        sx={{
                                          whiteSpace: 'nowrap'
                                        }}
                                      >
                                        {item.itemTemplateResponse?.name}
                                      </Typography>
                                      {item.itemTemplateResponse?.attributeValues &&
                                        item.itemTemplateResponse.attributeValues.length > 0 && (
                                          <Typography
                                            variant='body2'
                                            sx={{
                                              whiteSpace: 'nowrap'
                                            }}
                                          >
                                            ({item.itemTemplateResponse?.attributeValues.join(', ')})
                                          </Typography>
                                        )}
                                    </Box>
                                  </Box>
                                  <Box
                                    {...(data !== (item.quantity || 0)
                                      ? {
                                          sx: {
                                            color: theme => `${theme.palette.error[theme.palette.mode]} !important`
                                          }
                                        }
                                      : null)}
                                  >
                                    {` Tổng vận chuyển / quyên góp : ${data}/${item.quantity}`}
                                  </Box>
                                </Box>
                                {!!errorItem[item.id || ''] && (
                                  <Typography
                                    variant='body2'
                                    sx={{
                                      color: theme => `${theme.palette.error[theme.palette.mode]} !important`
                                    }}
                                  >
                                    {errorItem[item.id || '']}
                                  </Typography>
                                )}
                              </Box>
                            )
                          })}
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {props.type === DeliveryType.AID && (
        <ChooseItemDeliveryForAidRequest
          dialogAddOpen={dialogAddOpen}
          handleClose={handleClose}
          itemStock={itemStock}
          handleAddNewItem={handleAddNewItem}
          handleUpdateItem={handleUpdateItem}
          oldItem={deliveryItems.filter(item => item.itemTemplateResponse?.id === itemStock?.id).at(0)}
        />
      )}
    </Box>
  )
}
