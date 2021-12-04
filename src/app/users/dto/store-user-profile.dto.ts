import { IsIn, IsOptional, IsUrl, MaxLength } from 'class-validator';

export class StoreUserProfileDto {
  @IsOptional()
  @IsUrl({}, { message: 'Informe uma URL válida de foto' })
  @MaxLength(255, { message: 'Limite é de 255 caracteres' })
  photoUrl?: string;

  @IsOptional()
  @MaxLength(255, { message: 'Limite é de 255 caracteres' })
  bio?: string;

  @IsOptional()
  @IsIn(['0', '1'], { message: 'É somente permitido 0 ou 1' })
  privacy?: string;
}
