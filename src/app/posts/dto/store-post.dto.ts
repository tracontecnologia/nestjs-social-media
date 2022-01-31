import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class StorePostDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'Informe a descrição do novo post a ser criado' })
  description: string;
}
