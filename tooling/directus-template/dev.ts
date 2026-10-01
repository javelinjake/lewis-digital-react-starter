import { spawnSync } from 'node:child_process'
import { copyFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { getRepoRoot } from '../lib/repo'

const repoRoot = getRepoRoot()
const dir = join(repoRoot, 'cms/directus')
const envFile = join(dir, '.env')
const example = join(dir, '.env.example')
const command = process.argv[2] === 'down' ? 'down' : 'up'

if (!existsSync(envFile)) {
  copyFileSync(example, envFile)
  console.log('Created cms/directus/.env from .env.example. Change KEY, SECRET, and ADMIN_TOKEN before sharing this machine.')
}

const composeArgs = [
  'compose',
  '--env-file',
  envFile,
  '-p',
  'ld-react-starter',
  command,
  ...(command === 'up' ? ['-d'] : []),
]

console.log(`Running docker ${composeArgs.join(' ')} in cms/directus`)

const result = spawnSync('docker', composeArgs, {
  cwd: dir,
  stdio: 'inherit',
})

if (command === 'up' && result.status === 0) {
  console.log('\nDirectus: http://localhost:8055')
  console.log('Studio login is ADMIN_EMAIL / ADMIN_PASSWORD from cms/directus/.env')
  console.log('The app stays in mock mode until VITE_DATA_MODE=live.')
}

process.exit(result.status ?? 1)
