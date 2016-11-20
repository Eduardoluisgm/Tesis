<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class fact_vent_pagos extends Model
{
  protected $table = 'fact_vent_pagos';
  protected $fillable = [
      'tipo',
      'monto',
      'factura_id',
      'status'
  ];
}
