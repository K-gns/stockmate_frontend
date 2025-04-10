export type PrimaryColorConfig = {
  name?: string
  light?: string
  main: string
  dark?: string
}

// Primary color config object
const primaryColorConfig: PrimaryColorConfig[] = [
  {
    name: 'primary-black',
    light: '#333333',   // Темно-серый
    main: '#000000',     // Черный
    dark: '#000000'      // Черный
  },
  {
    name: 'primary-gray',
    light: '#999999',    // Средний серый
    main: '#666666',     // Основной серый
    dark: '#4D4D4D'      // Темный серый
  },
  {
    name: 'primary-white',
    light: '#F5F5F5',    // Светло-серый
    main: '#FFFFFF',      // Белый
    dark: '#E0E0E0'       // Средний светлый
  },
  {
    name: 'primary-contrast',
    light: '#E0E0E0',     // Светлый контраст
    main: '#333333',      // Темный контраст
    dark: '#1A1A1A'       // Очень темный
  }
]

export default primaryColorConfig
