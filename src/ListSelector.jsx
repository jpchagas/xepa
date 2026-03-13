import { FormControl, InputLabel, Select, MenuItem } from '@mui/material'

function ListSelector({ lists, selectedList, setSelectedList }) {
  return (
    <FormControl fullWidth sx={{ mb: 2 }}>
      <InputLabel>Lista</InputLabel>
      <Select value={selectedList?.id || ''} label="Lista" onChange={(e) => {
        const list = lists.find(l => l.id === e.target.value)
        setSelectedList(list)
      }}>
        {lists.map(list => (
          <MenuItem key={list.id} value={list.id}>{list.name}</MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default ListSelector