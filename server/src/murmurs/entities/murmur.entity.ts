import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Like } from "./like.entity";
// import { Like } from "./like.entity";

@Entity("murmurs")
export class Murmur {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "text" }) // Supports long murmur text
  text!: string;

  // Requirement: Link to the user who posted
  @ManyToOne(() => User, (user) => user.murmurs, { onDelete: "CASCADE" })
  user!: User;

  // Requirement: Tracking LIKEs for each murmur
  @OneToMany(() => Like, (like) => like.murmur)
  likes!: Like[];

  @CreateDateColumn()
  createdAt!: Date;
}
