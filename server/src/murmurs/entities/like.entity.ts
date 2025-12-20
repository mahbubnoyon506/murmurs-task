import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Unique,
} from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Murmur } from "./murmur.entity";

@Entity("likes")
@Unique(["user", "murmur"]) // Requirement: User can add LIKE (preventing duplicates)
export class Like {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.likes, { onDelete: "CASCADE" })
  user!: User;

  @ManyToOne(() => Murmur, (murmur) => murmur.likes, { onDelete: "CASCADE" })
  murmur!: Murmur;

  @CreateDateColumn()
  createdAt!: Date;
}
