import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JobDetail } from '../entities/job.entity';
import { Repository } from 'typeorm';
import { JobCategory } from '../entities/category.entity';
import { User } from 'apps/user/src/entities/user.entity';

@Injectable()
export class JobService {
  @InjectRepository(JobDetail)
  private jobDetailRepository: Repository<JobDetail>;

  @InjectRepository(JobCategory)
  private jobCategoryRepository: Repository<JobCategory>;

  @InjectRepository(User)
  private userRepository: Repository<User>;

  constructor() {}

  async initializeJobDetails(): Promise<void> {
    const jobCategory = await this.jobCategoryRepository.findOne({
      where: { id: Math.floor(Math.random() * (5 - 1 + 1)) + 1 },
    });
    const user = await this.userRepository.findOne({
      where: { id: 1 },
    });
    const jobDetailsData = [
      {
        jobName: 'Software Engineer',
        companyName: 'ABC Tech',
        companyAvatar: 'avatar.jpg',
        address: '123 Street, City',
        minSalary: '5000',
        maxSalary: '8000',
        isFullTime: true,
        isOnsite: false,
        jobDescription: ['Description 1', 'Description 2'],
        jobRequirements: ['Requirement 1', 'Requirement 2'],
        jobBonus: ['Bonus 1', 'Bonus 2'],
        workExperience: '2 years',
        educationRequirement: 'Bachelor',
        jobLevel: 'Senior',
        jobCategory: jobCategory,
        headCount: 5,
        website: 'www.abctech.com',
        companyDescription: 'ABC Tech is a leading tech company.',
        isFrozen: false,
        user: user,
      },
    ];

    for (const data of jobDetailsData) {
      const jobDetail = this.jobDetailRepository.create(data);
      await this.jobDetailRepository.save(jobDetail);
    }
  }

  async create({ jobDetail }: { jobDetail: JobDetail }): Promise<JobDetail> {
    return await this.jobDetailRepository.save(jobDetail);
  }

  async findAll({}: object): Promise<{ jobDetail: JobDetail[] }> {
    const jobDetail = await this.jobDetailRepository.find({
      relations: ['jobCategory'],
    });

    return {
      jobDetail,
    };
  }

  async findOne({ jobId }: { jobId: number }): Promise<JobDetail> {
    return await this.jobDetailRepository.findOne({
      where: {
        id: jobId,
      },
    });
  }

  async update({
    jobId,
    jobDetail,
  }: {
    jobId: number;
    jobDetail: JobDetail;
  }): Promise<JobDetail> {
    await this.jobDetailRepository.update(jobId, jobDetail);
    return await this.jobDetailRepository.findOne({
      where: {
        id: jobId,
      },
    });
  }

  async remove({ jobId }: { jobId: number }): Promise<void> {
    await this.jobDetailRepository.delete(jobId);
  }

  async search({ keyword }: { keyword: string }): Promise<JobDetail[]> {
    return await this.jobDetailRepository
      .createQueryBuilder('jobDetail')
      .where('jobDetail.jobName LIKE :keyword', { keyword: `%${keyword}%` })
      .getMany();
  }

  async paginate({
    page,
    take,
  }: {
    page: number;
    take: number;
  }): Promise<JobDetail[]> {
    const skip = (page - 1) * take;
    return await this.jobDetailRepository
      .createQueryBuilder('jobDetail')
      .orderBy('jobDetail.id', 'DESC')
      .skip(skip)
      .take(take)
      .getMany();
  }
}
