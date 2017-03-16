<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class category_product extends Model
{
  protected $table = 'category_product';
  protected $fillable = [
      'nombre',
      'descripcion'
  ];
}
