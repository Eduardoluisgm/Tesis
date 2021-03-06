<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */

    protected $primaryKey = 'cedula';
    public $incrementing = false;
    protected $fillable = [
        'name',
        'email',
        'password',
        'cedula',
        'direccion',
        'role_id',
        'fecha_ingreso',
        'telefono',
        'status'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];


    public function role () {
      return $this->belongsTo('App\role');
    }
}
