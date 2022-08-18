import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class RolesPermissions1660838060475 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'roles_permissions',
        columns: [
          {
            name: 'role_id',
            type: 'varchar',
            length: '36',
            isNullable: false,
          },
          {
            name: 'permission_id',
            type: 'varchar',
            length: '36',
            isNullable: false,
          },
        ],
      }),
    );
    await queryRunner.createForeignKey(
      'roles_permissions',
      new TableForeignKey({
        name: 'fk_roles_permissions__role_id',
        columnNames: ['role_id'],
        referencedTableName: 'roles',
        referencedColumnNames: ['id'],
      }),
    );
    await queryRunner.createForeignKey(
      'roles_permissions',
      new TableForeignKey({
        name: 'fk_roles_permissions__permission_id',
        columnNames: ['permission_id'],
        referencedTableName: 'permissions',
        referencedColumnNames: ['id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('roles_permissions', 'fk_roles_permissions__role_id');
    await queryRunner.dropForeignKey('roles_permissions', 'fk_roles_permissions__permission_id');
    await queryRunner.dropTable('roles_permissions');
  }
}
