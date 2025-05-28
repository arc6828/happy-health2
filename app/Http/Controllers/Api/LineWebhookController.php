<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
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
                $replyToken = $event['replyToken'];

                $replyText = $this->callGemini($userText); // ฟังก์ชันที่เราสร้างไว้

                // $replyText = "Hello World";
                $this->reply($replyText, $replyToken);
            }
        }

        return response('OK', 200);
    }

    private function callGemini(string $prompt): string
    {
        $apiKey = env('GEMINI_API_KEY');
        $modelName = "";
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            // 'x-goog-api-key' => $apiKey,
        ])->post("https://generativelanguage.googleapis.com/v1beta/models/{$modelName}:generateContent?key={$apiKey}", [
            'contents' => [[
                'parts' => [['text' => $prompt]]
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
