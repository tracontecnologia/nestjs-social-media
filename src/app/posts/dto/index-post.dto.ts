import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class IndexPostDto {
  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ description: 'Informe o id de algum usuário para realizar o filtro de posts' })
  userId?: string;
}
