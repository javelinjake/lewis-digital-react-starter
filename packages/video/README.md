# @ld/video

Shared playback for apps. One provider is one sync group: every surface inside it plays, seeks, and steps together.

Moments, looping, and follow-playback stay in the app. This package owns the clock, the picture, and the controls.

## Entries

| Import          | What it provides                                                           |
| --------------- | -------------------------------------------------------------------------- |
| `@ld/video`     | Provider, HTML surface, stage, transport, seek bar, and sync helpers       |
| `@ld/video/mux` | `MuxVideoSurface`. Peer of `@mux/mux-video-react` and `@mux/playback-core` |

`VideoSurface` plays a URL or a local file. `MuxVideoSurface` plays a Mux playback id. Both register with the same provider.

## Sync

Pass a `VideoStart` when a recording has a known first frame:

- `startedAt` is an ISO-8601 instant with a numeric offset (`Z` or `±HH:MM`)
- `timeZone` is an IANA zone, such as `Europe/London`

Both are required together. The earliest start in the group is shared time 0. A later start seeks into its own file so the pictures show the same moment. If the caller passes no start and the media has a program date, that date fills the start. Do not invent one.

One member is audible. The others stay muted. Live playback can catch the live edge.

## Layout

`VideoProvider` wraps the group. `VideoStage` is the picture and the default fullscreen element. `VideoRoot` takes fullscreen instead when the controls sit outside the stage and should overlay the picture in fullscreen. `VideoTransport` is play, frame step, jog, mute, zoom, and fullscreen.

Apps that use Tailwind need the package in their `@source` scan, or the control utilities are not generated.
