'use client'

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
import useRequestsStore, {RequestType} from "@store/requestStore";
import { useEffect } from 'react'
import {pluralize} from "@/utils/pluralize";
import {materialsMap, warehousesMap} from "@store/materialsNames";

type TableBodyRowType = {
  avatarSrc?:    string
  name?:         string
  username?:     string
  email?:        string
  current_tb_name: string
  material:        string
  description:     string
  target_count?:    number,
  count_months?:    number,
  status:          string
  statusColor:     string
}


const Table = () => {

  const handleOpen = (row: RequestType) => {
    setSelectedRequest(row)
  }

  const fetchAll            = useRequestsStore(s => s.fetchAll)
  const loading             = useRequestsStore(s => s.loading)
  const error               = useRequestsStore(s => s.error)
  const inProgressRequests  = useRequestsStore(s => s.inProgressRequests)
  const setSelectedRequest  = useSelectedRequestStore(s => s.setSelectedRequest)

  console.log(`inProgressRequests`, inProgressRequests)

  // при монтировании подгружаем список
  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  if (loading) return <div>Загрузка...</div>
  if (error)   return <div style={{ color: 'red' }}>Ошибка: {error}</div>

  const rowsData: TableBodyRowType[] = inProgressRequests.map((r) => ({
    // пока оставляем пользовательские поля пустыми
    avatarSrc:    undefined,
    name:         r?.author?.username,    // ← логин
    username:     r?.author?.username,    // или email, как нужно
    email:        r?.author?.email,

    current_tb_name: r.current_tb_name,

    material:     `[${r.material_id}] ${r.materialName}`,

    description:  r.comment ?? '',
    target_count:    r.target_count,
    count_months:    r.count_months,
    status:       r.status,
    statusColor:  r.statusColor,
    analysis: r.analysis
  }))

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
                    <CustomAvatar src={row.avatarSrc} size={34}/>
                    <div className="flex flex-col">
                      <Typography color="text.primary" className="font-medium">
                        {row.name}
                      </Typography>
                      <Typography variant="body2">{row.email}</Typography>
                    </div>
                  </div>
                </td>
                <td className="!plb-1">
                  <Typography color="text.primary">{row.current_tb_name}</Typography>
                </td>
                <td className="!plb-1">
                  <Typography>{row.material}</Typography>
                </td>
                <td className="!plb-1">
                  <Typography>{row.description}</Typography>
                </td>

                <td className="!plb-1">
                  <Typography>
                    {row.count_months != null
                      ? `на ${row.count_months} ${pluralize(row.count_months, ['месяц', 'месяца', 'месяцев'])}`
                      : `${row.target_count ?? 0} шт`}
                  </Typography>
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
                    onClick={() => handleOpen(inProgressRequests[index])}
                    endIcon={<ChevronRightIcon fontSize="small"/>}
                    sx={{textTransform: 'none', p: 2}}
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
      <RequestModal/>
    </>
  )
}

export default Table
