import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma.service';
import { User } from '@prisma/client';
import { CreateUserDto } from './user.dto';


@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  async get(page: number, limit: number, where: any) {

    if (page <= 0) {
      page = 1
    }

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.user.count({
        where,
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      totalPages,
      limit
    }
  }

  async getId(
    id: string,
  ): Promise<User | null> {
    const foundId = await this.prisma.user.findUnique({
      where: {
        id: id
      },
    });

    if (!foundId) {
      throw new HttpException(`User with id ${foundId} not found !`, HttpStatus.NOT_FOUND)
    }

    return foundId
  }


  async create(payload: CreateUserDto) {

    // Hash the password
    payload.password = await this.hashedPassword(payload.password)

    // Create the user
    const createUser = await this.prisma.user.create({
      data: {
        username: payload.username,
        password: payload.password,
        email: payload.email,
        image_profile: payload.image_profile,
      },
    });

    return createUser
  }

  async update(id: any, data: any): Promise<User> {

    // cheking user first
    const foundId = this.prisma.user.findUnique({
      where: {
        id: id
      }
    });

    if (!foundId) {
      throw new HttpException(`User with id ${foundId} not found !`, HttpStatus.NOT_FOUND)
    }

    // cheking password if change
    if (data.password) {
      data.password = await this.hashedPassword(data.password)
    }

    return this.prisma.user.update({
      data,
      where: {
        id: (await foundId).id
      },
    });
  }

  async delete(id: any): Promise<User> {
    // cheking user first
    const foundId = await this.prisma.user.findUnique({
      where: {
        id: id
      }
    });

    if (!foundId) {
      throw new HttpException(`User with id ${foundId} not found !`, HttpStatus.NOT_FOUND)
    }

    return this.prisma.user.delete({
      where: {
        id: id
      },
    });
  }

  async changePassword(id: string, payload: any) {
    // cheking user first
    const foundId = await this.prisma.user.findUnique({
      where: {
        id: id
      }
    });

    if (!foundId) throw new HttpException(`User with id ${foundId} not found !`, HttpStatus.NOT_FOUND)

    // check old password
    const passwordMatch = await bcrypt.compare(payload.oldPassword, foundId.password);
    if (!passwordMatch) throw new HttpException('Password tidak cocok!', HttpStatus.UNAUTHORIZED,);


    if (payload.confirmNewPassword !== payload.newPassword) throw new HttpException('Konfirmasi password tidak cocok!', HttpStatus.UNAUTHORIZED,);
    
    // hashed password
    const hashedPassword = await bcrypt.hash(payload.confirmNewPassword, 10);

    return this.prisma.user.update({
      data: {
        password: hashedPassword
      },
      where: {
        id: foundId.id
      },
    });
  }

  // Hash password
  private hashedPassword(password: any) {
    try {
      const hashedPassword = bcrypt.hash(password, 10);
      return hashedPassword;
    } catch (error) {
      throw new Error('Error hashing password.');
    }
  }
}
