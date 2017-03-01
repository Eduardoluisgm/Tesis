<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableInventario extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      Schema::create('inventario', function (Blueprint $table) {
          $table->increments('id');
          $table->decimal('monto', 20, 2)->default(0);
          $table->integer('cantidad');
          $table->string('year')->unique();
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
        Schema::drop('inventario');
    }
}
