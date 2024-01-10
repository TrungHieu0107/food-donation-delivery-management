import {
  Button,
  Skeleton,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Typography,
  Table,
  TableRow,
  Tooltip,
  Box,
  Stack,
  Grid,
  TextField,
  IconButton,
  Autocomplete,
  Card,
  CardMedia
} from '@mui/material'
import { Check, DotsVertical, Magnify, Plus } from 'mdi-material-ui'
import { Fragment, SyntheticEvent, useEffect, useState } from 'react'
import DialogCustom from 'src/@core/layouts/components/shared-components/Dialog'
import { KEY } from 'src/common/Keys'
import TableHeader from 'src/layouts/components/table/TableHeader'
import TableLabel from 'src/layouts/components/table/TableLabel'
import { ScheduledTime } from 'src/models/DonatedRequest'
import { HeadCell } from 'src/models/common/CommonModel'
import { CategoryAPI } from 'src/api-client/Category'
import { Category, ItemSearchKeywordModel } from 'src/models/Item'
import { CommonRepsonseModel, PaginationModel } from 'src/models/common/CommonResponseModel'
import { MyTablePagination } from 'src/layouts/components/table/TablePagination'
import { ItemAPI } from 'src/api-client/Item'
import { toast } from 'react-toastify'
import { DeliveryItemModel } from 'src/models/DeliveryRequest'
import { MapItemAvaiableStock } from './ChooseItemDelivery'

const headerCells: HeadCell<ItemSearchKeywordModel>[] = [
  new HeadCell({
    id: 'name',
    label: <TableLabel title='Tên' />,
    format(val) {
      const listAddtribute = val.attributes?.map(item => item.attributeValue) || []
      const name = listAddtribute.length > 0 ? `${val.name ?? ''} (${listAddtribute.join(', ')})` : val.name ?? ''

      return (
        <Tooltip title={name}>
          <Typography>{name}</Typography>
        </Tooltip>
      )
    }
  }),
  new HeadCell({
    id: 'image',
    label: <TableLabel title='Ảnh' />,
    format(val) {
      return (
        <Card
          sx={{
            height: '60px'
          }}
        >
          <CardMedia
            component={'img'}
            image={val.image ?? KEY.DEFAULT_IMAGE}
            alt={val.name}
            sx={{ maxHeight: '60px' }}
          />
        </Card>
      )
    }
  }),
  new HeadCell({
    id: 'unit',
    label: <TableLabel title='Đơn vị' />,
    maxWidth: 100,
    format(val) {
      return (
        <Tooltip title={val.unit?.name || '_'}>
          <Typography>{val.unit?.name || '_'}</Typography>
        </Tooltip>
      )
    }
  })
]

export interface IAddOtherItemsProps {
  stock: MapItemAvaiableStock
  handleSelectItem: (itemId: string) => Promise<boolean>
  deliveryItems: DeliveryItemModel[]
  scheduleTimes: ScheduledTime[]
  handleSearchItemsStock: (value: string[]) => void
}

export type ObjectFilterItemWithKeyword = {
  searchKeyWord?: string
  itemCategoryType?: number
  itemCategoryId?: string
  page?: number
  pageSize?: number
}

