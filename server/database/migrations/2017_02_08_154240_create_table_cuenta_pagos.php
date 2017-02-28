<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableCuentaPagos extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      Schema::create('cuentas_pagos', function (Blueprint $table) {
          $table->increments('id');
          $table->integer('cuenta_id')->unsigned();
          $table->string('tipo');
          $table->string('referencia');
          $table->decimal('monto', 15, 2)->default(0);
          $table->dateTime('fecha_pago')->nullable();
          $table->string('descripcion')->nullable();
          $table->integer('factura_id')->unsigned()->nullable();
          $table->foreign('factura_id')->references('id')->on('fact_comp')->onDelete('cascade')->onUpdate('cascade');
          $table->foreign('cuenta_id')->references('id')->on('cuentas')->onDelete('cascade')->onUpdate('cascade');
          $table->timestamps();
      });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('cuentas_pagos');
    }
}
