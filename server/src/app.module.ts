import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./users/entities/user.entity";
import { Follow } from "./users/entities/follow.entity";
import { Murmur } from "./murmurs/entities/murmur.entity";
import { Like } from "./murmurs/entities/like.entity";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "docker",
      password: "docker",
      database: "test",
      entities: [User, Follow, Murmur, Like],
      synchronize: true, // Auto-creates tables based on entities for development
    }),
    AuthModule,
    // UsersModule,
    // MurmursModule,
  ],
})
export class AppModule {}

// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { User } from './entities/user.entity';

// @Module({
//   imports: [
//     TypeOrmModule.forRoot({
//       type: 'mysql',
//       host: 'localhost',
//       port: 3306,
//       username: 'docker',
//       password: 'docker',
//       database: 'test',
//       entities: [User],
//       synchronize: true,
//     }),
//     TypeOrmModule.forFeature([User]),
//   ],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}
