<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFactVent extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      Schema::create('fact_vent', function (Blueprint $table) {
          $table->increments('id');
          $table->decimal('monto_total', 15, 2)->default(0);
          $table->decimal('monto_cancelado', 15, 2)->default(0);
          $table->string('client_id');
          $table->string('status')->default("1");
          $table->string('descripcion')->nullable();
          $table->dateTime('fecha_pago')->nullable();
          $table->foreign('client_id')->references('cedula')->on('client');
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
        Schema::drop('fact_vent');
    }
}
