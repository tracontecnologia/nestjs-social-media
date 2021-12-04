import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { UpdateUserProfileDto } from './update-user-profile.dto';

export class PatchUserDto {
  @IsOptional()
  @IsNotEmpty({ message: 'Preencha seu nome' })
  firstName: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Preencha seu sobrenome' })
  lastName: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Preencha seu nome de usuário' })
  username: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Preencha seu e-mail' })
  @IsEmail({}, { message: 'Informe um e-mail válido' })
  email: string;

  @IsOptional()
  @Type(() => UpdateUserProfileDto)
  @ValidateNested()
  userProfiles: UpdateUserProfileDto;
}
