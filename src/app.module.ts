import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { ImageController } from './modules/cloudinary/cloudinary.controller';
import { CloudinaryService } from './modules/cloudinary/cloudinary.service';
import cloudinaryConfig from './modules/cloudinary/cloudinary.config';

// module
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';

// prisma service
import { PrismaService } from './prisma.service';
import { PostModule } from './modules/post/post.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'Production'
          ? '.env.production'
          : '.env.development',
      load: [cloudinaryConfig],
    }),

    MulterModule.register(),

    AuthModule,
    UserModule,
    PostModule
  ],
  controllers: [ImageController],
  providers: [PrismaService, CloudinaryService],
})
export class AppModule { }
