// MUI Imports
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'

// Third-party Imports

// Components Imports
import CustomAvatar from '@core/components/mui/Avatar'

// Styles Imports
import tableStyles from '@core/styles/table.module.css'

type TableBodyRowType = {
  warehouse: string
  goods: string
  remains: string
  remainsColor: string
  forecast: string
}

// Vars
const rowsData: TableBodyRowType[] = [
  {
    warehouse: 'Склад 1 (Москва)',
    goods: 'Кофемашина',
    remains: 'Много',
    remainsColor: 'active',
    forecast: 'Пополнение не требуется'
  },
  {
    warehouse: 'Склад 5 (Новосибирск)',
    goods: 'Стулья для офиса',
    remains: 'Средне',
    remainsColor: 'pending',
    forecast: 'Необходимо пополнение в течение 2 недель'
  },
  {
    warehouse: 'Склад 3 (Владивосток)',
    goods: 'Принтеры',
    remains: 'Мало',
    remainsColor: 'inactive',
    forecast: 'Необходимо пополнение срочно!'
  },
  {
    warehouse: 'Склад 2 (Санкт-Петербург)',
    goods: 'Ноутбуки',
    remains: 'Много',
    remainsColor: 'active',
    forecast: 'Пополнение не требуется'
  },
  {
    warehouse: 'Склад 4 (Екатеринбург)',
    goods: 'Кресла офисные',
    remains: 'Средне',
    remainsColor: 'pending',
    forecast: 'Необходимо пополнение в течение 1 месяца'
  },
  {
    warehouse: 'Склад 6 (Казань)',
    goods: 'Проекторы',
    remains: 'Мало',
    remainsColor: 'inactive',
    forecast: 'Необходимо пополнение срочно!'
  },
  {
    warehouse: 'Склад 7 (Красноярск)',
    goods: 'Канцелярия',
    remains: 'Много',
    remainsColor: 'active',
    forecast: 'Пополнение не требуется'
  },
  {
    warehouse: 'Склад 8 (Ростов-на-Дону)',
    goods: 'Шкафы для документов',
    remains: 'Средне',
    remainsColor: 'pending',
    forecast: 'Необходимо пополнение в течение 3 недель'
  }
]

const Table = () => {
  return (
    <Card>
      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead>
          <tr>
            <th>Склад</th>
            <th>Товар</th>
            <th>Остатки</th>
            <th>Прогноз</th>
          </tr>
          </thead>
          <tbody>
          {rowsData.map((row, index) => (
            <tr key={index}>
              <td className='!plb-1'>
                <Typography>{row.warehouse}</Typography>
              </td>
              <td className='!plb-1'>
                <Typography >{row.goods}</Typography>
              </td>
              <td className='!pb-1'>
                <Chip
                  className='capitalize'
                  variant='tonal'
                  color={
                    row.remainsColor === 'pending' ? 'warning' :
                      row.remainsColor === 'inactive' ? 'secondary' :
                        'success'
                  }
                  label={row.remains}
                  size='small'
                />
              </td>
              <td className='!plb-1'>
                <Typography>{row.forecast}</Typography>
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
