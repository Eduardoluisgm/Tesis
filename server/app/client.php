<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class client extends Model
{
  protected $table = 'client';
  protected $primaryKey = 'cedula';
  protected $fillable = [
      'cedula',
      'name',
      'apellido',
      'direccion',
      'telefono'
  ];
}
