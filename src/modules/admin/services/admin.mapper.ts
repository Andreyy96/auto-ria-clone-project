import { ConfigStaticService } from '../../../configs/config.static';
import { AdminEntity } from '../../../database/entities/admin.entity';
import { AdminResDto } from '../dto/res/admin.res.dto';

export class AdminMapper {
  public static toResponseDTO(admin: AdminEntity): AdminResDto {
    const awsConfig = ConfigStaticService.get().aws;
    return {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      image: admin.image ? `${awsConfig.bucketUrl}/${admin.image}` : null,
    };
  }
}
