import { MigrationInterface, QueryRunner } from 'typeorm';
import { RolesEntity } from '../../app/roles/entities/roles.entity';
import { getManyRoles } from '../factories/Role';

export class Roles1660838681191 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const rolesRepository = queryRunner.manager.getRepository(RolesEntity);
    await rolesRepository.save(rolesRepository.create(getManyRoles()));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM roles`);
  }
}
