import { createUseTheme } from '@ld/react-utils'

type ThemeName = 'dark'

export const useTheme = createUseTheme<ThemeName>({
  storageKey: 'ld-review-color-scheme',
  defaultTheme: 'dark',
  darkTheme: 'dark',
  isValidTheme: (value): value is ThemeName => value === 'dark',
})
