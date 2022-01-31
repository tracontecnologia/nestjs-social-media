import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { UpdateUserProfileDto } from './update-user-profile.dto';

export class PatchUserDto {
  @IsOptional()
  @IsNotEmpty({ message: 'Preencha seu nome' })
  @ApiPropertyOptional({ description: 'Nome do usuário', maxLength: 255 })
  firstName: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Preencha seu sobrenome' })
  @ApiPropertyOptional({ description: 'Sobrenome do usuário', maxLength: 255 })
  lastName: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Preencha seu nome de usuário' })
  @ApiPropertyOptional({ description: 'Nome de usuário', maxLength: 255 })
  username: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Preencha seu e-mail' })
  @IsEmail({}, { message: 'Informe um e-mail válido' })
  @ApiPropertyOptional({ description: 'E-mail do usuário', maxLength: 255 })
  email: string;

  @IsOptional()
  @Type(() => UpdateUserProfileDto)
  @ValidateNested()
  @ApiPropertyOptional({ type: UpdateUserProfileDto })
  userProfiles: UpdateUserProfileDto;
}
