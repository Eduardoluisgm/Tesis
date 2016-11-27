<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFactComp extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      Schema::create('fact_comp', function (Blueprint $table) {
          $table->increments('id');
          $table->decimal('monto_total', 15, 2)->default(0);
          $table->decimal('monto_cancelado', 15, 2)->default(0);
          $table->string('provider_id');
          $table->string('status')->default("1");
          $table->dateTime('fecha_pago')->nullable();
          $table->foreign('provider_id')->references('rif')->on('provider');
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
        Schema::drop('fact_comp');
    }
}
