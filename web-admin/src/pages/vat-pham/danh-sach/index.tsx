'use client'

import ItemTemplateList from 'src/layouts/components/item/ItemList'
import { CommonRepsonseModel } from 'src/models/common/CommonResponseModel'
import { Category } from 'src/models/Item'
import { useEffect, useState } from 'react'
import { CategoryAPI } from 'src/api-client/Category'

export default function ItemList() {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await CategoryAPI.getAllCategories()
      const categories = new CommonRepsonseModel<Category[]>(response)
      setCategories(categories.data ?? [])
    } catch (err) {
      console.log(err)
    }
  }

  return (
    categories.length > 0 && (
      <ItemTemplateList
        tabs={[
          {
            id: '0',
            name: 'Tất cả'
          },
          {
            id: '1',
            name: 'Thực phẩm'
          },
          {
            id: '2',
            name: 'Đồ dùng'
          }
        ]}
        categories={categories}
      />
    )
  )
}
