import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import http from "node:http";
import test from "node:test";

test("the skill helper sends text and the API key without exposing the key", async () => {
  const apiKey = "test-only-api-key";
  const input = "Þetta er prófun.";

  const server = http.createServer(async (request, response) => {
    assert.equal(request.method, "POST");
    assert.equal(request.url, "/correct");
    assert.equal(request.headers["x-api-key"], apiKey);

    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    assert.deepEqual(JSON.parse(Buffer.concat(chunks).toString("utf8")), { text: input });

    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ corrected: input, annotations: [] }));
  });

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  const child = spawn(process.execPath, [".codex/skills/malfridur-api/scripts/check.mjs"], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      GREYNIR_API_KEY: apiKey,
      GREYNIR_API_URL: `http://127.0.0.1:${address.port}`,
    },
    stdio: ["pipe", "pipe", "pipe"],
  });

  child.stdin.end(input);
  const stdout = [];
  const stderr = [];
  child.stdout.on("data", (chunk) => stdout.push(chunk));
  child.stderr.on("data", (chunk) => stderr.push(chunk));

  const exitCode = await new Promise((resolve) => child.on("close", resolve));
  server.close();

  const output = Buffer.concat(stdout).toString("utf8");
  const errorOutput = Buffer.concat(stderr).toString("utf8");
  assert.equal(exitCode, 0, errorOutput);
  assert.deepEqual(JSON.parse(output), { corrected: input, annotations: [] });
  assert.doesNotMatch(output, new RegExp(apiKey));
  assert.doesNotMatch(errorOutput, new RegExp(apiKey));
});
