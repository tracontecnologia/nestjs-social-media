import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsEntity } from './entities/permissions.entity';
import { RolesEntity } from './entities/roles.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RolesEntity, PermissionsEntity])],
})
export class RolesModule {}
