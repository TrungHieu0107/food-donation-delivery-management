import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import * as React from 'react';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


export default function SearchScheduleTimeForExport(props: any) {
  const [scheduleTime, setScheduleTime] = React.useState<object[]>([]);

  const handleChange = (event: any) => {
    const {
      target: { value },
    } = event;
    console.log(value);
    if(typeof(value) !== 'string'){
        setScheduleTime(value)
        props.setScheduleTimeListSelected(value)
      }
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: "100%" }}>
        <InputLabel id="demo-multiple-checkbox-label">Chọn lịch trình</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          fullWidth
          value={scheduleTime}
          onChange={handleChange}
          input={<OutlinedInput label="Chọn lịch trình" />}
          renderValue={(selected) => {
            const valueToRender = selected.map((s: any) => s?.day + " (" + s?.startTime + " - " + s?.endTime +")")

            return valueToRender.join(', ')
          }}
          MenuProps={MenuProps}
        >
          {props.data?.map((s: any, index: any) => (
            <MenuItem key={index} value={s}>
              <Checkbox checked={scheduleTime.some((item: any) => item === s)} />
              <ListItemText primary={s?.day + " (" + s?.startTime + " - " + s?.endTime +")"} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
