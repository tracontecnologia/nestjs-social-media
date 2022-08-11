import { MigrationInterface, QueryRunner } from 'typeorm';
import { UsersEntity } from '../../app/users/entities/users.entity';
import { createManyUsers } from '../factories/User';

export class Users1660229622267 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const usersRepository = queryRunner.manager.getRepository(UsersEntity);
    await usersRepository.save(usersRepository.create(createManyUsers(10)));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM user_profiles`);
    await queryRunner.query(`DELETE FROM users`);
  }
}
