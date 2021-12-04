import { IsOptional, IsUUID } from 'class-validator';

export class IndexPostDto {
  @IsOptional()
  @IsUUID()
  userId?: string;
}
