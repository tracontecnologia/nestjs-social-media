import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { StoreUserProfileDto } from './store-user-profile.dto';

export class StoreUserDto {
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

  @IsNotEmpty({ message: 'Preencha sua senha' })
  @ApiProperty({ description: 'Senha do usuário', maxLength: 255 })
  password: string;

  @IsOptional()
  @Type(() => StoreUserProfileDto)
  @ValidateNested()
  @ApiProperty({ type: StoreUserProfileDto })
  userProfiles: StoreUserProfileDto;
}
