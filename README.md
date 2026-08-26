# Málfríður for Claude and Codex

This is a small, unofficial **local MCP server** for Miðeind's **Málfríður**
Icelandic proofreading service. It runs on your own computer and talks directly
to Miðeind's API using your own API key.

There is no intermediary service operated by this project. Your text and API
key go directly from your computer to Miðeind.

> This project is not affiliated with or supported by Miðeind ehf.

## Before you start

You need a Málfríður API key:

1. Create a **Frjáls áskrift** at
   [Málstaður](https://malstadur.mideind.is/askrift).
2. Create your key on the
   [Forritaskil page](https://malstadur.mideind.is/hopar/forritaskil).

Keep the key private. Do not paste it into a chat, GitHub issue, or public file.

## Choose one of three options

### 1. Install the Claude Desktop extension

This is the easiest option. It works only with **Claude Desktop**.

1. [Download the extension](https://github.com/RobertHH-IS/icelandic-grammar-mcp/releases/latest/download/icelandic-grammar-mcp.mcpb).
2. Open the downloaded file in Claude Desktop.
3. Enter your Málfríður API key when Claude asks for it.

That is all. Claude runs the MCP server locally and handles the API-key setting
for you. You do not need to use Terminal or install any programming tools.

### 2. Ask Claude or Codex to bring over the skill

Copy the message below into Claude or Codex:

> Install the Málfríður skill from this repository for me:
> https://github.com/RobertHH-IS/icelandic-grammar-mcp
>
> Keep my API key private. Do not ask me to paste it into this chat. Show me the
> safest way to set `MALSTADUR_API_KEY` when it is needed.

Claude or Codex can examine the repository, copy the small
[skill file](.codex/skills/malfridur-api/SKILL.md), and guide you through the
API-key step.

### 3. Ask Codex or Claude Cowork to make its own version

You do not have to use this repository. Give Codex or Claude Cowork the
[official API documentation](https://api.malstadur.is/#tag/grammar/POST/v1/grammar)
and ask it to create a minimal plugin or skill for you.

You can copy this message:

> Read the Málstaður grammar API documentation and create the smallest possible
> Málfríður plugin or skill for me. Use `POST https://api.malstadur.is/v1/grammar`,
> the `X-API-KEY` header, and the `MALSTADUR_API_KEY` environment variable. Keep
> the key private and do not ask me to paste it into this chat.

Miðeind also provides a
[short introduction to the API](https://mideind.is/is/greinar/forritaskil-api-a-malstad).

## What the connection does

The MCP server runs locally on your computer. It sends Icelandic text directly
to the official Málstaður grammar endpoint and returns Málfríður's corrected
text and suggested changes. API usage may be metered by Málstaður.

The Claude Desktop extension contains one tool:
`check_icelandic_grammar`.

## Privacy and configuration

The only setting is `MALSTADUR_API_KEY`. The key is sent as an `X-API-KEY`
header only to:

`https://api.malstadur.is/v1/grammar`

## License

MIT — see [LICENSE](LICENSE). Málfríður and Málstaður are products of
[Miðeind ehf.](https://mideind.is) and subject to their own terms.
