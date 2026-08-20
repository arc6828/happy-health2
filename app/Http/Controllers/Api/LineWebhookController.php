<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LineChatLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class LineWebhookController extends Controller
{
    protected $channelToken;

    public function __construct()
    {
        $this->channelToken = env('LINE_ACCESS_TOKEN');
    }

    public function handle(Request $request)
    {
        // 2.1 LINE Signature Verification
        $secret = env('LINE_CHANNEL_SECRET');
        $signature = $request->header('x-line-signature');
        
        if ($secret && $signature) {
            $body = $request->getContent();
            $calculatedSignature = base64_encode(hash_hmac('sha256', $body, $secret, true));
            if (!hash_equals($calculatedSignature, $signature)) {
                return response('Invalid signature', 400);
            }
        }

        $events = $request->input('events') ?? [];

        foreach ($events as $event) {
            $lineUserId = $event['source']['userId'] ?? null;
            $replyToken = $event['replyToken'] ?? null;

            if (!$lineUserId || !$replyToken) {
                continue;
            }

            if ($event['type'] === 'message') {
                $messageType = $event['message']['type'];

                // 2.2 Text message support with 2.3 Personalized Context
                if ($messageType === 'text') {
                    $userText = $event['message']['text'];

                    if ($this->isUrl($userText)) {
                        continue;
                    }

                    // 2.3 Personalized context injection if user linked
                    $personalizedContext = "";
                    $userProfile = \App\Models\User::where('line_user_id', $lineUserId)->first();
                    if ($userProfile) {
                        $latestWeightLog = \App\Models\UserHealthLog::where('user_id', $userProfile->id)
                            ->where('type', 'weight')
                            ->orderBy('created_at', 'desc')
                            ->first();
                        $weight = $latestWeightLog ? $latestWeightLog->value . ' กก.' : 'ไม่ระบุ';
                        
                        $personalizedContext = "ข้อมูลร่างกายผู้ใช้เฉพาะราย:\n" .
                            "- เพศ: " . ($userProfile->gender === 'male' ? 'ชาย' : 'หญิง') . "\n" .
                            "- อายุ: {$userProfile->age} ปี\n" .
                            "- ส่วนสูง: {$userProfile->height} ซม.\n" .
                            "- น้ำหนักล่าสุด: {$weight}\n" .
                            "- กิจกรรม: " . ($userProfile->activity_level > 1.25 ? 'ออกกำลังกายเป็นประจำ' : 'นั่งส่วนใหญ่') . "\n" .
                            "โปรดใช้ข้อมูลด้านบนปรับระดับคำแนะนำเป้าหมายแคลอรี่ให้เป็นสัดส่วนเหมาะสมแบบเฉพาะบุคคล\n\n";
                    }

                    $replyText = $this->callGemini($userText, $personalizedContext);

                    LineChatLog::create([
                        'line_user_id' => $lineUserId,
                        'prompt' => $userText,
                        'reply' => $replyText,
                    ]);

                    $this->reply($replyText, $replyToken);
                }
                
                // 2.2 Image message support (Multimodal AI)
                elseif ($messageType === 'image') {
                    $messageId = $event['message']['id'];

                    // Download image from LINE Content API
                    $imageResponse = Http::withToken($this->channelToken)
                        ->get("https://api-data.line.me/v2/bot/message/{$messageId}/content");

                    if ($imageResponse->ok()) {
                        $imageBinary = $imageResponse->body();
                        $base64Image = base64_encode($imageBinary);
                        $mimeType = $imageResponse->header('Content-Type') ?? 'image/png';

                        $replyText = $this->callGeminiImage($base64Image, $mimeType);

                        LineChatLog::create([
                            'line_user_id' => $lineUserId,
                            'prompt' => '[ส่งข้อความรูปภาพอาหาร]',
                            'reply' => $replyText,
                        ]);

                        $this->reply($replyText, $replyToken);
                    }
                }
            }
        }

        return response('OK Replied', 200);
    }

    private function isUrl($text): bool
    {
        return filter_var($text, FILTER_VALIDATE_URL) !== false;
    }

    public function callGemini(string $prompt, string $personalizedContext = ""): string
    {
        $apiKey = env('GEMINI_API_KEY');

        // ค่าเริ่มต้นกรณีไม่มีไฟล์ตั้งค่า
        $systemPrompt = "คุณคือผู้ช่วยแนะนำด้านโภชนาการและการดูแลสุขภาพเพื่อลดน้ำหนักอย่างถูกต้องและปลอดภัย";
        $suffixPrompt = "ไม่เกิน 1 ย่อหน้า";
        $modelName = env('GEMINI_MODEL', 'gemini-3.6-flash');

        // ดึงการตั้งค่าจากไฟล์ JSON
        $settingsPath = storage_path('app/ai_settings.json');
        if (file_exists($settingsPath)) {
            $settings = json_decode(file_get_contents($settingsPath), true);
            $systemPrompt = $settings['system_prompt'] ?? $systemPrompt;
            $suffixPrompt = $settings['suffix_prompt'] ?? $suffixPrompt;
            $modelName = $settings['model_name'] ?? $modelName;
        }

        // ประกอบร่างคำสั่ง System Instruction
        $fullPrompt = "บทบาทและแนวทางโต้ตอบ:\n{$systemPrompt}\n\n{$personalizedContext}คำถามจากผู้ใช้:\n{$prompt}\n\nข้อจำกัดความยาวของคำตอบ:\n{$suffixPrompt}";

        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
        ])->post("https://generativelanguage.googleapis.com/v1beta/models/{$modelName}:generateContent?key={$apiKey}", [
            'contents' => [[
                'parts' => [['text' => $fullPrompt]]
            ]]
        ]);

        return $response->json('candidates.0.content.parts.0.text') ?? 'ขออภัย ระบบไม่สามารถตอบได้';
    }

    private function callGeminiImage(string $base64Data, string $mimeType): string
    {
        $apiKey = env('GEMINI_API_KEY');
        $modelName = env('GEMINI_MODEL', 'gemini-3.6-flash');

        // ค่าตั้งค่ากรณีไม่มีไฟล์
        $systemPrompt = "คุณคือผู้ช่วยแนะนำด้านโภชนาการและการดูแลสุขภาพเพื่อลดน้ำหนักอย่างถูกต้องและปลอดภัย โปรดวิเคราะห์รูปภาพอาหารนี้ บอกชื่ออาหาร แคลอรี่ และส่วนประกอบหลักของสารอาหาร (คาร์โบไฮเดรต โปรตีน ไขมัน) และคำแนะนำสุขภาพสั้นๆ";
        $suffixPrompt = "ไม่เกิน 1 ย่อหน้า";

        $settingsPath = storage_path('app/ai_settings.json');
        if (file_exists($settingsPath)) {
            $settings = json_decode(file_get_contents($settingsPath), true);
            $systemPrompt = $settings['system_prompt'] ?? $systemPrompt;
            $suffixPrompt = $settings['suffix_prompt'] ?? $suffixPrompt;
            $modelName = $settings['model_name'] ?? $modelName;
        }

        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
        ])->post("https://generativelanguage.googleapis.com/v1beta/models/{$modelName}:generateContent?key={$apiKey}", [
            'contents' => [[
                'parts' => [
                    [
                        'inlineData' => [
                            'mimeType' => $mimeType,
                            'data' => $base64Data,
                        ]
                    ],
                    [
                        'text' => "บทบาทและคำสั่งควบคุม:\n{$systemPrompt}\n\nคำแนะนำเพิ่มเติม: โปรดช่วยประมาณค่าแคลอรี่และสารอาหารจากรูปถ่ายจานนี้พร้อมวิเคราะห์สุขภาพ และจำกัดขอบเขตคำตอบดังนี้: {$suffixPrompt}"
                    ]
                ]
            ]]
        ]);

        return $response->json('candidates.0.content.parts.0.text') ?? 'ขออภัย ระบบไม่สามารถประมาณค่าแคลอรี่จากรูปภาพนี้ได้';
    }

    private function reply($replyText, $replyToken)
    {
        Http::withToken($this->channelToken)
            ->post('https://api.line.me/v2/bot/message/reply', [
                'replyToken' => $replyToken,
                'messages' => [
                    ['type' => 'text', 'text' => $replyText],
                ],
            ]);
    }
}
