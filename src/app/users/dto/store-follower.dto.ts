import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class StoreFollowerDto {
  @IsUUID()
  @ApiProperty({ description: 'Id de usuário (seguidor)' })
  followerId: string;
}
