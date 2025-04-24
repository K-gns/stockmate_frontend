// Type Imports
import type { HorizontalMenuDataType } from '@/types/menuTypes'

const horizontalMenuData = (): HorizontalMenuDataType[] => [
  {
    label: 'Мои заявки',
    href: '/my-requests',
    icon: 'ri-survey-line'
  },
  {
    label: 'Мои ответы',
    href: '/my-responses',
    icon: 'ri-survey-line'
  },
  {
    label: 'Запасы',
    href: '/provisions',
    icon: 'ri-survey-line'
  },
  // {
  //   label: 'About',
  //   href: '/about',
  //   icon: 'ri-information-line'
  // }
]

export default horizontalMenuData
