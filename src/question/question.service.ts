import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';

import { LikeService } from 'src/like/like.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class QuestionService {
  constructor(
    private readonly likeds: LikeService,
    private readonly prisma: PrismaService,
  ) {}

  async create(id, dto: CreateQuestionDto) {
    const question = await this.prisma.question.create({
      data: { ...dto, userId: id },
    });
    return question;
  }

  async findAll(userId: number) {
    const questions = await this.prisma.question.findMany({
      select: {
        id: true,
        title: true,
        descreption: true,
        createdAt: true,
        answer: {
          select: {
            message: true,
            createdAt: true,
          },
        },
        like: {
          select: {
            id: true,
            createdAt: true,
          },
        },
      },
    });

    const userLikedIds = await this.likeds.findAll(userId);

    return questions.map((post) => ({
      id: post.id,
      title: post.title,
      createdAt: post.createdAt,
      descreption: post.descreption,
      answers: post.answer,
      liked: userLikedIds.includes(post.id),
      totalLikes: post.like ? post.like.length : 0,
    }));
  }
}
