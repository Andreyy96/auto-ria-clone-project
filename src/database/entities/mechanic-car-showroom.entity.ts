import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { CarShowroomEntity } from './car-showroom.entity';
import { TableNameEnum } from './enums/table-name.enum';
import { BaseModel } from './models/base.model';

@Entity({ name: TableNameEnum.MECHANIC_CAR_SHOWROOM })
export class MechanicCarShowroomEntity extends BaseModel {
  @Column('text')
  name: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text', { select: false })
  password: string;

  @Column()
  car_showroom_id: string;
  @ManyToOne(() => CarShowroomEntity, (entity) => entity.mechanics)
  @JoinColumn({ name: 'car_showroom_id' })
  carShowroom?: CarShowroomEntity;
}
