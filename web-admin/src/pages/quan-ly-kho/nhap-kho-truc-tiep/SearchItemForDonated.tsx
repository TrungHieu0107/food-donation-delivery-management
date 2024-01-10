import * as React from 'react'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress'
import axiosClient from 'src/api-client/ApiClient'
import { Box, InputLabel } from '@mui/material'

export default function SearchItemForDonated(props: any) {
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [dataSearch, setDataSearch] = React.useState<any>([])
  let timeoutId: NodeJS.Timeout;
  const fetchData = async (s: string) => {
    try {
      const res = await axiosClient.get(`/item?searchKeyWord=${s}`)
      if (res.data) setDataSearch(res.data)
      else setDataSearch([])
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(true)
    }
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      const inputValue = e.target.value
      if (inputValue !== '') {
        setLoading(true)
        fetchData(e.target.value)
      }
    }, 1000);
    
  }

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
        console.log(event, value)
        if (value) {
          let strName = "";
          for(let i = 0; i < value?.attributes?.length; i++){
            if(value?.attributes?.length === 1){
              strName +=  value?.attributes[i]?.attributeValue;
            }
            else if(value?.attributes?.length > 1 && i === value?.attributes?.length - 1){
              strName +=  value?.attributes[i]?.attributeValue;
            }
            else{
              strName +=  value?.attributes[i]?.attributeValue + ",";
            }
            
          }
          if(typeof(value) === "string"){
            
            return
          }
          const dataAdd = {
            name: strName === "" ? value?.name : value?.name + " ( " + strName + " ) ",
            id: value?.itemTemplateId,
            quantity: 1,
            unit: value?.unit?.name,
            status: "new_item"
          }
          const check = props?.itemSelected?.some((item: any) => item.id === dataAdd.id)
          if (check) {

            return
          }
          const dataField =  props.formikRef.current?.values?.listItemSelected        
          let newArray = []; 
          if(dataField[0]?.id){
            newArray = [...dataField, dataAdd]
          }else{
            newArray = [dataAdd]
          }       
          props.setItemSelected(newArray)
          props.formikRef.current?.setFieldValue('listItemSelected', newArray)
        }
      }}
      isOptionEqualToValue={(option, value) => option === value}
      getOptionLabel={(option: any) => {   
        let strName = "";
        for(let i = 0; i < option?.attributes?.length; i++){
          if(option?.attributes?.length === 1){
            strName +=  option?.attributes[i]?.attributeValue;
          }
          else if(option?.attributes?.length > 1 && i === option?.attributes?.length - 1){
            strName +=  option?.attributes[i]?.attributeValue;
          }
          else{
            strName +=  option?.attributes[i]?.attributeValue + ",";
          }
          
        }

        return strName === "" ? (option?.name ? option?.name : "")  : option?.name + " ( " + strName + " ) ";
        
      }}
      options={dataSearch}
      loading={loading}
      freeSolo
      autoHighlight
      filterOptions={options => options}
      renderInput={params => (
        <TextField
          {...params}
          onChange={handleChange}
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
                {loading ? <CircularProgress color='inherit' size={20} /> : null}
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
