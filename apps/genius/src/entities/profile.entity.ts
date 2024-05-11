import { User } from 'apps/user/src/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Education } from './education.entity';
import { Project } from './project.entity';
import { Volunteer } from './volunteer.entity';
import { Experience } from './experience.entity';

@Entity({
  name: 'profile',
  comment: '个人信息表',
})
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user: User) => user.profile)
  user: User;

  @OneToMany(() => Education, (education) => education.profile)
  education: Education[];

  @OneToMany(() => Project, (project) => project.profile)
  project: Project[];

  @OneToMany(() => Volunteer, (volunteer) => volunteer.profile)
  volunteer: Volunteer[];

  @OneToMany(() => Experience, (experience) => experience.profile)
  experience: Experience[];

  @Column({
    comment: '职业',
    default: '',
  })
  occupation: string;

  @Column({
    comment: '地址',
    default: '',
  })
  address: string;

  @Column({
    comment: '联系电话',
    default: '',
  })
  phone: string;

  @Column({
    comment: '邮箱',
    default: '',
  })
  email: string;

  @Column({
    comment: '最小期望薪资',
    default: '',
  })
  minSalary: string;

  @Column({
    comment: '最大期望薪资',
    default: '',
  })
  maxSalary: string;

  @Column({
    comment: '个人总结',
    type: 'longtext',
    nullable: true,
  })
  summary: string;

  @Column({
    comment: '简历pdf',
    type: 'json',
    nullable: true,
  })
  resume: string;

  @Column({
    default: false,
    comment: '是否求职中',
  })
  isHunting: boolean;

  @Column({
    default: false,
    comment: '是否删除',
  })
  isDelete: boolean;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
