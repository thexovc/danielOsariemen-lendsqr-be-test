import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { knexProvider } from 'src/knex/knex.provider';

@Module({
  controllers: [AuthController],
  providers: [AuthService, knexProvider],
})
export class AuthModule {}
