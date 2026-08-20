import { NextRequest, NextResponse } from "next/server";
import { getMemories, createMemory } from "@/services/memory/memoryService";

export async function POST(req: NextRequest) {
  try {
    const { prompt, messages, webSearchEnabled, attachments, userId, memoryEnabled } = await req.json();

    const apiKey = process.env.GROQ_API_KEY;
    const braveApiKey = process.env.BRAVE_SEARCH_API_KEY;
    
    if (!apiKey) {
      console.error("[Backend Config Error] GROQ_API_KEY environment variable is missing.");
      return NextResponse.json(
        { error: "Service configuration missing", text: "Something went wrong. Please try again." },
        { status: 500 }
      );
    }

    // 1. Build initial messages array
    const formattedMessages = [];

    // Extract and format file context if present
    let fileContext = "";
    if (attachments && Array.isArray(attachments) && attachments.length > 0) {
      fileContext = "ATTACHED FILES CONTENT FOR ANALYSIS:\n\n";
      attachments.forEach((file: any) => {
        if (file.content) {
          fileContext += `### File: ${file.name} ###\n${file.content}\n\n`;
        }
      });
      fileContext += "\nINSTRUCTIONS: Prioritize the information in these attached files. If the user asks a question about these files, answer accurately based ONLY on the provided text. If the answer is not in the files, say so. Do not invent information.";
    }

    if (Array.isArray(messages) && messages.length > 0) {
      formattedMessages.push(...messages.map((m: any) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      })));
    } else if (prompt) {
      formattedMessages.push({ role: 'user', content: prompt });
    } else {
      return NextResponse.json({ error: "Prompt or messages required" }, { status: 400 });
    }

    // 2. Decide if we need web search
    let requiresWebSearch = webSearchEnabled === true;
    
    if (!requiresWebSearch && braveApiKey && prompt) {
      // Automatic detection (Fast decision)
      try {
        const decisionRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "openai/gpt-oss-120b",
            messages: [
              { role: "system", content: "You decide if a query requires up-to-date web search. Respond with 'YES' if it asks about current events, news, recent facts, weather, live data, or very specific obscure facts that require lookup. Respond with 'NO' if it is a general coding question, math, writing task, casual chat, or general knowledge." },
              { role: "user", content: prompt }
            ],
            temperature: 0,
            max_tokens: 5,
          }),
        });
        if (decisionRes.ok) {
          const decisionData = await decisionRes.json();
          const decisionText = decisionData.choices?.[0]?.message?.content?.trim().toUpperCase() || 'NO';
          if (decisionText.includes('YES')) requiresWebSearch = true;
        }
      } catch (e) {
        console.error("Failed to route search decision", e);
      }
    }

    // 3. Perform Web Search if needed
    let searchContext = "";
    let extractedSources: any[] = [];
    
    if (requiresWebSearch) {
      if (!braveApiKey) {
        // We lack the key, just proceed normally
        console.warn("BRAVE_SEARCH_API_KEY missing, skipping web search.");
      } else {
        try {
          // Determine freshness dynamically based on prompt (basic heuristic)
          let freshness = "";
          const pLower = prompt.toLowerCase();
          if (pLower.includes("today") || pLower.includes("latest") || pLower.includes("current")) {
            freshness = "pd"; // past day
          } else if (pLower.includes("this week")) {
            freshness = "pw"; // past week
          }
          
          const braveUrl = new URL("https://api.search.brave.com/res/v1/web/search");
          braveUrl.searchParams.set("q", prompt);
          braveUrl.searchParams.set("count", "5");
          if (freshness) braveUrl.searchParams.set("freshness", freshness);

          const searchRes = await fetch(braveUrl.toString(), {
            headers: {
              "Accept": "application/json",
              "Accept-Encoding": "gzip",
              "X-Subscription-Token": braveApiKey
            }
          });

          if (searchRes.ok) {
            const searchData = await searchRes.json();
            const results = searchData.web?.results || [];
            
            if (results.length > 0) {
              searchContext = "WEB SEARCH RESULTS FOR CONTEXT:\n\n";
              results.forEach((r: any, idx: number) => {
                const domainId = new URL(r.url).hostname.replace('www.', '');
                extractedSources.push({
                  id: `web-${idx}`,
                  connector: 'web',
                  connectorName: domainId,
                  title: r.title,
                  url: r.url,
                  domain: domainId,
                  snippet: r.description
                });
                searchContext += `Source [${idx + 1}]:\nTitle: ${r.title}\nURL: ${r.url}\nSnippet: ${r.description}\n\n`;
              });
              searchContext += "\nINSTRUCTIONS: Use the above sources to answer the query accurately. Prioritize this information. Avoid inventing facts. If sources disagree, mention it. ALWAYS cite your factual claims using inline brackets corresponding to the source number, like [1] or [2]. DO NOT dump the snippets directly; synthesize the answer.";
            }
          }
        } catch (e) {
          console.error("Brave search failed", e);
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

    // 4. Memory Integration
    if (memoryEnabled && userId) {
      const userMemories = await getMemories(userId);
      if (userMemories.length > 0) {
        let memoryText = "\n\nRELEVANT USER MEMORIES (Stable preferences & facts):\n";
        userMemories.forEach(m => {
          memoryText += `- ${m.content}\n`;
        });
        memoryText += "\nINSTRUCTIONS: Silently respect these preferences in your response. Do not mention them unless asked.";
        systemContent += memoryText;
      }
      
      systemContent += `\n\nMEMORY DETECTION INSTRUCTIONS:
If the user shares a STABLE, USEFUL long-term preference, goal, or personal fact (e.g. "I prefer concise answers", "I am a senior React dev", "My goal is to learn Python"), acknowledge it naturally and then output exactly this hidden tag at the very end of your response: |||MEMORY_SAVE: [concise memory text]|||. 
DO NOT save temporary session context, transient facts, or sensitive info (passwords, keys). 
ONLY save information that helps you be more useful in future sessions.`;
    }

    formattedMessages.unshift({
      role: 'system',
      content: systemContent
    });

    // 5. Query the Groq endpoint with streaming enabled
    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: formattedMessages,
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
