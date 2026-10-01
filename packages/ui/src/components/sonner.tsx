import type { ComponentProps } from 'react'
import { CircleCheckIcon, InfoIcon, OctagonXIcon, TriangleAlertIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Toaster as Sonner, type ToasterProps } from 'sonner'

function useDocumentTheme(): ToasterProps['theme'] {
  const [theme, setTheme] = useState<ToasterProps['theme']>('light')

  useEffect(() => {
    const root = document.documentElement

    function read() {
      setTheme(root.classList.contains('dark') ? 'dark' : 'light')
    }

    read()
    const observer = new MutationObserver(read)
    observer.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  return theme
}

export function Toaster({ ...props }: ToasterProps) {
  const theme = useDocumentTheme()

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
      }}
      {...props}
    />
  )
}

export function ToastProvider({ children }: { children: ComponentProps<'div'>['children'] }) {
  return (
    <>
      {children}
      <Toaster />
    </>
  )
}
