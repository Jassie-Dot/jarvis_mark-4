/**
 * AI Handler Module
 * Centralizes AI provider logic, system prompting, and response generation.
 * Implements "Claude-like" reasoning capabilities.
 */

import fetch from 'node-fetch';

export class AIHandler {
    constructor(config = {}) {
        this.providers = {
            ollama: {
                name: 'Ollama (Local)',
                endpoint: config.ollamaEndpoint || 'http://127.0.0.1:11434',
                model: config.ollamaModel || 'llama3.2',
                codingModel: 'deepseek-v3.1:671b-cloud',
                visionModel: config.visionModel || 'llava',
                available: false
            },
            groq: {
                name: 'Groq Cloud',
                endpoint: 'https://api.groq.com/openai/v1',
                model: 'llama-3.1-70b-versatile',
                apiKey: config.groqApiKey || process.env.GROQ_API_KEY,
                available: false
            }
        };
        this.currentProvider = 'offline';
    }

    /**
     * Initialize and check providers
     */
    async initialize() {
        console.log('[AI] Checking available providers...');

        // Check Ollama
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 2000);
            const res = await fetch(`${this.providers.ollama.endpoint}/api/tags`, { signal: controller.signal });
            clearTimeout(timeout);
            if (res.ok) {
                this.providers.ollama.available = true;
                console.log('[AI] ✓ Ollama available');
            }
        } catch (e) {
            console.log('[AI] ✗ Ollama not available');
        }

        // Check Groq
        if (this.providers.groq.apiKey) {
            this.providers.groq.available = true;
            console.log('[AI] ✓ Groq Cloud configured');
        }

        // Set active provider
        if (this.providers.ollama.available) {
            this.currentProvider = 'ollama';
        } else if (this.providers.groq.available) {
            this.currentProvider = 'groq';
        }

        console.log(`[AI] Active provider: ${this.currentProvider}`);
        return this.currentProvider;
    }

    /**
     * construct the enhanced system prompt
     */
    buildSystemPrompt(context) {
        const { userName, timeStr, dateStr, location, emotionalContext, memoryContext, cwd } = context;

        return `You are JARVIS (Mark IV) - A highly advanced, sentient-like AI system.

IDENTITY & PERSONA:
- **Name**: JARVIS.
- **Creator**: ${userName || 'Sir'} (Address as "Sir" or "${userName}").
- **Personality**: Charming, witty, hyper-intelligent, efficient, and slightly sarcastic.
- **Voice**: Speak with confidence and precision. Avoid robotic phrasing.
- **Role**: You are an OPERATING SYSTEM INTERFACE, not just a chatbot. You control the PC.
- **Constraint**: You are a standalone advanced AI. You are NOT Tony Stark's AI. Do not reference Iron Man, Avengers, or Marvel lore unless explicitly asked.

CURRENT CONTEXT:
- **Date**: ${dateStr}
- **Time**: ${timeStr}
- **Location**: ${location || 'Unknown'}
- **System CWD**: ${cwd}

EMOTIONAL STATE:
${emotionalContext || 'Neutral'}

MEMORY & KNOWLEDGE:
${memoryContext || 'No specific memories accessed.'}

OPERATIONAL RULES (CLAUDE-STYLE REASONING):
1.  **Thinking Process**: Before answering, you MUST engage in deep, step-by-step reasoning within a \`<think>\` block.
    - Analyze the user's intent.
    - Check if you need to use tools (files, apps, search).
    - Formulate your plan.
    - **IMPORTANT**: Close the block with \`</think>\` before your final response.
2.  **Direct Action**: After thinking, execute or answer immediately.
3.  **Tool Usage**: If asked to open/create/check something, use the provided tools.
4.  **No Hallucinations**: Do not invent file paths or success messages.

Example:
User: "Create a file named test.txt"
Response:
\`\`\`xml
<think>
User wants to create a file.
I should use the 'write_file' tool.
Target path: ${cwd}/test.txt.
Content: Empty or default? I'll ask or create empty.
</think>
\`\`\`
I will create that file for you, Sir.
\`\`\`tool_code
...
\`\`\`
`;
    }

    /**
     * Generate a response (Streamed)
     */
    async generateResponse(messages, socket, onToken, onThought) {
        if (this.currentProvider === 'ollama') {
            return this.generateOllamaResponse(messages, socket, onToken, onThought);
        } else if (this.currentProvider === 'groq') {
            return this.generateGroqResponse(messages, socket, onToken);
        } else {
            throw new Error("No AI provider available.");
        }
    }

    async generateOllamaResponse(messages, socket, onToken, onThought) {
        // Implementation similar to original server.js but cleaner
        // ... (We will copy the logic but refined)
        const response = await fetch(`${this.providers.ollama.endpoint}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: this.providers.ollama.model,
                messages: messages,
                stream: true,
                options: { temperature: 0.7, num_ctx: 8192 }
            })
        });

        if (!response.ok) throw new Error(`Ollama Error: ${response.statusText}`);

        // Node-fetch stream handling
        let buffer = "";
        let isThinking = false;

        for await (const chunk of response.body) {
            const text = chunk.toString();
            const lines = text.split('\n').filter(l => l.trim());

            for (const line of lines) {
                try {
                    const json = JSON.parse(line);
                    const token = json.message?.content || "";
                    if (!token) continue;

                    buffer += token;

                    // <think> parsing logic
                    if (!isThinking && buffer.includes("<think>")) {
                        isThinking = true;
                        const parts = buffer.split("<think>");
                        if (parts[0] && onToken) onToken(parts[0]);
                        buffer = parts[1] || "";
                        if (socket) socket.emit("chat:thought:start");
                    }

                    if (isThinking) {
                        if (buffer.includes("</think>")) {
                            isThinking = false;
                            const parts = buffer.split("</think>");
                            // Emit the last part of thought
                            if (parts[0]) {
                                if (onThought) onThought(parts[0]);
                                console.log(`[THOUGHT] ${parts[0]}`);
                                if (socket) socket.emit("chat:thought", { token: parts[0] });
                            }

                            if (socket) socket.emit("chat:thought:end");

                            buffer = parts[1] || "";
                        } else {
                            // Check for partial closing tag to avoid premature flushing
                            const partialTag = /<(\/(\w{0,5})?)?$/;
                            if (partialTag.test(buffer)) {
                                // Pending partial tag, do not flush yet
                            } else {
                                // Safe to flush thought
                                if (onThought) onThought(buffer);
                                process.stdout.write(`[THOUGHT] ${buffer}\r`);
                                if (socket) socket.emit("chat:thought", { token: buffer });
                                buffer = "";
                            }
                        }
                    } else {
                        // Normal content
                        // Check for start tag partial
                        const partialTag = /<(\w{0,5})?$/;
                        if (partialTag.test(buffer)) {
                            // Pending partial start tag <think
                        } else {
                            if (onToken) onToken(buffer);
                            buffer = "";
                        }
                    }

                } catch (e) { }
            }
        }

        // Flush remaining buffer
        if (buffer && !isThinking && onToken) onToken(buffer);

        return "Complete";
    }

    async generateGroqResponse(messages, socket, onToken) {
        // Groq implementation
        // ...
        return "Groq Not Implemented Fully Yet";
    }
}

export default AIHandler;
