import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsUrl, IsUUID, MaxLength } from 'class-validator';

export class UpdateUserProfileDto {
  @IsUUID()
  @ApiProperty({ description: 'Id da entidade user_profiles' })
  id: string;

  @IsOptional()
  @IsUrl({}, { message: 'Informe uma URL válida de foto' })
  @MaxLength(255, { message: 'Limite é de 255 caracteres' })
  @ApiPropertyOptional({ description: 'URL da foto do usuário' })
  photoUrl?: string;

  @IsOptional()
  @MaxLength(255, { message: 'Limite é de 255 caracteres' })
  @ApiPropertyOptional({ description: 'Uma breve descrição do usuário' })
  bio?: string;

  @IsOptional()
  @IsIn(['0', '1'], { message: 'É somente permitido 0 ou 1' })
  @ApiPropertyOptional({ description: 'A privacidade do perfil do usuário (0 = público / 1 = privado)' })
  privacy?: string;
}
