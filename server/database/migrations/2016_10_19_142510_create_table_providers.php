<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableProviders extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      Schema::create('provider', function (Blueprint $table) {
          $table->string('rif');
          $table->string('nombre');
          $table->string('tipo');
          $table->string('direccion')->nullable();
          $table->string('telefono')->nullable();
          $table->string('status')->default("1");
          $table->string('nombre_vendedor')->nullable();
          $table->primary('rif');
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
        Schema::drop('provider');
    }
}
