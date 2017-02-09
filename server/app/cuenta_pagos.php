<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class cuenta_pagos extends Model
{
  protected $table = 'cuentas_pagos';
  protected $fillable = [
      'id',
      'cuenta_id',
      'tipo',
      'referencia',
      'monto',
      'fecha_pago',
      'descripcion'
  ];
}
