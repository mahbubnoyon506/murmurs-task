import { Like } from "src/murmurs/entities/like.entity";
import { Murmur } from "src/murmurs/entities/murmur.entity";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
} from "typeorm";
import { Follow } from "./follow.entity";
// import { Murmur } from "../../murmurs/entities/murmur.entity";
// import { Like } from "../../murmurs/entities/like.entity";
// import { Follow } from "./follow.entity";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ select: false }) // Password won't be returned in standard queries
  password!: string;

  @OneToMany(() => Murmur, (murmur) => murmur.user)
  murmurs!: Murmur[];

  @OneToMany(() => Like, (like) => like.user)
  likes!: Like[];

  @OneToMany(() => Follow, (follow) => follow.follower)
  following!: Follow[];

  @OneToMany(() => Follow, (follow) => follow.following)
  followers!: Follow[];

  @CreateDateColumn()
  createdAt!: Date;
}
