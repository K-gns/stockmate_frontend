'use client'

//Mui
import {
  Box,
  Typography,
} from '@mui/material'

//Components
import Provisions from '@components/provisions/Provisions'


const MyProvisions = () => {
  return (
    <Box className="p-6">
      {/* Заголовок страницы */}
      <Typography variant="h4" className="font-semibold mb-4">
        Текущие запасы
      </Typography>

      {/*Заявки*/}
      <Provisions />
    </Box>
  )
}

export default MyProvisions
