import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Divider,
  IconButton
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'

import type { RequestType } from '@store/requestStore'

import useRequestsStore from '@store/requestStore'
import {pluralize} from "@/utils/pluralize";

interface Props {
  open: boolean;
  onClose: () => void;
  request: RequestType | null;
}

const RequestDetailsModal = ({ open, onClose, request }: Props) => {
  const cancelRequest = useRequestsStore(state => state.cancelRequest)
  const addRequest = useRequestsStore(state => state.addRequest)


  const handleCancel = () => {
    cancelRequest(request!.id)
    onClose()
  }

  if (!request) return null

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box className="flex justify-between items-center">
          <Typography variant="h6" fontWeight={600}>
            [{request.material_id}] {request.materialName}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ px: 6, py: 3 }}>
        {/* Статус + Дата */}
        <Box className="flex justify-between items-center mb-7">
          <Box
            sx={{
              backgroundColor:
                request.statusColor === 'pending'
                  ? '#FFF4E5'
                  : request.statusColor === 'inactive'
                    ? '#ECECEC'
                    : request.statusColor === 'cancelled'
                      ? '#FDECEA'
                      : '#E7F5EC',
              color:
                request.statusColor === 'pending'
                  ? '#D28E3D'
                  : request.statusColor === 'inactive'
                    ? '#757575'
                    : request.statusColor === 'cancelled'
                      ? '#D14343'
                      : '#007F5F',
              fontSize: '14px',
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              display: 'inline-block',
              fontWeight: 500,
              lineHeight: 1.3,
            }}
          >
            {request.status}
          </Box>

          <Box className="flex items-center gap-1 text-gray-500 text-sm">
            <CalendarTodayIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {request.date}
            </Typography>
          </Box>
        </Box>

        {/* Материал + Кол-во */}
        <Box className="flex justify-between mb-7 gap-4">
          {/* Материал */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body2"
              color="text.primary"
              fontWeight={500}
              sx={{ mb: 1 }}
            >
              Материал
            </Typography>
            <Typography>[{request.material_id}] {request.materialName}</Typography>
          </Box>

          {/* Количество */}
          <Box sx={{ textAlign: 'right' }}>
            <Typography
              variant="body2"
              color="text.primary"
              fontWeight={500}
              sx={{ mb: 1 }}
            >
              Количество
            </Typography>
            <Box
              sx={{
                backgroundColor: '#FBF4EC',
                color: '#D28E3D',
                fontSize: '14px',
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                display: 'inline-block'
              }}
            >
              {request.count_months != null ? (
                <>на {request.count_months} {pluralize(request.count_months, ['месяц', 'месяца', 'месяцев'])}</>
              ) : (
                <>{request.target_count?.toLocaleString()} {request.unit}</>
              )}
            </Box>
          </Box>
        </Box>

        {/* Банк */}
        <Box sx={{ mb: 7 }}>
          <Typography
            variant="body2"
            color="text.primary"
            fontWeight={500}
            sx={{ mb: 1 }}
          >
            Территориальный банк
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
            <Box
              component="img"
              src="/images/logo/sber_icon.png" // путь к иконке
              alt="Банк"
              sx={{ width: 20, height: 20 }}
            />
            <Typography>[{request.current_tb}] {request.current_tb_name}</Typography>
          </Box>
        </Box>

        {/* Комментарий */}
        <Box sx={{ mb: 5 }}>
          <Typography
            variant="body2"
            color="text.primary"
            fontWeight={500}
            sx={{ mb: 1 }}
          >
            Комментарий
          </Typography>
          <Typography whiteSpace="pre-line">
            {request.comment}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 4, py: 7 }}>
        {request.status === 'Выполнена' ? (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => {
              // Повторить заявку
              const { id, date, status, statusColor, ...rest } = request

              //@ts-ignore
              addRequest(rest)
              onClose()
            }}
          >
            Повторить заявку
          </Button>
        ) : (
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            onClick={handleCancel}
          >
            Отменить заявку
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default RequestDetailsModal
