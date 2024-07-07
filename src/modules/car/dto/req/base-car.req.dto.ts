import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString, Length, Min } from 'class-validator';

export class BaseCarReqDto {
  @ApiProperty({ type: 'string', format: 'string', required: true })
  @IsString()
  @Length(3, 50)
  @Type(() => String)
  brand: string;

  @ApiProperty({ type: 'string', format: 'string', required: true })
  @IsString()
  @Length(0, 3000)
  model: string;

  @ApiProperty({ type: 'string', format: 'string', required: true })
  @IsString()
  @Length(0, 3000)
  region: string;

  @ApiProperty({ type: 'string', format: 'number', required: true })
  @IsNumber()
  @Min(100)
  @Type(() => Number)
  user_price: string;

  @ApiProperty({ type: 'string', format: 'string', required: true })
  @IsString()
  @Length(3, 50)
  @Type(() => String)
  user_ccy: string;

  @ApiProperty({ type: 'string', format: 'binary', required: true })
  image: Express.Multer.File;
}
