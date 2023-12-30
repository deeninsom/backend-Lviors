import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'src/prisma.service';

import {
  LoginDto,
  RegisterDto,
} from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) { }


  async register(registerDto: RegisterDto): Promise<{ username: string; email: string; jwt_token: string }> {
    const { username, email, password, image_profile } = registerDto;

    // Validate the uniqueness of the username
    await this.validateEmailUniqueness(username);

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await this.prisma.user.create({
      data: {
        username: username,
        password: hashedPassword,
        email: email,
        image_profile: image_profile,
      }
    });

    // Generate JWT token
    const payload = { id: user.id, username: user.username, email: user.email };
    const token = this.jwtService.sign(payload);

    await this.prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        jwt_token: token
      }
    })

    return { username: user.username, email: user.email, jwt_token: token };
  }

  async login(loginDto: LoginDto): Promise<{
    id: string;
    username: string;
    email: string;
    jwt_token: string;
  }> {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user)
      throw new HttpException('Email tidak ditemukan !', HttpStatus.NOT_FOUND);

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      throw new HttpException(
        'Password tidak cocok !',
        HttpStatus.UNAUTHORIZED,
      );


    const payload = { id: user.id, username: user.username, email: user.email };
    const token = this.jwtService.sign(payload);

    await this.prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        jwt_token: token
      }
    })

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      jwt_token: token,
    };
  }

  async logout(token: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: {
        jwt_token: token
      },
    });

    if (!user)
      throw new HttpException('User tidak ditemukan !', HttpStatus.NOT_FOUND);

    await this.prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        jwt_token: null
      }
    })

    return true;
  }

  private async validateEmailUniqueness(email: string): Promise<any> {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      throw new HttpException(
        'Email sudah terdaftar !',
        HttpStatus.BAD_REQUEST,
      );
    }
    return existingUser;
  }
}
