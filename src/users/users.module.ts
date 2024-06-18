import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { knexProvider } from '../knex/knex.provider';

@Module({
  controllers: [UsersController],
  providers: [UsersService, knexProvider],
})
export class UsersModule {}
