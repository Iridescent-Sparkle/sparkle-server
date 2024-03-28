import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { JobEducation } from 'apps/boss/src/entities/education.entity';
import { EducationService } from 'apps/boss/src/service/education.service';

@Controller()
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @MessagePattern('initJobEducation')
  initJobEducation() {
    return this.educationService.initJobEducation();
  }

  @MessagePattern('findAllJobEducation')
  findAllJobEducation(): Promise<JobEducation[]> {
    return this.educationService.findAllJobEducation();
  }
}
