import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { Follow } from "./entities/follow.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Follow) private followRepository: Repository<Follow>
  ) {}

  // Requirement: User Detail (name, followCount, followedCount, murmurs)
  async getProfile(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ["murmurs"],
    });

    if (!user) throw new NotFoundException("User not found");

    const followCount = await this.followRepository.count({
      where: { follower: { id } },
    });
    const followedCount = await this.followRepository.count({
      where: { following: { id } },
    });

    return {
      id: user.id,
      name: user.username,
      followCount,
      followedCount,
      murmurs: user.murmurs,
    };
  }

  // Requirement: Follow other users
  async toggleFollow(followerId: number, followingId: number) {
    if (followerId === followingId)
      throw new BadRequestException("Cannot follow yourself");

    const existing = await this.followRepository.findOne({
      where: { follower: { id: followerId }, following: { id: followingId } },
    });

    if (existing) {
      await this.followRepository.remove(existing);
      return { following: false };
    }

    const follow = this.followRepository.create({
      follower: { id: followerId },
      following: { id: followingId },
    });
    await this.followRepository.save(follow);
    return { following: true };
  }
}
