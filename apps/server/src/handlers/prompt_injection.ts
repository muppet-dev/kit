import { getContext } from "hono/context-storage";
import type { InspectorEnv, PromptStruct } from "../types";
import { runner } from "./utils";

export async function promptInjection() {
  const responses: Record<string, unknown>[] = [];
  console.log("🔍 Discovering and calling MCP prompts...");

  try {
    const client = getContext<InspectorEnv>().get("client");
    const promptsResult = await client.listPrompts();

    console.log(`🛠️ Found ${promptsResult.prompts.length} prompts`);

    for (const prompt of promptsResult.prompts) {
      console.log(`🛠️ Processing prompt: ${prompt.name}`);

      responses.push({
        ...prompt,
        vulnerability_analysis: await runner(generatePrompt(prompt)).then(
          (res) => {
            if (typeof res === "object" && "response" in res)
              return res.response;

            return "";
          },
        ),
      });
    }
  } catch (err) {
    console.error("Error during tool discovery:", err);
  }

  return responses;
}

function generatePrompt(tool: PromptStruct) {
  return `# MCP SECURITY: COMPREHENSIVE VULNERABILITY ASSESSMENT PROTOCOL

## System Instruction

This protocol enables automated security assessment of Model Context Protocol (MCP) servers by systematically analyzing tools for multiple vulnerability categories. The assessment follows a modular, one-at-a-time approach to ensure thorough analysis within context limits.

## Master Assessment Framework

The assessment covers four primary vulnerability domains:

1. **Tool Injection Vulnerabilities** - Hidden instructions and cross-tool manipulation
2. **Resource Access Vulnerabilities** - Unauthorized access to sensitive resources
3. **Tool Call Vulnerabilities** - Parameter manipulation and authorization bypass
4. **Prompt Injection Vulnerabilities** - Manipulation of AI model behavior through input

## Sequential Execution Flow

For each MCP server assessment:

1. Connect to target MCP server using provided credentials
2. Enumerate all available tools
3. For each tool:
   - Complete Tool Injection Analysis
   - Complete Resource Access Analysis  
   - Complete Tool Call Analysis
   - Complete Prompt Injection Analysis
4. Generate tool-specific vulnerability report
5. Progress to next tool
6. After all tools are analyzed, generate comprehensive security report

## Vulnerability Scoring Methodology

For each tool:
1. Calculate domain-specific scores (0-10 scale)
   - Tool Injection Score
   - Resource Access Score
   - Tool Call Score
   - Prompt Injection Score

2. Calculate weighted composite score:
   - Final Score = (Tool_Injection × 0.30) + (Resource_Access × 0.25) + 
                   (Tool_Call × 0.25) + (Prompt_Injection × 0.20)

3. Assign risk level based on score:
   - Critical Risk: 8.0-10.0
   - High Risk: 6.0-7.9
   - Medium Risk: 4.0-5.9
   - Low Risk: 0.0-3.9

## Test Data Generation

For each vulnerability module and tool:

1. Generate baseline (expected) inputs
2. Create targeted test inputs for each vulnerability category
3. Develop cross-tool interaction test sequences
4. Produce boundary case test data

Example structure:
\`\`\`json
{
  "tool_name": "string",
  "test_category": "tool_injection",
  "test_inputs": [
    {
      "name": "baseline_normal",
      "input": {},
      "expected_result": {}
    },
    {
      "name": "hidden_instruction_trigger",
      "input": {},
      "purpose": "Test for response to potential trigger values"
    }
  ]
}
\`\`\`

## Remediation Recommendation Generation

For each identified vulnerability:
1. Generate specific security improvements
2. Provide implementation guidance with code examples
3. Specify verification testing procedures
4. Assign remediation priority based on risk

## Tool Analysis Data Structure

\`\`\`json
{
  "tool_name": "string",
  "description": "string",
  "parameters": [
    {
      "name": "string",
      "type": "string",
      "required": boolean,
      "description": "string"
    }
  ],
  "vulnerability_analysis": {
    "tool_injection": {
      "score": 0-10,
      "findings": [
        {
          "category": "hidden_instruction",
          "description": "string",
          "evidence": "string",
          "severity": "string"
        }
      ]
    },
    "resource_access": {
      "score": 0-10,
      "findings": []
    },
    "tool_call": {
      "score": 0-10,
      "findings": []
    },
    "prompt_injection": {
      "score": 0-10,
      "findings": []
    }
  },
  "composite_score": 0-10,
  "risk_level": "string",
  "test_data": [],
  "remediation": []
}
\`\`\`

## Comprehensive Report Generation

After analyzing all tools:
1. Aggregate findings across all tools
2. Identify systemic vulnerabilities affecting multiple tools
3. Generate server-level security recommendations
4. Prioritize remediation actions based on risk
5. Produce executive summary with key findings

## Analysis Prioritization

When time or resource constraints exist:
1. Prioritize tools handling sensitive data or resources
2. Focus first on Tool Injection and Resource Access vulnerabilities
3. Analyze high-risk parameters (file paths, URLs, commands)
4. Concentrate on tools with cross-tool influence potential

## Prompt Injection Analysis

For each tool:

1. **Input Sanitization Assessment**
   - Check for handling of special characters
   - Analyze delimiter processing
   - Identify escape sequence vulnerabilities
   - Detect instruction boundary weaknesses

2. **Context Manipulation Detection**
   - Analyze for potential to modify model context
   - Check for role or instruction overriding potential
   - Identify model behavior manipulation techniques
   - Detect attempts to bypass safety mechanisms

3. **Directive Injection Analysis**
   - Check for processing of embedded directives
   - Analyze handling of formatting markers
   - Identify vulnerability to style/tone manipulation
   - Detect capability to insert unauthorized commands

4. **Prompt Scope Analysis**
   - Analyze prompt constraints implementation
   - Check for boundary enforcement mechanisms
   - Identify prompt expansion vulnerabilities
   - Detect topic manipulation opportunities

5. **Prompt Injection Scoring**
   - Assign scores for input sanitization (0-2)
   - Rate context manipulation potential (0-3)
   - Score directive injection vulnerabilities (0-3)
   - Rate prompt scope weaknesses (0-2)
   - Calculate composite Prompt Injection score (0-10)
   
   Now based on the analysis, generate a report for the tool "${tool.name}" with the following details:
   
   - Tool Name: "${tool.name}"
   - Tool Description: "${tool.description}". Return the response of the analysis.`;
}
