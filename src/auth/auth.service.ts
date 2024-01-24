import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { Injectable, ForbiddenException } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { LoginAuthDto, RegisterAuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async login(dto: LoginAuthDto): Promise<any> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: dto.email,
      },
      select: {
        id: true,
        email: true,
        lastname: true,
        firstname: true,
        password: true,
      },
    });

    if (!user)
      throw new ForbiddenException(
        "informations d'identification incompatibles!",
      );

    const { id, password, ...result } = user;

    const hashMatches = await argon.verify(password, dto.password);

    if (!hashMatches)
      throw new ForbiddenException(
        "informations d'identification incompatibles!",
      );

    const payload = { id: id, email: user.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
      data: result,
    };
  }

  async register(dto: RegisterAuthDto): Promise<any> {
    const isExists = await this.prisma.exists(this.prisma.user, {
      where: {
        email: dto.email,
      },
    });

    if (isExists)
      throw new ForbiddenException("Informations d'identification prises!");

    const password = await argon.hash(dto.password);

    const user = await this.prisma.user.create({
      data: {
        ...dto,
        password,
      },
      select: {
        id: true,
        email: true,
        lastname: true,
        firstname: true,
      },
    });

    const { id, ...result } = user;

    const payload = { id: id, email: user.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
      data: result,
    };
  }
}
