import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { User } from "../users/entities/user.entity";
import { RegisterDto } from "./dto/register.dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  async register(registerDto: RegisterDto) {
    const { username, email, password } = registerDto;

    // Check if user exists
    const existingUser = await this.userRepository.findOne({
      where: [{ email }, { username }],
    });
    if (existingUser) throw new ConflictException("User already exists");

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
    });

    await this.userRepository.save(user);
    return { message: "User registered successfully" };
  }

  async login(email: string, pass: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ["id", "username", "password"], // Explicitly select password for comparison
    });

    if (user && (await bcrypt.compare(pass, user.password))) {
      const payload = { sub: user.id, username: user.username };
      return {
        access_token: this.jwtService.sign(payload),
        user: { id: user.id, username: user.username },
      };
    }
    throw new UnauthorizedException("Invalid credentials");
  }
}
