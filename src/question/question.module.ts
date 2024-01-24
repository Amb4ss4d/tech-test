import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';

import { LikeModule } from 'src/like/like.module';

@Module({
  imports: [LikeModule],
  providers: [QuestionService],
  controllers: [QuestionController],
})
export class QuestionModule {}
