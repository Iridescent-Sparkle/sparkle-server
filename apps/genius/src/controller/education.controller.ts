import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { EducationService } from '../service/education.service';
import { Education } from '../entities/education.entity';

@Controller('education')
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Get('user/:userId')
  async findEducationByUserId(@Param('userId') userId: number) {
    return this.educationService.findEducationByUserId(userId);
  }

  @Post('create')
  async createEducation(@Body() education: Education) {
    return this.educationService.createEducation(education);
  }

  @Put('update')
  async updateEducation(@Body() education: Education) {
    return this.educationService.updateEducation(education);
  }

  @Delete('remove')
  async deleteEducation(@Body() education: Education) {
    return this.educationService.deleteEducation(education.id);
  }
}
