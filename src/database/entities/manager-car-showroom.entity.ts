import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { UserRoleEnum } from '../../common/enums/user-role.enum';
// import { RefreshTokenEntity } from './refresh-token.entity';
import { CarShowroomEntity } from './car-showroom.entity';
// import { AccessTokenEntity } from './access-token.entity';
import { TableNameEnum } from './enums/table-name.enum';
import { BaseModel } from './models/base.model';

@Entity({ name: TableNameEnum.MANAGERS_CAR_SHOWROOM })
export class ManagerCarShowroomEntity extends BaseModel {
  @Column('text')
  name: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text', { select: false })
  password: string;

  @Column('enum', { enum: UserRoleEnum, default: UserRoleEnum.MANAGER })
  role: UserRoleEnum;

  @Column('text', { nullable: true })
  image?: string;

  @Column()
  car_showroom_id: string;
  @ManyToOne(() => CarShowroomEntity, (entity) => entity.managers)
  @JoinColumn({ name: 'car_showroom_id' })
  carShowroom?: CarShowroomEntity;
}
