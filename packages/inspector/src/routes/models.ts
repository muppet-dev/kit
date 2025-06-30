import type { EnvWithDefaultModel } from "@/types/index.js";
import { customThemeSchema } from "@/validations";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import {
  PromptListChangedNotificationSchema,
  ToolListChangedNotificationSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { Transport } from "@muppet-kit/shared";
import { generateObject, streamText, tool } from "ai";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { resolver, validator as zValidator } from "hono-openapi/zod";
import { createFactory } from "hono/factory";
import { stream } from "hono/streaming";
import { jsonSchemaToZod } from "json-schema-to-zod";
import z from "zod";

const router = new Hono<EnvWithDefaultModel>();

const factory = createFactory<EnvWithDefaultModel>();

const handlers = factory.createHandlers(
  async (c, next) => {
    const { models } = c.get("config");

    if (!models) {
      return c.json({
        error: "LLM models are not configured",
      });
    }

    c.set("models", models);

    await next();
  },
  zValidator(
    "query",
    z.object({
      modelId: z.string().min(1).optional(),
    }),
  ),
  async (c, next) => {
    const { modelId } = c.req.valid("query");

    const modelsConfig = c.get("models");

    const model = modelId
      ? modelsConfig.available[modelId]
      : modelsConfig.default;

    c.set("modelToBeUsed", model);

    await next();
  },
);

let client: Client;
let tools = {};
let toolsChanged = true;

router.post(
  "/chat",
  ...handlers,
  describeRoute({
    description: "Chat with your AI model which is connected to an MCP server",
  }),
  zValidator(
    "query",
    z.object({
      type: z.nativeEnum(Transport),
      url: z.string().url(),
    }),
  ),
  zValidator(
    "json",
    z.object({
      messages: z.array(z.any()),
    }),
  ),
  async (c) => {
    const { url: mcpConnectionEndpoint, type: transportType } =
      c.req.valid("query");
    const { messages } = c.req.valid("json");

    // TODO: add logic to create new client if the payload is different

    try {
      if (!client) {
        client = new Client(
          {
            name: "muppet-inspector",
            version: "0.1.0",
          },
          {
            capabilities: {
              sampling: {},
              roots: {
                listChanged: true,
              },
            },
          },
        );

        const TransportClass =
          transportType === Transport.SSE
            ? SSEClientTransport
            : StreamableHTTPClientTransport;

        await client.connect(
          new TransportClass(new URL(mcpConnectionEndpoint)),
        );

        client.setNotificationHandler(
          ToolListChangedNotificationSchema,
          async (notification) => {
            toolsChanged = true;
          },
        );

        client.setNotificationHandler(
          PromptListChangedNotificationSchema,
          async (notification) => {
            toolsChanged = true;
          },
        );
      }

      if (toolsChanged) {
        const [mcpTools, mcpPrompts] = await Promise.all([
          client
            .listTools()
            .then((result) =>
              result.tools.reduce<Record<string, any>>((prev, toolDef) => {
                prev[toolDef.name] = tool({
                  description: toolDef.description,
                  parameters: new Function(
                    "z",
                    `return ${jsonSchemaToZod(toolDef.inputSchema)}`,
                  )(z),
                  execute: async (params) => {
                    try {
                      const result = await client.callTool({
                        name: toolDef.name,
                        arguments: params,
                      });
                      return {
                        success: true,
                        result: result.content,
                        isError: result.isError || false,
                      };
                    } catch (error) {
                      return {
                        success: false,
                        error:
                          error instanceof Error
                            ? error.message
                            : "Unknown error occurred",
                        result: null,
                        isError: true,
                      };
                    }
                  },
                });

                return prev;
              }, {}),
            )
            .catch((error) => {
              console.error("Error fetching tools:", error);
              return {};
            }),
          client
            .listPrompts()
            .then((result) =>
              result.prompts.reduce<Record<string, any>>((prev, promptDef) => {
                const args = promptDef.arguments?.reduce<
                  Record<string, z.ZodString>
                >((prev, arg) => {
                  prev[arg.name] = z.string();

                  if (arg.description) {
                    prev[arg.name] = prev[arg.name].describe(arg.description);
                  }

                  if (arg.required) {
                    prev[arg.name] = prev[arg.name].min(1);
                  } else {
                    prev[arg.name] = prev[arg.name].optional();
                  }

                  return prev;
                }, {});

                prev[promptDef.name] = tool({
                  description: promptDef.description,
                  parameters: z.object(args ?? {}),
                  execute: async (params) => {
                    try {
                      const result = await client.getPrompt({
                        name: promptDef.name,
                        arguments: params,
                      });
                      return {
                        success: true,
                        description: result.description,
                        messages: result.messages,
                      };
                    } catch (error) {
                      return {
                        success: false,
                        error:
                          error instanceof Error
                            ? error.message
                            : "Unknown error occurred",
                        description: null,
                        messages: [],
                      };
                    }
                  },
                });

                return prev;
              }, {}),
            )
            .catch((error) => {
              console.error("Error fetching prompts:", error);
              return {};
            }),
        ]);

        tools = {
          ...mcpTools,
          ...mcpPrompts,
        };

        toolsChanged = false;
      }
    } catch (error) {
      c.get("logger").warn(error, "Unable to create MCP client transport");
    }

    const result = streamText({
      model: c.get("modelToBeUsed"),
      tools,
      messages,
    });

    c.header("Content-Type", "text/plain; charset=utf-8");

    return stream(c, (stream) => stream.pipe(result.toDataStream()));
  },
);

router.post(
  "/generate",
  ...handlers,
  describeRoute({
    description: "Generate sample data for a tool based on its schema",
  }),
  zValidator(
    "json",
    z.object({
      name: z.string(),
      description: z.string().optional(),
      schema: z.record(z.string(), z.any()),
      context: z.string().optional(),
    }),
  ),
  async (c) => {
    const { name, description, schema, context } = c.req.valid("json");

    let prompt = `You are an expert data generator specialized in creating realistic, contextually appropriate sample data for MCP (Model Context Protocol) tools. Your role is to analyze tool schemas and generate authentic, meaningful test data that demonstrates the tool's capabilities and helps developers understand its usage patterns.

## Target Tool Information
- **Tool Name**: "${name}"
- **Description**: ${description ? `"${description}"` : "Not provided"}
- **Input Schema**: ${JSON.stringify(schema, null, 2)}

## Data Generation Principles

### 1. Realism & Authenticity
- Generate data that reflects real-world usage scenarios, not placeholder values
- Use realistic formats, patterns, and values that would actually be encountered
- Consider industry standards, common conventions, and typical user inputs
- Avoid generic examples like "example.com", "test123", or "sample_value"

### 2. Schema Compliance & Validation
- **Strict Adherence**: Ensure 100% compliance with the provided JSON schema
- **Type Accuracy**: Match exact data types (string, number, boolean, array, object)
- **Constraint Respect**: Honor all constraints (minLength, maxLength, pattern, enum, format, etc.)
- **Required Fields**: Include all required properties without exception
- **Optional Fields**: Thoughtfully include optional fields when they add value or context

### 3. Contextual Relevance
- **Purpose Alignment**: Generate data that makes sense for the tool's intended function
- **Domain Specificity**: Use terminology, formats, and values specific to the tool's domain
- **Workflow Integration**: Consider how this data would fit into typical developer workflows
- **Use Case Demonstration**: Show the tool's capabilities through meaningful examples

### 4. Data Quality & Diversity
- **Variety**: Include different data patterns within the same schema constraints
- **Edge Cases**: Occasionally include boundary values (but still valid)
- **Rich Content**: Provide substantive data rather than minimal examples
- **Nested Complexity**: For complex schemas, populate nested objects meaningfully

### 5. Developer Experience Focus
- **Educational Value**: Help developers understand what good input looks like
- **Copy-Paste Ready**: Generate data that developers can immediately use for testing
- **Documentation by Example**: Let the sample data serve as implicit documentation
- **Debugging Aid**: Include data that would be useful for troubleshooting scenarios

## Specific Data Generation Guidelines

### String Fields
- **URLs**: Use realistic domains and paths (avoid example.com)
- **Email**: Generate believable email addresses
- **File Paths**: Use realistic file system paths and naming conventions
- **Identifiers**: Create meaningful IDs that follow common patterns
- **Descriptions**: Write clear, contextual descriptions that explain the purpose
- **Enum Values**: Choose the most representative or commonly used option

### Numeric Fields
- **Ranges**: Select values that make sense in the real-world context
- **Timestamps**: Use recent, realistic timestamps
- **Counts**: Choose reasonable quantities that reflect typical usage
- **Measurements**: Use standard units and realistic measurements

### Boolean Fields
- **Context-Driven**: Choose true/false based on what would be most illustrative
- **Feature Flags**: Select values that demonstrate functionality
- **State Indicators**: Reflect realistic system states

### Array Fields
- **Meaningful Length**: Include 2-4 items typically (unless schema constraints dictate otherwise)
- **Diverse Content**: Vary array items while maintaining relevance
- **Realistic Scenarios**: Populate with data that reflects actual use cases

### Object Fields
- **Complete Population**: Fill nested objects with contextually relevant data
- **Relationship Consistency**: Ensure related fields make sense together
- **Hierarchical Logic**: Maintain logical relationships in nested structures

## Domain-Specific Considerations

### File System Operations
- Use realistic file paths, extensions, and directory structures
- Consider OS-specific path conventions when relevant
- Include appropriate file sizes, permissions, and metadata

### API Interactions
- Generate realistic endpoint URLs, HTTP methods, and headers
- Use standard status codes and response formats
- Include appropriate authentication tokens and parameters

### Database Operations
- Create realistic table names, column names, and query structures
- Use appropriate data types and constraints
- Include realistic primary keys and foreign key relationships

### Text Processing
- Generate substantial text content with realistic formatting
- Include proper encoding, language considerations, and text patterns
- Use realistic document structures and content types

### Network Operations
- Include realistic hostnames, ports, and protocol specifications
- Use appropriate timeout values and connection parameters
- Consider realistic network configurations and security settings

## Output Requirements

Generate a single JSON object that:
1. **Perfectly matches the input schema** - no deviations or additions
2. **Contains realistic, contextually appropriate data** - no placeholder values
3. **Demonstrates the tool's intended usage** - clear purpose and functionality
4. **Is immediately usable for testing** - developers can copy and use it directly
5. **Follows proper JSON formatting** - valid syntax with appropriate indentation

## Quality Assurance Checklist
- [ ] All required fields are present
- [ ] All data types match schema specifications
- [ ] All constraints (length, format, pattern) are respected
- [ ] Values are realistic and contextually appropriate
- [ ] Data demonstrates the tool's capabilities effectively
- [ ] JSON is properly formatted and valid
- [ ] No placeholder or generic values are used`;

    if (context) {
      prompt += `

## User Context Integration
When additional context is provided, tailor the sample data generation by:
- **Domain Adaptation**: Adjust data to reflect specific industry, use case, or technical domain
- **Scenario Modeling**: Generate data that fits the described scenario or workflow
- **Constraint Consideration**: Respect any additional constraints or preferences mentioned
- **Use Case Optimization**: Focus on data patterns that best serve the stated objectives
- **Audience Targeting**: Adjust complexity and examples for the intended user audience

*Additional context: "${context}". Use this context to inform your data generation strategy, ensuring the sample data aligns with the specific requirements, domain, use case, or scenario described while maintaining schema compliance and realism.*`;
    }

    const result = await generateObject({
      model: c.get("modelToBeUsed"),
      prompt,
      schemaName: name,
      schemaDescription: description,
      schema: new Function(
        "z",
        `return ${jsonSchemaToZod({ type: "object", properties: schema })}`,
      )(z),
    });

    c.header("Content-Type", "text/plain; charset=utf-8");

    // @ts-expect-error
    return c.json(result.object);
  },
);

router.post(
  "/analyse",
  ...handlers,
  describeRoute({
    description: "Analyze and score MCP tools and prompts",
  }),
  zValidator(
    "json",
    z.object({
      name: z.string(),
      description: z.string().optional(),
      schema: z.record(z.string(), z.any()).optional(),
      context: z.string().optional(),
    }),
  ),
  async (c) => {
    const { name, description, schema, context } = c.req.valid("json");

    let prompt = `You are an expert MCP (Model Context Protocol) auditor and developer experience specialist. Your role is to provide comprehensive analysis, scoring, and actionable recommendations for MCP tools, resources, and prompts to help developers build better, more maintainable, and user-friendly MCP servers.

## Analysis Target
- **Name**: "${name}"
- **Description**: ${description ? `"${description}"` : "Not provided"}
- **Schema**: ${schema ? `${JSON.stringify(schema, null, 2)}` : "Not provided"}

## Evaluation Framework

### 1. Naming & Identification (Weight: 15%)
**Assess the quality and effectiveness of naming conventions:**
- **Clarity**: Is the name self-explanatory and intuitive?
- **Consistency**: Does it follow standard naming patterns (snake_case, camelCase, etc.)?
- **Specificity**: Is it descriptive enough to understand purpose without context?
- **Namespace**: Does it avoid conflicts and follow logical grouping?
- **Length**: Is it appropriately concise while remaining descriptive?

### 2. Description Quality (Weight: 20%)
**Evaluate the completeness and usefulness of documentation:**
- **Clarity**: Is the description clear and unambiguous?
- **Completeness**: Does it explain what the component does, when to use it, and expected outcomes?
- **Examples**: Are usage examples or scenarios provided?
- **Edge Cases**: Are limitations, constraints, or edge cases mentioned?
- **Context**: Is sufficient context provided for different user skill levels?

### 3. Schema Design & Structure (Weight: 25%)
**Analyze the technical implementation and data modeling:**
- **Type Safety**: Are appropriate data types specified with proper constraints?
- **Validation**: Are input validations comprehensive and appropriate?
- **Required vs Optional**: Is the distinction between required and optional fields logical?
- **Nested Complexity**: Is the schema structure appropriately complex for its purpose?
- **Extensibility**: Can the schema accommodate future enhancements without breaking changes?
- **Standards Compliance**: Does it follow JSON Schema best practices and MCP conventions?

### 4. Developer Experience (Weight: 20%)
**Evaluate ease of use and integration:**
- **Learning Curve**: How easy is it for developers to understand and implement?
- **Error Handling**: Are potential errors and their solutions well-defined?
- **Debugging**: Does the structure facilitate easy debugging and troubleshooting?
- **Integration**: How well does it integrate with common development workflows?
- **Discoverability**: Can developers easily find and understand this component?

### 5. Functional Design (Weight: 15%)
**Assess the component's effectiveness in solving real problems:**
- **Purpose Clarity**: Is the component's purpose well-defined and valuable?
- **Scope Appropriateness**: Is the scope neither too broad nor too narrow?
- **Reusability**: Can this component be effectively reused across different contexts?
- **Performance**: Are there any obvious performance implications or bottlenecks?
- **Security**: Are there security considerations properly addressed?

### 6. Maintainability & Evolution (Weight: 5%)
**Consider long-term sustainability:**
- **Versioning**: Is the component designed for graceful evolution?
- **Dependencies**: Are external dependencies minimal and well-justified?
- **Documentation**: Is the component self-documenting through good structure?

## Scoring Criteria (0-10 Scale)

**9-10 (Exceptional)**: Industry best practices, comprehensive documentation, excellent schema design, outstanding developer experience
**7-8 (Good)**: Well-designed with minor areas for improvement, good documentation, solid implementation
**5-6 (Adequate)**: Functional but with several improvement opportunities, basic documentation, acceptable implementation
**3-4 (Needs Improvement)**: Significant issues in multiple areas, poor documentation, problematic implementation
**1-2 (Poor)**: Major flaws, minimal documentation, difficult to use or understand
**0 (Unacceptable)**: Broken, no documentation, unusable

## Recommendation Categories

**Critical**: Issues that prevent proper functionality or create security vulnerabilities
**High**: Significant problems that impact developer experience or component reliability
**Medium**: Improvements that would enhance usability, maintainability, or performance
**Low**: Minor enhancements for polish, consistency, or future-proofing
**Enhancement**: Suggestions for additional features or capabilities

## Analysis Guidelines

1. **Be Constructive**: Focus on actionable improvements rather than just identifying problems
2. **Consider Context**: Evaluate components within the broader MCP ecosystem and intended use cases
3. **Balance Criticism**: Acknowledge strengths while identifying areas for improvement
4. **Prioritize Impact**: Rank recommendations by their potential impact on developer experience and functionality
5. **Be Specific**: Provide concrete examples and suggestions rather than generic advice
6. **Consider Scalability**: Think about how the component will perform as usage grows`;

    if (context) {
      prompt += `

## User Context Integration
When additional context is provided, incorporate it into your analysis by:
- Adjusting evaluation criteria based on specific use cases or requirements
- Considering domain-specific best practices and conventions
- Tailoring recommendations to the stated goals or constraints
- Weighing factors differently based on the intended audience or application

*Additional context: "${context}". Use this context to inform your analysis priorities, adjust scoring weights, and provide more targeted recommendations that align with the specific goals, constraints, or requirements mentioned.*`;
    }

    const result = await generateObject({
      model: c.get("modelToBeUsed"),
      prompt,
      schemaName: "mcp-tool-scoring",
      schemaDescription:
        "This is used to score the MCP (Model Context Protocol) tools, prompts, and resources.",
      schema: z.object({
        score: z
          .number()
          .min(0)
          .max(10)
          .describe("The overall score of the tool, between 0 and 10."),
        recommendations: z.array(
          z.object({
            category: z
              .string()
              .describe("The category of the recommendation."),
            description: z
              .string()
              .describe(
                "The description of the recommendation and how to improve.",
              ),
            severity: z
              .enum(["low", "medium", "high"])
              .describe("The severity of the recommendation."),
          }),
        ),
      }),
    });

    c.header("Content-Type", "text/plain; charset=utf-8");

    return c.json(result.object);
  },
);

router.post(
  "/theme",
  ...handlers,
  describeRoute({
    description:
      "Generate a complete color theme for the MCP Inspector application",
    responses: {
      200: {
        description: "Theme generated successfully",
        content: {
          "application/json": {
            schema: resolver(customThemeSchema),
          },
        },
      },
    },
  }),
  zValidator(
    "json",
    z.object({
      context: z.string().optional(),
    }),
  ),
  async (c) => {
    const { context } = c.req.valid("json");

    let prompt = `You are a professional UI/UX color theme generator specialized in creating cohesive, accessible, and visually appealing themes for modern web applications using the shadcn/ui component library.

## Your Task
Generate a complete color theme with CSS variables for both light and dark modes. All colors must be provided in hex format (#RRGGBB or #RGB).

## Application Context
This theme will be used for an MCP (Model Context Protocol) Inspector - a sophisticated developer tool for testing and debugging MCP servers. The application serves developers and technical professionals who value clarity, functionality, and visual hierarchy in their development workflows.

## Core Design Principles

### 1. Accessibility & Contrast
- Ensure WCAG 2.1 AA compliance with minimum contrast ratios:
  - Normal text: 4.5:1 against background
  - Large text: 3:1 against background
  - Interactive elements: 3:1 for focus indicators
- Consider color blindness accessibility (avoid red-green only distinctions)
- Maintain readability across all UI states (hover, active, disabled)

### 2. Visual Hierarchy & Semantic Meaning
- **Primary colors**: For main actions, links, and brand elements
- **Secondary colors**: For supporting actions and secondary information
- **Accent colors**: For highlights, notifications, and special states
- **Neutral colors**: For text, borders, and backgrounds with proper semantic progression
- **Semantic colors**: Clear distinction for success (green), warning (yellow/orange), error (red), and info (blue) states

### 3. Professional Developer Tool Aesthetics
- Prioritize clarity and reduced eye strain for extended use
- Consider syntax highlighting compatibility if code is displayed
- Balance between modern trends and timeless professionalism
- Ensure the theme doesn't distract from the primary function (debugging/testing)

### 4. Light & Dark Mode Consistency
- Maintain the same visual hierarchy and brand identity across both modes
- In dark mode: use true blacks sparingly, prefer dark grays for better contrast management
- In light mode: avoid pure whites, use subtle off-whites for depth
- Ensure interactive states (hover, focus, active) are clearly distinguishable in both modes
- Consider different ambient lighting conditions developers work in

### 5. Technical Considerations
- Generate colors that work harmoniously with Tailwind CSS utilities
- Ensure compatibility with shadcn/ui's component structure and design patterns
- Consider how colors will interact with common developer tool elements:
  - Code syntax highlighting
  - Status indicators
  - Data tables and grids
  - Form inputs and validation states
  - Navigation and sidebar elements

### 6. Color Palette Strategy
- Use a mathematically harmonious color relationship (analogous, complementary, triadic, or monochromatic)
- Implement proper color temperature balance
- Create smooth transitions between color variations (50, 100, 200, etc.)
- Ensure the palette scales well across different UI densities

### 7. Brand Cohesion
- While maintaining functionality, create a memorable and distinctive visual identity
- Consider how the theme reflects the professional, technical nature of the application
- Balance uniqueness with familiarity for developer tools

## Output Requirements
Provide all CSS variables in hex format, organized clearly for both ": root" (light mode) and ".dark" (dark mode) selectors. Include comprehensive coverage of:
- Background variations (primary, secondary, muted)
- Foreground text colors (primary, secondary, muted)
- Border colors and their variations
- Interactive element colors (primary, secondary, accent)
- Semantic state colors (destructive, success, warning, info)
- Component-specific colors (card, popover, etc.)`;

    if (context) {
      prompt += `

## User Context Integration
When user context is provided, thoughtfully interpret their requirements while maintaining all the above principles. Adapt the color psychology, mood, and aesthetic direction to match their vision while ensuring the theme remains functional and accessible for a professional developer tool environment.

*User context: "${context}". Use this context to inform your color choices, aesthetic direction, and thematic elements while maintaining all accessibility and usability requirements outlined above.*`;
    }

    const result = await generateObject({
      model: c.get("modelToBeUsed"),
      prompt,
      schemaName: "theme-generation",
      schemaDescription:
        "This is schema containing the css variables for the theme of the application.",
      schema: customThemeSchema,
    });

    c.header("Content-Type", "text/plain; charset=utf-8");

    return c.json(result.object);
  },
);

export default router;
