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
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PostService } from './post.service';
import { AuthGuard } from '../auth/auth.guard';
import { Response } from 'express';
import { CreatePostDto, QueryPostDto, UpdatePostDto } from './post.dto';

@ApiTags('post')
@Controller('post')
@UseGuards(AuthGuard)
@ApiBearerAuth('access-token')
export class PostController {
  constructor(private readonly postService: PostService) { }

  @Get()
  async get(
    @Query() search: QueryPostDto,
    @Res() res: Response,
  ) {
    try {
      const whereConditions = {
        where: {
          OR: [
            {
              caption: {
                contains: search.search,
              },
            },
            {
              tags: {
                contains: search.search,
              },
            },
            {
              author_id: {
                contains: search.user_id,
              },
            },
          ],
        },
      };
      

      const {
        data,
        total,
        page: pages,
        totalPages,
        limit
      } = await this.postService.get(search.page, search.limit, search);

      return res.status(200).json({
        status: true,
        message: 'Successfully get post',
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
  async getId(@Param('id') id: string, @Res() res: Response) {
    try {
      const data = await this.postService.getId(id);
      return res
        .status(200)
        .json({
          status: true,
          message: 'Successfully get post',
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
  async create(@Body() payload: CreatePostDto, @Res() res: Response) {
    try {
      const data = await this.postService.create(payload);
      return res
        .status(200)
        .json({
          status: true,
          message: 'Successfully create post',
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
    @Body() payload: UpdatePostDto,
    @Res() res: Response,
  ) {
    try {
      const data = await this.postService.update(id, payload);
      return res
        .status(200)
        .json({ status: true, message: 'Successfully update post.', data });
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
      await this.postService.delete(id);
      return res
        .status(200)
        .json({ status: true, message: 'Successfully deleted post', data: {} });
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

  @Put('like/:id')
  async likes(@Param('id') id: string, @Res() res: Response) {
    try {
      const data = await this.postService.likes(id);
      return res
        .status(200)
        .json({
          status: true,
          message: 'Successfully likes post',
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

  @Put('unlike/:id')
  async unlikes(@Param('id') id: string, @Res() res: Response) {
    try {
      const data = await this.postService.unlikes(id);
      return res
        .status(200)
        .json({
          status: true,
          message: 'Successfully likes post',
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
