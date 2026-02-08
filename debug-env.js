import "dotenv/config";

console.log("--- ENV DEBUGGER ---");
console.log(`Email:    '${process.env.EMAIL_USER}'`);
const pass = process.env.EMAIL_PASS || "";
console.log(`Password: '${pass.substring(0, 3)}...${pass.slice(-3)}' (Length: ${pass.length})`);

if (pass.length === 16 && !pass.includes(" ")) {
    console.log("⚠️  Length is 16, but App Passwords usually contain spaces (or are random).");
}

if (pass.includes("@")) {
    console.log("❌ DETECTED: Password contains '@'. Google App Passwords ONLY contain letters (a-z) and spaces.");
    console.log("   You are likely using your Login Password.");
} else if (pass.length !== 19 && pass.length !== 16) {
    // 16 chars + 3 spaces = 19, or 16 raw
    console.log(`⚠️  WARNING: App Passwords are typically 16 letters long (plus spaces). Your password is ${pass.length} characters.`);
} else {
    console.log("✅ FORMAT LOOKS OK (Length-wise).");
}
