// ** React Imports
import { ReactNode, useState } from 'react'

import Box from '@mui/material/Box'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'
import BackDrop from 'src/layouts/components/loading/BackDrop'
import TabContext from '@mui/lab/TabContext'
import { TabPanel } from '@mui/lab'
import TermsAndBenefitView from 'src/layouts/components/views/registration/TermsAndBenefits'
import CreateCharityView from 'src/layouts/components/views/registration/CreateCharityView'
import { CharityCreatingModel, CharityUnitModel } from 'src/models/Charity'
import CreateCharityUnitView from 'src/layouts/components/views/registration/CreateCharityUnitView'
import { CharityAPI } from 'src/api-client/Charity'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { CommonRepsonseModel } from 'src/models/common/CommonResponseModel'

// import CreateCharityUnitView from 'src/layouts/components/views/registration/CreateCharityUnitView'

const RegisterPage = () => {
  // ** State
  const [loading, setLoading] = useState<boolean>(false)
  const [currentTab, setCurrentTab] = useState<string>('terms-and-benefits')
  const [charity, setCharity] = useState<CharityCreatingModel>(
    new CharityCreatingModel({
      name: '',
      logo: null,
      description: '',
      charityUnits: [new CharityUnitModel({
        isHeadquarter: true
      })],
      email: ''
    })
  )

  const router = useRouter()

  const handleChangeTab = (tabName: string, charityModel?: CharityCreatingModel) => {
    setLoading(true)
    charityModel && setCharity({ ...charityModel })

    if (tabName === 'submit') {
      handleSubmit(charityModel)

      return
    }
    setCurrentTab(tabName)
    setLoading(false)
  }

  const handleSubmit = async (charityModel?: CharityCreatingModel) => {
    console.log(charity, charityModel)
    try {
      if (charityModel) {
        const reponse = await CharityAPI.register(charityModel)
        toast.success(new CommonRepsonseModel<any>(reponse).message)
        router.push('/')
      }

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false)
    }

  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        height: '100vh !important',
        width: '100vw !important'
      }}
    >
      <TabContext value={currentTab}>
        <TabPanel sx={{ p: 0, width: '100%', flexGrow: 1 }} value='terms-and-benefits'>
          <TermsAndBenefitView handleChangeTab={handleChangeTab} nameNextTab='create-charity-info' />
        </TabPanel>
        <TabPanel sx={{ p: 0, width: '100%', flexGrow: 1 }} value='create-charity-info'>
          <CreateCharityView
            handleChangeTab={handleChangeTab}
            nameNextTab='create-charity-unit-info'
            nameBackTab='terms-and-benefits'
            charityModel={charity}
          />
        </TabPanel>
        <TabPanel sx={{ p: 0, width: '100%', flexGrow: 1 }} value='create-charity-unit-info'>
          <CreateCharityUnitView
            handleChangeTab={handleChangeTab}
            nameBackTab='create-charity-info'
            charityModel={charity}
          />
        </TabPanel>
      </TabContext>
      <Box
        sx={{
          background: `url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBj7EbsdPC0Dr6N-Gb3LmpXvrpJjc4gHLFWA&usqp=CAU')`,
          width: '30vw',
          height: '100vh !important',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover'
        }}
      ></Box>
      <BackDrop open={loading} />
    </Box>
  )
}

RegisterPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default RegisterPage
