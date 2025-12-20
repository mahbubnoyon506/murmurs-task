import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from "@nestjs/common";
import { MurmursService } from "./murmurs.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CreateMurmurDto } from "./dto/create-murmur.dto";

@Controller("api")
export class MurmursController {
  constructor(private readonly murmursService: MurmursService) {}

  // [GET] /api/murmurs/
  @Get("murmurs")
  getTimeline(@Query("page") page: string) {
    return this.murmursService.getTimeline(parseInt(page) || 1);
  }

  @Get("/murmurs/:id")
  // Requirement: Public or protected access to single murmur detail
  getOne(@Param("id") id: string) {
    return this.murmursService.findOne(+id);
  }

  // [POST] /api/me/murmurs/
  @UseGuards(JwtAuthGuard)
  @Post("me/murmurs")
  create(@Request() req, @Body() dto: CreateMurmurDto) {
    return this.murmursService.create(req.user.userId, dto.text);
  }

  // [DELETE] /api/me/murmurs/:id/
  @UseGuards(JwtAuthGuard)
  @Delete("me/murmurs/:id")
  remove(@Request() req, @Param("id") id: string) {
    return this.murmursService.remove(+id, req.user.userId);
  }

  // [POST] /api/murmurs/:id/like
  @UseGuards(JwtAuthGuard)
  @Post("murmurs/:id/like")
  toggleLike(@Request() req, @Param("id") id: string) {
    return this.murmursService.toggleLike(req.user.userId, +id);
  }
}
