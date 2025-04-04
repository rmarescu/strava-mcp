/* eslint-disable sort-keys */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequest,
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";

const underConstruction: Tool = {
  name: "under_construction",
  description: "Server is under construction",
  inputSchema: {
    type: "object",
    properties: {},
  },
};

export const createServer = () => {
  const server = new Server(
    {
      name: "Strava MCP Server",
      version: "0.0.1",
    },
    {
      capabilities: {
        tools: {},
      },
    },
  );

  server.setRequestHandler(CallToolRequestSchema, (request: CallToolRequest) => {
    console.error("Received CallToolRequest:", request);
    try {
      if (!request.params.arguments) {
        throw new Error("No arguments provided");
      }

      switch (request.params.name) {
        case "under_construction": {
          return {
            content: [{ type: "text", text: "This server is under construction." }],
          };
        }
        default:
          throw new Error(`Unknown tool: ${request.params.name}`);
      }
    } catch (error) {
      console.error("Error executing tool:", error);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              error: error instanceof Error ? error.message : String(error),
            }),
          },
        ],
      };
    }
  });

  server.setRequestHandler(ListToolsRequestSchema, () => {
    console.error("Received ListToolsRequest");
    return {
      tools: [underConstruction],
    };
  });

  return { server, cleanup: () => server.close() };
};
