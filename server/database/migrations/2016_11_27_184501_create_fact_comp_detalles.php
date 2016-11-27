<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFactCompDetalles extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      Schema::create('fact_comp_detalles', function (Blueprint $table) {
          $table->increments('id');
          $table->decimal('precio_compra', 15, 2)->default(0);
          $table->decimal('precio_venta', 15, 2)->default(0);
          $table->integer('cant')->nullable();
          $table->decimal('monto_total', 15, 2)->default(0);
          $table->string('status')->default("1");
          $table->integer('factura_id')->unsigned();
          $table->string('producto_id');
          $table->foreign('factura_id')->references('id')->on('fact_comp')->onDelete('cascade')->onUpdate('cascade');
          $table->foreign('producto_id')->references('codigo')->on('product')->onDelete('cascade')->onUpdate('cascade');
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
        Schema::drop('fact_comp_detalles');
    }
}
