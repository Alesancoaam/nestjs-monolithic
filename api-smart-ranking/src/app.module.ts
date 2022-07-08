import { Module } from '@nestjs/common';
import { PlayersModule } from './players/players.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CategoriesModule } from './categories/categories.module';
import { ChallengesModule } from './challenges/challenges.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: `${configService.get<string>('MONGO_SR_URL')}/${configService.get<string>(
          'MONGO_SR_DB',
        )}`,
      }),
    }),
    PlayersModule,
    CategoriesModule,
    ChallengesModule,
  ],
})
export class AppModule {}
