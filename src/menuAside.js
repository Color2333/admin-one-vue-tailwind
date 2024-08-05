import {
  mdiAccountCircle,
  mdiMonitor,
  mdiLock,
  mdiAlertCircle,
  mdiSquareEditOutline,
  mdiInstrumentTriangle,
  mdiViewList,
  mdiTelevisionGuide,
  mdiPalette
} from '@mdi/js'

export default [
  {
    to: '/dashboard',
    icon: mdiMonitor,
    label: '首页'
  },
  {
    to: '/style',
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
        icon: mdiInstrumentTriangle,
        label: '10903'
      },
      {
        to: '/10905',
        icon: mdiInstrumentTriangle,
        label: '10905'
      },
      {
        to: '/observation',
        icon: mdiInstrumentTriangle,
        label: '气象仪'
      }
    ]
  }
]
