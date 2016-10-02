<?php

use Illuminate\Database\Seeder;

class UserTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $users = [
          [
            'name'=>'Eduardo',
            'cedula' => '23591017',
            'password'=>Hash::make('nomeacuerdo'),
            'role_id'=> '1',
            'direccion'=> 'San Juan',
            'telefono'=> '04248849771'
          ]
        ];

        foreach ($users as $user) {
            \App\User::create($user);
        }
    }
}
