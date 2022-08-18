import { MigrationInterface, QueryRunner } from 'typeorm';
import { PermissionsEntity } from '../../app/roles/entities/permissions.entity';
import { RolesEntity } from '../../app/roles/entities/roles.entity';

export class RolesPermissions1660838686594 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const rolesRepository = queryRunner.manager.getRepository(RolesEntity);
    const roles = await rolesRepository.find();

    const permissionsRepository = queryRunner.manager.getRepository(PermissionsEntity);
    const permissions = await permissionsRepository.find();

    const superAdmin = roles.find((r) => r.name === 'super_admin');
    superAdmin.permissions = permissions.filter(
      (p) => !['create_post', 'create_photo', 'like_post', 'follow_user'].includes(p.name),
    );

    const admin = roles.find((r) => r.name === 'admin');
    admin.permissions = permissions.filter(
      (p) => !['delete_user', 'create_post', 'create_photo', 'like_post', 'follow_user'].includes(p.name),
    );

    const user = roles.find((r) => r.name === 'user');
    user.permissions = permissions.filter((p) => !['delete_user'].includes(p.name));

    await rolesRepository.save([superAdmin, admin, user]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM roles`);
    await queryRunner.query(`DELETE FROM permissions`);
    await queryRunner.query(`DELETE FROM roles_permissions`);
  }
}
