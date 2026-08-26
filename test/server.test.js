import assert from "node:assert/strict";
import http from "node:http";
import test from "node:test";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

function createClient(env) {
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: ["server/index.js"],
    cwd: process.cwd(),
    env,
    stderr: "pipe",
  });
  const client = new Client({ name: "icelandic-grammar-mcp-test", version: "1.0.1" });
  return { client, transport };
}

test("lists the grammar tool and rejects calls without an API key", async () => {
  const env = { ...process.env };
  delete env.MALSTADUR_API_KEY;

  const { client, transport } = createClient(env);

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

test("sends the documented Málstaður grammar request through MCP", async () => {
  const apiKey = "test-only-api-key";
  const input = "Þetta er prófun.";
  const responseBody = {
    results: [{ originalText: input, changedText: input, diffAnnotations: [] }],
    usage: { units: input.length, unitType: "characters", cost: 0 },
  };

  const mockApi = http.createServer(async (request, response) => {
    assert.equal(request.method, "POST");
    assert.equal(request.url, "/v1/grammar");
    assert.equal(request.headers["x-api-key"], apiKey);

    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    assert.deepEqual(JSON.parse(Buffer.concat(chunks).toString("utf8")), { texts: [input] });

    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify(responseBody));
  });

  await new Promise((resolve) => mockApi.listen(0, "127.0.0.1", resolve));
  const address = mockApi.address();
  const { client, transport } = createClient({
    ...process.env,
    MALSTADUR_API_KEY: apiKey,
    MALSTADUR_API_URL: `http://127.0.0.1:${address.port}`,
  });

  try {
    await client.connect(transport);
    const result = await client.callTool({
      name: "check_icelandic_grammar",
      arguments: { text: input },
    });
    assert.notEqual(result.isError, true);
    assert.deepEqual(JSON.parse(result.content[0].text), responseBody);
    assert.doesNotMatch(result.content[0].text, new RegExp(apiKey));
  } finally {
    await client.close();
    mockApi.close();
  }
});
