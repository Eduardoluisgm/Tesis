<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
         $this->call(RoleSeeder::class);
         $this->call(UserTableSeeder::class);
         $this->call(ClientSeeder::class);
         $this->call(category_product::class);
         $this->call(ProductSeeder::class);
    }
}
