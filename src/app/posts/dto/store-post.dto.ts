import { IsNotEmpty } from 'class-validator';

export class StorePostDto {
  @IsNotEmpty()
  description: string;
}
