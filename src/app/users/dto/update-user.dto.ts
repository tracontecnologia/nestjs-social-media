import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { UpdateUserProfileDto } from './update-user-profile.dto';

export class UpdateUserDto {
  @IsNotEmpty({ message: 'Preencha seu nome' })
  @ApiProperty({ description: 'Nome do usuário', maxLength: 255 })
  firstName: string;

  @IsNotEmpty({ message: 'Preencha seu sobrenome' })
  @ApiProperty({ description: 'Sobrenome do usuário', maxLength: 255 })
  lastName: string;

  @IsNotEmpty({ message: 'Preencha seu nome de usuário' })
  @ApiProperty({ description: 'Nome de usuário', maxLength: 255 })
  username: string;

  @IsNotEmpty({ message: 'Preencha seu e-mail' })
  @IsEmail({}, { message: 'Informe um e-mail válido' })
  @ApiProperty({ description: 'E-mail do usuário', maxLength: 255 })
  email: string;

  @IsOptional()
  @Type(() => UpdateUserProfileDto)
  @ValidateNested()
  @ApiProperty({ type: UpdateUserProfileDto })
  userProfiles: UpdateUserProfileDto;
}
