import { Provider } from '@nestjs/common';
import * as Knex from 'knex';
import KnexConfig from '../../knexfile';
import { ConfigService } from '@nestjs/config';

export const KNEX_CONNECTION = 'KNEX_CONNECTION';

export const knexProvider: Provider = {
  provide: KNEX_CONNECTION,
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const nodeEnv = configService.get<string>('NODE_ENV') || 'development';

    let knexConfig: any;

    if (nodeEnv === 'production') {
      knexConfig = KnexConfig.production;
    } else {
      knexConfig = KnexConfig.development;
    }

    const knex = Knex(knexConfig);
    return knex;
  },
};
