import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

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
}
