<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class fact_vent_detalles extends Model
{
  protected $table = 'fact_vent_detalles';
  protected $fillable = [
  	  'nombre',
      'precio_compra',
      'precio_venta',
      'cant',
      'monto_total',
      'factura_id',
      'status'
  ];
}
