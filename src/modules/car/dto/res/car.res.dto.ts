import { PickType } from '@nestjs/swagger';

import { UserResDto } from '../../../user/dto/res/user.res.dto';
import { BaseCarResDto } from './base-car.res.dto';

export class CarResDto extends PickType(BaseCarResDto, [
  'id',
  'brand',
  'model',
  'region',
  'user_ccy',
  'user_price',
  'image',
  'price',
  'base_ccy',
  'rate',
  'isActive',
]) {
  user?: UserResDto;
}
