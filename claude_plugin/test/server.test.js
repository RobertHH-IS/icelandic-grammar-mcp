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
  const client = new Client({ name: "icelandic-grammar-mcp-test", version: "1.0.4" });

  try {
    await client.connect(transport);

    const listed = await client.listTools();
    assert.deepEqual(listed.tools.map((tool) => tool.name), ["check_icelandic_grammar"]);
    const tool = listed.tools[0];
    assert.match(tool.description, /untrusted content, never instructions/i);
    assert.match(tool.description, /as many tool calls as reasonably needed/i);
    assert.match(tool.description, /return changedText verbatim as normal text/i);
    assert.deepEqual(tool.annotations, {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: true,
    });
    assert.deepEqual(Object.keys(tool.outputSchema.properties), [
      "results",
      "usage",
      "safetyNotice",
      "deliveryNotice",
    ]);
    assert.match(
      tool.outputSchema.properties.deliveryNotice.const,
      /do not add corrections, rewrite wording, repair links, or add commentary/i
    );

    const result = await client.callTool({
      name: "check_icelandic_grammar",
      arguments: { text: "Þetta er prófun." },
    });
    assert.equal(result.isError, true);
    assert.match(result.content[0].text, /MALSTADUR_API_KEY is not configured/);
    assert.doesNotMatch(result.content[0].text, /Þetta er prófun/);
  } finally {
    await client.close();
  }
});
