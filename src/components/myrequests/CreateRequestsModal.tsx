import { useState } from 'react';

import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormLabel,
  IconButton,
  MenuItem,
  Select,
  TextField,
  TextareaAutosize,
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';

import type { RequestType } from '@store/requestStore';
import useRequestsStore from '@store/requestStore';
import { banksData } from '@store/banksData'

type FormData = Omit<RequestType, 'id' | 'date' | 'status'>;

interface CreateRequestModalProps {
  open: boolean;
  onClose: () => void;
}

const CreateRequestModal = ({ open, onClose }: CreateRequestModalProps) => {
  const materials = ['Пакет п/э 200×300', 'Офисные стулья', 'Бумага А4', 'Картриджи'];
  const units = ['шт', 'кг', 'л', 'м'];

  const addRequest = useRequestsStore((state) => state.addRequest);

  const [formData, setFormData] = useState<FormData>({
    material: '',
    count: 0,
    unit: 'шт',
    bank: '',
    comment: '',
    statusColor: 'inactive'
  });

  const handleChange = (field: keyof FormData) => (e: any) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    });
  };

  const handleSubmit = () => {
    console.log('Отправка данных:', formData);
    addRequest(formData);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          width: '70%',
          minWidth: 600,
        },
      }}
    >
      <DialogTitle>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: 3,
            pt: 2,
          }}
        >
          Создать заявку на анализ
          <IconButton onClick={onClose} sx={{ p: 0 }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ px: 6, py: 6 }}>
        {/* Блок Материал + Количество + Единица */}
        <Box sx={{ display: 'flex', gap: 3, mb: 6, alignItems: 'flex-start' }}>
          {/* Колонка "Материал" */}
          <Box sx={{ flex: 3 }}>
            <FormLabel sx={{ mb: 2, display: 'block', color: 'text.primary' }}>
              Материал
            </FormLabel>
            <Autocomplete
              options={materials}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder="Выберите материал"
                  InputProps={{
                    ...params.InputProps,
                    sx: { borderRadius: 1, bgcolor: 'background.paper' },
                  }}
                />
              )}
              value={formData.material}
              onChange={(e, value) => setFormData({ ...formData, material: value! })}
              sx={{ width: '100%' }}
            />
          </Box>

          {/* Колонка "Количество и единица" */}
          <Box sx={{ flex: 2 }}>
            <FormLabel sx={{ mb: 2, display: 'block', color: 'text.primary' }}>
              Количество
            </FormLabel>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                type="number"
                value={formData.count}
                onChange={handleChange('count')}
                variant="outlined"
                placeholder="Количество"
                InputProps={{
                  sx: { borderRadius: 1, bgcolor: 'background.paper', flex: 1 },
                }}
              />
              <FormControl variant="outlined" sx={{ flex: 1 }}>
                <Select
                  value={formData.unit}
                  onChange={handleChange('unit')}
                  displayEmpty
                  sx={{
                    borderRadius: 1,
                    '& .MuiSelect-select': { py: 1.5, px: 2 },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'divider',
                    },
                  }}
                >
                  {units.map((unit) => (
                    <MenuItem key={unit} value={unit}>
                      {unit}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Box>

        {/* Территориальный банк */}
        <Box sx={{ mb: 6 }}>
          <FormLabel sx={{ mb: 2, display: 'block', color: 'text.primary' }}>
            Территориальный банк
          </FormLabel>
          <FormControl variant="outlined" fullWidth>
            <Select
              value={formData.bank}
              onChange={handleChange('bank')}
              displayEmpty
              sx={{
                borderRadius: 1,
                '& .MuiSelect-select': { py: 1.5, px: 2 },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'divider',
                },
              }}
            >
              {banksData.map((bank) => (
                <MenuItem key={bank} value={bank}>
                  {bank}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Комментарий */}
        <Box>
          <FormLabel sx={{ mb: 2, display: 'block', color: 'text.primary' }}>
            Комментарий
          </FormLabel>
          <TextareaAutosize
            placeholder="Особенные условия, пояснения"
            minRows={5}
            value={formData.comment}
            onChange={handleChange('comment')}
            style={{
              width: '100%',
              padding: 14,
              borderRadius: 8,
              border: '1px solid #ced4da',
              font: 'inherit',
              resize: 'none',
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 4, pb: 3, display: 'block' }}>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={!formData.material || !formData.count || !formData.unit}
          sx={{ mb: 2, borderRadius: 2 }}
        >
          Создать заявку
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateRequestModal;
