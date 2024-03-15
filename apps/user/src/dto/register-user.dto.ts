import { IsNotEmpty } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  username: string;

  @IsNotEmpty({
    message: '密码不能为空',
  })
  password: string;

  @IsNotEmpty({
    message: '手机号不能为空',
  })
  phone: string;

  @IsNotEmpty({
    message: '验证码不能为空',
  })
  captcha: string;
}
