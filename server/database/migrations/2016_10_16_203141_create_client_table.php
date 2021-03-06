<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateClientTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      Schema::create('client', function (Blueprint $table) {
          $table->string('cedula');
          $table->string('name');
          $table->string('apellido');
          $table->string('tipo');
          $table->string('direccion')->nullable();
          $table->string('telefono')->nullable();
          $table->string('status')->default("1");
          $table->primary('cedula');
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
        Schema::drop('client');
    }
}
