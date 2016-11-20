<?php

use Illuminate\Database\Seeder;

class ClientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      $clients = [
        [
          'name'=>'Eduardo',
          'cedula' => 'V-23591017',
          'apellido'=> 'Velasquez',
          'direccion'=> 'San Juan',
          'telefono'=> '04248849771',
          'status' => '1',
          'tipo' => 'Venezolano'
        ]
      ];
      foreach ($clients as $client) {
          \App\Client::create($client);
      }
    }
}
