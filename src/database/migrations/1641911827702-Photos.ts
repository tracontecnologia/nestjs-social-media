import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class Photos1641911827702 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'photos',
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
            name: 'post_id',
            type: 'varchar',
            length: '36',
            isNullable: false,
          },
          {
            name: 'photo_url',
            type: 'text',
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
      'photos',
      new TableForeignKey({
        name: 'fk__photos__post_id',
        columnNames: ['post_id'],
        referencedTableName: 'posts',
        referencedColumnNames: ['id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('photos', 'fk__photos__post_id');
    await queryRunner.dropTable('photos');
  }
}
