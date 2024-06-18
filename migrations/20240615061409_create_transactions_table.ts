import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('transactions', function (table) {
    table.increments('id').primary();
    table.integer('wallet_id').unsigned().notNullable();
    table.double('amount').notNullable();
    table.enum('type', ['deposit', 'withdrawal', 'transfer']).notNullable();
    table.enum('currency', ['NGN', 'EUR', 'USD']).notNullable();
    table.timestamps(true, true);

    table
      .foreign('wallet_id')
      .references('id')
      .inTable('wallets')
      .onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('transactions');
}
