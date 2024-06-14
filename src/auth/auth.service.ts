import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  //   login
  async login(loginData: loginDto): Promise<any> {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: loginData.email.toLowerCase(),
      },
    });

    if (!existingUser) {
      throw new NotFoundException('Email is invalid');
    }

    const passwordMatch = await bcrypt.compare(
      loginData.password,
      existingUser.password,
    );

    if (!passwordMatch) {
      throw new HttpException('password incorrect', HttpStatus.UNAUTHORIZED);
    }

    if (!existingUser.emailConfirmed) {
      this.generateAndSendToken(loginData.email);

      throw new HttpException('email not confirmed', HttpStatus.UNAUTHORIZED);
    }

    const access_token = jwt.sign(existingUser, this.secretKey, {
      expiresIn: '5h',
    });

    const { password, ...rest } = existingUser;

    return { access_token, data: rest };
  }

  //   register
  async register(createUserData: RegisterDto): Promise<any> {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: createUserData.email.toLowerCase(),
      },
    });

    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    const { password, email, ...data } = createUserData;

    const hashedPassword = await bcrypt.hash(password, this.saltRounds);

    let api_key = this.generateUniqueApiKey();

    // Check if api_key already exists, if so, generate another one
    while (await this.apiKeyExists(api_key)) {
      api_key = this.generateUniqueApiKey();
    }

    const newUser = await this.prisma.user.create({
      data: {
        ...data,
        email: email.toLowerCase(),
        api_key,
        password: hashedPassword,
      },
    });

    // await this.emailsService.sendWelcomeEmail(newUser);
    await this.generateAndSendToken(newUser.email);

    return { message: 'registration successfull check email to confirm!' };
  }
}
