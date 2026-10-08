# Vildhjarta — Den Helige Anden (Strudel port)

A complete **11-track, 137-bar, 5:23 score-derived arrangement** for the [Strudel](https://strudel.cc/) live-coding REPL. The source is the user-supplied Guitar Pro 8 `.gp` transcription associated with [Songsterr tab s463766](https://www.songsterr.com/a/wsa/vildhjarta-den-helige-anden-tab-s463766). This repository contains a new transcription into Strudel events, **not** the original Guitar Pro file. The arrangement is credited to Vildhjarta; the score source and the arrangement should not be mistaken for an official score or recording.

## Play

1. Copy the entire [`den-helige-anden.js`](./den-helige-anden.js) into [strudel.cc](https://strudel.cc/) and press **Play**. Default output uses WebAudio guitar/bass sample substitutes and sampled drums.
2. Adjust the levels in `webPart` (the distorted guitars are deliberately quiet because the distortion effect increases loudness). You may want a high-quality guitar/drum sampler or external DAW to obtain a convincing metal mix.
3. To drive instruments via MIDI instead, set `const MIDI = true` in the Strudel code, select/configure a MIDI output, and assign receiving channels: drums **10**, bass **1**, Calle **2**, Daniel **3**, pitch drop **4–5**, clean guitars **6–7**, delay/reverb guitars **8, 9, 11**. MIDI notes and durations match the transcription but MIDI hardware/drum-VST maps may need adjustments.
4. To rehearse a passage, change `START_BAR` and `END_BAR` (inclusive, 1-based). To play the whole arrangement, keep `1` and `137`.

## Score coverage

Tracks: Drums; Slap Bass 2; CALLE GUITAR; DANIEL GUITAR; PITCH DROP L/R; CLEAN GUITAR L/R; Guitar Delay; REV/DEL; REV.

Preserved from the Guitar Pro score: **7,240 note onsets after merging ties**, simultaneous chord pitches, bar lengths (including irregular time signatures), triplets, dynamics converted to velocity tiers, cross-bar note sustain from ties, and all **11 notated tempo values**. Since Strudel schedules events in cycles, the converter sets 60 cycles/minute and converts the changing quarter-note tempo map into **absolute seconds** (one Strudel cycle = one second). The full-score duration is about **323.366 s**.

Not yet rendered accurately: continuous guitar slides or pitch-bend curves, let-ring semantics, performance-dependent articulation, guitar-string physics, drum-kit nuances, automation/mixing and production. In particular, Vildhjarta's tone and phrasing cannot be reconstructed purely from General MIDI pitches and basic samples; this port is a timing/pitch transcription first, a timbral arrangement second.

Selected section markers in the score: intro at bar 1, BREAK 1 at 19, CLEANS IN at 24, SLIDES at 30, PITCH BREAKDOWN at 48, Chorus at 56, `When we broke free...` at 72, then sections at 102, 112, and 128. The metadata file records their precise 1-based positions.

## Rebuild from a GP8 score

```bash
python tools/gpif_to_strudel.py 'Den Helige Anden.gp' \
  --output den-helige-anden.js \
  --source-url 'https://www.songsterr.com/a/wsa/vildhjarta-den-helige-anden-tab-s463766'
```

The converter uses only the Python standard library; it reads the GPIF XML inside Guitar Pro 7/8 `.gp` ZIP containers. It fails explicitly for unsupported intra-bar tempo automations, unknown rhythms or insufficient tick resolution instead of silently quantizing. For additional Songsterr transcriptions, inspect the generated score metadata and adapt the track-to-sample mapping in `webPart`.

Run the offline timing and decoding smoke test with `node tests/runtime_test.cjs`. This uses a Strudel-core **mock**, not the official REPL/audio engine; final browser playback and MIDI routing still require listening tests.

## Related project

The MIDI-oriented [Meshuggah — New Millenium Cyanide Christ](https://github.com/alvaro-caceres-munoz/live-coding-metal/blob/main/new-millenium-cyanide-christ/new-millenium-cyanide-christ.js) by **Alvaro Cáceres** informed the separate MIDI-channel output and structure. Its riff/music data is not used here.