import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JobDetail } from './entities/job.entity';
import { Repository } from 'typeorm';
import { JobCategory } from './entities/category.entity';

@Injectable()
export class BossService {
  constructor(
    @InjectRepository(JobDetail)
    private jobDetailRepository: Repository<JobDetail>,
  ) {}
  @InjectRepository(JobCategory)
  private jobCategoryRepository: Repository<JobCategory>;

  async initializeJobDetails(): Promise<void> {
    const jobCategory = await this.jobCategoryRepository.findOne({
      where: { id: Math.floor(Math.random() * (5 - 1 + 1)) + 1 },
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
      },
    ];

    for (const data of jobDetailsData) {
      const jobDetail = this.jobDetailRepository.create(data);
      await this.jobDetailRepository.save(jobDetail);
    }

    console.log('Job details initialized successfully.');
  }

  async create(jobDetail: JobDetail): Promise<JobDetail> {
    return await this.jobDetailRepository.save(jobDetail);
  }

  async findAll(): Promise<JobDetail[]> {
    return await this.jobDetailRepository.find({
      relations: ['jobCategory'],
    });
  }

  async findOne(id: number): Promise<JobDetail> {
    return await this.jobDetailRepository.findOne({
      where: {
        id,
      },
    });
  }

  async update(id: number, jobDetail: JobDetail): Promise<JobDetail> {
    await this.jobDetailRepository.update(id, jobDetail);
    return await this.jobDetailRepository.findOne({
      where: {
        id,
      },
    });
  }

  async remove(id: number): Promise<void> {
    await this.jobDetailRepository.delete(id);
  }

  async search(keyword: string): Promise<JobDetail[]> {
    return await this.jobDetailRepository
      .createQueryBuilder('jobDetail')
      .where('jobDetail.jobName LIKE :keyword', { keyword: `%${keyword}%` })
      .getMany();
  }

  async paginate(page: number, take: number): Promise<JobDetail[]> {
    const skip = (page - 1) * take;
    return await this.jobDetailRepository
      .createQueryBuilder('jobDetail')
      .orderBy('jobDetail.id', 'DESC')
      .skip(skip)
      .take(take)
      .getMany();
  }
}
