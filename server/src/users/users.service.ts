import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Not, Repository } from "typeorm";
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

  async getAllUsers(currentUserId: number) {
    return this.userRepository.find({
      where: { id: Not(currentUserId) }, // Exclude self
      select: ["id", "username"], // Only send necessary data
    });
  }

  // Get users following a specific person
  async getFollowers(userId: number) {
    const follows = await this.followRepository.find({
      where: { following: { id: userId } },
      relations: ["follower"],
    });
    return follows.map((f) => f.follower);
  }

  // Get users that a specific person is following
  async getFollowing(userId: number) {
    const follows = await this.followRepository.find({
      where: { follower: { id: userId } },
      relations: ["following"],
    });
    return follows.map((f) => f.following);
  }

  // Updated All Users with "isFollowed" status for the Discover page
  async getAllUsersWithStatus(currentUserId: number) {
    const users = await this.userRepository.find({
      where: { id: Not(currentUserId) },
    });

    const myFollowing = await this.followRepository.find({
      where: { follower: { id: currentUserId } },
      relations: ["following"],
    });

    const followingIds = myFollowing.map((f) => f.following.id);

    return users.map((user) => ({
      ...user,
      isFollowed: followingIds.includes(user.id),
    }));
  }
}
