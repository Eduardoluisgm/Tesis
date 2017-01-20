<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFactVentPagos extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      Schema::create('fact_vent_pagos', function (Blueprint $table) {
          $table->increments('id');
          $table->string('tipo');
          $table->decimal('monto', 15, 2)->default(0);
          $table->string('status')->default("1");
          $table->integer('factura_id')->unsigned();
          $table->foreign('factura_id')->references('id')->on('fact_vent')->onDelete('cascade')->onUpdate('cascade');
          $table->integer('bank_id')->unsigned()->nullable();
          $table->foreign('bank_id')->references('id')->on('bank')->onDelete('cascade')->onUpdate('cascade');
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
        Schema::drop('fact_vent_pagos');
    }
}
