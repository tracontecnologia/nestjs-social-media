import { SetMetadata } from '@nestjs/common';

export const Can = (...permissions: string[]) => SetMetadata('permissions', permissions);
