import { NextRequest, NextResponse } from "next/server";
import { getMemories, createMemory } from "@/services/memory/memoryService";
import { extractIntentAndGoal } from "@/services/ai/intentEngine";
import { buildContextPackage, ChatMessageItem } from "@/services/ai/contextBrain";
import { routeEvidenceAndTools } from "@/services/ai/evidenceRouter";
import { generateResponseStrategy } from "@/services/ai/responseStrategy";
import { evaluateDeepThinkPolicy } from "@/services/ai/deepThinkEngine";

// Deterministic helper for intelligent auto web search
function shouldAutoSearch(query: string): boolean {
  if (!query || query.trim().length === 0) return false;

  const q = query.trim().toLowerCase();

  // 1. Exclude simple greetings & casual conversation
  if (/^(hi|hello|hey|greetings|good (morning|afternoon|evening)|how are you|who are you|what is your name|thanks|thank you)(\s*|\!|\.|\?)*$/.test(q)) {
    return false;
  }

  // 2. Exclude common coding/syntax queries unless explicit live docs/versions requested
  if (
    /^(how to|how do i|write a|create a|implement|function|code|class|component|script|css|html|regex|sql query)/.test(q) &&
    !/(latest version|new features in|released in|documentation for|current api|breaking changes)/.test(q)
  ) {
    if (/in (javascript|typescript|python|java|c\+\+|c#|react|next\.js|node|rust|go|php|ruby|swift|kotlin|git|bash|docker|css|html|sql)/.test(q)) {
      return false;
    }
  }

  // 3. Exclude math & basic calculation requests
  if (/^(\d+[\+\-\*\/\^%\s\(\)]+)+\d+$/.test(q) || /^solve\s+/i.test(q) || /^calculate\s+/i.test(q) || /^evaluate\s+/i.test(q)) {
    return false;
  }

  // 4. Exclude creative writing / transformation requests without live context
  if (/^(write a|compose a|draft a|write an|summarize|rewrite|translate|rephrase|paraphrase|proofread|format|explain the code)/.test(q) && !/(news|article|event|today|latest|current)/.test(q)) {
    return false;
  }

  // 5. Exclude static conceptual explanations
  if (/^explain\s+(photosynthesis|gravity|relativity|quantum|evolution|calculus|thermodynamics|mitosis|dna)/.test(q)) {
    return false;
  }

  // POSITIVE SIGNALS FOR AUTO SEARCH:

  // Explicit search intent phrases
  if (/(search (for|the web|online)|look up|find online|check online|google|browse for|search web)/.test(q)) {
    return true;
  }

  // Temporal & freshness indicators
  if (/\b(today('s)?|tonight|yesterday|this week|this month|this year|right now|currently|latest|breaking news|up to date|recent|recently|live|2025|2026)\b/.test(q)) {
    return true;
  }

  // Real-time facts, financial, weather, sports & current state indicators
  if (
    /\b(weather|forecast|stock price|exchange rate|crypto|bitcoin|ethereum|market price|sports score|who won|match result|standings|election|winner|release date|movie times|flight status|current price|how much is|current ceo|current president|current prime minister|current governor|current status|score of)\b/.test(q)
  ) {
    return true;
  }

  // News & real-world events
  if (/\b(news|headline|event|announcement|launch of|scandal|happened (to|in|at)|what is happening|current situation)\b/.test(q)) {
    return true;
  }

  return false;
}

export async function POST(req: NextRequest) {
  try {
    const { prompt, messages, webSearchEnabled, attachments, userId, memoryEnabled, deepThinkEnabled } = await req.json();

    const apiKey = process.env.GROQ_API_KEY;
    const braveApiKey = process.env.BRAVE_SEARCH_API_KEY;
    
    if (!apiKey) {
      console.error("[Backend Config Error] GROQ_API_KEY environment variable is missing.");
      return NextResponse.json(
        { error: "Service configuration missing", text: "Something went wrong. Please try again." },
        { status: 500 }
      );
    }

    // 1. Build initial raw messages array
    const rawMessages: ChatMessageItem[] = [];

    if (Array.isArray(messages) && messages.length > 0) {
      rawMessages.push(...messages.map((m: any) => ({
        role: (m.sender === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
        content: m.text || '',
      })));
    } else if (prompt) {
      rawMessages.push({ role: 'user', content: prompt });
    } else {
      return NextResponse.json({ error: "Prompt or messages required" }, { status: 400 });
    }

    const userQuery = (
      prompt ||
      (rawMessages.filter((m) => m.role === "user").slice(-1)[0]?.content || "")
    ).trim();

    // 2. Fetch Stored Memories if enabled
    let userMemories: any[] = [];
    if (memoryEnabled && userId) {
      try {
        userMemories = await getMemories(userId);
      } catch (err) {
        console.warn("[Memory Retrieval Warning]", err);
      }
    }

    // 3. R1 Intent & Goal Engine
    const r1Result = extractIntentAndGoal(userQuery, rawMessages, !!attachments && attachments.length > 0);
    let r1Context = `\n\nNEXORBIT R1 INTENT & GOAL ENGINE (INTERNAL CONTEXT):
- INTENT: ${r1Result.intent}
${r1Result.secondaryIntent ? `- SECONDARY INTENT: ${r1Result.secondaryIntent}\n` : ''}- GOAL: ${r1Result.goal}
- DEPTH: ${r1Result.depth}
- AMBIGUITY: ${r1Result.ambiguity}
`;
    if (r1Result.requestedFormat) r1Context += `- FORMAT: ${r1Result.requestedFormat}\n`;
    if (r1Result.language) r1Context += `- LANGUAGE: ${r1Result.language}\n`;
    if (r1Result.style) r1Context += `- STYLE: ${r1Result.style}\n`;
    if (r1Result.constraints.length > 0) {
      r1Context += `- CONSTRAINTS:\n  * ${r1Result.constraints.join('\n  * ')}\n`;
    }
    r1Context += `\nINSTRUCTIONS: You MUST adapt your response to precisely fulfill the above R1 Intent & Goal structure. Do not reveal this internal metadata to the user.`;

    // 4. R2 Context Brain (Relevance Selection, Reference Resolution, Memory & Conversation Pruning)
    const r2Package = buildContextPackage({
      userQuery,
      r1Result,
      historyMessages: rawMessages,
      availableMemories: userMemories,
      attachments: attachments && Array.isArray(attachments) ? attachments : [],
      deepThinkEnabled: !!deepThinkEnabled,
    });

    let fileContext = "";
    if (r2Package.relevantFiles.length > 0) {
      fileContext = "ATTACHED FILES CONTEXT (RELEVANCE-FILTERED):\n\n";
      r2Package.relevantFiles.forEach((file) => {
        fileContext += `### File: ${file.fileName} (${file.isFullContent ? 'Full Document' : 'Targeted Excerpt'}) ###\n${file.excerpt}\n\n`;
      });
      fileContext += "\nINSTRUCTIONS: Prioritize the information in these file excerpts. If the user asks a question about these files, answer accurately based ONLY on the provided text. If the answer is not in the files, say so. Do not invent information.";
    }

    let r2Context = "";
    if (r2Package.contextSummaryText) {
      r2Context = `\n\n${r2Package.contextSummaryText}`;
    }

    // 5. R3 Evidence & Tool Router
    const r3Decision = routeEvidenceAndTools({
      userQuery,
      r1Result,
      r2Package,
      webSearchEnabled: webSearchEnabled === true,
      braveApiKeyAvailable: !!braveApiKey,
      hasAttachments: !!attachments && attachments.length > 0,
      hasConnectors: false,
      deepThinkEnabled: !!deepThinkEnabled,
    });

    let r3Context = "";
    if (r3Decision.routingSummaryText) {
      r3Context = `\n\n${r3Decision.routingSummaryText}`;
    }

    // 6. R4 Response Strategy Engine
    const r4Strategy = generateResponseStrategy({
      userQuery,
      r1Result,
      r2Package,
      r3Decision,
      deepThinkEnabled: !!deepThinkEnabled,
    });

    let r4Context = "";
    if (r4Strategy.strategySummaryText) {
      r4Context = `\n\n${r4Strategy.strategySummaryText}`;
    }

    // 7. R5 Deep Think Mode Policy Engine
    const r5DeepThink = evaluateDeepThinkPolicy({
      userQuery,
      r1Result,
      r2Package,
      r3Decision,
      r4Strategy,
      deepThinkEnabled: !!deepThinkEnabled,
    });

    // 6. Perform Web Search if planned by R3 router
    let searchContext = "";
    let extractedSources: any[] = [];
    const requiresWebSearch = r3Decision.tools.includes('brave_search') || r3Decision.primarySources.includes('WEB');
    
    if (requiresWebSearch && userQuery) {
      if (!braveApiKey) {
        console.warn("[Web Search] BRAVE_SEARCH_API_KEY environment variable is not configured.");
        searchContext = `\nWEB SEARCH NOTICE: Web search was requested, but live search provider is temporarily unconfigured. Answer based on your knowledge while noting live web data is unavailable.`;
      } else {
        try {
          // Determine freshness dynamically based on query keywords
          let freshness = "";
          const pLower = userQuery.toLowerCase();
          if (pLower.includes("today") || pLower.includes("latest") || pLower.includes("current") || pLower.includes("breaking") || pLower.includes("live") || pLower.includes("now")) {
            freshness = "pd"; // past day
          } else if (pLower.includes("this week") || pLower.includes("yesterday") || pLower.includes("recent")) {
            freshness = "pw"; // past week
          } else if (pLower.includes("this month") || pLower.includes("this year") || pLower.includes("2026") || pLower.includes("2025")) {
            freshness = "pm"; // past month
          }
          
          const braveUrl = new URL("https://api.search.brave.com/res/v1/web/search");
          braveUrl.searchParams.set("q", userQuery);
          braveUrl.searchParams.set("count", "5");
          braveUrl.searchParams.set("text_decorations", "0");
          braveUrl.searchParams.set("search_lang", "en");
          if (freshness) braveUrl.searchParams.set("freshness", freshness);

          // Use AbortController for reliable 8s timeout
          const searchController = new AbortController();
          const searchTimeout = setTimeout(() => searchController.abort(), 8000);

          const searchRes = await fetch(braveUrl.toString(), {
            method: "GET",
            headers: {
              "Accept": "application/json",
              "Accept-Encoding": "gzip",
              "X-Subscription-Token": braveApiKey.trim(),
            },
            signal: searchController.signal,
          });

          clearTimeout(searchTimeout);

          if (searchRes.ok) {
            const searchData = await searchRes.json();
            const results = searchData.web?.results || [];
            
            const cleanText = (str: string) => {
              if (!str) return "";
              return str
                .replace(/<\/?[^>]+(>|$)/g, "")
                .replace(/&amp;/g, "&")
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
                .replace(/&apos;/g, "'")
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .replace(/\s+/g, " ")
                .trim();
            };

            if (results.length > 0) {
              searchContext = "WEB SEARCH RESULTS FOR CONTEXT (Retrieved in real-time from verified sources):\n\n";
              results.forEach((r: any, idx: number) => {
                let domainId = "web";
                try {
                  if (r.url) {
                    domainId = new URL(r.url).hostname.replace(/^www\./, "");
                  }
                } catch {
                  domainId = "web";
                }

                const cleanedTitle = cleanText(r.title) || domainId;
                const rawSnippet = cleanText(r.description || r.snippet || "");
                const snippet = rawSnippet.length > 320 ? rawSnippet.substring(0, 317) + "..." : rawSnippet;
                const publishedDate = r.page_age || r.published_time || undefined;

                const sourceItem = {
                  id: `web-${idx + 1}`,
                  connector: 'web',
                  connectorName: domainId,
                  title: cleanedTitle,
                  url: r.url || "",
                  domain: domainId,
                  snippet: snippet,
                  rank: idx + 1,
                  publishedDate: publishedDate,
                  favicon: r.profile?.img || `https://www.google.com/s2/favicons?domain=${domainId}&sz=32`,
                };

                extractedSources.push(sourceItem);
                searchContext += `Source [${idx + 1}]:\nTitle: ${sourceItem.title}\nDomain: ${domainId}\nURL: ${sourceItem.url}\n${publishedDate ? `Published: ${publishedDate}\n` : ""}Snippet: ${sourceItem.snippet}\n\n`;
              });

              searchContext += `\nWEB SEARCH SYNTHESIS INSTRUCTIONS:
1. Ground your answer primarily in the verified facts and details provided in the search sources above.
2. Synthesize the findings into a clear, cohesive, and direct answer. Do not blindly copy-paste snippets or dump bulleted excerpts.
3. Do NOT hallucinate or extrapolate facts beyond what the search results substantiate.
4. Do NOT invent fake URLs or sources.
5. If the sources conflict on a detail, neutrally highlight the disagreement.
6. If the search results are insufficient to fully answer the query, clearly state what is verified by the sources and what remains unknown.
7. Maintain Nexorbit's natural tone, style, and concise formatting.`;
            } else {
              searchContext = `\nWEB SEARCH CONTEXT:
The real-time web search for "${userQuery}" returned zero live results.
INSTRUCTIONS:
- State clearly that live search yielded no results for this specific query.
- Do not invent facts, fabricate sources, or pretend information was web-verified.
- Provide a helpful response based on your general knowledge if applicable, noting that it is not verified with live web data.`;
            }
          } else {
            console.warn(`[Web Search] Brave Search API returned HTTP ${searchRes.status}`);
            searchContext = `\nWEB SEARCH NOTICE: Live web search provider returned status ${searchRes.status}. Answer based on your knowledge while noting real-time web data could not be fetched.`;
          }
        } catch (e: any) {
          if (e?.name === 'AbortError') {
            console.warn("[Web Search] Brave Search request timed out.");
            searchContext = `\nWEB SEARCH NOTICE: Real-time search timed out. Answer based on your knowledge while noting live search is unavailable.`;
          } else {
            console.error("[Web Search] Brave search network error:", e?.message || e);
            searchContext = `\nWEB SEARCH NOTICE: Real-time search network issue. Answer based on your knowledge while noting live search is unavailable.`;
          }
        }
      }
    }

    // 4. Insert system prompt
    let systemContent = `You are Nexorbit, a calm, intelligent AI workspace assistant.

RESPONSE BREVITY & STYLE MANDATES:
1. BREVITY & CONVERSATIONAL TONE:
   - Simple questions: Answer directly in 2-4 concise, well-crafted sentences.
   - Medium questions: Provide clear explanations with minimal filler.
   - Complex tasks: Provide structured answers only as detailed as necessary.
   - Sound natural and helpful. Never sound like a rigid report generator.
   - Never repeat the user's question, restate obvious context, or add canned introductions ("Here is...", "Sure!") or wrap-up filler ("Hope this helps!").
   - Do NOT automatically force "Takeaway", "Summary", or "Conclusion" headers onto every answer.

2. INTELLIGENT FORMATTING:
   - Use plain paragraphs when prose is sufficient.
   - Use bullet points when listing distinct items.
   - Use numbered lists ONLY for sequential instructions or steps.
   - Use Markdown tables ONLY when presenting comparative or tabular data. Never use ASCII tables or random pipe characters in text.
   - Use headings (##, ###) ONLY when a response genuinely contains multiple distinct logical sections. Keep headings short and functional.

3. CODE & TECHNICAL CONTENT:
   - Always place programming code inside fenced code blocks with the appropriate language tag.
   - Use inline code formatting (\`code\`) for variables, terminal commands, or short technical terms.`;

    if (searchContext) {
      systemContent += `\n\n${searchContext}`;
    }

    if (fileContext) {
      systemContent += `\n\n${fileContext}`;
    }

    if (r1Context) {
      systemContent += `${r1Context}`;
    }

    if (r2Context) {
      systemContent += `${r2Context}`;
    }

    if (r3Context) {
      systemContent += `${r3Context}`;
    }

    if (r4Context) {
      systemContent += `${r4Context}`;
    }

    if (r5DeepThink.systemPromptAddendum) {
      systemContent += `${r5DeepThink.systemPromptAddendum}`;
    }

    // Memory Detection Instructions
    if (memoryEnabled && userId) {
      systemContent += `\n\nMEMORY DETECTION INSTRUCTIONS:
If the user shares a STABLE, USEFUL long-term preference, goal, or personal fact (e.g. "I prefer concise answers", "I am a senior React dev", "My goal is to learn Python"), acknowledge it naturally and then output exactly this hidden tag at the very end of your response: |||MEMORY_SAVE: [concise memory text]|||. 
DO NOT save temporary session context, transient facts, or sensitive info (passwords, keys). 
ONLY save information that helps you be more useful in future sessions.`;
    }

    // Assemble final messages for GPT-OSS 120B
    const finalMessages: ChatMessageItem[] = [
      {
        role: 'system',
        content: systemContent,
      },
      ...r2Package.selectedMessages,
    ];

    // Ensure the current user prompt is present at the end of the conversation if not already
    const lastSelected = finalMessages[finalMessages.length - 1];
    if (!lastSelected || lastSelected.role !== 'user' || lastSelected.content !== userQuery) {
      finalMessages.push({ role: 'user', content: userQuery });
    }

    // 6. Query the Groq endpoint with streaming enabled
    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: finalMessages,
        stream: true,
      }),
    });

    if (!groqResponse.ok) {
      const errText = await groqResponse.text();
      console.error("Groq API error response:", errText);
      return NextResponse.json(
        { error: "Provider communication error", text: "Something went wrong. Please try again." },
        { status: 502 }
      );
    }

    // 6. Set up the streaming response
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    let fullResponse = "";
    let streamedLength = 0;

    const stream = new ReadableStream({
      async start(controller) {
        // Send sources preamble if we have sources
        if (extractedSources.length > 0) {
          controller.enqueue(encoder.encode(JSON.stringify(extractedSources) + '|||__SOURCES_END__|||'));
        }

        const reader = groqResponse.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        let buffer = "";
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed) continue;
              if (trimmed.startsWith("data: ")) {
                const dataStr = trimmed.slice(6).trim();
                if (dataStr === "[DONE]") continue;

                try {
                  const json = JSON.parse(dataStr);
                  const content = json.choices?.[0]?.delta?.content || "";
                  if (content) {
                    fullResponse += content;
                    
                    // Stream everything except the last 25 chars to avoid leaking the memory tag start
                    if (!fullResponse.includes("|||MEMORY_SAVE:")) {
                      const safeLength = Math.max(0, fullResponse.length - 25);
                      if (safeLength > streamedLength) {
                        controller.enqueue(encoder.encode(fullResponse.substring(streamedLength, safeLength)));
                        streamedLength = safeLength;
                      }
                    }
                  }
                } catch (e) {}
              }
            }
          }
          
          // Yield any final remaining buffer content
          if (buffer && buffer.startsWith("data: ")) {
            const dataStr = buffer.slice(6).trim();
            if (dataStr !== "[DONE]") {
              try {
                const json = JSON.parse(dataStr);
                const content = json.choices?.[0]?.delta?.content || "";
                if (content) {
                  fullResponse += content;
                }
              } catch (e) {}
            }
          }

          // Final flush of the visible response
          if (!fullResponse.includes("|||MEMORY_SAVE:")) {
            if (fullResponse.length > streamedLength) {
              controller.enqueue(encoder.encode(fullResponse.substring(streamedLength)));
            }
          } else {
            const tagIndex = fullResponse.indexOf("|||MEMORY_SAVE:");
            if (tagIndex > streamedLength) {
              controller.enqueue(encoder.encode(fullResponse.substring(streamedLength, tagIndex)));
            }
          }

          // Handle memory saving in background
          if (memoryEnabled && userId && fullResponse.includes("|||MEMORY_SAVE:")) {
            const match = fullResponse.match(/\|\|\|MEMORY_SAVE:\s*(.*?)\|\|\|/);
            if (match && match[1]) {
              const memoryContent = match[1].trim();
              createMemory({
                userId,
                content: memoryContent,
                category: 'Preferences',
                source: 'Chat'
              }).catch(e => console.error("Background memory save failed", e));
            }
          }
        } catch (error) {
          console.error("Streaming decode or network failure:", error);
          controller.error(error);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });

  } catch (error: any) {
    console.error("Next.js Chat Server Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", text: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
