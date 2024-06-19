"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
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
exports.up = up;
async function down(knex) {
    await knex.schema.dropTable('transactions');
}
exports.down = down;
//# sourceMappingURL=20240615061409_create_transactions_table.js.map