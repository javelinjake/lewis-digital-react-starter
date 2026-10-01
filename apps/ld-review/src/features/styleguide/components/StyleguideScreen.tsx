import type { ReactNode } from 'react'
import { Bookmark, Clapperboard } from 'lucide-react'
import {
  CoachingNote,
  DestructiveAction,
  FeedbackPanel,
  MomentCard,
  NavigationItem,
  PlayerControl,
  PrimaryAction,
  SecondaryAction,
  SelectField,
  StatusBadge,
  TextField,
  TimeField,
} from '@/components/kit'
import { VideoSyncPreview } from './VideoSyncPreview'

const colors = [
  ['surface/canvas', '#081522'],
  ['surface/default', '#0E1E2C'],
  ['surface/hover', '#152738'],
  ['surface/selected', '#25233F'],
  ['surface/disabled', '#20303E'],
  ['surface/success', '#102E2D'],
  ['surface/error', '#351D29'],
  ['action/primary', '#F34EAE'],
  ['action/hover', '#FF6BBD'],
  ['action/pressed', '#E447A2'],
  ['action/destructive', '#FF6868'],
  ['text/primary', '#F4F4FA'],
  ['text/secondary', '#A9B4CC'],
  ['text/disabled', '#718197'],
  ['text/on-action', '#081522'],
  ['border/default', '#2B3E50'],
  ['border/focus', '#9470F4'],
  ['selection/primary', '#9470F4'],
  ['selection/text', '#C7B5FF'],
  ['trim/handle', '#FF8736'],
  ['trim/surface', '#39281E'],
  ['status/success', '#2EC4A7'],
  ['status/error', '#FF6868'],
] as const

function Section({ title, children }: { title: string, children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-bold tracking-[-0.1px]">{title}</h2>
      {children}
    </section>
  )
}

