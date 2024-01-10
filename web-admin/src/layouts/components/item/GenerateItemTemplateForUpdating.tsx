import { ChangeEvent, ReactNode, useEffect, useMemo, useState } from 'react'
import { Attribute, AttributeValue } from 'src/models/Item'
import TableRow from '@mui/material/TableRow'
import TablePagination from '@mui/material/TablePagination'
import TableHead from '@mui/material/TableHead'
import TableContainer from '@mui/material/TableContainer'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import Table from '@mui/material/Table'
import Checkbox from '@mui/material/Checkbox'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import { AttributeTemplateModelForm, ItemTemplateUpdatingModelForm } from 'src/pages/vat-pham/chinh-sua/[id]'
import DialogCustom from 'src/@core/layouts/components/shared-components/Dialog'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Autocomplete, { AutocompleteRenderInputParams } from '@mui/material/Autocomplete'

export interface IGenerateItemTemplateForUpdatingProps {
  attributes: Attribute[]
  templateSelected: ItemTemplateUpdatingModelForm[]
  setTemplateSelected: (value: ItemTemplateUpdatingModelForm[]) => void
  reload: boolean
  handleClose: () => void
}

interface AttributeValueBaseAttribute {
  attributeValue: AttributeValue
  attribute: Attribute
}

interface DataSearchTempalte {
  [key: string]: string
}

