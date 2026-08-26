# icelandic-grammar-mcp

An **unofficial** MCP server for Miðeind's **Málfríður** Icelandic grammar and
spelling API. It gives Claude a single tool — `check_icelandic_grammar` — so
Claude can proofread Icelandic text and work with the corrections it gets back.

> Not affiliated with, endorsed by, or supported by Miðeind ehf.
> Málfríður is Miðeind's product; this project just talks to its public API.

## Requirements

An API key from a **Frjáls áskrift** subscription at
[api.greynir.is](https://api.greynir.is). The key is yours — this server sends
it directly to Miðeind and nowhere else.

## Install (Claude Desktop)

1. Download `icelandic-grammar-mcp.mcpb` from the
   [latest release](../../releases/latest).
2. Double-click it, or drag it into **Claude Desktop → Settings → Extensions**.
3. Paste your Málfríður API key when prompted.

No Node.js or Python installation needed — Claude Desktop runs the extension in
its own bundled runtime. The key is stored by Claude Desktop in your OS
keychain, not in a config file.

## Install (Claude Code / other MCP clients)

Requires Node.js 18+.

```bash
git clone https://github.com/RobertHH-IS/icelandic-grammar-mcp.git
cd icelandic-grammar-mcp
npm install --omit=dev

claude mcp add icelandic-grammar \
  -e GREYNIR_API_KEY=your-key-here \
  -- node "$PWD/server/index.js"
```

Do not commit the key or paste it into an issue. Configure it in the MCP client
or in the environment of the process that runs the server.

## Install the Codex skill

The repository includes a small Codex skill for calling the same API directly:

```bash
cp -R .codex/skills/malfridur-api ~/.codex/skills/
export GREYNIR_API_KEY='your-key-here'
```

Start a new Codex task after installing the skill. The skill reads the key from
the environment and never writes it to the repository or includes it in command
arguments.

## The tool

**`check_icelandic_grammar(text)`** — returns the API's JSON: corrected text
plus annotations. Each annotation carries a token span, an error code, a
description in Icelandic, and a suggested replacement where one exists.

```
> Lestu yfir þennan texta: "Mér langar að fara í bíó."
```

## Configuration

Everything is overridable by environment variable. Defaults:

| Variable               | Default                    | Purpose                     |
|------------------------|----------------------------|-----------------------------|
| `GREYNIR_API_KEY`      | *(required)*               | Your Málfríður API key      |
| `GREYNIR_API_URL`      | `https://api.greynir.is`   | API base URL                |
| `GREYNIR_CORRECT_PATH` | `/correct`                 | Correction endpoint path    |
| `GREYNIR_TEXT_FIELD`   | `text`                     | Request body field name     |
| `GREYNIR_KEY_HEADER`   | `X-API-Key`                | Header carrying the API key |
| `GREYNIR_TIMEOUT_MS`   | `60000`                    | Request timeout             |

## Building the extension yourself

```bash
npm install --omit=dev
npm test
npm run validate
npm run pack        # -> dist/icelandic-grammar-mcp.mcpb
```

Tagging a release (`git tag v1.0.0 && git push --tags`) builds and attaches the
`.mcpb` automatically via GitHub Actions.

## License

MIT — see [LICENSE](LICENSE). Málfríður and Greynir are products of
[Miðeind ehf.](https://mideind.is) and subject to their own terms.
