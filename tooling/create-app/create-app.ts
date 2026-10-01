import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { createInterface } from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import { getRepoRoot } from '../lib/repo'

interface AppsRegistry {
  apps: Array<{
    slug: string
    packageName: string
    path: string
    deployable: boolean
  }>
}

async function prompt(question: string, defaultValue = ''): Promise<string> {
  const rl = createInterface({ input, output })
  const answer = await rl.question(defaultValue ? `${question} [${defaultValue}]: ` : `${question}: `)
  await rl.close()
  return answer.trim() || defaultValue
}

function toSlug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function escapeSingleQuotes(value: string): string {
  return value.replace(/'/g, '\\\'')
}

function shouldCopy(path: string) {
  return !path.includes(`${join('apps', 'template', 'node_modules')}`)
    && !path.includes(`${join('apps', 'template', 'dist')}`)
    && !path.includes('.turbo')
}

async function main() {
  const repoRoot = getRepoRoot()
  const displayName = await prompt('App display name', 'My App')
  const slug = await prompt('App slug', toSlug(displayName))
  const packageName = await prompt('Package name', `@ld/app-${slug}`)
  const appTitle = await prompt('Default app title', displayName)
  const version = await prompt('Initial version', '0.1.0')

  const targetPath = join(repoRoot, 'apps', slug)
  if (existsSync(targetPath))
    throw new Error(`App already exists at ${targetPath}`)

  cpSync(join(repoRoot, 'apps/template'), targetPath, {
    recursive: true,
    filter: shouldCopy,
  })

  const packageJsonPath = join(targetPath, 'package.json')
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as { name?: string, version?: string }
  packageJson.name = packageName
  packageJson.version = version
  writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`)

  writeFileSync(join(targetPath, 'src/config/app.config.ts'), `export const appConfig = {\n  name: '${escapeSingleQuotes(appTitle)}',\n  projectId: '${slug}',\n  defaultRoute: '/',\n}\n`)

  const indexHtml = join(targetPath, 'index.html')
  writeFileSync(indexHtml, readFileSync(indexHtml, 'utf8').replace('<title>Lewis Digital</title>', `<title>${appTitle}</title>`))

  const registryPath = join(repoRoot, 'tooling/apps/apps.config.json')
  const registry = JSON.parse(readFileSync(registryPath, 'utf8')) as AppsRegistry
  registry.apps.push({
    slug,
    packageName,
    path: `apps/${slug}`,
    deployable: false,
  })
  writeFileSync(registryPath, `${JSON.stringify(registry, null, 2)}\n`)

  mkdirSync(join(repoRoot, 'cms/projects', slug), { recursive: true })
  writeFileSync(join(repoRoot, 'cms/projects', slug, 'project.json'), `${JSON.stringify({
    slug,
    packageName,
    platform: 'react',
  }, null, 2)}\n`)

  console.log(`\nCreated app at apps/${slug}`)
  console.log(`Next: pnpm install && pnpm --filter ${packageName} dev`)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
