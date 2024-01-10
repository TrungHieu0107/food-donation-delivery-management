// ** MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'

// ** Icons Imports

// ** Types
import PieChartView from './PieChartView'

const TotalEarning = ({setFilterDelivery, filterDelivery, dataDeliveryStatistic}: any) => {
  return (
    <Card sx={{height:430}}>
      <CardHeader
        title='Thống kê vận chuyển'
        titleTypographyProps={{ sx: { lineHeight: '1.6 !important', letterSpacing: '0.15px !important' } }}
      />
      <CardContent sx={{ pt: theme => `${theme.spacing(2.25)} !important` }}>
      <PieChartView 
      dataDeliveryStatistic={dataDeliveryStatistic}
      filterDelivery={filterDelivery} 
      setFilterDelivery={setFilterDelivery}
      />
      </CardContent>
    </Card>
  )
}

export default TotalEarning
