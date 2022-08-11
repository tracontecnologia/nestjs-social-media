import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class Followers1643297139829 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'followers',
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
          },
          {
            name: 'follower_id',
            type: 'varchar',
            length: '36',
            isNullable: false,
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
      'followers',
      new TableForeignKey({
        name: 'fk_followers__user_id',
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
      }),
    );

    await queryRunner.createForeignKey(
      'followers',
      new TableForeignKey({
        name: 'fk_followers__follower_id',
        columnNames: ['follower_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('followers', 'fk_followers__user_id');
    await queryRunner.dropForeignKey('followers', 'fk_followers__follower_id');
    await queryRunner.dropTable('followers');
  }
}
