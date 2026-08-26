#!/usr/bin/env node
/**
 * greynir-mcp — Claude Desktop extension server.
 * Wraps the Greynir (Miðeind) Icelandic grammar correction endpoint.
 *
 * Config arrives via env vars set by the manifest from user_config:
 *   GREYNIR_API_KEY       required (user enters it in the extension settings UI)
 *   GREYNIR_API_URL       default https://api.greynir.is
 *   GREYNIR_CORRECT_PATH  default /correct
 *   GREYNIR_KEY_HEADER    default X-API-Key
 *   GREYNIR_TEXT_FIELD    default text
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const API_URL = (process.env.GREYNIR_API_URL || "https://api.greynir.is").replace(/\/+$/, "");
const CORRECT_PATH = process.env.GREYNIR_CORRECT_PATH || "/correct";
const KEY_HEADER = process.env.GREYNIR_KEY_HEADER || "X-API-Key";
const TEXT_FIELD = process.env.GREYNIR_TEXT_FIELD || "text";
const TIMEOUT_MS = Number(process.env.GREYNIR_TIMEOUT_MS || 60000);

const server = new McpServer({
  name: "icelandic-grammar-mcp",
  version: "1.0.0",
});

server.registerTool(
  "check_icelandic_grammar",
  {
    title: "Check Icelandic grammar",
    description:
      "Check Icelandic text for spelling and grammar errors using the Greynir/GreynirCorrect " +
      "engine (Miðeind). Returns corrected text plus annotations: each has a token span, " +
      "an error code, a human-readable description in Icelandic, and — when available — " +
      "a suggested replacement. Use for any Icelandic text that should be proofread.",
    inputSchema: {
      text: z.string().describe("The Icelandic text to check (plain text, one or more sentences)."),
    },
  },
  async ({ text }) => {
    const apiKey = process.env.GREYNIR_API_KEY;
    const fail = (msg, extra) => ({
      content: [{ type: "text", text: JSON.stringify({ error: msg, ...extra }) }],
      isError: true,
    });

    if (!apiKey) return fail("GREYNIR_API_KEY is not configured. Set it in the extension settings.");
    if (!text || !text.trim()) return fail("Empty text.");

    let resp;
    try {
      resp = await fetch(`${API_URL}${CORRECT_PATH}`, {
        method: "POST",
        headers: {
          [KEY_HEADER]: apiKey,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ [TEXT_FIELD]: text }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch (e) {
      return fail(`Request to Greynir API failed: ${e.message || e}`);
    }

    const body = await resp.text();
    if (!resp.ok) return fail(`Greynir API returned HTTP ${resp.status}`, { body: body.slice(0, 2000) });

    try {
      JSON.parse(body); // validate
      return { content: [{ type: "text", text: body }] };
    } catch {
      return fail("Non-JSON response from API", { body: body.slice(0, 2000) });
    }
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
