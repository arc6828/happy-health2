<?php

use App\Http\Controllers\Api\LineWebhookController;
use App\Models\LineChatLog;
use App\Models\UserHealthLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('line/webhook', [LineWebhookController::class, 'handle']);

Route::get('chatlogs', function(Request $request){
    $user = $request->user();
    if (!$user || $user->email !== 'chavalit.kow@gmail.com') {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    $query = LineChatLog::query();

    // ค้นหาตาม prompt, reply หรือ line_user_id
    if ($request->has('search') && $request->search != '') {
        $search = $request->search;
        $query->where(function($q) use ($search) {
            $q->where('line_user_id', 'like', "%{$search}%")
              ->orWhere('prompt', 'like', "%{$search}%")
              ->orWhere('reply', 'like', "%{$search}%");
        });
    }

    // จัดเรียงตามล่าสุดและทำแบ่งหน้า (Pagination)
    $chatLogs = $query->orderBy('created_at', 'desc')->paginate(15);
    $uniqueUsers = LineChatLog::distinct('line_user_id')->count('line_user_id');
    
    return response()->json([
        'logs' => $chatLogs,
        'unique_users' => $uniqueUsers
    ]);
})->middleware('auth');

Route::get('settings', function(Request $request) {
    $user = $request->user();
    if (!$user || $user->email !== 'chavalit.kow@gmail.com') {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    $settingsPath = storage_path('app/ai_settings.json');
    if (file_exists($settingsPath)) {
        return response()->json(json_decode(file_get_contents($settingsPath), true));
    }

    return response()->json([
        'system_prompt' => 'คุณคือผู้ช่วยแนะนำด้านโภชนาการและการดูแลสุขภาพเพื่อลดน้ำหนักอย่างถูกต้องและปลอดภัย',
        'suffix_prompt' => 'ไม่เกิน 1 ย่อหน้า',
        'model_name' => 'gemini-2.0-flash',
    ]);
})->middleware('auth');

Route::post('settings', function(Request $request) {
    $user = $request->user();
    if (!$user || $user->email !== 'chavalit.kow@gmail.com') {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    $validated = $request->validate([
        'system_prompt' => 'required|string',
        'suffix_prompt' => 'required|string',
        'model_name' => 'required|string',
    ]);

    $settingsPath = storage_path('app/ai_settings.json');
    $dir = dirname($settingsPath);
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }

    file_put_contents($settingsPath, json_encode($validated, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
    return response()->json(['message' => 'Settings saved successfully']);
})->middleware('auth');

Route::middleware('auth')->group(function () {
    // 3.1 Web-based Chat API
    Route::post('web-chat', function (Request $request) {
        $request->validate([
            'prompt' => 'required|string',
        ]);

        $user = $request->user();
        $prompt = $request->prompt;

        $webhookController = new LineWebhookController();
        $replyText = $webhookController->callGemini($prompt);

        LineChatLog::create([
            'line_user_id' => 'web_' . $user->id . '_' . $user->name,
            'prompt' => $prompt,
            'reply' => $replyText,
        ]);

        return response()->json([
            'reply' => $replyText,
        ]);
    });

    // 3.2 Get Health Logs & Profile
    Route::get('user/health-logs', function (Request $request) {
        $user = $request->user();

        $logs = UserHealthLog::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'profile' => [
                'height' => $user->height,
                'age' => $user->age,
                'gender' => $user->gender,
                'activity_level' => $user->activity_level,
            ],
            'logs' => $logs
        ]);
    });

    // 3.2 Update Health Profile Settings
    Route::post('user/profile', function (Request $request) {
        $validated = $request->validate([
            'height' => 'required|numeric|min:30|max:300',
            'age' => 'required|integer|min:1|max:120',
            'gender' => 'required|string|in:male,female',
            'activity_level' => 'required|numeric',
        ]);

        $user = $request->user();
        $user->update($validated);

        return response()->json([
            'message' => 'Profile updated successfully',
            'profile' => $user
        ]);
    });

    // 3.2 Insert Daily Logs (weight / diet)
    Route::post('user/health-logs', function (Request $request) {
        $validated = $request->validate([
            'type' => 'required|string|in:weight,diet',
            'value' => 'required|numeric|min:0.1|max:10000',
            'description' => 'nullable|string|max:255',
        ]);

        $user = $request->user();

        $log = UserHealthLog::create([
            'user_id' => $user->id,
            'type' => $validated['type'],
            'value' => $validated['value'],
            'description' => $validated['description'],
        ]);

        return response()->json([
            'message' => 'Log created successfully',
            'log' => $log
        ]);
    });

    // 4.2 Anonymous Weight Loss Leaderboard
    Route::get('leaderboard', function (Request $request) {
        $users = \App\Models\User::all();
        $leaderboard = [];

        foreach ($users as $u) {
            $oldest = UserHealthLog::where('user_id', $u->id)
                ->where('type', 'weight')
                ->orderBy('created_at', 'asc')
                ->first();

            $newest = UserHealthLog::where('user_id', $u->id)
                ->where('type', 'weight')
                ->orderBy('created_at', 'desc')
                ->first();

            if ($oldest && $newest && $oldest->id !== $newest->id) {
                $startWeight = $oldest->value;
                $currentWeight = $newest->value;
                $loss = $startWeight - $currentWeight;
                $percentage = ($startWeight > 0) ? ($loss / $startWeight) * 100 : 0;

                // Anonymize name (initials, e.g. "Chavalit Kow" -> "C. K.")
                $names = explode(' ', trim($u->name));
                $anonName = '';
                if (count($names) > 0 && !empty($names[0])) {
                    $anonName .= mb_substr($names[0], 0, 1) . '.';
                }
                if (count($names) > 1 && !empty($names[1])) {
                    $anonName .= ' ' . mb_substr($names[1], 0, 1) . '.';
                } else {
                    $anonName .= ' *';
                }

                $leaderboard[] = [
                    'name' => $anonName,
                    'loss' => round($loss, 1),
                    'percentage' => round($percentage, 1),
                ];
            }
        }

        // เรียงลำดับตามเปอร์เซ็นต์ที่ลดได้มากที่สุด
        usort($leaderboard, function ($a, $b) {
            return $b['percentage'] <=> $a['percentage'];
        });

        return response()->json(array_slice($leaderboard, 0, 10));
    });
});