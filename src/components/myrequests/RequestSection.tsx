import { useState } from 'react'

//MUI
import { Box, Button, Card, CardContent, Grid, IconButton, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

//Icons
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'

//Components
import type { RequestType } from '@store/requestStore'
import RequestDetailsModal from '@components/myrequests/RequestDetailsModal'


interface RequestSectionProps {
  title: string,
  requests: RequestType[],
  total: number
}

const RequestSection = ({ title, requests, total }: RequestSectionProps) => {
  const theme = useTheme()
  const [visibleCount, setVisibleCount] = useState(3)
  const hasMore = visibleCount < requests.length

  const [selectedRequest, setSelectedRequest] = useState<RequestType | null>(null);

  const handleShowMore = () => {
    setVisibleCount(prev => Math.min(prev + 6, requests.length))
  }

  const statusColorMap: Record<RequestType['statusColor'], string> = {
    active: theme.palette.warning.main,
    pending: theme.palette.warning.main,
    inactive: theme.palette.grey[500],
    cancelled: theme.palette.grey[500],
    completed: theme.palette.success.main
  }

  const sectionColor = statusColorMap[requests[0]?.statusColor ?? 'inactive']

  return (
    <>
      <Card className="mb-6">
        <CardContent className="p-6">
          {/* Заголовок секции с счетчиком */}
          <Box className="flex items-center mb-6">
            <Box className="flex items-center gap-3">
              <Box
                className="w-[12px] h-[12px] rounded-full"
                sx={{ bgcolor: sectionColor}}
              />
              <Typography variant="h5" className="font-semibold  pr-2">
                {title}
              </Typography>
            </Box>

            {/* Счетчик-бейдж рядом */}
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: '0.875rem' }}
            >
              {total}
            </Typography>
          </Box>

          <Grid container spacing={5}>
            {requests.slice(0, visibleCount).map(request => (
              <Grid item xs={12} sm={6} md={4} key={request.id}>
                <Card
                  onClick={() => setSelectedRequest(request)}
                  sx={{
                    position: 'relative',
                    overflow: 'visible',
                    height: '100%'
                  }}
                >
                  {/* Основное содержимое */}
                  <CardContent className="pr-[5rem] pb-[0.5rem]">
                    <Typography
                      variant="body1"
                      color="text.primary"
                      className="font-semibold mb-1 text-sm"
                      sx={{
                        wordBreak: 'break-word', // Перенос слов
                        minHeight: '2.5rem'
                      }}
                    >
                      {request.material}
                    </Typography>

                    {/* Блок с датой и иконкой */}
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mt: 1 // Отступ сверху
                    }}>
                      {/* Иконка календаря */}
                      <CalendarTodayIcon
                        sx={{
                          fontSize: '12px',
                          color: 'text.secondary',
                          mr: 1
                        }} />
                      {/* Дата */}
                      <Typography variant="body2" color="text.secondary">
                        {request.date}
                      </Typography>
                    </Box>
                  </CardContent>

                  {/* UI в углу карточки */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 8,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      backgroundColor: 'transparent',
                      px: 1,
                      borderRadius: 1
                    }}
                  >

                    {/* бейдж с количеством шт */}
                    <Box
                      sx={{
                        backgroundColor: '#FBF4EC',
                        color: '#D28E3D',
                        fontSize: '14px',
                        px: 1,
                        py: 0.5,
                        borderRadius: 0.5
                      }}
                    >
                      {request.count + ' шт'}
                    </Box>

                    <IconButton
                      size="small"
                      sx={{
                        padding: 1,
                        '&:hover': { bgcolor: 'transparent' }
                      }}
                    >
                      <MoreHorizIcon fontSize="small" />
                    </IconButton>
                  </Box>

                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Кнопка "Показать больше" */}
          {hasMore && (
            <Box className="flex justify-center mt-4">
              <Button
                variant="text"
                color="primary"
                onClick={handleShowMore}
                startIcon={<ArrowDownwardIcon />}
              >
                Показать еще 6
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      <RequestDetailsModal
        open={!!selectedRequest}
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
      />
    </>
  )
}

export default RequestSection
