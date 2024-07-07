import { Column, Entity, OneToMany } from 'typeorm';

import { AdminCarShowroomEntity } from './admin-car-showroom.entity';
import { TableNameEnum } from './enums/table-name.enum';
import { ManagerCarShowroomEntity } from './manager-car-showroom.entity';
import { MechanicCarShowroomEntity } from './mechanic-car-showroom.entity';
import { BaseModel } from './models/base.model';
import { UserCarShowroomEntity } from './user-car-showroom.entity';

@Entity({ name: TableNameEnum.CAR_SHOWROOMS })
export class CarShowroomEntity extends BaseModel {
  @Column('text')
  name: string;

  @Column('text')
  region: string;

  @OneToMany(() => AdminCarShowroomEntity, (entity) => entity.carShowroom)
  admins?: AdminCarShowroomEntity[];

  @OneToMany(() => ManagerCarShowroomEntity, (entity) => entity.carShowroom)
  managers?: ManagerCarShowroomEntity[];

  @OneToMany(() => UserCarShowroomEntity, (entity) => entity.carShowroom)
  users?: UserCarShowroomEntity[];

  @OneToMany(() => MechanicCarShowroomEntity, (entity) => entity.carShowroom)
  mechanics?: MechanicCarShowroomEntity[];
}
