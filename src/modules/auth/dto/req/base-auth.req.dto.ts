import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { BaseAdminReqDto } from '../../../admin/dto/req/base-admin.req.dto';
import { BaseUserReqDto } from '../../../user/dto/req/base-user.req.dto';

export class BaseAuthReqDto extends PickType(BaseUserReqDto, [
  'email',
  'password',
  'image',
  'phone',
  'name',
]) {
  @IsNotEmpty()
  @IsString()
  readonly deviceId: string;
}

export class BaseAuthForPersonalReqDto extends PickType(BaseAdminReqDto, [
  'email',
  'password',
  'image',
  'name',
]) {
  @IsNotEmpty()
  @IsString()
  readonly deviceId: string;
}
