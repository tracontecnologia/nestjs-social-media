import { IsUUID } from 'class-validator';

export class StoreFollowerDto {
  @IsUUID()
  followerId: string;
}
