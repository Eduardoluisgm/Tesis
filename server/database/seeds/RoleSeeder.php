<?php

use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      $roles = [
        [
          'name'=>'Super-Admin'
        ],
        [
          'name'=>'Administrador'
        ],
        [
          'name'=>'Vendedor'
        ]
      ];

      foreach ($roles as $role) {
          \App\role::create($role);
      }
    }
}
