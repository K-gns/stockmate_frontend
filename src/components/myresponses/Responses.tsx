
//MUI
import {Box, Button, TextField} from '@mui/material'

//Icons
import FilterListIcon from '@mui/icons-material/FilterList'

//Components
import Table from '@components/myresponses/Table'

const Requests = () => {
  return (
    <>
      {/* Верхняя панель с поиском и кнопками */}
      <Box className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 mb-4">
        <TextField
          placeholder="Поиск по названию"
          size="small"
          className="w-full md:w-1/3"
        />
        <Box className="flex gap-2">
          <Button
            variant="outlined"
            startIcon={<FilterListIcon/>}
            className="normal-case"
          >
            Фильтры
          </Button>
        </Box>
      </Box>
      <Table/>
    </>
  )
}


export default Requests
