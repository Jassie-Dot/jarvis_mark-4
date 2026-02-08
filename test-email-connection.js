import "dotenv/config";
import nodemailer from "nodemailer";

async function testConnection() {
    console.log("--- EMAIL CONNECTION TESTER ---");

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error("❌ MISSING CREDENTIALS: EMAIL_USER or EMAIL_PASS not found in .env");
        process.exit(1);
    }

    console.log(`User: ${process.env.EMAIL_USER}`);
    console.log("Password: [HIDDEN] " + (process.env.EMAIL_PASS ? "(Present)" : "(Missing)"));

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        logger: true,
        debug: true
    });

    try {
        console.log("Attempting to verify SMTP connection...");
        await transporter.verify();
        console.log("✅ SUCCESS: SMTP Connection Established!");
        console.log("Credentials are valid.");
    } catch (error) {
        console.error("❌ FAILED: Connection could not be established.");
        console.error(`Error Code: ${error.code}`);
        console.error(`Message: ${error.message}`);

        if (error.code === 'EAUTH') {
            console.log("\n💡 TROUBLESHOOTING:");
            console.log("1. Ensure you are using an 'App Password', NOT your Google login password.");
            console.log("2. Go to Google Account > Security > 2-Step Verification > App Passwords.");
            console.log("3. Generate a new one and paste it into .env");
        }
    }
}

testConnection();
