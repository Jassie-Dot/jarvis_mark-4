import plugin from './plugins/open-app.js';

async function test() {
    console.log("Initializing plugin...");
    await plugin.initialize();

    console.log("\n--- Test: Open Notepad (Static) ---");
    console.log(await plugin.handle({}, "open notepad"));

    console.log("\n--- Test: Open Calculator (Static) ---");
    console.log(await plugin.handle({}, "open calculator"));

    // Test a dynamic app (assuming something common like 'Clock' or 'Photos' or 'Camera' exists on Windows)
    console.log("\n--- Test: Open Clock (Dynamic) ---");
    console.log(await plugin.handle({}, "open clock"));

    console.log("\n--- Test: Open Non-existent App ---");
    console.log(await plugin.handle({}, "open xyzaappp"));
}

test();
