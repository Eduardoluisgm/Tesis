<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
  protected $table = 'client';
  protected $primaryKey = 'cedula';
  public $incrementing = false;
  protected $fillable = [
      'cedula',
      'name',
      'apellido',
      'direccion',
      'telefono',
      'status',
      'tipo'
  ];
}
