export interface SessionUser {
  id: string
  email: string
  firstName: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface AuthApi {
  refresh: () => Promise<void>
  readCurrentUser: () => Promise<SessionUser>
  login: (input: LoginInput) => Promise<void>
  logout: () => Promise<void>
}
