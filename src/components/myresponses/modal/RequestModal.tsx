import { useState, useEffect } from 'react'

import type { SelectChangeEvent } from '@mui/material';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  FormControl,
  Select,
  MenuItem,
  Autocomplete,
  TextField,
  Divider,
  Paper,
  Box
} from '@mui/material'

import CustomAvatar from '@core/components/mui/Avatar'
import { useSelectedRequestStore } from '@store/modals/selectedRequestStore'

import { banksData } from '@store/banksData'

const statusOptions = ['В работе', 'На уточнении', 'Завершена']

const RequestModal = () => {
  const { selectedRequest, clearSelectedRequest } = useSelectedRequestStore()
  const open = Boolean(selectedRequest)

  const [status, setStatus] = useState<string>('')
  const [targetTb, setTargetTb] = useState<string>('')

  useEffect(() => {
    if (selectedRequest) {
      setStatus(selectedRequest.status)
      setTargetTb('')
    }
  }, [selectedRequest])

  const handleClose = () => {
    clearSelectedRequest()
  }

  const handleStatusChange = (event:  SelectChangeEvent<{ value: string }>) => {
    setStatus(event.target.value as string)
  }

  const handleTargetChange = (_: any, value: string | null) => {
    if (value) setTargetTb(value)
  }

  if (!selectedRequest) return null

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
      <DialogTitle>Изменение заявки</DialogTitle>
      <DialogContent dividers>
        {/* Первый раздел: Информация */}
        <Grid container spacing={4} mb={10}>
          {/* Две колонки: левая про ТМЦ и описание, правая про пользователя */}
          <Grid item xs={12} md={6} container spacing={3}>
            <Grid item xs={12}>
              <Typography><strong>ТМЦ:</strong> {selectedRequest.material}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography><strong>Количество, шт.:</strong> {selectedRequest.quantity}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography><strong>Описание:</strong> {selectedRequest.description}</Typography>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6} container spacing={3} alignItems="center">
            <Grid item>
              <div className="flex items-center gap-3">
                <CustomAvatar src={selectedRequest.avatarSrc} size={34} />
                <div className="flex flex-col">
                  <Typography color="text.primary" className="font-medium">
                    {selectedRequest.name}
                  </Typography>
                  <Typography variant="body2">{selectedRequest.email}</Typography>
                </div>
              </div>
            </Grid>
            <Grid item xs={12}>
              <Typography><strong>Отделение:</strong> {selectedRequest.department}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography><strong>Почта:</strong> {selectedRequest.email}</Typography>
            </Grid>
          </Grid>
        </Grid>

        <Divider />

        {/* Второй раздел: Изменение */}
        <Box mt={6} mb={4}>
          <Typography variant="subtitle1" color="textPrimary"><strong>Изменение</strong></Typography>
        </Box>
        <Grid container spacing={4} mb={10}>
          <Grid item xs={6}>
            <Typography className="mb-3"><strong>Из какого ТБ отгрузить</strong></Typography>
            <Autocomplete
              options={banksData}
              value={targetTb}
              onChange={handleTargetChange}
              renderInput={(params) => <TextField {...params} label="Отгрузка из" fullWidth />}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography className="mb-3"><strong>Статус заявки</strong></Typography>
            <FormControl variant="outlined" fullWidth size="small">
              <Select
                size="medium"
                value={status as any}
                onChange={handleStatusChange}
              >
                {statusOptions.map((opt) => (
                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Divider />

        {/* Третий блок: рекомендации алгоритма */}
        <Box mt={7} mb={4}>
          <Typography variant="subtitle1" color="textPrimary"><strong>Анализ</strong></Typography>
        </Box>

        {/* Рекомендация */}
        <Paper variant="outlined" sx={{ borderColor: 'info.light', p: 4 }}>
          <Typography variant="subtitle1" gutterBottom>
            Рекомендация алгоритма:
          </Typography>
          <Typography variant="body1" color="primary.main">
            Лучше всего заказать из ТБ [7000] в количестве 10345 шт
          </Typography>
        </Paper>


      </DialogContent>
      <DialogActions className="mt-4">
        <Button onClick={handleClose}>Закрыть</Button>
        <Button variant="contained" onClick={handleClose}>Сохранить</Button>
      </DialogActions>
    </Dialog>
  )
}

export default RequestModal
