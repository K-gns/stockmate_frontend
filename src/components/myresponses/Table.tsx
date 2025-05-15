// MUI Imports
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { Button } from '@mui/material'

// Third-party Imports


// Components Imports
import CustomAvatar from '@core/components/mui/Avatar'

// Styles Imports
import tableStyles from '@core/styles/table.module.css'

import { RequestData, useSelectedRequestStore } from '@store/modals/selectedRequestStore'

import RequestModal from './modal/RequestModal'
import { materialsData } from '@store/materialsData'
import { banksData } from '@store/banksData'

type TableBodyRowType = {
  avatarSrc?: string
  name: string
  username: string
  email: string
  department: string
  material: string
  description: string
  quantity: number
  status: string
  statusColor: string
}

// Vars
const rowsData: TableBodyRowType[] = [
  {
    avatarSrc: '/images/avatars/1.png',
    name: 'Иван Григорьев',
    username: '@ivan_grigoriev',
    email: 'ivanGrigoriev@yandex.ru',
    department: banksData[0],
    material: materialsData[0],
    description: 'Для IT отдела',
    quantity: 5,
    status: 'В работе',
    statusColor: 'active'
  },
  {
    avatarSrc: '/images/avatars/6.png',
    name: 'Алексей Соколов',
    username: '@alexey_sokolov',
    email: 'alexeySokolov@yandex.ru',
    department: banksData[0],
    material: materialsData[1],
    description: 'Для бухгалтерии',
    quantity: 15,
    status: 'В работе',
    statusColor: 'active'
  },
  {
    avatarSrc: '/images/avatars/3.png',
    name: 'Сергей Петров',
    username: '@sergey_petrov',
    email: 'sergeyPetrov@yandex.ru',
    department: banksData[2],
    material: materialsData[2],
    description: 'Для операционного',
    quantity: 2,
    status: 'На уточнении',
    statusColor: 'pending'
  },
  {
    avatarSrc: '/images/avatars/5.png',
    name: 'Дмитрий Иванов',
    username: '@dmitry_ivanov',
    email: 'dmitryIvanov@yandex.ru',
    department: banksData[3],
    material: materialsData[4],
    description: 'Для разработчиков',
    quantity: 8,
    status: 'На уточнении',
    statusColor: 'pending'
  },
  {
    avatarSrc: '/images/avatars/8.png',
    name: 'Мария Попова',
    username: '@maria_popova',
    email: 'mariaPopova@yandex.ru',
    department: banksData[3],
    material: materialsData[3],
    description: 'Для отдела кадров',
    quantity: 20,
    status: 'На уточнении',
    statusColor: 'pending'
  },
  {
    avatarSrc: '/images/avatars/4.png',
    name: 'Ольга Кузнецова',
    username: '@olga_kuznetsova',
    email: 'olgaKuznetsova@yandex.ru',
    department: banksData[4],
    material: materialsData[3],
    description: 'Для операционного',
    quantity: 3,
    status: 'Завершена',
    statusColor: 'inactive'
  },
  {
    avatarSrc: '/images/avatars/2.png',
    name: 'Анна Смирнова',
    username: '@anna_smirnova',
    email: 'annaSmirnova@yandex.ru',
    department: banksData[5],
    material: materialsData[2],
    description: 'Для аналитиков',
    quantity: 10,
    status: 'Завершена',
    statusColor: 'inactive'
  }
]

const Table = () => {

  const setSelectedRequest = useSelectedRequestStore((state) => state.setSelectedRequest)

  const handleOpen = (row: RequestData) => {
    setSelectedRequest(row)
  }

  return (
    <>
      <Card>
        <div className="overflow-x-auto">
          <table className={tableStyles.table}>
            <thead>
            <tr>
              <th>Пользователь</th>
              <th>Подразделение</th>
              <th>ТМЦ</th>
              <th>Описание заявки</th>
              <th>Кол-во</th>
              <th>Статус заявки</th>
              <th>Анализ</th>
            </tr>
            </thead>
            <tbody>
            {rowsData.map((row, index) => (
              <tr key={index}>
                <td className="!plb-1">
                  <div className="flex items-center gap-3">
                    <CustomAvatar src={row.avatarSrc} size={34} />
                    <div className="flex flex-col">
                      <Typography color="text.primary" className="font-medium">
                        {row.name}
                      </Typography>
                      <Typography variant="body2">{row.email}</Typography>
                    </div>
                  </div>
                </td>
                <td className="!plb-1">
                  <Typography color="text.primary">{row.department}</Typography>
                </td>
                <td className="!plb-1">
                  <Typography>{row.material}</Typography>
                </td>
                <td className="!plb-1">
                  <Typography>{row.description}</Typography>
                </td>
                <td className="!plb-1">
                  <Typography>{row.quantity}</Typography>
                </td>
                <td className="!pb-1">
                  <Chip
                    className="capitalize"
                    variant="tonal"
                    color={
                      row.statusColor === 'pending' ? 'warning' :
                        row.statusColor === 'inactive' ? 'secondary' :
                          'success'
                    }
                    label={row.status}
                    size="small"
                  />
                </td>
                <td className="!pb-1">
                  <Button
                    variant="text"
                    onClick={() => handleOpen(row)}
                    endIcon={<ChevronRightIcon fontSize="small" />}
                    sx={{ textTransform: 'none', p: 2 }}
                  >
                    <span>Перейти</span>
                  </Button>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Модальное окно */}
      <RequestModal />
    </>
  )
}

export default Table
