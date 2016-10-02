<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUserTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
     public function up()
     {
         Schema::create('users', function (Blueprint $table) {
             $table->string('cedula');
             $table->string('name');
             $table->string('email')->nullable();
             $table->string('password');
             $table->date('fecha_ingreso')->nullable();
             $table->string('direccion')->nullable();
             $table->string('telefono')->nullable();
             $table->integer('role_id')->unsigned();
             $table->foreign('role_id')->references('id')->on('role');
             $table->primary('cedula');
             $table->rememberToken();
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
         Schema::drop('users');
     }
}
