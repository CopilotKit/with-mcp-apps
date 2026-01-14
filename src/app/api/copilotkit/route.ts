import {
  CopilotRuntime,
  ExperimentalEmptyAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { BuiltInAgent } from "@copilotkit/runtime/v2";
import { NextRequest } from "next/server";
import { MCPAppsMiddleware } from "@ag-ui/mcp-apps-middleware";

const agent = new BuiltInAgent({
  model: "openai/gpt-4o",
  prompt: "You are a helpful assistant.",
  mcpServers: [
    {
      type: "http",
      url: "http://localhost:3108/mcp",
    },
  ]
}).use(new MCPAppsMiddleware({
  mcpServers: [
    {
      type: "http",
      url: "http://localhost:3108/mcp",
      serverId: "threejs" // Recommended: stable identifier
    },
  ],
}));

// 1. You can use any service adapter here for multi-agent support. We use
//    the empty adapter since we're only using one agent.
const serviceAdapter = new ExperimentalEmptyAdapter();

// 2. Create the CopilotRuntime instance and utilize the LangGraph AG-UI
//    integration to setup the connection.
const runtime = new CopilotRuntime({
  agents: {
    sample_agent: agent,
  },
});

// 3. Build a Next.js API route that handles the CopilotKit runtime requests.
export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};
