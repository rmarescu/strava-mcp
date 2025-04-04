#!/usr/bin/env node

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { createServer } from "./server.js";

const main = async () => {
  const transport = new StdioServerTransport();
  const { server, cleanup } = createServer();
  await server.connect(transport);

  process.on("SIGINT", async () => {
    await cleanup();
    await server.close();
    process.exit(0);
  });
};

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
