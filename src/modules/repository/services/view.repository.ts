import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { TimeHelper } from '../../../common/helpers/time.helper';
import { ViewEntity } from '../../../database/entities/view.entity';

@Injectable()
export class ViewRepository extends Repository<ViewEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(ViewEntity, dataSource.manager);
  }

  public async getViews(carId: string): Promise<ViewEntity[]> {
    const qb = this.createQueryBuilder('view');
    qb.leftJoin('view.car', 'car');

    qb.where('view.car_id = :carId');

    qb.setParameter('carId', carId);

    return await qb.getMany();
  }

  public async getViewsByWeek(carId: string): Promise<ViewEntity[]> {
    const qb = this.createQueryBuilder('view');
    qb.leftJoin('view.car', 'car');

    qb.where('view.car_id = :carId');
    qb.where('view.created >= :time');

    qb.setParameter('carId', carId);
    qb.setParameter('time', TimeHelper.subtractByParams(7, 'days'));

    return await qb.getMany();
  }

  public async getViewsByMonth(carId: string): Promise<ViewEntity[]> {
    const qb = this.createQueryBuilder('view');
    qb.leftJoin('view.car', 'car');

    qb.where('view.car_id = :carId');
    qb.where('view.created >= :time');

    qb.setParameter('carId', carId);
    qb.setParameter('time', TimeHelper.subtractByParams(1, 'months'));

    return await qb.getMany();
  }

  public async getViewsByYear(carId: string): Promise<ViewEntity[]> {
    const qb = this.createQueryBuilder('view');
    qb.leftJoin('view.car', 'car');

    qb.where('view.car_id = :carId');
    qb.where('view.created >= :time');

    qb.setParameter('carId', carId);
    qb.setParameter('time', TimeHelper.subtractByParams(1, 'years'));

    return await qb.getMany();
  }
}
