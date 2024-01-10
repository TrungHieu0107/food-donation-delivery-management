import { ChangeEvent, useEffect, useMemo, useState } from 'react'
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
import { AttributeTemplateModelForm, ItemTemplateCreatingModelForm } from 'src/pages/vat-pham/tao-moi'

export interface IGenerateItemTemplateProps {
  attributes: Attribute[]
  templateSelected: ItemTemplateCreatingModelForm[]
  setTemplateSelected: (value: ItemTemplateCreatingModelForm[]) => void
  dataSearchTempalte: DataSearchTempalte
}

interface AttributeValueBaseAttribute {
  attributeValue: AttributeValue
  attribute: Attribute
}

interface DataSearchTempalte {
  [key: string]: string
}

export default function GenerateItemTemplate(props: IGenerateItemTemplateProps) {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [dataPerPage, setDataPerPage] = useState<ItemTemplateCreatingModelForm[]>([])
  const [allData, setAllData] = useState<ItemTemplateCreatingModelForm[]>([])

  useEffect(() => {
    const result = generateCombinations(props.attributes, [])
    const finalResult = result.map(item => {
      const attributes = item.map(attribute => {
        return new AttributeTemplateModelForm({
          attributeValue: attribute.attributeValue,
          name: attribute.attribute.name,
          key: attribute.attributeValue.value ? `${attribute.attribute.name}_${attribute.attributeValue?.value}` : ''
        })
      })

      const data = new ItemTemplateCreatingModelForm({
        key: attributes.map(subItem => subItem.key).join('_'),
        attributes: attributes
      })

      return data
    })
    setAllData(finalResult)
    console.log(finalResult, props.templateSelected)

    const newData = finalResult.filter(item => {
      let isMap = true

      item.attributes?.map(subItem => {
        const value = props.dataSearchTempalte[subItem.name || '']
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
  }, [props])

  const generateCombinations = (
    arrays: Attribute[],
    current: AttributeValueBaseAttribute[]
  ): AttributeValueBaseAttribute[][] => {
    if (arrays.length === 0) {
      return [current]
    }

    const results: AttributeValueBaseAttribute[][] = []
    const arraayMap = [
      ...(arrays.at(0)?.attributeValues || []),
      new AttributeValue({
        value: ''
      })
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

  const isSelected = (valueCheck: ItemTemplateCreatingModelForm) => {
    const temp = props.templateSelected.filter(item => {
      return item.key === valueCheck.key
    })

    return temp.length > 0
  }

  const onSelectAllClick = () => {
    props.setTemplateSelected(allData.length === props.templateSelected.length ? [] : allData)
  }

  const handleClick = (isItemSelected: boolean, index: number, value: ItemTemplateCreatingModelForm) => {
    if (!isItemSelected) {
      props.setTemplateSelected([...props.templateSelected, value])
    } else {
      const newValue = props.templateSelected.filter(item => {
        return item.key !== value.key
      })
      console.log('newValue', newValue)

      props.setTemplateSelected(newValue)
    }
  }

  const visibleData = useMemo(() => {
    const newData = [...dataPerPage]

    return newData.splice(page * rowsPerPage, (page + 1) * rowsPerPage)
  }, [rowsPerPage, page, dataPerPage])

  return (
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
                  indeterminate={props.templateSelected.length > 0 && props.templateSelected.length < allData.length}
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
                  {item.attributes?.map((subItem, subIndex) => {
                    return <TableCell key={subIndex}>{subItem.attributeValue?.value || ''}</TableCell>
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
  )
}
