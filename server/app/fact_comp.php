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
}
