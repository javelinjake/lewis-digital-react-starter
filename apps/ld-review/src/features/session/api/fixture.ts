import type { ReviewSession } from '@/types/session'
import { CANONICAL_DURATION } from '@/types/session'

export const battingPractice: ReviewSession = {
  id: 'batting-practice',
  title: 'Batting practice',
  dateLabel: '30 September 2026',
  kind: 'Individual coaching',
  duration: CANONICAL_DURATION,
  access: 'coach',
  moments: [
    {
      id: 'balanced-stance',
      title: 'Balanced stance',
      type: 'positive',
      start: 72,
      end: 80,
      note: 'Good balance at address.',
    },
    {
      id: 'front-foot',
      title: 'Front-foot position',
      type: 'technique',
      start: 266,
      end: 278,
      note: 'Step towards the pitch of the ball. Keep your head steady as your weight moves into the shot.',
    },
    {
      id: 'head-over-ball',
      title: 'Head over the ball',
      type: 'technique',
      start: 438,
      end: 448,
      note: 'Keep your head steady.',
    },
    {
      id: 'follow-through',
      title: 'Follow-through',
      type: 'timing',
      start: 665,
      end: 679,
      note: 'Finish the movement.',
    },
    {
      id: 'timing-the-drive',
      title: 'Timing the drive',
      type: 'note',
      start: 942,
      end: 951,
      note: 'Watch the ball onto the bat.',
    },
  ],
}
