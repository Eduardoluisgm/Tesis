<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class fact_comp_detalles extends Model
{
  protected $table = 'fact_comp_detalles';
  protected $fillable = [
      'precio_compra',
      'precio_venta',
      'cant',
      'monto_total',
      'factura_id',
      'status'
  ];

  public function producto() {
    return $this->hasOne('App\product','codigo', 'producto_id');
  }
}
