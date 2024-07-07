import { UuidFactory } from '@nestjs/core/inspector/uuid-factory';
import { ApiProperty } from '@nestjs/swagger';

export class BaseCarResDto {
  @ApiProperty({
    example: UuidFactory,
    description: 'The id of the User',
  })
  id: string;

  @ApiProperty({
    example: 'BMV',
    description: 'The brand of the Car',
  })
  public readonly brand: string;

  @ApiProperty({
    example: 'X6',
    description: 'The model of the Car',
  })
  public readonly model: string;

  @ApiProperty({
    example: 'Kyiv',
    description: 'The region of the Car',
  })
  public readonly region: string;

  @ApiProperty({
    example: '5000',
    description: 'The user price of the Car',
  })
  public readonly user_price: string;

  @ApiProperty({
    example: 'UAH',
    description: 'The user ccy of the Car',
  })
  public readonly user_ccy: string;

  @ApiProperty({
    example: 'https://www.example.com/image.jpg',
    description: 'The image of the Car',
  })
  public readonly image?: string;

  @ApiProperty({
    example: 'The price of the Car',
    description: 'The price of the Car',
  })
  price: string;

  @ApiProperty({
    example: 'UAH',
    description: 'The base_ccy of the Car',
  })
  base_ccy: string;

  @ApiProperty({
    example: '45.5',
    description: 'The rate of the currency',
  })
  rate: string;

  @ApiProperty({
    description: 'The status car',
  })
  public readonly isActive?: boolean;
}
