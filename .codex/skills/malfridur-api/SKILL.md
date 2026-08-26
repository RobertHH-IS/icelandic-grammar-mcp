---
name: malfridur-api
description: Use Miðeind's Málfríður service through the Málstaður API for Icelandic spelling and grammar checks when the user explicitly requests Málfríður or API-backed Icelandic proofreading. Requires MALSTADUR_API_KEY.
---

# Málfríður API

Use this skill when the result must come from Málfríður rather than from the
model's own language judgment. This is an unofficial integration and is not
affiliated with Miðeind ehf.

## API key

- Confirm that `MALSTADUR_API_KEY` is present without printing it: `test -n "${MALSTADUR_API_KEY:-}"`.
- If it is absent, ask the user to configure it in the environment used by
  Codex. Do not ask them to paste the key into the conversation.
- Never echo, log, commit, or return the key. Do not put its expanded value in
  command arguments.

## Proofread text

Run `scripts/check.mjs`, resolved relative to this `SKILL.md`, and pass the
Icelandic text on standard input. The helper returns the API's JSON on standard
output and honors the documented `MALSTADUR_*` environment overrides.

For long material, send coherent paragraph-sized batches and preserve their
order. Report the corrected text and a compact list of API annotations,
including the original span, suggested replacement, error code, and Icelandic
description when present. Keep API findings separate from any additional style
advice.

If the request fails, report the error honestly and do not imply that
Málfríður reviewed the text. Never silently replace a requested API check with
model-only proofreading.
