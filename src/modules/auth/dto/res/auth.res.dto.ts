import { AdminResDto } from '../../../admin/dto/res/admin.res.dto';
import { ManagerResDto } from '../../../manager/dto/res/manager.res.dto';
import { UserResDto } from '../../../user/dto/res/user.res.dto';
import { TokenPairResDto } from './token-pair.res.dto';

export class AuthResDto {
  user: UserResDto;
  tokens: TokenPairResDto;
}

export class AuthAdminResDto {
  admin: AdminResDto;
  tokens: TokenPairResDto;
}

export class AuthManagerResDto {
  admin: ManagerResDto;
  tokens: TokenPairResDto;
}
