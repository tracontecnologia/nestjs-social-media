import { MigrationInterface, QueryRunner } from 'typeorm';
import { PermissionsEntity } from '../../app/roles/entities/permissions.entity';
import { getManyPermissions } from '../factories/Permission';

export class Permissions1660838683530 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const permissionsRepository = queryRunner.manager.getRepository(PermissionsEntity);
    await permissionsRepository.save(permissionsRepository.create(getManyPermissions()));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM permissions`);
  }
}
