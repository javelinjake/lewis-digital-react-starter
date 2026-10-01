import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@ld/ui'
import { useNavigate } from 'react-router'
import { appConfig } from '@/config/app.config'
import { isMockMode } from '@/config/env.config'
import { LoginForm } from '@/features/auth/components/LoginForm'
import { demoCredentials } from '@/lib/auth/mock'
import { useAuthStore } from '@/stores/auth.store'

export function LoginPage() {
  const login = useAuthStore(state => state.login)
  const navigate = useNavigate()

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
      <Card>
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>{appConfig.name}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <LoginForm
            onSubmit={async (values) => {
              await login(values.email, values.password)
              navigate('/')
            }}
          />
          {isMockMode()
            ? (
                <p className="text-sm text-muted-foreground">
                  Mock sign-in:
                  {' '}
                  {demoCredentials.email}
                  {' '}
                  /
                  {' '}
                  {demoCredentials.password}
                </p>
              )
            : null}
        </CardContent>
      </Card>
    </div>
  )
}
