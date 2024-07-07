import { ConfigStaticService } from '../../../configs/config.static';
import { CarEntity } from '../../../database/entities/car.entity';
import { UserMapper } from '../../user/services/user.mapper';
import { CarListReqDto } from '../dto/req/car-list.req.dto';
import { CarResDto } from '../dto/res/car.res.dto';
import { CarListResDto } from '../dto/res/car-list.res.dto';
import { StatisticCarResDto } from '../dto/res/statistic-car.res.dto';

export class CarMapper {
  public static toResponseDTO(car: CarEntity): CarResDto {
    const awsConfig = ConfigStaticService.get().aws;
    return {
      id: car.id,
      brand: car.brand,
      model: car.model,
      region: car.region,
      user_ccy: car.user_ccy,
      user_price: car.user_price,
      price: car.price,
      base_ccy: car.base_ccy,
      rate: car.rate ? car.rate : null,
      isActive: car.isActive,
      image: car.image ? `${awsConfig.bucketUrl}/${car.image}` : null,
      user: car.user ? UserMapper.toResponseDTO(car.user) : null,
    };
  }

  public static toListResponseDTO(
    entities: CarEntity[],
    total: number,
    query: CarListReqDto,
  ): CarListResDto {
    return {
      data: entities.map(this.toResponseDTO),
      meta: {
        total,
        limit: query.limit,
        offset: query.offset,
      },
    };
  }

  public static toResponseStatistic(
    views: number,
    viewsForWeek: number,
    viewsForMonth: number,
    viewsForYear: number,
  ): StatisticCarResDto {
    return {
      views: views,
      viewsForMonth: viewsForWeek,
      viewsForWeek: viewsForMonth,
      viewsForYear: viewsForYear,
    };
  }
}
