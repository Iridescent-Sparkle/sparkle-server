import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Education } from '../entities/education.entity';
import { EducationService } from '../service/education.service';

@Controller('education')
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @MessagePattern('findEducationByUserId')
  async findEducationByUserId(userId: number) {
    return this.educationService.findEducationByUserId(userId);
  }

  @MessagePattern('createEducation')
  async createEducation(education: Education) {
    return this.educationService.createEducation(education);
  }

  @MessagePattern('updateEducation')
  async updateEducation(education: Education) {
    return this.educationService.updateEducation(education);
  }

  @MessagePattern('deleteEducation')
  async deleteEducation(education: Education) {
    return this.educationService.deleteEducation(education.id);
  }
}
