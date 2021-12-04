import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class UserProfiles1638641749567 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_profiles',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '36',
            isNullable: false,
            isPrimary: true,
            default: 'uuid()',
          },
          {
            name: 'user_id',
            type: 'varchar',
            length: '36',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'photo_url',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'bio',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'privacy',
            type: 'char',
            length: '1',
            isNullable: true,
            default: '0',
            comment: '0 - public / 1 - private',
          },
          {
            name: 'created_at',
            type: 'datetime',
            isNullable: false,
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'datetime',
            isNullable: true,
          },
          {
            name: 'deleted_at',
            type: 'datetime',
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'user_profiles',
      new TableForeignKey({
        name: 'fk__user_profiles__users__user_id',
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('user_profiles', 'fk__user_profiles__users__user_id');
    await queryRunner.dropTable('user_profiles');
  }
}
