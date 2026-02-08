
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

async function analyze() {
    console.log("=== JARVIS SYSTEM ANALYSIS ===");

    // 1. Health Check & Latency
    const start = props.now();
    try {
        const res = await fetch(`${BASE_URL}/api/health`);
        const data = await res.json();
        const latency = props.now() - start;
        console.log(`[HEALTH] Status: ${res.status} (${latency}ms)`);
        console.log(`[HEALTH] Payload:`, JSON.stringify(data, null, 2));
    } catch (e) {
        console.error(`[HEALTH] FAILED: ${e.message}`);
        return;
    }

    // 2. Intelligence/Reasoning Test
    console.log("\n[INTELLIGENCE] Testing Chain of Thought...");
    const question = "If I have 3 apples and eat 1, then buy 2 more, how many do I have?";
    const startChat = props.now();
    try {
        const res = await fetch(`${BASE_URL}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: question })
        });
        const data = await res.json();
        const duration = props.now() - startChat;

        console.log(`[CHAT] Response Time: ${duration}ms`);
        console.log(`[CHAT] Reply: ${data.reply}`);

        // Note: The thought process is logged on server side, we can't see it here easily 
        // without access to server stdout, but the reply quality indicates it.
    } catch (e) {
        console.error(`[CHAT] FAILED: ${e.message}`);
    }

    // 3. Plugin System
    try {
        const res = await fetch(`${BASE_URL}/api/apps`);
        const data = await res.json();
        console.log(`\n[SYSTEM] Apps Loaded: ${data.apps ? data.apps.length : 'N/A'}`);
    } catch (e) { }

    console.log("\n=== ANALYSIS COMPLETE ===");
}

// Polyfill for performance.now if needed, or just Date
const props = { now: () => Date.now() };

analyze();
