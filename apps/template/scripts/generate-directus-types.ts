#!/usr/bin/env node

import process from 'node:process'
import { generateDirectusTypes } from 'directus-sdk-typegen'
import { loadEnv } from 'vite'

const env = {
  ...loadEnv('', process.cwd(), ''),
  ...process.env,
}

const directusUrl = env.DIRECTUS_URL ?? env.VITE_DIRECTUS_URL
const directusToken = env.DIRECTUS_TOKEN ?? env.VITE_DIRECTUS_TOKEN

if (!directusUrl || !directusToken) {
  console.error(
    'Missing Directus URL and token.\n'
    + 'Set in .env.local:\n'
    + '  VITE_DIRECTUS_URL=http://localhost:8055\n'
    + '  DIRECTUS_TOKEN=your-admin-token\n',
  )
  process.exit(1)
}

try {
  await generateDirectusTypes({
    outputPath: './src/schemas/directus-schema.ts',
    directusUrl,
    directusToken,
  })

  console.log('Generated src/schemas/directus-schema.ts')
}
catch (error) {
  console.error('Failed to generate Directus types:', error)
  process.exit(1)
}
