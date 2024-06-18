import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('wallets', function (table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.double('balance').defaultTo(0);
    table.enum('currency', ['NGN', 'EUR', 'USD']).notNullable();

    table.timestamps(true, true);

    table
      .foreign('user_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('wallets');
}
