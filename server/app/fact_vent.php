<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class fact_vent extends Model
{
  protected $table = 'fact_vent';
  protected $fillable = [
      'monto_total',
      'monto_cancelado',
      'status',
      'client_id',
      'fecha_pago'
  ];
}
