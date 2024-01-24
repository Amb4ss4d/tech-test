import { Injectable } from '@nestjs/common';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AnswerService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId, questionId, dto: CreateAnswerDto) {
    const answer = await this.prisma.answer.create({
      data: { ...dto, userId: userId, questionId: questionId },
    });
    return answer;
  }

  async findAll(id) {
    const answers = await this.prisma.answer.findMany({
      where: { questionId: id },
      select: {
        id: true,
        message: true,
      },
    });
    return answers;
  }
}
