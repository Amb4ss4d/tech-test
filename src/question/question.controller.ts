import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';

import { AuthGuard } from 'src/common/guard/auth.guard';
import { User } from 'src/common/decorators/user.decorator';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(
    @User('id') userId: number,
    @Body() createQuestionDto: CreateQuestionDto,
  ) {
    return this.questionService.create(userId, createQuestionDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@User('id') userId: number) {
    return this.questionService.findAll(userId);
  }
}
