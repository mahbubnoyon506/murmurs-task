import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./users/entities/user.entity";
import { Follow } from "./users/entities/follow.entity";
import { Murmur } from "./murmurs/entities/murmur.entity";
import { Like } from "./murmurs/entities/like.entity";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { MurmursModule } from "./murmurs/murmurs.module";

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
    UsersModule,
    MurmursModule,
  ],
})
export class AppModule {}
