'use client'

// React Imports
import {useRef, useState, useEffect} from 'react'
import type {MouseEvent, ReactNode} from 'react'

// MUI Imports
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Tooltip from '@mui/material/Tooltip'
import Divider from '@mui/material/Divider'
import Avatar from '@mui/material/Avatar'
import useMediaQuery from '@mui/material/useMediaQuery'
import Button from '@mui/material/Button'
import type {Theme} from '@mui/material/styles'
import Backdrop from '@mui/material/Backdrop'

// Third Party Components
import classnames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'
import sanitizeHtml from 'sanitize-html'

// Type Imports
import type {ThemeColor} from '@core/types'
import type {CustomAvatarProps} from '@core/components/mui/Avatar'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Hook Imports
import {useSettings} from '@core/hooks/useSettings'

// Util Imports
import {getInitials} from '@/utils/getInitials'

// import {ApiReadMessageByID, ApiReadMessageByIDsArray, ApiRemoveMessageByID} from "@clientApi/messages";

// import MessageFullscreen from "@components/layout/shared/MessageFullscreen";


export type NotificationsType = {
  id: string
  title?: string
  subtitle?: string
  message?: string
  time?: string
  read: boolean
} & (
  | {
  avatarImage?: string
  avatarIcon?: never
  avatarText?: never
  avatarColor?: never
  avatarSkin?: never
}
  | {
  avatarIcon?: string
  avatarColor?: ThemeColor
  avatarSkin?: CustomAvatarProps['skin']
  avatarImage?: never
  avatarText?: never
}
  | {
  avatarText?: string
  avatarColor?: ThemeColor
  avatarSkin?: CustomAvatarProps['skin']
  avatarImage?: never
  avatarIcon?: never
}
  )

const ScrollWrapper = ({children, hidden}: { children: ReactNode; hidden: boolean }) => {
  if (hidden) {
    return <div className="overflow-x-hidden max-bs-[420px]">{children}</div>
  } else {
    return (
      <PerfectScrollbar className="max-bs-[420px]" options={{wheelPropagation: false, suppressScrollX: true}}>
        {children}
      </PerfectScrollbar>
    )
  }
}

const getAvatar = (
  params: Pick<NotificationsType, 'avatarImage' | 'avatarIcon' | 'title' | 'avatarText' | 'avatarColor' | 'avatarSkin'>
) => {
  const {avatarImage, avatarIcon, avatarText, title, avatarColor, avatarSkin} = params

  if (avatarImage) {
    return <Avatar src={avatarImage}/>
  } else if (avatarIcon) {
    return (
      <CustomAvatar color={avatarColor} skin={avatarSkin || 'light-static'}>
        <i className={avatarIcon}/>
      </CustomAvatar>
    )
  } else {
    return (
      <CustomAvatar color={avatarColor} skin={avatarSkin || 'light-static'}>
        {avatarText || getInitials(title || "У")}
      </CustomAvatar>
    )
  }
}

