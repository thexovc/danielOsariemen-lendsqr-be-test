"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
    await knex.schema.createTable('users', function (table) {
        table.increments('id').primary();
        table.string('email').notNullable().unique();
        table.string('first_name').notNullable();
        table.string('last_name').notNullable();
        table.string('password').notNullable();
        table.string('phone_number').nullable();
        table.timestamps(true, true);
    });
}
exports.up = up;
async function down(knex) {
    await knex.schema.dropTable('users');
}
exports.down = down;
//# sourceMappingURL=20240614135453_create_users_table.js.map