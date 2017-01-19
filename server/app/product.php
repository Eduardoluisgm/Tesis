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
      'max_stock'
  ];
}
