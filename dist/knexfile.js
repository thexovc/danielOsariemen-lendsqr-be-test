"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
dotenv.config();
const config = {
    development: {
        client: 'mysql',
        connection: {
            host: 'localhost',
            database: 'demo_credit',
            user: 'root',
            password: '1ubKxc7b£ro2',
        },
    },
    production: {
        client: 'mysql2',
        connection: {
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT) || 16237,
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
        },
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: 'knex_migrations',
        },
    },
};
exports.default = config;
//# sourceMappingURL=knexfile.js.map