import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Post } from '@prisma/client';
import { CreatePostDto, QueryPostDto } from './post.dto';


@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) { }

  async get(page: number, limit: number, search: QueryPostDto) {

    if (page <= 0) {
      page = 1
    }

    const whereConditions: any = {}

    if (search.search) {
      whereConditions.OR = [
        { caption: { contains: search.search } },
        { tags: { contains: search.search } }
      ];
    }

    if (search.user_id) {
      whereConditions.author_id = { contains: search.user_id }
    }

    const [data, total] = await Promise.all([
      this.prisma.post.findMany({
        where: whereConditions,
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.post.count({
        where: whereConditions,
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
  ): Promise<Post | null> {
    const foundId = await this.prisma.post.findUnique({
      where: {
        id: id
      },
    });

    if (!foundId) {
      throw new HttpException(`Post with id ${foundId} not found !`, HttpStatus.NOT_FOUND)
    }

    return foundId
  }


  async create(payload: CreatePostDto) {

    // Create the post
    const createUser = await this.prisma.post.create({
      data: {
        caption: payload.caption,
        tags: payload.tags,
        image: payload.image,
        author: { connect: { id: payload.author } }
      },
    });

    return createUser
  }

  async update(id: any, data: any): Promise<Post> {

    // cheking user first
    const foundId = this.prisma.post.findUnique({
      where: {
        id: id
      }
    });

    if (!foundId) {
      throw new HttpException(`Post with id ${foundId} not found !`, HttpStatus.NOT_FOUND)
    }

    return this.prisma.post.update({
      data,
      where: {
        id: (await foundId).id
      },
    });
  }

  async delete(id: any): Promise<Post> {
    // cheking user first
    const foundId = await this.prisma.post.findUnique({
      where: {
        id: id
      }
    });

    if (!foundId) {
      throw new HttpException(`Post with id ${foundId} not found !`, HttpStatus.NOT_FOUND)
    }

    return this.prisma.post.delete({
      where: {
        id: id
      },
    });
  }

  async likes(id: any) {
    // cheking user first
    const foundId = await this.prisma.post.findUnique({
      where: {
        id: id
      }
    });

    if (!foundId) {
      throw new HttpException(`Post with id ${foundId} not found !`, HttpStatus.NOT_FOUND)
    }

    return this.prisma.post.update({
      data: {
        likes: foundId.likes + 1
      },
      where: {
        id: (await foundId).id
      },
    });
  }

  async unlikes(id: any) {
    // cheking user first
    const foundId = await this.prisma.post.findUnique({
      where: {
        id: id
      }
    });

    if (!foundId) {
      throw new HttpException(`Post with id ${foundId} not found !`, HttpStatus.NOT_FOUND)
    }

    return this.prisma.post.update({
      data: {
        likes: foundId.likes - 1
      },
      where: {
        id: (await foundId).id
      },
    });
  }

}
