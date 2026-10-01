import { isMockMode } from '@/config/env.config'

export function SettingsOverview() {
  return (
    <div className="flex h-full max-w-xl flex-col gap-3 overflow-auto p-6">
      <h1 className="text-[32px] leading-10 font-bold tracking-[-0.4px]">Settings</h1>
      <p className="text-base leading-6 text-muted-foreground">
        This demo opens straight into the batting session. No account is required.
      </p>
      <p className="text-sm text-muted-foreground">
        Data mode:
        <code>{isMockMode() ? 'mock' : 'live'}</code>
      </p>
    </div>
  )
}
