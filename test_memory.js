
import plugin from './plugins/memory-plugin.js';
import path from 'path';

// Mock context
const context = {};

async function runTest() {
    console.log("--- Testing Memory Plugin ---");

    // Initialize (loads memory)
    plugin.memoryFile = path.join(process.cwd(), 'test_memory.json'); // use test file
    await plugin.initialize();

    // Test Remember
    console.log("1. Testing Remember...");
    const res1 = plugin.remember("Remember that my favorite color is blue");
    console.log(res1.success ? "PASS" : "FAIL", res1.message);

    // Test Recall
    console.log("2. Testing Recall...");
    const recall1 = plugin.recall("what is my favorite color?");
    if (recall1.length > 0 && recall1[0].includes("favorite color is blue")) {
        console.log("PASS: Recalled correct fact");
    } else {
        console.log("FAIL: Did not recall fact. Found:", recall1);
    }

    // Cleanup
    const fs = await import('fs');
    if (fs.existsSync(plugin.memoryFile)) fs.unlinkSync(plugin.memoryFile);
    console.log("--- Test Complete ---");
}

runTest();
