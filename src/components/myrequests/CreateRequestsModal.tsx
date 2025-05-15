import { useState } from 'react'

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
  FormControlLabel,
  FormLabel,
  IconButton,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  TextareaAutosize,
  createFilterOptions
} from '@mui/material'

import CloseIcon from '@mui/icons-material/Close'

import type { RequestType } from '@store/requestStore'
import useRequestsStore from '@store/requestStore'
import { banksData } from '@store/banksData'
import { materialsData } from '@store/materialsData'


type FormData = Omit<RequestType, 'id' | 'date' | 'status'>;

type OptionType = string | { inputValue: string; title: string };

const filter = createFilterOptions<OptionType>();


interface CreateRequestModalProps {
  open: boolean;
  onClose: () => void;
}

const CreateRequestModal = ({ open, onClose }: CreateRequestModalProps) => {
  const units = ['шт', 'кг', 'л', 'м']
  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1)

  const addRequest = useRequestsStore((state) => state.addRequest)

  const [mode, setMode] = useState<'quantity' | 'months'>('quantity')

  const [formData, setFormData] = useState<FormData>({
    material: '',
    count: 0,
    unit: 'шт',
    current_tb: '',
    not_tb: [], //Банки из которых нельзя привозить
    comment: '',
    statusColor: 'inactive',
    count_months: undefined
  })

  const handleModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.value as 'quantity' | 'months'

    setMode(selected)

    setFormData({
      ...formData,
      count: selected === 'quantity' ? formData.count : 0,
      count_months: selected === 'months' ? formData.count_months : undefined,
      unit: selected === 'quantity' ? formData.unit : formData.unit
    })
  }

  const handleNotTbChange = (event: any, value: string[]) => {
    setFormData({
      ...formData,
      not_tb: value
    })
  }

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
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          width: '70%',
          minWidth: 600
        }
      }}
    >
      <DialogTitle>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: 3,
            pt: 2
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

        {/* Блок выбора режима */}
        <Box sx={{ mb: 4 }}>
          <FormControl component="fieldset">
            <FormLabel component="legend" sx={{ mb: 2 }}>Режим ввода</FormLabel>
            <RadioGroup
              row
              value={mode}
              onChange={handleModeChange}
            >
              <FormControlLabel value="quantity" control={<Radio />} label="По количеству" />
              <FormControlLabel value="months" control={<Radio />} label="На сколько месяцев" />
            </RadioGroup>
          </FormControl>
        </Box>

        {/* Блок Материал + Количество + Единица */}
        <Box sx={{ display: 'flex', gap: 3, mb: 6, alignItems: 'flex-start' }}>

          {/* Колонка "Материал" */}
          <Box sx={{ flex: 3 }}>
            <FormLabel sx={{ mb: 2, display: 'block', color: 'text.primary' }}>
              Материал или ID материала
            </FormLabel>
            <Autocomplete
              freeSolo
              fullWidth
              options={materialsData as OptionType[]}
              filterOptions={(options, params) => {
                const filtered = filter(options, params);
                const { inputValue } = params;

                // Если введённого значения нет в списке — добавляем «Добавить "xxx"»
                const isExisting = options.includes(inputValue as OptionType);

                if (inputValue !== '' && !isExisting) {
                  filtered.push({
                    inputValue,
                    title: `Выбрать товар с ID "${inputValue}"`,
                  });
                }

                return filtered;
              }}
              getOptionLabel={(option) => {
                if (typeof option === 'string') {
                  return option;
                }

                if ('inputValue' in option) {
                  return option.inputValue;
                }

                return option;
              }}
              renderOption={(props, option) => (
                <li {...props}>
                  {typeof option === 'string' ? option : option.title}
                </li>
              )}
              inputValue={formData.material}
              onInputChange={(_, v) => {
                setFormData({ ...formData, material: v });
              }}
              onChange={(_, newValue) => {
                if (typeof newValue === 'string') {
                  setFormData({ ...formData, material: newValue });
                } else if (newValue && 'inputValue' in newValue) {
                  setFormData({ ...formData, material: newValue.inputValue });
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder="Выберите материал или введите ID"
                  InputProps={{
                    ...params.InputProps,
                    sx: { borderRadius: 1, bgcolor: 'background.paper' }
                  }}
                />
              )}
            />
          </Box>

          {/* Ввод количества или месяцев */}
          {mode === 'quantity' ? (
            <Box sx={{ display: 'flex', gap: 3, mb: 6, alignItems: 'flex-start' }}>
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
                      sx: { borderRadius: 1, bgcolor: 'background.paper', flex: 1 }
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
                          borderColor: 'divider'
                        }
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
          ) : (
            <Box sx={{ mb: 6, maxWidth: 200 }}>
              <FormLabel sx={{ mb: 2, display: 'block', color: 'text.primary' }}>
                Запас на, месяцев
              </FormLabel>
              <FormControl variant="outlined" fullWidth>
                <Select
                  value={formData.count_months || ''}
                  onChange={handleChange('count_months')}
                  displayEmpty
                  size="medium"
                >
                  {monthOptions.map((m) => (
                    <MenuItem key={m} value={m}>
                      {m}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}

        </Box>

        {/* Территориальный банк */}
        <Box sx={{ mb: 6 }}>
          <FormLabel sx={{ mb: 2, display: 'block', color: 'text.primary' }}>Территориальный банк, в который требуется поставка</FormLabel>
          <Autocomplete
            freeSolo
            fullWidth
            options={banksData as OptionType[]}
            filterOptions={(options, params) => {
              const filtered = filter(options, params);
              const { inputValue } = params;
              const isExisting = options.includes(inputValue as OptionType);

              if (inputValue !== '' && !isExisting) {
                filtered.push({ inputValue, title: `Выбрать ТБ с ID "${inputValue}"` });
              }

              return filtered;
            }}
            getOptionLabel={(option) => typeof option === 'string' ? option : option.inputValue}
            renderOption={(props, option) => <li {...props}>{typeof option === 'string' ? option : option.title}</li>}
            inputValue={formData.current_tb}
            onInputChange={(_, v) => setFormData({ ...formData, current_tb: v })}
            onChange={(_, newVal) => {
              if (typeof newVal === 'string') setFormData({ ...formData, current_tb: newVal });
              else if (newVal && 'inputValue' in newVal) setFormData({ ...formData, current_tb: newVal.inputValue });
            }}
            renderInput={(params) => <TextField {...params} variant="outlined" placeholder="Выберите банк или введите ID" InputProps={{ ...params.InputProps, sx: { borderRadius: 1, bgcolor: 'background.paper' } }} />}
          />
        </Box>

        {/* Исключить банки */}
        <Box sx={{ mt: 4, mb: 6 }}>
          <FormLabel
            sx={{
              mb: 2,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              color: 'text.primary'
            }}
          >
            <i className="ri-close-line" />
            Исключить территориальные банки
          </FormLabel>
          <Autocomplete
            multiple
            freeSolo
            options={banksData}
            value={formData.not_tb || []}
            onChange={handleNotTbChange}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="Выберите банки или введите ID и нажмите Enter"
                InputProps={{ ...params.InputProps, sx: { borderRadius: 1, bgcolor: 'background.paper' } }}
              />
            )}
          />
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
              resize: 'none'
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
  )
}

export default CreateRequestModal
