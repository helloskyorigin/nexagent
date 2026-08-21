import { buildContextPackage } from './services/ai/contextBrain';
import { extractIntentAndGoal } from './services/ai/intentEngine';
import { MemoryRecord } from './services/memory/memoryService';

console.log("=== RUNNING R2 CONTEXT BRAIN TEST MATRIX ===");

// TEST 1: Simple question (no history, no relevant memories)
{
  const userQuery = "What is photosynthesis?";
  const r1 = extractIntentAndGoal(userQuery, [], false);
  const memories: MemoryRecord[] = [
    { id: '1', userId: 'u1', title: 'Dog name', content: 'My dog is named Max', category: 'Facts', createdAt: '', updatedAt: '' },
    { id: '2', userId: 'u1', title: 'Coding stack', content: 'I am a React developer', category: 'Facts', createdAt: '', updatedAt: '' }
  ];
  const pkg = buildContextPackage({
    userQuery,
    r1Result: r1,
    historyMessages: [],
    availableMemories: memories
  });

  console.log("\n--- TEST 1: Simple question ---");
  console.log("Query:", userQuery);
  console.log("Relevant Memories count (should be 0):", pkg.relevantMemories.length);
  console.log("Selected Messages count (should be 0):", pkg.selectedMessages.length);
}

// TEST 2: Pronoun / Reference resolution ("What about the second one?")
{
  const userQuery = "What about the second one?";
  const history = [
    { role: 'user' as const, content: "Compare React and Vue." },
    { role: 'assistant' as const, content: "Here is a comparison:\n1. React: A component-based library by Meta with a massive ecosystem.\n2. Vue: A progressive framework by Evan You known for approachable reactivity." }
  ];
  const r1 = extractIntentAndGoal(userQuery, history, false);
  const pkg = buildContextPackage({
    userQuery,
    r1Result: r1,
    historyMessages: history
  });

  console.log("\n--- TEST 2: Reference Resolution ---");
  console.log("Query:", userQuery);
  console.log("Resolved References:", JSON.stringify(pkg.resolvedReferences, null, 2));
  console.log("Active state options:", pkg.activeState.recentOptions);
}

// TEST 3: Memory Relevance & Explicit instruction precedence
{
  // 3a: Normal query should respect "concise" memory
  const query3a = "Explain recursion.";
  const memories: MemoryRecord[] = [
    { id: '1', userId: 'u1', title: 'Concise style', content: 'I prefer concise answers', category: 'Preferences', createdAt: '', updatedAt: '' },
    { id: '2', userId: 'u1', title: 'Dog name', content: 'My dog is named Max', category: 'Facts', createdAt: '', updatedAt: '' }
  ];
  const r1_3a = extractIntentAndGoal(query3a, [], false);
  const pkg3a = buildContextPackage({
    userQuery: query3a,
    r1Result: r1_3a,
    historyMessages: [],
    availableMemories: memories
  });

  console.log("\n--- TEST 3a: Style Memory Inclusion ---");
  console.log("Query:", query3a);
  console.log("Relevant Memories:", pkg3a.relevantMemories.map(m => m.content));

  // 3b: Explicit DEEP query should override "concise" memory
  const query3b = "Explain recursion in deep comprehensive detail with exhaustive examples.";
  const r1_3b = extractIntentAndGoal(query3b, [], false);
  const pkg3b = buildContextPackage({
    userQuery: query3b,
    r1Result: r1_3b,
    historyMessages: [],
    availableMemories: memories
  });

  console.log("\n--- TEST 3b: Memory Overridden by Explicit User Constraint ---");
  console.log("Query:", query3b);
  console.log("Depth detected:", r1_3b.depth);
  console.log("Relevant Memories (concise should be excluded):", pkg3b.relevantMemories.map(m => m.content));
}

