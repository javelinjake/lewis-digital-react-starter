import { createBrowserRouter } from 'react-router'
import { AppLayout } from '@/components/layout/AppLayout'
import { GuestOnly, RequireAuth } from '@/components/layout/guards'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { NoteDetailPage } from '@/pages/NoteDetailPage'
import { NotesPage } from '@/pages/NotesPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { RootLayout } from './root-layout'

export const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      {
        Component: GuestOnly,
        children: [
          { path: '/login', Component: LoginPage, handle: { title: 'Sign in' } },
        ],
      },
      {
        Component: RequireAuth,
        children: [
          {
            Component: AppLayout,
            children: [
              { path: '/', Component: HomePage, handle: { title: 'Home' } },
              { path: '/notes', Component: NotesPage, handle: { title: 'Notes' } },
              { path: '/notes/:id', Component: NoteDetailPage, handle: { title: 'Note' } },
              { path: '/settings', Component: SettingsPage, handle: { title: 'Settings' } },
            ],
          },
        ],
      },
      { path: '*', Component: NotFoundPage, handle: { title: 'Not found' } },
    ],
  },
])
