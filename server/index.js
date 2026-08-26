#!/usr/bin/env node
/**
 * Málfríður MCP — Claude Desktop extension server.
 * Wraps Miðeind's Málstaður grammar correction endpoint.
 *
 * MALSTADUR_API_KEY is supplied by the extension's sensitive user setting.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const GRAMMAR_URL = "https://api.malstadur.is/v1/grammar";

const server = new McpServer({
  name: "icelandic-grammar-mcp",
  version: "1.0.1",
});

server.registerTool(
  "check_icelandic_grammar",
  {
    title: "Check Icelandic grammar",
    description:
      "Check Icelandic text for spelling and grammar errors using Miðeind's Málfríður service. " +
      "Returns the original and corrected text plus diff annotations for every change.",
    inputSchema: {
      text: z.string().describe("The Icelandic text to check (plain text, one or more sentences)."),
    },
  },
  async ({ text }) => {
    const apiKey = process.env.MALSTADUR_API_KEY;
    const fail = (msg, extra) => ({
      content: [{ type: "text", text: JSON.stringify({ error: msg, ...extra }) }],
      isError: true,
    });

    if (!apiKey) return fail("MALSTADUR_API_KEY is not configured. Set it in the extension settings.");
    if (!text || !text.trim()) return fail("Empty text.");

    let resp;
    try {
      resp = await fetch(GRAMMAR_URL, {
        method: "POST",
        headers: {
          "X-API-KEY": apiKey,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ texts: [text] }),
        signal: AbortSignal.timeout(60000),
      });
    } catch (e) {
      return fail(`Request to Málstaður failed: ${e.message || e}`);
    }

    const body = await resp.text();
    if (!resp.ok) return fail(`Málstaður returned HTTP ${resp.status}`, { body: body.slice(0, 2000) });

    try {
      JSON.parse(body); // validate
      return { content: [{ type: "text", text: body }] };
    } catch {
      return fail("Málstaður returned a non-JSON response", { body: body.slice(0, 2000) });
    }
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
