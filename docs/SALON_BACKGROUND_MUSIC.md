# Hananeh Beauty ambient soundtrack — opt-in release

The user-provided MP3 is **not committed to public GitHub**. This is deliberate:
its ID3 metadata identifies the recording as *Evgeny Grinko — Field*, and
the legal right to redistribute it in a commercial app has not been established.

## Install

1. Obtain web-distribution permission or replace the music with a licensed track.
2. Place the cleared file at `public/audio/hananeh-salon-ambience.mp3`.
3. Match `assets/hananeh-salon-ambience.sha256` (change the lock for a licensed replacement).
4. Run `VITE_SALON_MUSIC=true npm run build` and `VITE_SALON_MUSIC=true npm run test:ui`.
5. Enable `VITE_SALON_MUSIC=true` in Cloudflare Workers Builds only after release approval.
6. Verify playback, audio mute persistence, airplane mode, and installation on real phones.

Without the flag, the control is hidden and current production is unaffected.

The track loops in one persistent HTMLAudioElement across screens/sheets at 25% volume.
The browser may require a first tap/keyboard activation before sound starts.
Music pauses when the page is hidden; mute choice is saved in localStorage and
synced across tabs. With music enabled, the release build verifies and precaches
the exact MP3 for offline playback; missing/changed media aborts the build.
