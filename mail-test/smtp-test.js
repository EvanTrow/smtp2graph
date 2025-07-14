const nodemailer = require('nodemailer');

// Extract CLI arguments
const [,, host, username, password, toEmail] = process.argv;

if (!host || !username || !password || !toEmail) {
    console.error(`
❌ Missing arguments!

Usage:
node smtp-test.js <host> <username> <password> <toEmail>

Example:
node smtp-test.js smtp.example.com user@example.com password123 recipient@example.com
    `);
    process.exit(1);
}

async function testSMTP() {
    let transporter = nodemailer.createTransport({
        host: host,
        port: 465,
        secure: true,
        auth: {
            user: username,
            pass: password
        },
        tls: {
            rejectUnauthorized: false
        },
        logger: true,
        debug: true
    });

    try {
        let info = await transporter.sendMail({
            from: `"SMTP Tester" <${username}>`,
            to: toEmail,
            subject: 'SMTP Test Email',
            text: 'This is a test email to verify SMTP over TLS/465.',
            html: '<b>This is a test email to verify SMTP over TLS/465.</b>'
        });

        console.log('\n✅ Message sent:', info.messageId);
    } catch (error) {
        console.error('\n❌ Failed to send email:\n', error);
    }
}

testSMTP();
