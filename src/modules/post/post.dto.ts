import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class CreatePostDto {
  @ApiProperty()
  caption: string;

  @ApiProperty()
  tags: string;

  @ApiProperty()
  image: string;

  @ApiProperty()
  author: string;
}

export class UpdatePostDto {

  @ApiProperty()
  @IsOptional()
  caption: string;

  @ApiProperty()
  @IsOptional()
  tags: string;

  @ApiProperty()
  @IsOptional()
  image: string;

}

export class QueryPostDto {

  @ApiProperty({
    description: 'Set page',
    required: true
  })
  @IsOptional()
  page?: number;

  @ApiProperty({
    description: 'Set limit',
    required: true
  })
  @IsOptional()
  limit?: number;

  @ApiProperty({
    description: 'Find by keyword or caption',
    required: false
  })
  @IsOptional()
  search?: string;

  @ApiProperty({
    description: 'Find User ID',
    required: false
  })
  @IsOptional()
  user_id?: string;
}

export class LikePostDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  likes: number;
}