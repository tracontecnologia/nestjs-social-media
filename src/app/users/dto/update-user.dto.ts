import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty({ message: 'Preencha seu nome' })
  firstName: string;

  @IsNotEmpty({ message: 'Preencha seu sobrenome' })
  lastName: string;

  @IsNotEmpty({ message: 'Preencha seu nome de usuário' })
  username: string;

  @IsNotEmpty({ message: 'Preencha seu e-mail' })
  @IsEmail({}, { message: 'Informe um e-mail válido' })
  email: string;
}
