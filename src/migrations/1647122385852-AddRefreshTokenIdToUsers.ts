import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddRefreshTokenIdToUsers1647122385852 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'refresh_token_id',
        type: 'varchar',
        length: '36',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'refresh_token_id');
  }
}
