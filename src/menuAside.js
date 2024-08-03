import {
  mdiAccountCircle,
  mdiMonitor,
  mdiLock,
  mdiAlertCircle,
  mdiSquareEditOutline,
  mdiTable,
  mdiViewList,
  mdiTelevisionGuide,
  mdiPalette
} from '@mdi/js'

export default [
  {
    to: '/dashboard',
    icon: mdiMonitor,
    label: '欢迎页'
  },
  {
    to: '/',
    label: '主题选择器',
    icon: mdiPalette
  },
  {
    to: '/ObservationDashboard',
    label: '数据大屏',
    icon: mdiTelevisionGuide
  },
  {
    to: '/data',
    label: '数据分析',
    icon: mdiSquareEditOutline
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
