import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { UserRoleEnum } from '../../common/enums/user-role.enum';
import { TypeUserAccountEnum } from '../../modules/user/enums/type-user-account.enum';
import { CarShowroomEntity } from './car-showroom.entity';
// import { AccessTokenEntity } from './access-token.entity';
import { TableNameEnum } from './enums/table-name.enum';
import { BaseModel } from './models/base.model';
// import { RefreshTokenEntity } from './refresh-token.entity';

@Entity({ name: TableNameEnum.USERS_CAR_SHOWROOM })
export class UserCarShowroomEntity extends BaseModel {
  @Column('text')
  name: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text', { select: false })
  password: string;

  @Column('enum', { enum: UserRoleEnum, default: UserRoleEnum.SALESMAN })
  role: UserRoleEnum;

  @Column('text', { unique: true })
  phone: string;

  @Column('text', { nullable: true })
  image?: string;

  @Column('text', { default: false })
  isBaned: boolean;

  @Column('text', { default: TypeUserAccountEnum.BASE })
  account: TypeUserAccountEnum;

  @Column()
  car_showroom_id: string;
  @ManyToOne(() => CarShowroomEntity, (entity) => entity.users)
  @JoinColumn({ name: 'car_showroom_id' })
  carShowroom?: CarShowroomEntity;
}
