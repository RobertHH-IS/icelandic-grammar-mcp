import assert from "node:assert/strict";
import test from "node:test";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

test("lists the grammar tool and rejects calls without an API key", async () => {
  const env = { ...process.env };
  delete env.MALSTADUR_API_KEY;

  const transport = new StdioClientTransport({
    command: process.execPath,
    args: ["server/index.js"],
    cwd: process.cwd(),
    env,
    stderr: "pipe",
  });
  const client = new Client({ name: "icelandic-grammar-mcp-test", version: "1.0.1" });

  try {
    await client.connect(transport);

    const listed = await client.listTools();
    assert.deepEqual(listed.tools.map((tool) => tool.name), ["check_icelandic_grammar"]);

    const result = await client.callTool({
      name: "check_icelandic_grammar",
      arguments: { text: "Þetta er prófun." },
    });
    assert.equal(result.isError, true);
    assert.match(result.content[0].text, /MALSTADUR_API_KEY is not configured/);
  } finally {
    await client.close();
  }
});
