import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { UserRoleEnum } from '../../common/enums/user-role.enum';
import { CarShowroomEntity } from './car-showroom.entity';
import { TableNameEnum } from './enums/table-name.enum';
import { BaseModel } from './models/base.model';

@Entity({ name: TableNameEnum.ADMIN_CAR_SHOWROOM })
export class AdminCarShowroomEntity extends BaseModel {
  @Column('text')
  name: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text', { select: false })
  password: string;

  @Column('enum', { enum: UserRoleEnum, default: UserRoleEnum.ADMIN })
  role: UserRoleEnum;

  @Column('text', { nullable: true })
  image?: string;

  @Column()
  car_showroom_id: string;
  @ManyToOne(() => CarShowroomEntity, (entity) => entity.admins)
  @JoinColumn({ name: 'car_showroom_id' })
  carShowroom?: CarShowroomEntity;
}
