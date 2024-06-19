"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
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
exports.up = up;
async function down(knex) {
    await knex.schema.dropTable('wallets');
}
exports.down = down;
//# sourceMappingURL=20240614165635_create_wallets_table.js.map