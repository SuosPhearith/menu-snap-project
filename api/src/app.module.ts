import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ArticlesModule } from './articles/articles.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { SlideModule } from './slide/slide.module';

@Module({
  imports: [PrismaModule, ArticlesModule, AuthModule, UserModule, RestaurantModule, SlideModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
