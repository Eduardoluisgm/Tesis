<?php

use Illuminate\Database\Seeder;

class category_product extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      $categorias = [
        [
          'nombre'=>'Rones'
        ],
        [
          'nombre'=>'Whiskys'
        ],
        [
          'nombre'=>'Vinos'
        ],
        [
          'nombre'=>'Chucherías'
        ],
        [
          'nombre'=>'Otros'
        ]
      ];


      foreach ($categorias as $categoria) {
          \App\category_product::create($categoria);
      }
    }
}
