<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class fact_comp extends Model
{
  protected $table = 'fact_comp';
  protected $fillable = [
      'monto_total',
      'monto_cancelado',
      'status',
      'provider_id',
      'fecha_pago'
  ];

  public function proveedor() {
    return $this->hasOne('App\provider','rif', 'provider_id');
  }

  public function detalles() {
    return $this->hasMany('App\fact_comp_detalles', 'factura_id');
  }

  public function pagos() {
    return $this->hasMany('App\fact_comp_pagos', 'factura_id');
  }
}
