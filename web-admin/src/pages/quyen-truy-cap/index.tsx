import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { Skeleton } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Tab from '@mui/material/Tab'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { RoleAPI } from 'src/api-client/Role'
import { KEY } from 'src/common/Keys'
import PermissionTable from 'src/layouts/components/table/PermissionTable'
import { RoleModel } from 'src/models/Role'
import { CommonRepsonseModel } from 'src/models/common/CommonResponseModel'

export default function PermissionPage() {
  const [roles, setRoles] = useState<RoleModel[]>([])
  const [currentRole, setCurrentRole] = useState<RoleModel>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const router = useRouter()

  useEffect(() => {
    fetchRoles()
  }, [])

  const fetchRoles = async () => {
    try {
      setIsLoading(true)

      const response = await RoleAPI.getAll()
      const commonReponse = new CommonRepsonseModel<RoleModel[]>(response)
      setRoles(commonReponse.data ?? [])

      if (router.query.role) {
        const roleName = router.query.role as string
        console.log(roleName, commonReponse.data?.filter(item => item.name === roleName).at(0))

        setCurrentRole(commonReponse.data?.filter(item => item.name === roleName).at(0))
      } else {
        setCurrentRole(commonReponse.data?.at(0))
      }
    } catch (err) {
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card
      sx={{
        p: 5
      }}
    >
      <TabContext value={currentRole?.name ?? ''}>
        <TabList aria-label='card navigation example'>
          {roles.length > 0 && !isLoading && currentRole
            ? roles.map(role => {
                return (
                  <Tab
                    key={role.id}
                    value={role.name}
                    label={role.displayName}
                    onClick={() => {
                      setCurrentRole(role)
                      router.replace({
                        pathname: '/quyen-truy-cap',
                        query: {
                          role: role.name
                        }
                      })
                    }}
                  />
                )
              })
            : [0, 1, 2, 3, 4].map(item => {
                return (
                  <Tab key={item} value={item} label={<Skeleton variant='rectangular' width={100} height={30} />} />
                )
              })}
        </TabList>
        <CardContent>
          <TabPanel value={currentRole?.name ?? ''} sx={{ p: 0 }}>
            {!isLoading ? (
              <PermissionTable tableName='Tất cả quyền truy cập' currentRole={currentRole} />
            ) : (
              <Skeleton variant='rectangular' width={'100%'} height={500} />
            )}
          </TabPanel>
        </CardContent>
      </TabContext>
    </Card>
  )
}

PermissionPage.auth = [KEY.ROLE.SYSTEM_ADMIN]
