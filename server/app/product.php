<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
  protected $table = 'product';
  protected $primaryKey = 'codigo';
  public $incrementing = false;
  protected $fillable = [
      'codigo',
      'nombre',
      'precio_costo',
      'precio_venta',
      'stock',
      'descripcion',
      'marca',
      'min_stock',
      'max_stock',
      'category_id'
  ];

  public function providers() {
    return $this->belongsToMany('App\provider', 'provider_product');
  }

  public function category () {
    return $this->belongsTo('App\category_product');
  }
}
