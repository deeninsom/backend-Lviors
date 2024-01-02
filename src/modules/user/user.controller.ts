import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  Res,
  HttpException,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';
import { Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { ChangePasswordDto, CreateUserDto, QueryUserDto, UpdateUserDto } from './user.dto';

@ApiTags('users')
@Controller('users')
@UseGuards(AuthGuard)
@ApiBearerAuth('access-token')
export class UsersController {
  constructor(private readonly userService: UserService) { }

  @Get()
  async get(
    @Query() search: QueryUserDto,
    @Res() res: Response,
  ) {
    try {
      const whereConditions = {
        where: {
          username: {
            contains: search.search
          }
        }
      }

      const {
        data,
        total,
        page: pages,
        totalPages,
        limit
      } = await this.userService.get(search.page, search.limit, whereConditions.where);

      return res.status(200).json({
        status: true,
        message: 'Successfully get user',
        pages,
        totalPages,
        total,
        data,
        limit
      });

    } catch (error) {
      if (error instanceof HttpException) {
        return res
          .status(error.getStatus())
          .json({ status: false, message: error.message });
      } else {
        return res
          .status(500)
          .json({
            status: false,
            message: 'Terjadi kesalahan server !',
            error: error.message,
          });
      }
    }
  }

  @Get(':id')
  async getUserById(@Param('id') id: string, @Res() res: Response) {
    try {
      const data = await this.userService.getId(id);
      return res
        .status(200)
        .json({
          status: true,
          message: 'Successfully get user',
          data,
        });
    } catch (error) {
      if (error instanceof HttpException) {
        return res
          .status(error.getStatus())
          .json({ status: false, message: error.message });
      } else {
        return res
          .status(500)
          .json({
            status: false,
            message: 'Terjadi kesalahan server !',
            error: error.message,
          });
      }
    }
  }

  @Post()
  async create(@Body() payload: CreateUserDto, @Res() res: Response) {
    try {
      const data = await this.userService.create(payload);
      return res
        .status(200)
        .json({
          status: true,
          message: 'Successfully create user',
          data,
        });
    } catch (error) {
      if (error instanceof HttpException) {
        return res
          .status(error.getStatus())
          .json({ status: false, message: error.message });
      } else {
        return res
          .status(500)
          .json({
            status: false,
            message: 'Terjadi kesalahan server !',
            error: error.message,
          });
      }
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() payload: UpdateUserDto,
    @Res() res: Response,
  ) {
    try {
      const data = await this.userService.update(id, payload);
      return res
        .status(200)
        .json({ status: true, message: 'Successfully update user.', data });
    } catch (error) {
      if (error instanceof HttpException) {
        return res
          .status(error.getStatus())
          .json({ status: false, message: error.message });
      } else {
        return res
          .status(500)
          .json({
            status: false,
            message: 'Terjadi kesalahan server !',
            error: error.message,
          });
      }
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.userService.delete(id);
      return res
        .status(200)
        .json({ status: true, message: 'Successfully deleted user', data: {} });
    } catch (error) {
      if (error instanceof HttpException) {
        return res
          .status(error.getStatus())
          .json({ status: false, message: error.message });
      } else {
        return res
          .status(500)
          .json({
            status: false,
            message: 'Terjadi kesalahan server !',
            error: error.message,
          });
      }
    }
  }

  @Post('change-password')
  async changePassword(@Headers() headers: any, @Body() payload: ChangePasswordDto, @Res() res: Response) {
    try {
      const token = headers['authorization'].replace('Bearer ', '');
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
      const data = await this.userService.changePassword(decoded.id, payload);
      return res
        .status(200)
        .json({
          status: true,
          message: 'Successfully create user',
          data,
        });
    } catch (error) {
      if (error instanceof HttpException) {
        return res
          .status(error.getStatus())
          .json({ status: false, message: error.message });
      } else {
        return res
          .status(500)
          .json({
            status: false,
            message: 'Terjadi kesalahan server !',
            error: error.message,
          });
      }
    }
  }
}