const NotificationDropdown = ({notifications}: { notifications: NotificationsType[] }) => {
  // States
  const [open, setOpen] = useState(false)
  const [notificationsState, setNotificationsState] = useState(notifications)
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const [fullscreenOpen, setFullscreenOpen] = useState(false)
  const [currentFullscreenIndex, setcurrentFullscreenIndex] = useState<number>(0)

  //Для чтения уведомлений
  const hoverTimeout = useRef<any | null>(null);
  const activeNotification = useRef<number | null>(null);

  // Vars
  const notificationCount = notificationsState.filter(notification => !notification.read).length
  const readAll = notificationsState.every(notification => notification.read)

  // Refs
  const anchorRef = useRef<HTMLButtonElement>(null)

  // Hooks
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))
  const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
  const {settings} = useSettings()

  const handleClose = () => {
    setOpen(false)
  }

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen)
  }

  // Прочитать уведомление
  const handleReadNotification = async (index: number, id: string) => {
    if (!notificationsState[index].read) {
      const newNotifications = [...notificationsState]

      newNotifications[index].read = true
      setNotificationsState(newNotifications)

      // await ApiReadMessageByID(id)
    }
  }


  // Удалить уведомление (иконка крестика при ховере)
  const handleRemoveNotification = async (event: MouseEvent<HTMLElement>, index: number, id: string) => {
    event.stopPropagation()
    const newNotifications = [...notificationsState]

    newNotifications.splice(index, 1)
    setNotificationsState(newNotifications)

    // await ApiRemoveMessageByID(id)
  }

  // Прочитать все непрочитанные уведомления
  const readAllNotifications = async () => {
    const newNotifications = [...notificationsState]
    const notificationsToReadOnBackend : string[] = []

    newNotifications.forEach(notification => {
      if(!notification.read) {
        notification.read = true
        notificationsToReadOnBackend.push(notification.id)
      }
    })

    setNotificationsState(newNotifications)
    // await ApiReadMessageByIDsArray(notificationsToReadOnBackend)

  }

  const handleClickOnNotification = (event: MouseEvent<HTMLElement>, index: number, id: string) => {
    handleReadNotification(index, id)
    setcurrentFullscreenIndex(index)
    setFullscreenOpen(true)
  }

  const handleCloseFullscreen = () => {
    setFullscreenOpen(false)
  }

  //Чтение уведомлений при наведении на них через небольшой промежуток времени
  const handleMouseEnterNotification = (event: MouseEvent<HTMLElement>, index: number, id: string) => {
    // Очищаем предыдущий таймер, если он существует
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
    }

    // Запоминаем текущее активное уведомление
    activeNotification.current = index;

    // Устанавливаем новый таймер для текущего уведомления
    hoverTimeout.current = setTimeout(() => {
      // Проверяем, что курсор всё ещё на этом уведомлении
      if (activeNotification.current === index) {
        handleReadNotification(index, id);
      }
    }, 600);
  };

  const handleMouseLeaveNotification = (event: MouseEvent<HTMLElement>, index: number) => {
    // Очищаем таймер только если курсор уходит с активного уведомления
    if (activeNotification.current === index && hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
      activeNotification.current = null;
    }
  };

  // Парсим html-теги в message сообщения
  const sanitizedMessage = (message: string) => {
    const sanitized = sanitizeHtml(message || '', {
      allowedTags: ['b', 'i', 'em', 'strong', 'p', 'br'],
      allowedAttributes: {}
    })

    // Обрезка до 200 символов (примерно 5-6 строк)
    const maxLength = 200;

    return sanitized.length > maxLength
      ? sanitized.slice(0, maxLength) + '...'
      : sanitized;
  }

  // Синхронизация notificationsState при изменении notifications
  useEffect(() => {
    setNotificationsState(notifications)
  }, [notifications])

  return (
    <>
      <Backdrop
        open={open} // открываем Backdrop, когда открывается Popper
        onClick={() => setOpen(false)} // закрываем по клику на Backdrop
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0)',
        }}
      />

      <Tooltip
        title={'Уведомления'}
        onOpen={() => setTooltipOpen(true)}
        onClose={() => setTooltipOpen(false)}
        open={open ? false : !!tooltipOpen}
        PopperProps={{className: 'capitalize'}}
      >
        <IconButton ref={anchorRef} onClick={handleToggle} className="!text-textPrimary">
          <Badge
            color="error"
            className="cursor-pointer"
            variant="dot"
            overlap="circular"
            invisible={notificationCount === 0}
            anchorOrigin={{vertical: 'top', horizontal: 'right'}}
          >
            <i className="ri-notification-2-line"/>
          </Badge>
        </IconButton>
      </Tooltip>
      <Popper
        open={open}
        transition
        disablePortal
        placement="bottom-end"
        anchorEl={anchorRef.current}
        {...(isSmallScreen
          ? {
            className: 'is-full !mbs-4 z-[1]',
            modifiers: [
              {
                name: 'preventOverflow',
                options: {
                  padding: themeConfig.layoutPadding
                }
              }
            ]
          }
          : {className: 'is-96 !mbs-4 z-[1]'})}
      >
        {({TransitionProps, placement}) => (
          <Fade {...TransitionProps} style={{transformOrigin: placement === 'bottom-end' ? 'right top' : 'left top'}}>
            <Paper className={settings.skin === 'bordered' ? 'border shadow-none' : 'shadow-lg'}>
              <ClickAwayListener onClickAway={handleClose}>
                <div>
                  <div className="flex items-center justify-between plb-2 pli-4 is-full gap-4">
                    <Typography variant="h5" className="flex-auto">
                      Уведомления
                    </Typography>
                    {notificationCount > 0 && (
                      <Chip size="small" variant="tonal" color="primary" label={`${notificationCount}`}/>
                    )}
                    <Tooltip
                      title={readAll ? 'Всё прочитано!' : 'Пометить всё прочитанным'}
                      placement={placement === 'bottom-end' ? 'left' : 'right'}
                      slotProps={{
                        popper: {
                          sx: {
                            '& .MuiTooltip-tooltip': {
                              transformOrigin:
                                placement === 'bottom-end' ? 'right center !important' : 'right center !important'
                            }
                          }
                        }
                      }}
                    >
                      {notificationsState.length > 0 ? (
                        <span>
                          <IconButton size="small"
                                      onClick={() => readAllNotifications()}
                                      disabled={notificationCount === 0}
                                      className="text-textPrimary">
                          <i className={readAll ? 'ri-mail-line' : 'ri-mail-open-line'}/>
                          </IconButton>
                        </span>
                      ) : (
                        <></>
                      )}
                    </Tooltip>
                  </div>
                  <Divider/>
                  <ScrollWrapper hidden={hidden}>
                    {notificationsState.map((notification, index) => {

                      const {
                        id,
                        title,
                        message,
                        time,
                        read,
                        avatarImage,
                        avatarIcon,
                        avatarText,
                        avatarColor,
                        avatarSkin
                      } = notification

                      return (
                        <div
                          key={index}
                          className={classnames('flex plb-3 pli-4 gap-3 cursor-pointer hover:bg-actionHover group', {
                            'border-be': index !== notificationsState.length - 1
                          })}
                          onClick={e => handleClickOnNotification(e, index, id)}
                          onMouseEnter={e => handleMouseEnterNotification(e, index, id)}
                          onMouseLeave={e => handleMouseLeaveNotification(e, index)}
                        >
                          {getAvatar({avatarImage, avatarIcon, title, avatarText, avatarColor, avatarSkin})}
                          <div className="flex flex-col flex-auto">
                            <Typography className="font-medium mbe-1" color="text.primary">
                              {title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" className="mbe-2">
                              <div dangerouslySetInnerHTML={{__html: sanitizedMessage(message || "")}}/>
                            </Typography>
                            <Typography variant="caption">{time}</Typography>
                          </div>
                          <div className="flex flex-col items-end gap-2.5">
                            <Badge
                              variant="dot"
                              color={read ? 'secondary' : 'primary'}
                              onClick={() => handleReadNotification(index, id)}
                              className={classnames('mbs-1 mie-1', {
                                'invisible group-hover:visible': read
                              })}
                            />
                            <i
                              className="ri-close-line text-xl invisible group-hover:visible text-textSecondary"
                              onClick={e => handleRemoveNotification(e, index, id)}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </ScrollWrapper>
                  <Divider/>
                  <div className="p-4">
                    <Button fullWidth variant="contained" size="small">
                      Посмотреть все уведомления
                    </Button>
                  </div>
                </div>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>

      {/*<MessageFullscreen notifications={notificationsState} currentIndex={currentFullscreenIndex} handleRead={handleReadNotification} open={fullscreenOpen} closeFullscreen={handleCloseFullscreen}></MessageFullscreen>*/}
    </>
  )
}

export default NotificationDropdown
