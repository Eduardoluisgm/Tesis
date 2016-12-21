<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class provider_product extends Model
{
    protected $table = 'provider_product';
    protected $fillable = [
        'product_id',
        'provider_id'
    ];
}