export function StyleguideScreen() {
  return (
    <div className="flex h-full flex-col gap-8 overflow-auto p-6">
      <header>
        <h1 className="text-[32px] leading-10 font-bold tracking-[-0.4px]">LD Review kit</h1>
        <p className="text-sm text-muted-foreground">Foundations and components from the cricket coaching kit.</p>
      </header>
      <Section title="Colours">
        <ul className="grid gap-2 sm:grid-cols-2">
          {colors.map(([name, hex]) => (
            <li key={name} className="flex items-center gap-3 text-xs">
              <span className="size-8 rounded" style={{ background: hex }} />
              {`${name} ${hex}`}
            </li>
          ))}
        </ul>
      </Section>
      <Section title="Typography">
        <p className="text-xs leading-4">caption · The quick brown fox</p>
        <p className="text-sm leading-5 font-medium">label · The quick brown fox</p>
        <p className="text-base leading-6">body · The quick brown fox</p>
        <p className="text-base leading-6 font-bold">card-title · The quick brown fox</p>
        <p className="text-lg leading-6 font-bold tracking-[-0.1px]">section-title · The quick brown fox</p>
        <p className="text-[32px] leading-10 font-bold tracking-[-0.4px]">page-title · The quick brown fox</p>
      </Section>
      <Section title="Primary action">
        <div className="flex flex-wrap gap-2">
          <PrimaryAction label="Create moment" />
          <PrimaryAction label="Hover" variant="hover" />
          <PrimaryAction label="Pressed" variant="pressed" />
          <PrimaryAction label="Focus" variant="focus" />
          <PrimaryAction label="Disabled" variant="disabled" />
        </div>
      </Section>
      <Section title="Secondary action">
        <div className="flex flex-wrap gap-2">
          <SecondaryAction label="Invite to view" />
          <SecondaryAction label="Hover" variant="hover" />
          <SecondaryAction label="Focus" variant="focus" />
          <SecondaryAction label="Disabled" variant="disabled" />
        </div>
      </Section>
      <Section title="Destructive action">
        <div className="flex flex-wrap gap-2">
          <DestructiveAction label="Delete moment" />
          <DestructiveAction label="Hover" variant="hover" />
          <DestructiveAction label="Pressed" variant="pressed" />
          <DestructiveAction label="Focus" variant="focus" />
          <DestructiveAction label="Disabled" variant="disabled" />
        </div>
      </Section>
      <Section title="Synced video">
        <p className="max-w-3xl text-sm text-muted-foreground">
          Two views play the same moment. Each one shows the start timecode and zone assigned to that camera. This preview still uses one film, so both play from the earlier start. A second recording keeps its own start, and that difference is what lines the pictures up.
        </p>
        <VideoSyncPreview />
      </Section>
      <Section title="Player control">
        <div className="flex flex-wrap gap-2">
          <PlayerControl label="Play" />
          <PlayerControl label="Hover" variant="hover" />
          <PlayerControl label="Focus" variant="focus" />
          <PlayerControl label="Active" variant="active" />
          <PlayerControl label="Disabled" variant="disabled" />
        </div>
      </Section>
      <Section title="Navigation item">
        <div className="flex max-w-xs flex-col gap-2">
          <NavigationItem label="Sessions" icon={<Clapperboard className="size-4" />} />
          <NavigationItem label="Moments" variant="selected" icon={<Bookmark className="size-4" />} />
          <NavigationItem label="Hover" variant="hover" />
          <NavigationItem label="Focus" variant="focus" />
        </div>
      </Section>
      <Section title="Fields">
        <div className="grid max-w-md gap-4">
          <TextField label="Title" value="Front-foot position" />
          <TextField label="Focus title" value="Front-foot position" variant="focus" />
          <TextField label="Error title" value="Front-foot position" variant="error" />
          <TextField label="Disabled title" value="Front-foot position" variant="disabled" />
          <SelectField label="Type" value="Technique adjustment" options={['Technique adjustment', 'Positive', 'Timing']} />
          <SelectField label="Open type" value="Technique adjustment" options={['Technique adjustment']} variant="open" />
          <SelectField label="Disabled type" value="Technique adjustment" options={['Technique adjustment']} variant="disabled" />
          <TimeField label="In" value="04:02" />
          <TimeField label="Focus in" value="04:02" variant="focus" />
          <TimeField label="Boundary" value="04:02" variant="boundary" />
          <TimeField label="Error in" value="04:02" variant="error" />
          <TimeField label="Disabled in" value="04:02" variant="disabled" />
        </div>
      </Section>
      <Section title="Moment card">
        <div className="grid max-w-md gap-2">
          <MomentCard title="Front-foot position" meta="04:26–04:38 · 12 sec" note="Step towards the pitch of the ball." type="technique" />
          <MomentCard title="Hover" meta="04:26–04:38 · 12 sec" note="Step towards the pitch of the ball." type="technique" variant="hover" />
          <MomentCard title="Focus" meta="04:26–04:38 · 12 sec" note="Step towards the pitch of the ball." type="technique" variant="focus" />
          <MomentCard title="Selected" meta="04:26–04:38 · 12 sec" note="Step towards the pitch of the ball." type="technique" variant="selected" expanded />
          <MomentCard title="Active during playback" meta="04:26–04:38 · 12 sec" note="Step towards the pitch of the ball." type="technique" variant="active" playing />
        </div>
      </Section>
      <Section title="Coaching note">
        <div className="grid max-w-md gap-2">
          <CoachingNote label="Coaching note" body="Move your front foot towards the pitch of the ball." />
          <CoachingNote label="Focus" body="Move your front foot towards the pitch of the ball." variant="focus" />
          <CoachingNote label="Error" body="Add a coaching note before saving." variant="error" />
          <CoachingNote label="Disabled" body="This note cannot be edited." variant="disabled" />
        </div>
      </Section>
      <Section title="Status badge">
        <div className="flex flex-wrap gap-2">
          <StatusBadge label="Full session" />
          <StatusBadge label="Viewing moment" variant="selected" />
          <StatusBadge label="Saved" variant="success" />
          <StatusBadge label="Save failed" variant="error" />
          <StatusBadge label="Processing" variant="processing" />
        </div>
      </Section>
      <Section title="Feedback panel">
        <div className="grid max-w-md gap-2">
          <FeedbackPanel />
          <FeedbackPanel variant="selected" />
          <FeedbackPanel variant="empty" />
          <FeedbackPanel variant="loading" />
          <FeedbackPanel variant="success" />
          <FeedbackPanel variant="error" />
        </div>
      </Section>
    </div>
  )
}
