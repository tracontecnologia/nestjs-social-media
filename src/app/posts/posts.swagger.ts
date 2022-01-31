import { ApiProperty } from '@nestjs/swagger';

export class PostResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;

  @ApiProperty()
  deletedAt: string;
}

class UserNameResponse {
  @ApiProperty()
  username: string;
}

export class PostIndexResponse {
  @ApiProperty()
  id: string;

  @ApiProperty({ type: UserNameResponse })
  user: UserNameResponse;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;

  @ApiProperty()
  deletedAt: string;
}

export class PostPutResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;

  @ApiProperty()
  deletedAt: string;
}
