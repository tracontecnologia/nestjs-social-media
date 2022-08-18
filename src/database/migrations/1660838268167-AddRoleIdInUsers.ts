import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm';

export class AddRoleIdInUsers1660838268167 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'role_id',
        type: 'varchar',
        length: '36',
        isNullable: false,
      }),
    );
    await queryRunner.createForeignKey(
      'users',
      new TableForeignKey({
        name: 'fk_users__role_id',
        columnNames: ['role_id'],
        referencedTableName: 'roles',
        referencedColumnNames: ['id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('users', 'fk_users__role_id');
    await queryRunner.dropTable('users');
  }
}
