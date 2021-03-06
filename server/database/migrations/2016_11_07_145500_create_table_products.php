<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableProducts extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      Schema::create('product', function (Blueprint $table) {
          $table->string('codigo');
          $table->string('nombre');
          $table->string('descripcion')->nullable();
          $table->string('marca')->nullable();
          $table->decimal('precio_costo', 15, 2)->default(0);
          $table->decimal('precio_venta', 15, 2)->default(0);
          $table->string('status')->default("1");
          $table->integer('stock')->default(0);
          $table->integer('min_stock')->default(0);
          $table->integer('max_stock')->default(0);
          $table->integer('category_id')->unsigned();
          $table->foreign('category_id')->references('id')->on('category_product')->onDelete('cascade')->onUpdate('cascade');
          $table->primary('codigo');
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
        Schema::drop('product');
    }
}
