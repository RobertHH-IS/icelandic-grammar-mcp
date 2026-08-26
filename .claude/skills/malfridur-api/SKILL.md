---
name: malfridur-api
description: Use the Icelandic Grammar (Málfríður) MCP extension for API-backed Icelandic spelling and grammar checks when the user explicitly requests Málfríður. Requires a Málstaður API key configured in the extension.
---

# Málfríður API

Use the `check_icelandic_grammar` MCP tool when the result must come from
Málfríður rather than from the model's own language judgment. This is an
unofficial integration and is not affiliated with Miðeind ehf.

## Access

- The tool must be supplied by the `Icelandic Grammar (Málfríður)` Claude
  Desktop extension.
- If the tool is unavailable, ask the user to install or enable the extension,
  configure its Málstaður API key, and start a new Claude session.
- Do not ask the user to paste an API key into the conversation. The extension
  collects the key through its sensitive configuration field.

## Proofread text

Pass the Icelandic text to `check_icelandic_grammar`. For long material, send
coherent paragraph-sized batches and preserve their order.

The response contains `results`. For each result, report `changedText` and a
compact list of `diffAnnotations`, including `origString`, `changedString`, and
`changeType`. Keep returned API findings separate from any additional style
advice. If the tool call fails, report the error honestly and do not imply that
Málfríður reviewed the text.
