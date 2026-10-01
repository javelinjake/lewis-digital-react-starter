import { createBrowserRouter } from 'react-router'
import { AppShell } from '@/components/layout/AppShell'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { SessionPage } from '@/pages/SessionPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { StyleguidePage } from '@/pages/StyleguidePage'
import { RootLayout } from './root-layout'

export const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      {
        Component: AppShell,
        children: [
          { path: '/', Component: SessionPage, handle: { title: 'Batting practice' } },
          { path: '/styleguide', Component: StyleguidePage, handle: { title: 'Style guide' } },
          { path: '/settings', Component: SettingsPage, handle: { title: 'Settings' } },
        ],
      },
      { path: '*', Component: NotFoundPage, handle: { title: 'Not found' } },
    ],
  },
])
