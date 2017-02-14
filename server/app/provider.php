<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Provider extends Model
{
  protected $table = 'provider';
  protected $primaryKey = 'rif';
  public $incrementing = false;
  protected $fillable = [
      'rif',
      'nombre',
      'direccion',
      'telefono',
      'status',
      'nombre_vendedor',
      'tipo'
  ];

  public function products() {
    return $this->belongsToMany('App\product', 'provider_product');
  }
}
