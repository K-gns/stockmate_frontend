import {useMemo, useState } from 'react'

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
import {materialsMap, warehousesMap} from "@store/materialsNames";
import {toast} from "react-toastify";


type FormData = Omit<RequestType, 'id' | 'date' | 'status'>;

type OptionType = string | { inputValue: string; title: string };

interface BankOption { id: string; label: string }

interface MaterialOption { id: string; label: string }

const filter = createFilterOptions<OptionType>();


interface CreateRequestModalProps {
  open: boolean;
  onClose: () => void;
}

const CreateRequestModal = ({ open, onClose }: CreateRequestModalProps) => {
  const units = ['шт', 'кг', 'л', 'м']
  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1)

  const createRequest = useRequestsStore((state) => state.createRequest)
  const isFetching = useRequestsStore((state) => state.loading)

  const [mode, setMode] = useState<'quantity' | 'months'>('quantity')

  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    material_id: '',
    materialName: '',
    target_count: 0,
    unit: 'шт',
    current_tb: '',
    current_tb_name: '',
    not_tb: [], //Банки из которых нельзя привозить
    comment: '',
    statusColor: 'inactive',
    count_months: undefined
  })

  const bankOptions = useMemo<BankOption[]>(
    () => Object.entries(warehousesMap).map(([id, label]) => ({ id, label })),
    [] )

  const materialOptions = useMemo<MaterialOption[]>(
    () => Object.entries(materialsMap).map(([id, label]) => ({ id, label })),
    []
  )

  const handleModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.value as 'quantity' | 'months'

    setMode(selected)

    setFormData({
      ...formData,
      target_count: selected === 'quantity' ? formData.target_count : 0,
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

  const handleSubmit = async () => {
    setIsSubmitting(true)
    console.log('Отправка данных:', formData)
    try {
      await createRequest({
        ...formData,
        material_id: Number(formData.material_id),
        not_tb: formData.not_tb as string[]
      })
      onClose()
    } catch {

    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={() => { if (!(isSubmitting || isFetching)) onClose() }}
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
              options={materialOptions}
              getOptionLabel={(opt) => `[${opt.id}] ${opt.label}`}
              value={
                materialOptions.find((m) => m.id === formData.material_id) || null
              }
              onChange={(_, option) => {
                setFormData((fd) => ({
                  ...fd,
                  material_id:     option ? option.id   : '',
                  materialName: option ? option.label: ''
                }))
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder="Выберите материал"
                  InputProps={{
                    ...params.InputProps,
                    sx: { borderRadius: 1, bgcolor: 'background.paper' }
                  }}
                />
              )}
              fullWidth
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
                    value={formData.target_count}
                    onChange={handleChange('target_count')}
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
          <FormLabel sx={{ mb: 2, display: 'block', color: 'text.primary' }}>
            Территориальный банк, в который требуется поставка
          </FormLabel>
          <Autocomplete
            options={bankOptions}
            getOptionLabel={(opt) => `[${opt.id}] ${opt.label}`}
            value={bankOptions.find((b) => b.id === formData.current_tb) || null}
            onChange={(_, option) => {
              setFormData((fd) => ({
                ...fd,
                current_tb: option ? option.id : '',
                current_tb_name: option ? option.label : ''
              }))
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="Выберите банк"
                InputProps={{
                  ...params.InputProps,
                  sx: { borderRadius: 1, bgcolor: 'background.paper' }
                }}
              />
            )}
            fullWidth
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
            options={bankOptions}
            getOptionLabel={(opt) => `[${opt.id}] ${opt.label}`}
            value={bankOptions.filter((b) => formData.not_tb?.includes(b.id))}
            onChange={(_, options) => {
              setFormData((fd) => ({
                ...fd,
                not_tb: options.map((o) => o.id)
              }))
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="Выберите банки для исключения"
                InputProps={{
                  ...params.InputProps,
                  sx: { borderRadius: 1, bgcolor: 'background.paper' }
                }}
              />
            )}
            fullWidth
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
          disabled={
            (isSubmitting || isFetching) ||
            !formData.material_id ||
            !formData.current_tb ||
            (mode === 'quantity'
              ? !(formData?.target_count && formData.target_count > 0) || !formData.unit
              : formData.count_months == null)
          }
          sx={{ mb: 2, borderRadius: 2 }}
        >
          {(isSubmitting || isFetching) ? 'Создание...' : 'Создать заявку'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CreateRequestModal
