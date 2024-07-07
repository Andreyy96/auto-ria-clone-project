import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { AccessTokenEntity } from '../../../database/entities/access-token.entity';

@Injectable()
export class AccessTokenRepository extends Repository<AccessTokenEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(AccessTokenEntity, dataSource.manager);
  }

  public async isTokenExist(accessToken: string): Promise<boolean> {
    return await this.exists({ where: { accessToken } });
  }
}
