<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LineChatLog extends Model
{
    //
    protected $fillable = [
        'line_user_id',
        'prompt',
        'reply',
    ];

}
