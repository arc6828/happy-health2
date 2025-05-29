<?php

use App\Http\Controllers\Api\LineWebhookController;
use App\Models\LineChatLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('line/webhook', [LineWebhookController::class, 'handle']);

Route::get('chatlogs', function(Request $request){
    $user = $request->user();
    // เช็กว่า login แล้ว และเป็น email ที่กำหนด
    if (!$user || $user->email !== 'chavalit.kow@gmail.com') {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    $chatLogs = LineChatLog::limit(5)->get();
    return response()->json($chatLogs);
})->middleware('auth:sanctum');