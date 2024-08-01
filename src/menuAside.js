import {
  mdiAccountCircle,
  mdiMonitor,
  mdiGithub,
  mdiLock,
  mdiAlertCircle,
  mdiSquareEditOutline,
  mdiTable,
  mdiViewList,
  mdiTelevisionGuide,
  mdiResponsive,
  mdiPalette
} from '@mdi/js'

export default [
  {
    to: '/dashboard',
    icon: mdiMonitor,
    label: '欢迎页'
  },
  {
    to: '/tables',
    label: '表格',
    icon: mdiTable
  },
  {
    to: '/forms',
    label: '表单示范页',
    icon: mdiSquareEditOutline
  },
  {
    to: '/ui',
    label: 'UI',
    icon: mdiTelevisionGuide
  },
  {
    to: '/',
    label: '主题选择器',
    icon: mdiPalette
  },
  {
    to: '/profile',
    label: 'Profile',
    icon: mdiAccountCircle
  },
  {
    to: '/login',
    label: 'Login',
    icon: mdiLock
  },
  {
    to: '/ObservationDashboard',
    label: 'Error',
    icon: mdiAlertCircle
  },
  {
    label: '历史观测数据',
    icon: mdiViewList,
    menu: [
      {
        to: '/10903',
        label: '10903'
      },
      {
        to: '/10905',
        label: '10905'
      },
      {
        to: '/observation',
        label: '气象仪'
      }
    ]
  }
]