export default function GenerateItemTemplateForUpdating(props: IGenerateItemTemplateForUpdatingProps) {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [dataPerPage, setDataPerPage] = useState<ItemTemplateUpdatingModelForm[]>([])
  const [allData, setAllData] = useState<ItemTemplateUpdatingModelForm[]>([])
  const [dataSearchTempalte, setDataSearchTempalte] = useState<DataSearchTempalte>({})
  const [templateSelected, setTemplateSelected] = useState<ItemTemplateUpdatingModelForm[]>([])
  
  useEffect(() => {
    if (props.reload) {
      setTemplateSelected(props.templateSelected)
      const result = generateCombinations(props.attributes, [])
      const finalResult = result.map(item => {
        const attributes = item
          .filter(attribute => attribute.attribute.name && attribute.attributeValue?.value)
          .map(attribute => {
            return new AttributeTemplateModelForm({
              attributeValue: attribute.attributeValue,
              name: attribute.attribute.name,
              key:
                attribute.attribute.name && attribute.attributeValue?.value
                  ? `${attribute.attribute.name}_${attribute.attributeValue?.value}`
                  : undefined
            })
          })

        const data = new ItemTemplateUpdatingModelForm({
          key: attributes
            .filter(subItem => subItem.key)
            .map(subItem => subItem.key)
            .join('_'),
          attributes: attributes
        })

        return data
      })
      setAllData(finalResult)

                    const newData = finalResult.filter(item => {
                      let isMap = true

                      item.attributes?.map(subItem => {
                        const value = dataSearchTempalte[subItem.name || '']
                        if (value && value !== 'Trống') {
                          isMap = isMap ? subItem.attributeValue?.value === value : isMap
                        } else if (value === 'Trống') {
                          isMap = isMap ? subItem.attributeValue?.value === '' : isMap
                        }
                      })

                      return isMap
                    })

      setRowsPerPage(10)
      setPage(0)
      setDataPerPage(newData)
    }
  }, [props])

  useEffect(() => {
    if (props.reload) {
      const newData = allData.filter(item => {
        let isMap = true

        item.attributes?.map(subItem => {
          const value = dataSearchTempalte[subItem.name || ''] ?? ''

          if (isMap && value !== '') {
            if (value !== 'Trống') {
              isMap = subItem.attributeValue?.value === value
            } else if (value === 'Trống') {
              isMap = subItem.attributeValue === undefined
            }
          }
        })

        return isMap
      })

      setRowsPerPage(10)
      setPage(0)
      setDataPerPage(newData)
    }
  }, [dataSearchTempalte])

  const generateCombinations = (
    arrays: Attribute[],
    current: AttributeValueBaseAttribute[]
  ): AttributeValueBaseAttribute[][] => {
    if (arrays.length === 0) {
      return [current]
    }

    const results: AttributeValueBaseAttribute[][] = []
    const arraayMap = [
      ...(arrays.at(0)?.attributeValues || [])
    ]

    arraayMap.map(item => {
      const remainingArrays = arrays.slice(1)
      const combinations =
        arrays.length > 0
          ? generateCombinations(remainingArrays, [
              ...current,
              {
                attribute: arrays.at(0),
                attributeValue: item
              } as AttributeValueBaseAttribute
            ])
          : []
      results.push(...combinations)
    })

    return results
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const isSelected = (valueCheck: ItemTemplateUpdatingModelForm) => {
    const temp = templateSelected.filter(item => {
      return item.key === valueCheck.key
    })

    return temp.length > 0
  }

  const onSelectAllClick = () => {
    props.setTemplateSelected(allData.length === props.templateSelected.length ? [] : allData)
  }

  const handleClick = (isItemSelected: boolean, index: number, value: ItemTemplateUpdatingModelForm) => {
    if (!isItemSelected) {
      setTemplateSelected([...templateSelected, value])
    } else {
      const newValue = templateSelected.filter(item => {
        return item.key !== value.key
      })
      setTemplateSelected([...newValue])
    }
  }

  const visibleData = useMemo(() => {
    const newData = [...dataPerPage]

    return newData.splice(page * rowsPerPage, (page + 1) * rowsPerPage)
  }, [rowsPerPage, page, dataPerPage])

  const handleSave = () => {
    props.setTemplateSelected([...templateSelected])
    props.handleClose()
  }

  return (
    <DialogCustom
      content={
        <>
          <Box display={'flex'} flexDirection={'column'}>
            <TableContainer
              sx={{
                maxHeight: '300px !important'
              }}
              component={Paper}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell padding='checkbox'>
                      <Checkbox
                        color='primary'
                        indeterminate={
                          props.templateSelected.length > 0 && props.templateSelected.length < allData.length
                        }
                        checked={allData.length > 0 && props.templateSelected.length === allData.length}
                        onChange={onSelectAllClick}
                        inputProps={{
                          'aria-label': 'select all desserts'
                        }}
                      />
                    </TableCell>
                    <TableCell>STT</TableCell>
                    {props.attributes.map((attribute, index) => {
                      return <TableCell key={index}>{attribute.name}</TableCell>
                    })}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {visibleData.map((item, index) => {
                    const isItemSelected = isSelected(item)

                    return (
                      <TableRow
                        hover
                        role='checkbox'
                        key={index}
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        selected={isItemSelected}
                      >
                        <TableCell padding='checkbox'>
                          <Checkbox
                            color='primary'
                            checked={isItemSelected}
                            onClick={() => {
                              handleClick(isItemSelected, index, item)
                            }}
                          />
                        </TableCell>
                        <TableCell>{index + 1 + rowsPerPage * page}</TableCell>
                        {props.attributes?.map((subItem, subIndex) => {
                          const data = item.attributes?.filter(value => value.name === subItem.name).at(0)
                          if (data) {
                            return <TableCell key={subIndex}>{data.attributeValue?.value || ''}</TableCell>
                          }

                          return <TableCell key={subIndex}></TableCell>
                        })}
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              labelRowsPerPage='Hàng trên trang'
              labelDisplayedRows={({ from, to, count }) => {
                return `${from}–${to} / ${count !== -1 ? count : `nhiều hơn ${to}`}`
              }}
              rowsPerPageOptions={[10, 20, 30]}
              component='div'
              count={dataPerPage.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
        </>
      }
      handleClose={props.handleClose}
      open={props.reload}
      actionTitle={
        <Box display={'flex'} justifyContent={'flex-end'} gap={3} flexWrap={'wrap'}>
          {props.attributes
            .filter(item => item.name && item.attributeValues && item.attributeValues?.length > 0)
            .map((item, index) => (
              <Autocomplete
                key={index}
                options={[
                  ...(item.attributeValues || []),
                  {
                    value: 'Trống'
                  }
                ]}
                getOptionLabel={option => option.value || ''}
                onChange={(e, value) => {
                  setDataSearchTempalte({
                    ...dataSearchTempalte,
                    [item?.name || '']: value?.value || ''
                  })
                }}
                renderInput={function (params: AutocompleteRenderInputParams): ReactNode {
                  return <TextField {...params} fullWidth name='attributeValue' label={item.name} size='small' />
                }}
                sx={{
                  minWidth: 200
                }}
              />
            ))}
        </Box>
      }
      title={'Danh sách các biến thể'}
      actionDialog={
        <>
          <Button color='info' onClick={props.handleClose}>
            Đóng
          </Button>
          <Button
            onClick={() => {
              handleSave()
            }}
            variant='contained'
            color='info'
          >
            Lưu
          </Button>
        </>
      }
      width={1000}
    />
  )
}
