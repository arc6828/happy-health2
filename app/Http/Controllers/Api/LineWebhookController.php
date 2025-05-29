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
        $events = $request->input('events');


        foreach ($events as $event) {
            if ($event['type'] === 'message' && $event['message']['type'] === 'text') {
                $userText = $event['message']['text'];
                $lineUserId = $event['source']['userId'];
                $replyToken = $event['replyToken'];

                if ($this->isUrl($userText)) {
                    // ไม่ต้อง process ต่อ
                    return response('OK URL', 200);
                }

                $replyText = $this->callGemini($userText); // ฟังก์ชันที่เราสร้างไว้

                // บันทึกลง DB
                LineChatLog::create([
                    'line_user_id' => $lineUserId,
                    'prompt' => $userText,
                    'reply' => $replyText,
                ]);

                // $replyText = "Hello World";
                $this->reply($replyText, $replyToken);
            }
        }

        return response('OK Replied', 200);
    }

    private function isUrl($text): bool
    {
        return filter_var($text, FILTER_VALIDATE_URL) !== false;
    }


    private function callGemini(string $prompt): string
    {
        $apiKey = env('GEMINI_API_KEY');
        $modelName = "gemini-2.0-flash";
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            // 'x-goog-api-key' => $apiKey,
        ])->post("https://generativelanguage.googleapis.com/v1beta/models/{$modelName}:generateContent?key={$apiKey}", [
            'contents' => [[
                'parts' => [['text' => "{$prompt} ไม่เกิน 1 ย่อหน้า"]]
            ]]
        ]);

        return $response->json('candidates.0.content.parts.0.text') ?? 'ขออภัย ระบบไม่สามารถตอบได้';
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
