<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProviderProduct extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      Schema::create('provider_product', function (Blueprint $table) {
          $table->increments('id');
          $table->string('provider_id');
          $table->string('product_id');
          $table->foreign('provider_id')->references('rif')->on('provider')->onDelete('cascade')->onUpdate('cascade');
          $table->foreign('product_id')->references('codigo')->on('product')->onDelete('cascade')->onUpdate('cascade');
          $table->unique(['product_id', 'provider_id']);
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
        Schema::drop('provider_product');
    }
}
