import { IsNotEmpty } from 'class-validator';

export class UpdatePostDto {
  @IsNotEmpty()
  description: string;
}
