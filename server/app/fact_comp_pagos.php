<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class fact_comp_pagos extends Model
{
  protected $table = 'fact_comp_pagos';
  protected $fillable = [
      'tipo',
      'monto',
      'factura_id',
      'status'
  ];
}
