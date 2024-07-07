import { ConfigStaticService } from '../../../configs/config.static';
import { ManagerEntity } from '../../../database/entities/manager.entity';
import { ManagerResDto } from '../dto/res/manager.res.dto';

export class ManagerMapper {
  public static toResponseDTO(manger: ManagerEntity): ManagerResDto {
    const awsConfig = ConfigStaticService.get().aws;
    return {
      id: manger.id,
      name: manger.name,
      email: manger.email,
      role: manger.role,
      image: manger.image ? `${awsConfig.bucketUrl}/${manger.image}` : null,
    };
  }
}
