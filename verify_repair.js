
import io from 'socket.io-client';

const socket = io('http://localhost:3000');
console.log("Connecting to Jarvis...");

socket.on('connect', () => {
    console.log("Connected!");

    // Trigger Scan
    console.log("Triggering System Scan...");
    socket.emit('chat:message', { message: 'system.scan' });
});

socket.on('repair:status', (data) => {
    console.log(`[STATUS] ${data.message}`);
});

socket.on('repair:progress', (data) => {
    // Only log every 10th file to avoid spam
    if (Math.random() > 0.9) console.log(`[SCAN] ... ${data.file}`);
});

socket.on('repair:complete', (report) => {
    console.log("\n=== SCAN COMPLETE ===");
    console.log(`Total Files: ${report.totalFiles}`);
    console.log(`Issues Found: ${report.issues.length}`);
    if (report.issues.length > 0) {
        console.log("Issues:", report.issues);
    } else {
        console.log("System Integrity: 100%");
    }

    console.log("\nDisconnecting...");
    socket.disconnect();
    process.exit(0);
});

socket.on('chat:response', (data) => {
    // console.log(`[CHAT] ${data.message}`);
});

setTimeout(() => {
    console.log("Timeout - No response.");
    process.exit(1);
}, 10000);
