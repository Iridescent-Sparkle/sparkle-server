import { ApiProperty } from '@nestjs/swagger';

class AdminUser {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  nickname: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  isFrozen: boolean;

  @ApiProperty()
  avatar: string;

  @ApiProperty()
  createTime: Date;
}

export class UserListVo {
  @ApiProperty({
    type: [AdminUser],
  })
  users: AdminUser[];

  @ApiProperty()
  totalCount: number;
}
