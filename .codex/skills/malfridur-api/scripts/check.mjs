#!/usr/bin/env node

const apiKey = process.env.MALSTADUR_API_KEY;

if (!apiKey) {
  console.error(JSON.stringify({
    error: "MALSTADUR_API_KEY is not configured in this process environment.",
  }));
  process.exit(2);
}

const chunks = [];
for await (const chunk of process.stdin) chunks.push(chunk);
const text = Buffer.concat(chunks).toString("utf8");

if (!text.trim()) {
  console.error(JSON.stringify({ error: "No Icelandic text was provided on standard input." }));
  process.exit(2);
}

const apiUrl = (process.env.MALSTADUR_API_URL || "https://api.malstadur.is").replace(/\/+$/, "");
const grammarPath = process.env.MALSTADUR_GRAMMAR_PATH || "/v1/grammar";
const timeoutMs = Number(process.env.MALSTADUR_TIMEOUT_MS || 60000);

if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
  console.error(JSON.stringify({ error: "MALSTADUR_TIMEOUT_MS must be a positive number." }));
  process.exit(2);
}

let response;
try {
  response = await fetch(`${apiUrl}${grammarPath}`, {
    method: "POST",
    headers: {
      "X-API-KEY": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ texts: [text] }),
    signal: AbortSignal.timeout(timeoutMs),
  });
} catch (error) {
  console.error(JSON.stringify({ error: `Request to Málfríður failed: ${error.message || error}` }));
  process.exit(1);
}

const body = await response.text();
if (!response.ok) {
  console.error(JSON.stringify({
    error: `Málfríður returned HTTP ${response.status}.`,
    body: body.slice(0, 2000),
  }));
  process.exit(1);
}

try {
  const parsed = JSON.parse(body);
  process.stdout.write(`${JSON.stringify(parsed, null, 2)}\n`);
} catch {
  console.error(JSON.stringify({
    error: "Málfríður returned a non-JSON response.",
    body: body.slice(0, 2000),
  }));
  process.exit(1);
}