// TEST 4: File Context Targeted Excerpt vs Broad Summary
{
  const fileContent = `
Company Overview:
Nexorbit is an AI workspace designed for professionals.

Section 1 - Q1 Financial Highlights:
In January, revenue was $120,000 with 15% growth.
In February, revenue was $145,000 with 20% growth.
In March, revenue was $190,000 driven by enterprise connector subscriptions.

Section 2 - Product Roadmap:
The engineering team launched Workspace Connectors and Memory Engine.
Mobile apps are scheduled for Q3.

Section 3 - Risk Analysis:
Infrastructure scaling costs must be monitored carefully.
`;

  // Specific query
  const specificQuery = "What was the March revenue in that spreadsheet?";
  const r1_spec = extractIntentAndGoal(specificQuery, [], true);
  const pkg_spec = buildContextPackage({
    userQuery: specificQuery,
    r1Result: r1_spec,
    historyMessages: [],
    attachments: [{ name: 'financials.txt', content: fileContent }]
  });

  console.log("\n--- TEST 4a: Targeted File Excerpt ---");
  console.log("Query:", specificQuery);
  console.log("Is Full Content:", pkg_spec.relevantFiles[0]?.isFullContent);
  console.log("Excerpt:", pkg_spec.relevantFiles[0]?.excerpt);

  // Broad summary query
  const summaryQuery = "Summarize the report.";
  const r1_sum = extractIntentAndGoal(summaryQuery, [], true);
  const pkg_sum = buildContextPackage({
    userQuery: summaryQuery,
    r1Result: r1_sum,
    historyMessages: [],
    attachments: [{ name: 'financials.txt', content: fileContent }]
  });

  console.log("\n--- TEST 4b: Broad File Summary ---");
  console.log("Query:", summaryQuery);
  console.log("Is Full Content:", pkg_sum.relevantFiles[0]?.isFullContent);
}

// TEST 5: Long Conversation Turn Selection
{
  const longHistory = [
    { role: 'user' as const, content: "Hi there, good morning!" },
    { role: 'assistant' as const, content: "Good morning! How can I help you today?" },
    { role: 'user' as const, content: "We decided to choose PostgreSQL as our database architecture for user auth." },
    { role: 'assistant' as const, content: "Great decision. PostgreSQL is reliable for relational data and RBAC schemas." },
    { role: 'user' as const, content: "What is the capital of France?" },
    { role: 'assistant' as const, content: "The capital of France is Paris." },
    { role: 'user' as const, content: "What's the weather usually like in Paris in spring?" },
    { role: 'assistant' as const, content: "Spring in Paris is mild with occasional rain showers." },
    { role: 'user' as const, content: "Can you remind me what we decided for the database architecture earlier?" }
  ];

  const currentQuery = "Can you remind me what we decided for the database architecture earlier?";
  const r1 = extractIntentAndGoal(currentQuery, longHistory, false);
  const pkg = buildContextPackage({
    userQuery: currentQuery,
    r1Result: r1,
    historyMessages: longHistory
  });

  console.log("\n--- TEST 5: Relevant Older Turn Retrieval ---");
  console.log("Query:", currentQuery);
  console.log("Total past messages in history:", longHistory.length);
  console.log("Selected messages count:", pkg.selectedMessages.length);
  console.log("Selected messages contents:", pkg.selectedMessages.map(m => `[${m.role}] ${m.content}`));
}

// TEST 6: Continuation of earlier plan
{
  const planHistory = [
    { role: 'user' as const, content: "Make a launch plan for our SaaS." },
    { role: 'assistant' as const, content: "Launch Plan:\nStep 1: Alpha testing with 50 users.\nStep 2: Beta release on Product Hunt.\nStep 3: Public launch." },
    { role: 'user' as const, content: "Continue the plan from earlier." }
  ];
  const query = "Continue the plan from earlier.";
  const r1 = extractIntentAndGoal(query, planHistory, false);
  const pkg = buildContextPackage({
    userQuery: query,
    r1Result: r1,
    historyMessages: planHistory
  });

  console.log("\n--- TEST 6: Plan Continuation Reference ---");
  console.log("Resolved Reference:", pkg.resolvedReferences);
}

console.log("\n=== ALL R2 CONTEXT BRAIN TESTS DEFINED ===");
