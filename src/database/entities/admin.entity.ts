import { Column, Entity, OneToMany } from 'typeorm';

import { UserRoleEnum } from '../../common/enums/user-role.enum';
import { AccessTokenEntity } from './access-token.entity';
import { TableNameEnum } from './enums/table-name.enum';
import { BaseModel } from './models/base.model';
import { RefreshTokenEntity } from './refresh-token.entity';

@Entity({ name: TableNameEnum.ADMINS })
export class AdminEntity extends BaseModel {
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

  @OneToMany(() => RefreshTokenEntity, (entity) => entity.admin)
  refreshTokens?: RefreshTokenEntity[];

  @OneToMany(() => AccessTokenEntity, (entity) => entity.admin)
  accessTokens?: AccessTokenEntity[];
}
