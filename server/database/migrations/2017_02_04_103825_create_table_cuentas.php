<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableCuentas extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      Schema::create('cuentas', function (Blueprint $table) {
          $table->increments('id');
          $table->integer('bank_id')->unsigned();
          $table->string('numero');
          $table->string('descripcion')->nullable();
          $table->foreign('bank_id')->references('id')->on('bank')->onDelete('cascade')->onUpdate('cascade');
          $table->unique(['bank_id', 'numero']);
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
        Schema::drop('cuentas');
    }
}
