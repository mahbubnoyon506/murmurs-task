import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Murmur } from "./entities/murmur.entity";
import { User } from "../users/entities/user.entity";
import { Like } from "./entities/like.entity";

@Injectable()
export class MurmursService {
  constructor(
    @InjectRepository(Murmur)
    private murmurRepository: Repository<Murmur>,

    @InjectRepository(Like)
    private likeRepository: Repository<Like>
  ) {}

  // Requirement: Show 10 murmur per page (pagination)
  async getTimeline(page: number = 1) {
    const limit = 10;
    const skip = (page - 1) * limit;

    const [items, total] = await this.murmurRepository.findAndCount({
      relations: ["user", "likes"],
      order: { createdAt: "DESC" },
      take: limit,
      skip: skip,
    });

    return {
      data: items,
      count: total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    // Requirement: Fetch single murmur with user and likes data
    const murmur = await this.murmurRepository.findOne({
      where: { id },
      relations: ["user", "likes"],
    });

    if (!murmur) {
      throw new NotFoundException(`Murmur with ID ${id} not found`);
    }

    return murmur;
  }

  // Requirement: Post murmur
  async create(userId: number, text: string) {
    const murmur = this.murmurRepository.create({
      text,
      user: { id: userId } as User,
    });
    return this.murmurRepository.save(murmur);
  }

  // Requirement: Only the user who posted can delete his murmur
  async remove(murmurId: number, userId: number) {
    const murmur = await this.murmurRepository.findOne({
      where: { id: murmurId },
      relations: ["user"],
    });

    if (!murmur) throw new NotFoundException("Murmur not found");
    if (murmur.user.id !== userId) {
      throw new ForbiddenException("You can only delete your own murmurs");
    }

    await this.murmurRepository.remove(murmur);
    return { success: true };
  }

  async toggleLike(userId: number, murmurId: number) {
    const murmur = await this.murmurRepository.findOne({
      where: { id: murmurId },
    });
    if (!murmur) throw new NotFoundException("Murmur not found");

    // Check if like already exists
    const existingLike = await this.likeRepository.findOne({
      where: {
        user: { id: userId },
        murmur: { id: murmurId },
      },
    });

    if (existingLike) {
      await this.likeRepository.remove(existingLike);
      return { liked: false };
    }

    const newLike = this.likeRepository.create({
      user: { id: userId },
      murmur: { id: murmurId },
    });

    await this.likeRepository.save(newLike);
    return { liked: true };
  }
}
