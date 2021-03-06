<?php

use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      $productos = [
        [
          'codigo'=>'1',
          'nombre'=>'Oreo Vainilla',
          'precio_costo' => 300,
          'precio_venta' => 500,
          'stock'=>1,
          'category_id'=>4
        ],
        [
          'codigo'=>'2',
          'nombre'=>'Oreo Chocolate',
          'precio_costo' => 200,
          'precio_venta' => 400,
          'stock'=>1,
          'category_id'=>4
        ],
        [
          'codigo'=>'3',
          'nombre'=>'cacique clasico',
          'precio_costo' => 5000,
          'precio_venta' => 5400,
          'stock'=>1,
          'category_id'=>1
        ],
        [
          'codigo'=>'4',
          'nombre'=>'cacique 500',
          'precio_costo' => 6000,
          'precio_venta' => 6400,
          'stock'=>1,
          'category_id'=>1
        ]
      ];

      foreach ($productos as $producto) {
          \App\Product::create($producto);
      }
    }
}
