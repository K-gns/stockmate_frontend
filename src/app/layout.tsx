// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

// Type Imports
import type {ChildrenType} from '@core/types'

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'
import dynamic from 'next/dynamic'

const ToastProvider = dynamic(
  () => import('@/components/layout/horizontal/ToastProvider'),
  {ssr: false}
)

export const metadata = {
  title: 'StockMate - Складской помощник',
  description:
    ''
}

const RootLayout = ({children}: ChildrenType) => {
  // Vars
  const direction = 'ltr'

  return (
    <html id='__next' lang='en' dir={direction} suppressHydrationWarning>
    <body className='flex is-full min-bs-full flex-auto flex-col'>
    {children}
    <ToastProvider/>
    </body>
    </html>
  )
}

export default RootLayout
