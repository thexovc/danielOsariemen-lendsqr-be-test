import type { Knex } from 'knex';

// Update with your config settings.

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'mysql',
    connection: {
      // filename: "./dev.mysql"
      host: 'localhost', // Specify the host where your MySQL server is running
      database: 'demo_credit',
      user: 'root',
      password: '1ubKxc7b£ro2',
    },
  },

  staging: {
    client: 'mysql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  production: {
    client: 'mysql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password',
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

export default config;
