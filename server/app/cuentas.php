<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class cuentas extends Model
{
  protected $table = 'cuentas';
  protected $fillable = [
      'id',
      'bank_id',
      'numero',
      'descripcion'
  ];

  public function bank () {
    return $this->belongsTo('App\bank');
  }

  public function movimientos() {
    return $this->hasMany('App\cuenta_pagos','cuenta_id');
  }
}
