import { ApiPropertyOptional } from '@nestjs/swagger';
import { ArrayNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class IndexPostDto {
  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ description: 'Informe o id de algum usuário para realizar o filtro de posts' })
  userId?: string;

  @IsOptional()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  @ApiPropertyOptional({ description: 'Informe uma lista de ids de usuários para realizar o filtro de posts' })
  userIds?: string[];
}
