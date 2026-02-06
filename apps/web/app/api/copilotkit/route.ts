import {
  CopilotRuntime,
  copilotRuntimeNextJSAppRouterEndpoint,
  ExperimentalEmptyAdapter,
} from "@copilotkit/runtime";
import { BuiltInAgent } from "@copilotkit/runtime/v2";
import { NextRequest } from "next/server";

// 1. Create the agents
const supervisor = new BuiltInAgent({
  model: "openai/gpt-4o",
  prompt: "Your name is Bob. You are a leader, delegate.",
})
const finance = new BuiltInAgent({
  model: "openai/gpt-4o",
  prompt: "Your name is Sally. You are a finance expert. There is $4000 to be spent.",
})
const pirate = new BuiltInAgent({
  model: "openai/gpt-4o",
  prompt: "Your name is Roger. Talk like a pirate",
})

// 5. Create the runtime
const runtime = new CopilotRuntime({
  // @ts-ignore
  agents: {
    default: supervisor,
    pirate,
    finance,
  },
});

// 6. Create the API route
export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter: new ExperimentalEmptyAdapter(),
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};
