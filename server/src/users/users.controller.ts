import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Request,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("api/users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get("all")
  getAllUsers(@Request() req) {
    return this.usersService.getAllUsers(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get("me/profile")
  getOwnProfile(@Request() req) {
    return this.usersService.getProfile(req.user.userId);
  }

  @Get(":id")
  getProfile(@Param("id") id: string) {
    return this.usersService.getProfile(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(":id/follow")
  follow(@Request() req, @Param("id") id: string) {
    return this.usersService.toggleFollow(req.user.userId, +id);
  }

  @Get(":id/followers")
  getFollowers(@Param("id") id: string) {
    return this.usersService.getFollowers(+id);
  }

  // New endpoint: Get who this user is following
  @Get(":id/following")
  getFollowing(@Param("id") id: string) {
    return this.usersService.getFollowing(+id);
  }
}
