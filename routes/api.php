<?php

use App\Http\Controllers\Api\LineWebhookController;
use App\Models\LineChatLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('line/webhook', [LineWebhookController::class, 'handle']);

Route::get('chatlogs', function(){
    $chatLogs = LineChatLog::limit(5)->get();
    return response()->json($chatLogs);
});