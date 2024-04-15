/*
 * @Date: 2024-01-11 12:54:59
 * @Description: User表
 */
import { Company } from 'apps/boss/src/entities/company.entity';
import { Contact } from 'apps/boss/src/entities/contact.entity';
import { Profile } from 'apps/genius/src/entities/profile.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
    comment: '用户名',
  })
  username: string;

  @Column({
    length: 50,
    comment: '密码',
  })
  password: string;

  @Column({
    length: 50,
    comment: '昵称',
  })
  nickname: string;

  @Column({
    length: 200,
    comment: '头像',
    nullable: true,
  })
  avatar: string;

  @Column({
    length: 50,
    comment: '职业',
    nullable: true,
  })
  occupation: string;

  @Column({
    length: 50,
    default: '',
    comment: '邮箱',
  })
  email: string;

  @Column({
    length: 50,
    comment: '联系ID老板',
    nullable: true,
  })
  contactIdToB: string;

  @Column({
    length: 50,
    comment: '联系ID牛人',
    nullable: true,
  })
  contactIdToC: string;

  @Column({
    length: 50,
    comment: '联系密码',
    nullable: true,
  })
  contactPassword: string;

  @Column({
    comment: '积分',
    default: 0,
  })
  integral: number;

  @ManyToOne(() => Company)
  company: Company;

  @Column({
    nullable: true,
  })
  @RelationId((user: User) => user.company)
  companyId: number;

  @OneToOne(() => Profile)
  @JoinColumn()
  profile: Profile;

  @Column()
  @RelationId((user: User) => user.profile)
  profileId: number;

  @OneToMany(() => Contact, (contact) => contact.user)
  contact: Contact[];

  @Column({
    type: 'simple-array',
    nullable: true,
  })
  @RelationId((user: User) => user.contact)
  contactId: number[];

  @Column({
    default: false,
    comment: '是否冻结',
  })
  isFrozen: boolean;

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
