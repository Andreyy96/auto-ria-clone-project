import { CarResDto } from './car.res.dto';

export class CarListResDto {
  data: CarResDto[];
  meta: {
    total: number;
    limit: number;
    offset: number;
  };
}