export default function AddOtherItems(props: IAddOtherItemsProps) {
  const [dialogAddNewOpen, setDialogAddNewOpen] = useState<boolean>(false)
  const [items, setItems] = useState<ItemSearchKeywordModel[]>([])
  const [isFetching, setIsFetching] = useState<boolean>(false)
  const [keyWord, setKeyword] = useState<string>('')
  const [categories, setCategories] = useState<Category[]>([])
  const [pagination, setPagination] = useState<PaginationModel>(
    new PaginationModel({
      currentPage: 1,
      pageSize: 10
    })
  )
  const [filterObject, setFilterObject] = useState<ObjectFilterItemWithKeyword>({
    page: 1,
    pageSize: 10
  })

  const handleClose = () => {
    setDialogAddNewOpen(false)
  }

  const isSelected = (itemId: string) => {
    const result = props.deliveryItems.filter(item => item.itemTemplateResponse?.id === itemId).at(0)

    return !!result
  }

  useEffect(() => {
    handleSearchItem()
  }, [filterObject])

  const handleSearchItem = async () => {
    try {
      setIsFetching(true)
      const response = await ItemAPI.searchItemWithKeyword(filterObject)
      const commonReponse = new CommonRepsonseModel<ItemSearchKeywordModel[]>(response)
      const itemsList = commonReponse.data || []
      await props.handleSearchItemsStock(itemsList.map(item => item.itemTemplateId || ''))
      setItems(itemsList)
      setPagination(commonReponse.pagination)
    } catch (error) {
      console.log(error)
    } finally {
      setIsFetching(false)
    }
  }

  const handleSelect = async (itemId: string) => {
    const result = await props.handleSelectItem(itemId)
    if (result) setDialogAddNewOpen(false)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await CategoryAPI.getAllCategories()
      const categories = new CommonRepsonseModel<Category[]>(response)
      console.log(categories)

      setCategories(categories.data ?? [])
    } catch (err) {
      console.log(err)
    }
  }

  const handleOpen = () => {
    if (props.scheduleTimes.length === 0) {
      toast.warning('Hãy chọn ít nhất 1 ngày giao đồ.')

      return
    }

    handleSearchItem()
    setDialogAddNewOpen(true)
  }

  return (
    <Fragment>
      <Button size='small' startIcon={<Plus />} onClick={handleOpen}>
        Thêm vật phẩm khác
      </Button>
      <DialogCustom
        content={
          <Stack gap={3} padding={'10px'}>
            <Grid container spacing={3} justifyContent={'flex-end'}>
              <Grid item xl lg md sm xs>
                <TextField
                  size='small'
                  autoComplete='off'
                  label='Tên vật phẩm'
                  value={keyWord}
                  onChange={e => {
                    setKeyword(e.target.value)
                  }}
                  fullWidth
                  placeholder='Thịt bò'
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      setFilterObject({
                        ...filterObject,
                        searchKeyWord: keyWord,
                        page: 1
                      })
                    }
                  }}
                  onBlur={() => {
                    if (keyWord !== filterObject.searchKeyWord)
                      setFilterObject({
                        ...filterObject,
                        searchKeyWord: keyWord,
                        page: 1
                      })
                  }}
                />
              </Grid>
              <Grid item xl lg md sm xs>
                <Autocomplete
                  fullWidth
                  renderInput={params => (
                    <TextField
                      {...params}
                      name='category'
                      placeholder='Loại vật phẩm'
                      label='Loại'
                      size='small'
                      fullWidth
                    />
                  )}
                  getOptionLabel={option => (option as Category).name}
                  options={categories}
                  renderOption={(props, option) => (
                    <Box component='li' {...props}>
                      <Typography ml={1} variant='body2' fontWeight={450}>
                        {(option as Category).name}
                      </Typography>
                    </Box>
                  )}
                  onChange={(_: SyntheticEvent, newValue: Category | null) => {
                    setFilterObject({
                      ...filterObject,
                      itemCategoryId: newValue?.id
                    })
                  }}
                />
              </Grid>
              <Grid item display={'flex'} alignItems={'center'}>
                <IconButton onClick={handleSearchItem}>
                  <Magnify />
                </IconButton>
              </Grid>
            </Grid>
            <TableContainer
              sx={{
                height: '260px',
                minWidth: '600px'
              }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>STT</TableCell>
                    {headerCells.map((cell, index) => {
                      return <TableHeader headCell={cell} key={`header${index}`} />
                    })}
                    <TableCell>
                      <TableLabel title='Tồn kho' />
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!isFetching ? (
                    !!items ? (
                      items?.length > 0 ? (
                        items?.map((donatedItem, index) => {
                          return (
                            <TableRow hover key={donatedItem.itemTemplateId}>
                              <TableCell>{index + 1}</TableCell>
                              {headerCells.map((item, i) => {
                                return (
                                  <TableCell
                                    key={`items_${donatedItem.itemTemplateId}_${i}`}
                                    sx={{
                                      minWidth: item.minWidth,
                                      maxWidth: item.maxWidth ?? 'none',
                                      width: item.width ?? 'auto'
                                    }}
                                  >
                                    {item.format ? (
                                      item.format(donatedItem)
                                    ) : (
                                      <Tooltip title={donatedItem.name as any}>
                                        <Typography
                                          sx={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            textTransform: 'none'
                                          }}
                                          variant='body2'
                                        >
                                          {donatedItem[item.id]}
                                        </Typography>
                                      </Tooltip>
                                    )}
                                  </TableCell>
                                )
                              })}
                              <TableCell>{props.stock.get(donatedItem.itemTemplateId || '')?.quantity || 0}</TableCell>
                              <TableCell>
                                {isSelected(donatedItem?.itemTemplateId || '') ? (
                                  <Box display={'flex'}>
                                    <Check color='success' />
                                    <Typography
                                      fontWeight={'550'}
                                      sx={{
                                        color: theme => theme.palette.success[theme.palette.mode]
                                      }}
                                    >
                                      Đã chọn
                                    </Typography>
                                  </Box>
                                ) : (
                                  <Button
                                    variant='contained'
                                    color='secondary'
                                    sx={{
                                      color: theme => `${theme.palette.common.white} !important`
                                    }}
                                    onClick={() => {
                                      if (!props.stock.get(donatedItem.itemTemplateId || '')?.quantity) return
                                      handleSelect(donatedItem.itemTemplateId || '')
                                    }}
                                    size='small'
                                    disabled={!props.stock.get(donatedItem.itemTemplateId || '')?.quantity}
                                  >
                                    chọn
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          )
                        })
                      ) : (
                        <TableRow hover>
                          <TableCell
                            colSpan={3 + headerCells.length}
                            sx={{
                              borderBottom: '0px !important'
                            }}
                          >
                            <Typography variant='body1' textAlign={'center'}>
                              Không có dữ liệu 🥸
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )
                    ) : (
                      <TableRow hover>
                        <TableCell
                          colSpan={3 + headerCells.length}
                          sx={{
                            borderBottom: '0px !important'
                          }}
                        >
                          <Typography variant='body1' textAlign={'center'}>
                            Không có dữ liệu 🥸
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )
                  ) : (
                    [0, 1, 2, 3, 4].map((_, index) => {
                      return (
                        <TableRow hover key={`Loading${index}`}>
                          <TableCell>{index + 1}</TableCell>
                          {headerCells.map((item, i) => {
                            return (
                              <TableCell
                                key={i}
                                sx={{
                                  minWidth: item.minWidth,
                                  maxWidth: item.maxWidth ?? 'none',
                                  width: item.width ?? 'auto'
                                }}
                              >
                                <Skeleton variant='rectangular' />
                              </TableCell>
                            )
                          })}
                          <TableCell
                          >
                            <Skeleton variant='rectangular' />
                          </TableCell>
                          <TableCell>
                            <DotsVertical />
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <MyTablePagination data={pagination} filterObject={filterObject} setFilterObject={setFilterObject} />
          </Stack>
        }
        handleClose={handleClose}
        open={dialogAddNewOpen}
        title={'Thêm vật phẩm khác'}
        actionDialog={<Button onClick={handleClose}>Đóng</Button>}
        width={880}
      />
    </Fragment>
  )
}
