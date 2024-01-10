import * as React from 'react'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { Box, InputLabel } from '@mui/material'

// import CircularProgress from '@mui/material/CircularProgress'
// import axiosClient from 'src/api-client/ApiClient'

export default function SearchAidItemForExport(props: any) {
  const [open, setOpen] = React.useState(false)

//   const [loading, setLoading] = React.useState(false)

//   const [dataSearch, setDataSearch] = React.useState<any>([])
//   let timeoutId: NodeJS.Timeout;

//   const fetchData = async (s: string) => {
//     try {
//       const res = await axiosClient.get(`/item?searchKeyWord=${s}`)
//       if (res.data) setDataSearch(res.data)
//       else setDataSearch([])
//       setLoading(false)
//     } catch (error) {
//       console.log(error)
//       setLoading(true)
//     }
//   }
  
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     clearTimeout(timeoutId);

//     timeoutId = setTimeout(() => {
//       const inputValue = e.target.value
//       if (inputValue !== '') {
//         setLoading(true)
//         fetchData(e.target.value)
//       }
//     }, 1000);
    
//   }

  return (
    <Box sx={{mt: 5, mb: 5}}>
    <InputLabel sx={{fontWeight: 700}}>Tìm kiếm tên vật phẩm</InputLabel>
    <Autocomplete
      id='asynchronous-demo'
      fullWidth

      // sx={{ width: 500 }}
      open={open}
      onOpen={() => {
        setOpen(true)
      }}
      onClose={() => {
        setOpen(false)
      }}
      onChange={(event, value: any) => {
        console.log("zo")
        if (value) {
            let strName = "";
            for(let i = 0; i < value.attributeValues.length; i++){
              if(value.attributeValues.length === 1){
                strName +=  value.attributeValues[i];
              }
              else if(value.attributeValues.length > 1 && i === value.attributeValues.length - 1){
                strName +=  value.attributeValues[i];
              }
              else{
                strName +=  value.attributeValues[i] + ",";
              }
              
            }
            const dataAdd = {
              name: value.name + " ( " + strName + " ) ",
              id: value.id,
              quantity: value.quantity,
              unit: value.unit
            }
            const check = props?.itemSelected.some((item: any) => item.id === dataAdd.id)
            if (check) {
  
              return
            }
            const newArray = [...props.itemSelected, dataAdd]
            props.setItemSelected(newArray)
            props.formikRef.current?.setFieldValue('listItemSelected', newArray)
          }      
      }}
      isOptionEqualToValue={(option, value) => option === value}
      getOptionLabel={(option: any) => {   

        let strName = "";
        for(let i = 0; i < option?.attributeValues.length; i++){
          if(option.attributeValues.length === 1){
            strName +=  option.attributeValues[i];
          }
          else if(option.attributeValues.length > 1 && i === option.attributeValues.length - 1){
            strName +=  option.attributeValues[i];
          }
          else{
            strName +=  option.attributeValues[i] + ",";
          }
          
        }

        return option?.name + " ( " + strName + " ) "; 
        
      }}
      options={props?.data}
      
    //   loading={loading}
      freeSolo
      filterOptions={options => options}
      renderInput={params => (
        <TextField
          {...params}

        //   onChange={handleChange}
          placeholder='Tìm kiếm vật phẩm quyên góp ở đây...'
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <>
                {params.InputProps.startAdornment}
              </>
            ),
            endAdornment: (
              <React.Fragment>
                {/* {loading ? <CircularProgress color='inherit' size={20} /> : null} */}
                {params.InputProps.endAdornment}
              </React.Fragment>
            )
          }}
        />
      )}
    />
     </Box>
  )
}
