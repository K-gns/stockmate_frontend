import { useState } from 'react'

//MUI
import { Box, Button, TextField } from '@mui/material'

//Icons
import FilterListIcon from '@mui/icons-material/FilterList'
import AddIcon from '@mui/icons-material/Add'

//Components
import RequestSection from '@components/myrequests/RequestSection'
import CreateRequestModal from '@components/myrequests/CreateRequestsModal'

//Hooks
import useRequestsStore from '@/store/requestStore'

const Requests = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const handleOpenCreateModal = () => setIsCreateModalOpen(true)
  const handleCloseCreateModal = () => setIsCreateModalOpen(false)

  const inProgressRequests = useRequestsStore(state => state.inProgressRequests)
  const completedRequests = useRequestsStore(state => state.completedRequests)
  const cancelledRequests = useRequestsStore(state => state.cancelledRequests)


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
            startIcon={<FilterListIcon />}
            className="normal-case"
          >
            Фильтры
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            className="normal-case"
            onClick={handleOpenCreateModal}
          >
            Создать заявку
          </Button>
        </Box>
      </Box>

      {/* Секция "В работе" */}
      <RequestSection
        title="В работе"
        requests={inProgressRequests}
        total={inProgressRequests.length}
      />

      {/* Секция "Выполненные" */}
      <RequestSection
        title="Выполненные"
        requests={completedRequests}
        total={completedRequests.length}
      />

      {/* Секция "Отмененные" */}
      <RequestSection
        title="Отменённые"
        requests={cancelledRequests}
        total={cancelledRequests.length}
      />

      {/* Модальное окно создания заявки */}
      <CreateRequestModal
        open={isCreateModalOpen}
        onClose={handleCloseCreateModal}
      />
    </>
  )
}


export default Requests
