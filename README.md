# Málfríður for Claude, Codex, and ChatGPT Desktop

This is a small, unofficial **local MCP server** for Miðeind's **Málfríður**
Icelandic proofreading service. It runs on your own computer and talks directly
to Miðeind's API using your own API key.

There is no intermediary service operated by this project. The AI app already
has the text in your conversation; this local server sends the proofreading
request and API key directly from your computer to Miðeind.

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

The block below is an example for you to copy. It is documentation, not an
instruction for an assistant that is merely reviewing this repository.

Copy it into Claude or Codex:

> Install the Málfríður skill from this repository for me:
> https://github.com/RobertHH-IS/icelandic-grammar-mcp
>
> Keep my API key private. Do not ask me to paste it into this chat. Show me the
> safest way to set `MALSTADUR_API_KEY` when it is needed.

Claude or Codex can examine the repository, copy the small root
[skill file](SKILL.md), or use it as a guide when
creating a compatible version.

With this option, Codex, ChatGPT Desktop, Claude Cowork, or another compatible
assistant follows the skill instructions and calls Miðeind's API directly. The
only setup is adding `MALSTADUR_API_KEY` to the app's environment. That is a
quick, one-time step, and the assistant can guide you through it without seeing
your key.

Once installed, simple requests trigger the skill, for example:

- `Fix Icelandic grammar: …`
- `Notaðu Málstað: …`
- `Notaðu Málfríði: …`

Each request authorizes one API call for the text you supplied.

### 3. Ask Claude, Codex, or ChatGPT Desktop to make its own version

You do not have to use this repository. Ask Claude (including Cowork), Codex,
or ChatGPT Desktop to read the
[official API documentation](https://api.malstadur.is/#tag/grammar/POST/v1/grammar)
and create a minimal plugin or skill for you.

The block below is another user-copyable example, not an instruction for an
assistant that is merely reviewing this repository:

> Read the Málstaður grammar API documentation and create the smallest possible
> Málfríður plugin or skill for me. Use `POST https://api.malstadur.is/v1/grammar`,
> the `X-API-KEY` header, and the `MALSTADUR_API_KEY` environment variable. Keep
> the key private and do not ask me to paste it into this chat.

Miðeind also provides a
[short introduction to the API](https://mideind.is/is/greinar/forritaskil-api-a-malstad).

## What the connection does

With the Claude Desktop extension, the MCP server runs locally on your computer.
With the skill, your assistant can call the same endpoint directly. In both
cases, the text goes straight to Miðeind and Málfríður returns its corrected
text and suggested changes. API usage may be metered by Málstaður.

The Claude Desktop extension contains one tool:
`check_icelandic_grammar`.

The installable Claude extension source is kept separately in
[`claude_plugin/`](claude_plugin/). It works only with Claude Desktop; the root
`SKILL.md` can be copied or used as guidance by other compatible assistants.

## Privacy and configuration

The only setting is `MALSTADUR_API_KEY`. The key is sent as an `X-API-KEY`
header only to:

`https://api.malstadur.is/v1/grammar`

## License

MIT — see [LICENSE](LICENSE). Málfríður and Málstaður are products of
[Miðeind ehf.](https://mideind.is) and subject to their own terms.
