import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LikeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, questionId: number) {
    const isExists = await this.prisma.exists(this.prisma.like, {
      where: {
        userId: userId,
        questionId: questionId,
      },
    });
    if (isExists)
      throw new HttpException(
        "Question déjà appréciée par l'utilisateur",
        HttpStatus.BAD_REQUEST,
      );

    const like = await this.prisma.like.create({
      data: {
        userId: userId,
        questionId: questionId,
      },
    });
    return like;
  }

  async findAll(userId: number) {
    const likedPosts = await this.prisma.like.findMany({
      where: {
        userId,
      },
      select: {
        questionId: true,
      },
    });

    return likedPosts.map((like) => like.questionId);
  }

  async remove(userId: number, questionId: number) {
    const like = await this.prisma.like.deleteMany({
      where: {
        userId: userId,
        questionId: questionId,
      },
    });

    return like;
  }
}
