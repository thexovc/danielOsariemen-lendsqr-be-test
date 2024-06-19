import { Exclude, Expose } from 'class-transformer';

@Expose()
export class UserEntity {
  id: number;
  email: string;
  first_name: string;
  last_name: string;

  @Exclude()
  password: string;

  phone_number?: string;

  @Exclude()
  created_at: Date;

  @Exclude()
  updated_at: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
