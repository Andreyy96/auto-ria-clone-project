import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { SoldCarEntity } from '../../../database/entities/sold-car.entity';

@Injectable()
export class SoldCarRepository extends Repository<SoldCarEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(SoldCarEntity, dataSource.manager);
  }
}
