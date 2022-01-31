import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdatePostDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'Informe a descrição do novo post a ser criado' })
  description: string;
}
