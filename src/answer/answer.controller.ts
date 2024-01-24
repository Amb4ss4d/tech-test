import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AnswerService } from './answer.service';
import { CreateAnswerDto } from './dto/create-answer.dto';

import { AuthGuard } from 'src/common/guard/auth.guard';
import { User } from 'src/common/decorators/user.decorator';

@Controller('answer')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @UseGuards(AuthGuard)
  @Post(':id')
  create(
    @Param('id') id: string,
    @User('id') userId: number,
    @Body() createAnswerDto: CreateAnswerDto,
  ) {
    return this.answerService.create(userId, +id, createAnswerDto);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findAll(@Param('id') id: string) {
    return this.answerService.findAll(+id);
  }
}
