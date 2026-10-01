import { Link } from 'react-router'

export function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-3 px-4">
      <h1 className="text-lg font-medium">Not found</h1>
      <Link className="text-sm underline" to="/">Go home</Link>
    </div>
  )
}
