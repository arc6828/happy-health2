<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('home');
})->name('home');

Route::get('/welcome', function () {
    return Inertia::render('welcome');
})->name('welcome');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $user = auth()->user();
        if ($user && $user->email === 'chavalit.kow@gmail.com') {
            return Inertia::render('dashboard');
        }
        return Inertia::render('user-dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

// SPA API Routes under web session middleware group
Route::prefix('api')->group(function () {
    // 1. Chat Logs (Admin)
    Route::get('chatlogs', function(\Illuminate\Http\Request $request){
        $user = $request->user();
        if (!$user || $user->email !== 'chavalit.kow@gmail.com') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $query = \App\Models\LineChatLog::query();

        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('line_user_id', 'like', "%{$search}%")
                  ->orWhere('prompt', 'like', "%{$search}%")
                  ->orWhere('reply', 'like', "%{$search}%");
            });
        }

        $chatLogs = $query->orderBy('created_at', 'desc')->paginate(15);
        $uniqueUsers = \App\Models\LineChatLog::distinct('line_user_id')->count('line_user_id');
        
        return response()->json([
            'logs' => $chatLogs,
            'unique_users' => $uniqueUsers
        ]);
    })->middleware('auth');

    // 2. Settings (Admin)
    Route::get('settings', function(\Illuminate\Http\Request $request) {
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
            'model_name' => env('GEMINI_MODEL', 'gemini-3.6-flash'),
        ]);
    })->middleware('auth');

    Route::post('settings', function(\Illuminate\Http\Request $request) {
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

    // 3. User Dashboard APIs
    Route::middleware('auth')->group(function () {
        // 3.1 Web-based Chat API
        Route::post('web-chat', function (\Illuminate\Http\Request $request) {
            try {
                $user = $request->user();
                if (!$user) {
                    \Illuminate\Support\Facades\Log::error('web-chat: User is null!');
                    return response()->json(['message' => 'Unauthenticated.'], 401);
                }

                $request->validate([
                    'prompt' => 'required|string',
                ]);

                $prompt = $request->prompt;

                $webhookController = new \App\Http\Controllers\Api\LineWebhookController();
                $replyText = $webhookController->callGemini($prompt);

                \App\Models\LineChatLog::create([
                    'line_user_id' => 'web_' . $user->id . '_' . $user->name,
                    'prompt' => $prompt,
                    'reply' => $replyText,
                ]);

                return response()->json([
                    'reply' => $replyText,
                ]);
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error('web-chat Exception: ' . $e->getMessage() . "\n" . $e->getTraceAsString());
                return response()->json(['message' => $e->getMessage()], 500);
            }
        });

        // 3.2 Get Health Logs & Profile
        Route::get('user/health-logs', function (\Illuminate\Http\Request $request) {
            $user = $request->user();

            $logs = \App\Models\UserHealthLog::where('user_id', $user->id)
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

        // 3.3 Update Health Profile Settings
        Route::post('user/profile', function (\Illuminate\Http\Request $request) {
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

        // 3.4 Insert Daily Logs (weight / diet)
        Route::post('user/health-logs', function (\Illuminate\Http\Request $request) {
            $validated = $request->validate([
                'type' => 'required|string|in:weight,diet',
                'value' => 'required|numeric|min:0.1|max:10000',
                'description' => 'nullable|string|max:255',
            ]);

            $user = $request->user();
            $log = \App\Models\UserHealthLog::create([
                'user_id' => $user->id,
                'type' => $validated['type'],
                'value' => $validated['value'],
                'description' => $validated['description'],
            ]);

            return response()->json([
                'message' => 'Log added successfully',
                'log' => $log
            ]);
        });

        // 3.5 Anonymized Leaderboard
        Route::get('leaderboard', function (\Illuminate\Http\Request $request) {
            $users = \App\Models\User::all();
            $leaderboard = [];

            foreach ($users as $u) {
                $logs = \App\Models\UserHealthLog::where('user_id', $u->id)
                    ->where('type', 'weight')
                    ->orderBy('created_at', 'asc')
                    ->get();

                if ($logs->count() >= 2) {
                    $initialWeight = $logs->first()->value;
                    $latestWeight = $logs->last()->value;
                    $loss = $initialWeight - $latestWeight;

                    if ($loss > 0) {
                        $percentage = ($loss / $initialWeight) * 100;
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
            }

            usort($leaderboard, function ($a, $b) {
                return $b['percentage'] <=> $a['percentage'];
            });

            return response()->json(array_slice($leaderboard, 0, 10));
        });
    });

    // 4. Medium articles feed (Publicly accessible)
    Route::get('medium-articles', function () {
        return \Illuminate\Support\Facades\Cache::remember('medium_articles', now()->addHours(6), function () {
            $feedUrl = "https://medium.com/feed/happy-health-happy-heart";
            $response = \Illuminate\Support\Facades\Http::get($feedUrl);

            if ($response->failed()) {
                return [];
            }

            $xmlString = $response->body();
            $xml = @simplexml_load_string($xmlString, 'SimpleXMLElement', LIBXML_NOCDATA);
            if (!$xml) {
                return [];
            }

            $articles = [];
            foreach ($xml->channel->item as $item) {
                $namespaces = $item->getNameSpaces(true);
                $contentNamespace = $item->children($namespaces['content'] ?? '');
                $dcNamespace = $item->children($namespaces['dc'] ?? '');

                $contentHtml = (string)$contentNamespace->encoded;

                $thumbnail = '/assets/img/default-blog.jpg';
                if (preg_match('/<img[^>]+src="([^"]+)"/i', $contentHtml, $matches)) {
                    $thumbnail = $matches[1];
                }

                $snippet = strip_tags($contentHtml);
                $snippet = mb_substr($snippet, 0, 150) . '...';

                $articles[] = [
                    'id' => (string)$item->guid ?? md5((string)$item->link),
                    'title' => (string)$item->title,
                    'link' => (string)$item->link,
                    'author' => (string)$dcNamespace->creator ?: 'ทีมวิจัย',
                    'published_at' => date('d M Y', strtotime((string)$item->pubDate)),
                    'thumbnail' => $thumbnail,
                    'snippet' => $snippet,
                ];
            }

            return $articles;
        });
    });
});
