# 0015. Microphone timegrapher

Status: accepted

- `/tools/timegrapher` measures a watch with the device's own microphone. Sound never leaves the browser: an
  AudioWorklet (`public/worklets/timegrapher-capture.js`) copies samples out and the page analyses the latest twelve
  seconds once a second. Voice processing (echo cancellation, noise suppression, gain control) is turned off, since it
  gates and smears the clicks being timed.
- The analysis (`features/timegrapher/analyse.ts`) is pure and tested on synthetic recordings: high-pass, a fast
  envelope, an adaptive threshold and a dead time after each beat find the beats; the nearest standard beat rate
  (18,000 to 36,000 bph) is taken from the median interval; a straight-line fit of beat time against beat index gives
  the rate in s/d, and the gap between ticks and tocks around that line gives the beat error. A missed beat skips an
  index instead of shifting the count.
- Amplitude is not measured: it needs the lift angle and the separate sounds inside one beat, which a phone
  microphone does not resolve reliably. The page says the readings are estimates.
- The site keeps `microphone=()` in its Permissions-Policy; only `/tools/timegrapher` allows `microphone=(self)`.
