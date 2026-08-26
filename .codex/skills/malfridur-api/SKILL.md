---
name: malfridur-api
description: Use Miðeind's Málfríður service through the Málstaður API for Icelandic spelling and grammar checks when the user explicitly requests Málfríður or API-backed Icelandic proofreading. Requires MALSTADUR_API_KEY.
---

# Málfríður API

Use this skill only when the result must come from Málfríður rather than from
the model's own language judgment. This is an unofficial integration.

## Access

- Confirm that `MALSTADUR_API_KEY` is present without printing it: `test -n "${MALSTADUR_API_KEY:-}"`.
- If absent, ask the user to set it in the environment used by Codex. Never ask
  them to paste it into the conversation, and never print or commit it.

## Request

- Method and URL: `POST https://api.malstadur.is/v1/grammar`
- Headers: `X-API-KEY: <MALSTADUR_API_KEY>` and `Content-Type: application/json`
- Body: `{"texts":["Fyrsti texti","Annar texti"]}`

`texts` is required and must contain at least one string. The official OpenAPI
schema publishes no maximum item count or text length. For long documents, use
coherent paragraph-sized strings and preserve their order. Avoid unnecessary
retries because usage is billable.

Read `results[].changedText` and `results[].diffAnnotations`; annotations expose
the original and changed spans and strings plus `changeType`. Also preserve the
returned `usage` information. If the request fails, do not imply that
Málfríður reviewed the text.

Official documentation:
https://api.malstadur.is/#tag/grammar/POST/v1/grammar
