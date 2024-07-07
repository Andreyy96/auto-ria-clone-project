import { UuidFactory } from '@nestjs/core/inspector/uuid-factory';
import { ApiProperty } from '@nestjs/swagger';

export class BaseUserResDto {
  @ApiProperty({
    example: UuidFactory,
    description: 'The id of the User',
  })
  id: string;

  @ApiProperty({
    example: 'John',
    description: 'The name of the User',
  })
  public readonly name: string;

  @ApiProperty({
    example: 'test@.gmail.com',
    description: 'The email of the User',
  })
  public readonly email: string;

  @ApiProperty({
    example: 'This is a role',
    description: 'The role of the User',
  })
  public readonly role: string;

  @ApiProperty({
    example: '+380975555555',
    description: 'The phone of the User',
  })
  public readonly phone: string;

  @ApiProperty({
    example: 'https://www.example.com/avatar.jpg',
    description: 'The avatar of the User',
  })
  public readonly image?: string;

  @ApiProperty({
    description: 'The status user',
  })
  public readonly isBanned?: boolean;
}
