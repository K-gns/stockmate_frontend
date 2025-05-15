'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Input, InputAdornment, IconButton, Button } from '@mui/material'
import { Visibility, VisibilityOff, Clear } from '@mui/icons-material'

import useAuthStore from '@/store/authStore'

const Auth = () => {
  const router = useRouter()
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const login = useAuthStore(state => state.login)
  const user = useAuthStore(state => state.user)
  const [showPassword, setShowPassword] = useState<boolean>(false)

  useEffect(() => {
    if (user) {
      router.push('/home')
    }
  }, [user, router])

  const handleLogin = () => {
    if (username.trim() && password.trim()) {
      login({ name: username })
    } else {
      alert('Введите логин и пароль')
    }
  }

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        backgroundImage: "url('/images/illustrations/auth/authBg.jpg')",
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
      }}
    >
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          width: 'max-content',
          height: 'max-content',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          padding: '24px',
          borderRadius: '16px',
          backgroundColor: '#fff',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
        }}
      >
        <h1>Авторизация StockMate</h1>
        <Input
          type='text'
          placeholder='Введите логин'
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={{ padding: '10px', marginBottom: '10px', width: '400px' }}
          endAdornment={
            <InputAdornment position='end'>
              {username && (
                <IconButton onClick={() => setUsername('')}>
                  <Clear />
                </IconButton>
              )}
            </InputAdornment>
          }
        />

        <Input
          type={showPassword ? 'text' : 'password'}
          placeholder='Введите пароль'
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ padding: '10px', width: '400px', marginBottom: '16px' }}
          endAdornment={
            <InputAdornment position='end'>
              <>
                <IconButton onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
                {password && (
                  <IconButton onClick={() => setPassword('')}>
                    <Clear />
                  </IconButton>
                )}
              </>
            </InputAdornment>
          }
        />

        <Button
          variant='contained'
          onClick={handleLogin}
          style={{ padding: '10px 20px', marginBottom: '10px', width: '400px', backgroundColor: '#1e88e5' }}
        >
          Войти в систему{' '}
        </Button>
      </div>
    </div>
  )
}

export default Auth
