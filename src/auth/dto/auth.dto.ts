import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(5)
  @Matches(/^(?=.[A-Z])(?=.\d).+$/, {
    message:
      'Password must contain at least one uppercase letter and one number',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  first_name: string;

  @IsNotEmpty()
  @IsString()
  last_name: string;

  @IsString()
  @MinLength(5)
  @Matches(/^\+?(\d{1,3})?[-.\s]?(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})$/, {
    message: 'Invalid phone number',
  })
  phone_number: string;
}

export class loginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
