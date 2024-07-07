import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { TableNameEnum } from './enums/table-name.enum';
import { BaseModel } from './models/base.model';
import { UserEntity } from './user.entity';

@Entity({ name: TableNameEnum.SOLD_CARS })
export class SoldCarEntity extends BaseModel {
  @Column('text')
  brand: string;

  @Column('text')
  model: string;

  @Column('text')
  price: string;

  @Column('text')
  region: string;

  @Column()
  user_id: string;
  @ManyToOne(() => UserEntity, (entity) => entity.soldCars)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;
}
