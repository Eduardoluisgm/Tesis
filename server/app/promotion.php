<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class promotion extends Model
{
  protected $table = 'promotion';
  protected $fillable = [
      'titulo',
      'descripcion',
      'image',
      'url'
  ];

//  protected $hidden = ['image'];
}
