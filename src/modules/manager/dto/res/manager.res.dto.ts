import { PickType } from '@nestjs/swagger';

import { BaseManagerResDto } from './base-manager.res.dto';

export class ManagerResDto extends PickType(BaseManagerResDto, [
  'id',
  'name',
  'email',
  'role',
  'image',
]) {}
