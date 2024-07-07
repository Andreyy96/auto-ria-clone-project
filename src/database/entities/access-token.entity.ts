import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AdminEntity } from './admin.entity';
import { TableNameEnum } from './enums/table-name.enum';
import { ManagerEntity } from './manager.entity';
import { BaseModel } from './models/base.model';
import { UserEntity } from './user.entity';

@Entity({ name: TableNameEnum.ACCESS_TOKENS })
export class AccessTokenEntity extends BaseModel {
  @Column('text')
  accessToken: string;

  @Column('text')
  deviceId: string;

  @Column({ nullable: true })
  user_id: string;
  @ManyToOne(() => UserEntity, (entity) => entity.accessTokens)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;

  @Column({ nullable: true })
  admin_id: string;
  @ManyToOne(() => AdminEntity, (entity) => entity.accessTokens)
  @JoinColumn({ name: 'admin_id' })
  admin?: AdminEntity;

  @Column({ nullable: true })
  manager_id: string;
  @ManyToOne(() => ManagerEntity, (entity) => entity.accessTokens)
  @JoinColumn({ name: 'manager_id' })
  manager?: ManagerEntity;
}
