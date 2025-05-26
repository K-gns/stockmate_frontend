import { useState, useEffect, useMemo } from 'react'

import { alpha, SelectChangeEvent } from '@mui/material'
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
  Box,
  Accordion, AccordionSummary, AccordionDetails,
  Table, TableCell, TableRow, TableHead, TableBody
} from '@mui/material'

import CustomAvatar from '@core/components/mui/Avatar'
import { useSelectedRequestStore } from '@store/modals/selectedRequestStore'

import { banksData } from '@store/banksData'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'

// Styles Imports
import tableStyles from '@core/styles/table.module.css'

import { useTheme } from '@mui/material/styles'
import {warehousesMap} from "@store/materialsNames";

const statusOptions = ['В работе', 'На уточнении', 'Завершена']

// Общий стиль для разделителей ячеек
const cellStyle = { borderRight: '1px solid rgba(224, 224, 224, 1)' }

const RequestModal = () => {
  const { selectedRequest, clearSelectedRequest } = useSelectedRequestStore()
  const open = Boolean(selectedRequest)

  const theme = useTheme()

  const [status, setStatus] = useState<string>('')
  const [targetTb, setTargetTb] = useState<string>('')

  useEffect(() => {
    if (selectedRequest) {
      setStatus(selectedRequest.status)
      setTargetTb(selectedRequest.analysis?.result?.target_tb ?? '')
    }
  }, [selectedRequest])


  const handleClose = () => {
    clearSelectedRequest()
  }

  const handleStatusChange = (event: SelectChangeEvent<{ value: string }>) => {
    setStatus(event.target.value as string)
  }

  const handleTargetChange = (_: any, option: { id: string; label: string } | null) => {
    setTargetTb(option?.id ?? '')
  }

  console.log("selected request", selectedRequest)

  const warehouseOptions = useMemo(
    () =>
      Object.entries(warehousesMap).map(([id, label]) => ({ id, label })),
    []
  )

  const r = selectedRequest
  const analysis = r?.analysis
  const result = analysis?.result
  const rows = result?.data ?? []

  // Сортируем строки: рекомендованный ТБ первым, остальные по убыванию остатка
  const sortedRows = useMemo(() => {
    if (!result || !result.target_tb || !rows) return rows
    const rec = rows.filter(r => r['ТБ'] === result.target_tb)
    const others = rows
      .filter(r => r['ТБ'] !== result.target_tb)
      .sort((a, b) => (b['Постостаток'] ?? 0) - (a['Постостаток'] ?? 0))
    return [...rec, ...others]
  }, [rows, result?.target_tb])

  const isSolution = result?.message !== "Решение не найдено"

  if (!r) return null

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
      <DialogTitle>Изменение заявки</DialogTitle>
      <DialogContent dividers>
        {/* Первый раздел: Информация */}
        <Grid container spacing={4} mb={10}>
          {/* Две колонки: левая про ТМЦ и описание, правая про пользователя */}
          <Grid item xs={12} md={6} container spacing={3}>
            <Grid item xs={12}>
              <Typography><strong>ТМЦ:</strong> [{r.material_id}] {r.materialName}</Typography>
            </Grid>
            <Grid item xs={12} md={12}>
              <Typography><strong>Количество:</strong> {r.count_months != null ? `${r.count_months} мес` : `${r.target_count} ${r.unit}`}</Typography>
            </Grid>
            <Grid item xs={12} md={12}>
              <Typography><strong>Описание:</strong> {r.comment || '—'}</Typography>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6} container spacing={3} alignItems="center">
            <Grid item>
              <div className="flex items-center gap-3">
                <CustomAvatar src={(selectedRequest as any).avatarSrc} size={34} />
                <div className="flex flex-col">
                  <Typography color="text.primary" className="font-medium">
                    {r?.author?.username}
                  </Typography>
                  <Typography variant="body2">{r?.author?.email}</Typography>
                </div>
              </div>
            </Grid>
            <Grid item xs={12}>
              <Typography><strong>Отделение:</strong> [{r?.current_tb}] {r?.current_tb_name}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography><strong>Почта:</strong> {r?.author?.email}</Typography>
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
            <Typography className="mb-4"><strong>Из какого ТБ отгрузить</strong></Typography>
            <Autocomplete
              options={warehouseOptions}
              getOptionLabel={(opt) => `[${opt.id}] ${opt.label}`}
              value={warehouseOptions.find((o) => o.id === targetTb) || null}
              onChange={handleTargetChange}
              renderInput={(params) => <TextField {...params} label="Отгрузка из" fullWidth />}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography className="mb-4"><strong>Статус заявки</strong></Typography>
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

        {(!result || !result?.message || !result?.data) ? (
            <Paper variant="outlined" sx={{ borderColor: 'info.light', p: 4 }}>
              <Typography variant="subtitle1" gutterBottom>
                Рекомендация алгоритма:
              </Typography>
              <Typography variant="body1" color="primary.warning">
                {"Рекомендация алгоритма на данный момент недоступна. Скорее всего, заявка ещё обрабатывается."}
              </Typography>
            </Paper>

          )
        :  (
          <>
            {/* Рекомендация */}
            <Paper variant="outlined" sx={{ borderColor: isSolution ? 'info.light' : "warning.main", p: 4 }}>
              <Typography variant="subtitle1" gutterBottom>
                Рекомендация алгоритма:
              </Typography>
              <Typography variant="body1" color="primary.main">
                {result?.message || "Рекомендация алгоритма недоступна"}
              </Typography>
            </Paper>

            <Box mt={4}>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ArrowDownwardIcon />}
                >
                  <Typography><strong>Детали анализа</strong></Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {isSolution && <Typography variant="subtitle2" className="mb-2">
                    <Box component="span" sx={{color: 'info.dark', fontWeight: 600}}>Синим</Box> выделена рекомендация
                    алгоритма
                  </Typography>}
                  <Table size="small" className={tableStyles.table} sx={{ borderCollapse: 'separate', borderSpacing: 0 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>ТБ Отгрузки</TableCell>
                        <TableCell>1Q24</TableCell>
                        <TableCell>2Q24</TableCell>
                        <TableCell>3Q24</TableCell>
                        <TableCell>4Q24</TableCell>
                        <TableCell>Среднее потребление</TableCell>
                        <TableCell>Кол-во мес.</TableCell>
                        <TableCell>Доступный остаток</TableCell>
                        <TableCell>Постостаток</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sortedRows.map((row, index) => (
                        <TableRow key={row['ТБ']} sx={(index === 0 && isSolution) ? { backgroundColor: alpha(theme.palette.info.light, 0.2) } : undefined}>
                          <TableCell sx={cellStyle}>{row['ТБ']}</TableCell>
                          <TableCell sx={cellStyle}>{row['1Q24']?.toLocaleString() ?? '—'}</TableCell>
                          <TableCell sx={cellStyle}>{row['2Q24']?.toLocaleString() ?? '—'}</TableCell>
                          <TableCell sx={cellStyle}>{row['3Q24']?.toLocaleString() ?? '—'}</TableCell>
                          <TableCell sx={cellStyle}>{row['4Q24']?.toLocaleString() ?? '—'}</TableCell>
                          <TableCell sx={cellStyle}>{row['Среднее потребление']?.toLocaleString() ?? '—'}</TableCell>
                          <TableCell sx={cellStyle}>{row['Количество месяцев'] ?? '—'}</TableCell>
                          <TableCell sx={cellStyle}>{row['Доступный остаток']?.toLocaleString() ?? '—'}</TableCell>
                          <TableCell sx={row['Постостаток'] < 0 ? { color: 'error.dark' } : {}}>{row['Постостаток']?.toLocaleString() ?? '—'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </AccordionDetails>
              </Accordion>
            </Box>
          </>
        )}





      </DialogContent>
      <DialogActions className="mt-4">
        <Button onClick={handleClose}>Закрыть</Button>
        <Button variant="contained" onClick={handleClose}>Сохранить</Button>
      </DialogActions>
    </Dialog>
  )
}

export default RequestModal
