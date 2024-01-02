import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  image_profile: string;
}

export class UpdateUserDto {

  @ApiProperty()
  @IsOptional()
  username: string;

  @ApiProperty()
  @IsOptional()
  email: string;

  @ApiProperty()
  @IsOptional()
  password?: string;

  @ApiProperty()
  @IsOptional()
  image_profile?: string;

}

export class QueryUserDto {

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
    description: 'Find by username',
    required: false
  })
  @IsOptional()
  search?: string;

}

export class ChangePasswordDto {

  @ApiProperty()
  @IsNotEmpty()
  oldPassword?: string;

  @ApiProperty()
  @IsNotEmpty()
  newPassword?: string;

  @ApiProperty()
  @IsNotEmpty()
  confirmNewPassword?: string;

}
