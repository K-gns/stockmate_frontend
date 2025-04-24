'use client'

//Mui
import {
  Box,
  Typography,
} from '@mui/material'

//Components
import Responses from '@components/myresponses/Responses'


const MyResponses = () => {
  return (
    <Box className="p-6">
      {/* Заголовок страницы */}
      <Typography variant="h4" className="font-semibold mb-4">
        Мои ответы
      </Typography>

      {/*Заявки*/}
      <Responses />
    </Box>
  )
}

export default MyResponses
