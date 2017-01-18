<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class bank extends Model
{
  protected $table = 'bank';
  protected $fillable = [
      'nombre',
      'descripcion',
      'telefono',
      'status'
  ];
  public static $rules = [
    'nombre' => 'unique:bank'
  ];
}
