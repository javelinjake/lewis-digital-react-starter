import { createUseTheme } from '@ld/react-utils'

type ThemeName = 'light' | 'dark'

export const useTheme = createUseTheme<ThemeName>({
  storageKey: 'ld-color-scheme',
  defaultTheme: 'light',
  darkTheme: 'dark',
  isValidTheme: (value): value is ThemeName => value === 'light' || value === 'dark',
})
