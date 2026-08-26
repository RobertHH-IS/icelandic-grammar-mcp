# icelandic-grammar-mcp

An **unofficial** MCP server for Miðeind's **Málfríður** Icelandic proofreading
service through the [Málstaður API](https://api.malstadur.is/). It gives Claude
a single tool — `check_icelandic_grammar` — for API-backed Icelandic review.

> Not affiliated with, endorsed by, or supported by Miðeind ehf.
> Málfríður is Miðeind's product; this project just talks to its public API.

## Requirements

Create a **Frjáls áskrift** in
[Málstaður](https://malstadur.mideind.is/askrift), then create an API key on the
[Forritaskil page](https://malstadur.mideind.is/hopar/forritaskil). The key is
sent only to `https://api.malstadur.is/v1/grammar` in the `X-API-KEY` header.
See Miðeind's [API documentation](https://api.malstadur.is/#tag/grammar/POST/v1/grammar).

## Install (Claude Desktop)

1. Download `icelandic-grammar-mcp.mcpb` from the
   [latest release](../../releases/latest).
2. Double-click it, or drag it into **Claude Desktop → Settings → Extensions**.
3. Paste your Málfríður API key when prompted.

No Node.js or Python installation needed — Claude Desktop runs the extension in
its own bundled runtime. The extension marks the key as a sensitive setting and
passes it to the server as `MALSTADUR_API_KEY`.

## Install the Codex skill

The repository includes a small Codex skill for calling the same API directly:

```bash
cp -R .codex/skills/malfridur-api ~/.codex/skills/
export MALSTADUR_API_KEY='your-key-here'
```

Start a new Codex task after installing the skill. The skill reads the key from
the environment and never writes it to the repository or includes it in command
arguments.

## The tool

**`check_icelandic_grammar(text)`** sends `{"texts":[text]}` to the official
grammar endpoint and returns its JSON. Each item in `results` contains
`originalText`, `changedText`, and `diffAnnotations` describing the changes.

```
> Lestu yfir þennan texta: "Mér langar að fara í bíó."
```

## Configuration

The only configuration value is `MALSTADUR_API_KEY`. Claude Desktop asks for
it during installation and passes it to the MCP server as a sensitive
environment variable.

## Building the extension yourself

```bash
npm install --omit=dev
npm test
npm run validate
npm run pack        # -> dist/icelandic-grammar-mcp.mcpb
```

Tagging a release builds and attaches the `.mcpb` extension through GitHub
Actions.

## License

MIT — see [LICENSE](LICENSE). Málfríður and Málstaður are products of
[Miðeind ehf.](https://mideind.is) and subject to their own terms.
