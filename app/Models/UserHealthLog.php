<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserHealthLog extends Model
{
    protected $fillable = [
        'user_id',
        'type',
        'value',
        'description',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
