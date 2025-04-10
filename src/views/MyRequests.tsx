'use client'

//Mui
import {
  Box,
  Typography,
} from '@mui/material'

//Components
import Requests from '@components/myrequests/Requests'


const MyRequests = () => {
  return (
    <Box className="p-6">
      {/* Заголовок страницы */}
      <Typography variant="h4" className="font-semibold mb-4">
        Мои заявки
      </Typography>

      {/*Заявки*/}
      <Requests />
    </Box>
  )
}

export default MyRequests
