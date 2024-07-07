import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { CarEntity } from '../../../database/entities/car.entity';
import { CarListReqDto } from '../../car/dto/req/car-list.req.dto';

@Injectable()
export class CarRepository extends Repository<CarEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(CarEntity, dataSource.manager);
  }

  public async getList(query: CarListReqDto): Promise<[CarEntity[], number]> {
    const qb = this.createQueryBuilder('car');
    qb.andWhere('car.isActive = :is_active');
    qb.leftJoinAndSelect('car.user', 'user');

    if (query.search) {
      qb.andWhere('CONCAT(LOWER(car.brand), LOWER(car.model)) LIKE :search');
      qb.setParameter('search', `%${query.search}%`);
    }

    qb.setParameter('is_active', true);

    qb.take(query.limit);
    qb.skip(query.offset);

    return await qb.getManyAndCount();
  }

  public async getNoActiveList(
    query: CarListReqDto,
  ): Promise<[CarEntity[], number]> {
    const qb = this.createQueryBuilder('car');
    qb.andWhere('car.isActive = :is_active');
    qb.leftJoinAndSelect('car.user', 'user');

    if (query.search) {
      qb.andWhere('CONCAT(LOWER(car.brand), LOWER(car.model)) LIKE :search');
      qb.setParameter('search', `%${query.search}%`);
    }

    qb.setParameter('is_active', false);

    qb.take(query.limit);
    qb.skip(query.offset);

    return await qb.getManyAndCount();
  }

  public async findCarById(carId: string): Promise<CarEntity> {
    const qb = this.createQueryBuilder('car');
    qb.leftJoinAndSelect('car.user', 'user');

    qb.where('car.id = :carId');
    qb.setParameter('carId', carId);

    return await qb.getOne();
  }
}
