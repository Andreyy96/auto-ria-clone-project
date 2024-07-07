import { PickType } from '@nestjs/swagger';

import { BaseAuthForPersonalReqDto, BaseAuthReqDto } from './base-auth.req.dto';

export class SignUpReqDto extends PickType(BaseAuthReqDto, [
  'email',
  'password',
  'image',
  'phone',
  'name',
  'deviceId',
]) {}

export class SignUpForPersonalReqDto extends PickType(
  BaseAuthForPersonalReqDto,
  ['email', 'password', 'image', 'name', 'deviceId'],
) {}
