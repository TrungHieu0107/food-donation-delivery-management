'use client'

import ItemTemplateList from 'src/layouts/components/item/ItemList'
import { CommonRepsonseModel } from 'src/models/common/CommonResponseModel'
import { Category } from 'src/models/Item'
import { KEY } from 'src/common/Keys'
import { useEffect, useState } from 'react'
import { CategoryAPI } from 'src/api-client/Category'

const ItemTemplateListPage = () => {
  const [categories, setCategories] = useState<Category[]>([])

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

  return (
    <>
      {categories.length > 0 && (
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
      )}
    </>
  )
}

// export const getServerSideProps: GetServerSideProps<ItemTemplateListPageProps> = async () => {
//   // console.log('================', context , '================================');
//   try {
//     const categoryReponse = await CategoryAPI.getAllCategories()

//     return {
//       props: {
//         categories: new CommonRepsonseModel<Category[]>(categoryReponse).data ?? []
//       }
//     }
//   } catch (error) {
//     console.log(error)

//     return {
//       props: {
//         branchList: [],
//         categories: []
//       }
//     }
//   }
// }

ItemTemplateListPage.auth = [KEY.ROLE.SYSTEM_ADMIN, KEY.ROLE.BRANCH_ADMIN]

export default ItemTemplateListPage
