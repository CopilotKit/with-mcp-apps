"use client";

import { CopilotChat, useAgent, useFrontendTool } from "@copilotkit/react-core/v2";
import { useCallback, useRef } from "react";
import { z } from "zod";

export default function CopilotKitPage() {
  const { agent: supervisor } = useAgent()
  const { agent: financeAgent } = useAgent({ agentId: "finance" })
  const { agent: pirateAgent } = useAgent({ agentId: "pirate" })

  /*
    Using references here to avoid infinite re-rendering. Since the agents
    are re-rendered on updates, and this is self-referential, we need to use
    references to keep the agents up-to-date and stable.
  */
  const supervisorRef = useRef(supervisor)
  const financeAgentRef = useRef(financeAgent)
  const pirateAgentRef = useRef(pirateAgent)
  supervisorRef.current = supervisor
  financeAgentRef.current = financeAgent
  pirateAgentRef.current = pirateAgent
  
  // Define a frontend tool that can call the finance agent and inject the response into the supervisor agent 
  useFrontendTool({
    name: "callFinance",
    parameters: z.object({
      query: z.string(),
    }),
    handler: async ({query}) => {
      financeAgentRef.current.addMessage({ role: "user", content: query, id: crypto.randomUUID() })
      const { newMessages } = await financeAgentRef.current.runAgent()
      supervisorRef.current.addMessages(newMessages)

      return "Successfully called finance agent!"
    },
    render: ({status}) => {
      if (status !== "complete") {
        return <div className="animate-pulse">Calling finance agent...</div>
      }
      return null
    }
  }, [])

  // Define a frontend tool that can call the pirate agent and inject the response into the supervisor agent
  useFrontendTool({
    name: "callRoger",
    parameters: z.object({
      query: z.string(),
    }),
    handler: async ({query}) => {
      pirateAgentRef.current.addMessage({ role: "user", content: query, id: crypto.randomUUID() })
      const { newMessages } = await pirateAgentRef.current.runAgent()
      supervisorRef.current.addMessages(newMessages)

      return "Successfully called pirate agent!"
    },
    render: ({status}) => {
      if (status !== "complete") {
        return <div className="animate-pulse">Calling pirate agent...</div>
      }
      return null
    }
  })

  return (
      <CopilotChat className="w-1/2 h-full mx-auto" />
  );
}