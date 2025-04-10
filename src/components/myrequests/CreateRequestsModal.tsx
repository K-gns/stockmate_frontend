import { useState } from 'react'

//MUI
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle, FormControl,
  InputLabel, MenuItem, Select, TextareaAutosize

} from '@mui/material'

import TextField from '@mui/material/TextField'

import type { RequestType } from '@store/requestStore';
import useRequestsStore from '@store/requestStore'

type FormData = Omit<RequestType, 'id' | 'date' | 'status'>;

interface CreateRequestModalProps {
  open: boolean,
  onClose: () => void
}

// Компонент модального окна
const CreateRequestModal = ({ open, onClose } : CreateRequestModalProps) => {
  const materials = ['Пакет п/э 200×300', 'Офисные стулья', 'Бумага А4', 'Картриджи']
  const units = ['шт', 'кг', 'л', 'м']
  const banks = ['Отделение1', 'Отделение2', 'Отделение3']

  const addRequest = useRequestsStore(state => state.addRequest)

  const [formData, setFormData] = useState<FormData>({
    material: '',
    count: 0,
    unit: '',
    bank: '',
    comment: ''
  })

  const handleChange = (field: keyof FormData) => (e: any) => {
    setFormData({
      ...formData,
      [field]: e.target.value
    })
  }

  const handleSubmit = () => {
    console.log('Отправка данных:', formData)
    addRequest(formData)
    onClose()
  }


  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Создать заявку на анализ</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {/* Материал */}
          <Autocomplete
            options={materials}
            renderInput={(params) => (
              <TextField {...params} label="Материал" variant="outlined" />
            )}
            value={formData.material}
            onChange={(e, value) => setFormData({ ...formData, material: value! })}
          />

          {/* Количество и единицы измерения */}
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <TextField
              label="Количество"
              type="number"
              value={formData.count}
              onChange={handleChange('count')}
              sx={{ flex: 1 }}
            />
            <FormControl sx={{ flex: 1 }}>
              <InputLabel>Единица</InputLabel>
              <Select
                value={formData.unit}
                onChange={handleChange('unit')}
                label="Единица"
              >
                {units.map(unit => (
                  <MenuItem key={unit} value={unit}>
                    {unit}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Территориальный банк */}
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Территориальный банк</InputLabel>
            <Select
              value={formData.bank}
              onChange={handleChange('bank')}
              label="Территориальный банк"
            >
              {banks.map(bank => (
                <MenuItem key={bank} value={bank}>
                  {bank}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Комментарий */}
          <TextareaAutosize
            placeholder="Комментарий"
            minRows={3}
            value={formData.comment}
            onChange={handleChange('comment')}
            style={{
              width: '100%',
              marginTop: 16,
              padding: 8,
              borderRadius: 4,
              border: '1px solid #ced4da'
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Отмена
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={!formData.material || !formData.count || !formData.unit}
        >
          Создать заявку
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CreateRequestModal
