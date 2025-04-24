// MUI Imports
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'

// Third-party Imports
import classnames from 'classnames'

// Components Imports
import CustomAvatar from '@core/components/mui/Avatar'

// Styles Imports
import tableStyles from '@core/styles/table.module.css'

type TableBodyRowType = {
  avatarSrc?: string
  name: string
  username: string
  email: string
  department: string
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
    department: 'Сбер девайсы',
    description: 'Стулья для IT отдела',
    quantity: 5,
    status: 'Активна',
    statusColor: 'active'
  },
  {
    avatarSrc: '/images/avatars/2.png',
    name: 'Сергей Петров',
    username: '@sergey_petrov',
    email: 'sergeyPetrov@yandex.ru',
    department: 'Сбер фокус',
    description: 'Кофемашина для офиса',
    quantity: 2,
    status: 'На уточнении',
    statusColor: 'pending'
  },
  {
    avatarSrc: '/images/avatars/3.png',
    name: 'Анна Смирнова',
    username: '@anna_smirnova',
    email: 'annaSmirnova@yandex.ru',
    department: 'Сбер аналитика',
    description: 'Ноутбуки для аналитиков',
    quantity: 10,
    status: 'Завершена',
    statusColor: 'inactive'
  },
  {
    avatarSrc: '/images/avatars/4.png',
    name: 'Дмитрий Иванов',
    username: '@dmitry_ivanov',
    email: 'dmitryIvanov@yandex.ru',
    department: 'Сбер разработки',
    description: 'Мониторы для разработчиков',
    quantity: 8,
    status: 'На уточнении',
    statusColor: 'pending'
  },
  {
    avatarSrc: '/images/avatars/5.png',
    name: 'Ольга Кузнецова',
    username: '@olga_kuznetsova',
    email: 'olgaKuznetsova@yandex.ru',
    department: 'Сбер маркетинг',
    description: 'Принтеры для офиса',
    quantity: 3,
    status: 'Завершена',
    statusColor: 'inactive'
  },
  {
    avatarSrc: '/images/avatars/6.png',
    name: 'Алексей Соколов',
    username: '@alexey_sokolov',
    email: 'alexeySokolov@yandex.ru',
    department: 'Сбер финансы',
    description: 'Калькуляторы для бухгалтерии',
    quantity: 15,
    status: 'Активна',
    statusColor: 'active'
  },
  {
    avatarSrc: '/images/avatars/7.png',
    name: 'Мария Попова',
    username: '@maria_popova',
    email: 'mariaPopova@yandex.ru',
    department: 'Сбер HR',
    description: 'Канцелярия для отдела кадров',
    quantity: 20,
    status: 'На уточнении',
    statusColor: 'pending'
  }
]

const Table = () => {
  return (
    <Card>
      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead>
          <tr>
            <th>Пользователь</th>
            <th>Почта</th>
            <th>Подразделение</th>
            <th>Описание заявки</th>
            <th>Количество, шт</th>
            <th>Статус заявки</th>
          </tr>
          </thead>
          <tbody>
          {rowsData.map((row, index) => (
            <tr key={index}>
              <td className='!plb-1'>
                <div className='flex items-center gap-3'>
                  <CustomAvatar src={row.avatarSrc} size={34}/>
                  <div className='flex flex-col'>
                    <Typography color='text.primary' className='font-medium'>
                      {row.name}
                    </Typography>
                    <Typography variant='body2'>{row.username}</Typography>
                  </div>
                </div>
              </td>
              <td className='!plb-1'>
                <Typography>{row.email}</Typography>
              </td>
              <td className='!plb-1'>
                <Typography color='text.primary'>{row.department}</Typography>
              </td>
              <td className='!plb-1'>
                <Typography>{row.description}</Typography>
              </td>
              <td className='!plb-1'>
                <Typography>{row.quantity}</Typography>
              </td>
              <td className='!pb-1'>
                <Chip
                  className='capitalize'
                  variant='tonal'
                  color={
                    row.statusColor === 'pending' ? 'warning' :
                      row.statusColor === 'inactive' ? 'secondary' :
                        'success'
                  }
                  label={row.status}
                  size='small'
                />
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export default Table
