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


  public function cliente() {
    return $this->hasOne('App\client','cedula', 'client_id');
  }

  public function detalles() {
    return $this->hasMany('App\fact_vent_detalles', 'factura_id');
  }

  public function pagos() {
    return $this->hasMany('App\fact_vent_pagos', 'factura_id');
  }
}
