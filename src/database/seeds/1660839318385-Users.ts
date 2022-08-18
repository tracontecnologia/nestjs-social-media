import { MigrationInterface, QueryRunner } from 'typeorm';
import { RolesEntity } from '../../app/roles/entities/roles.entity';
import { UsersEntity } from '../../app/users/entities/users.entity';
import { createManyUsers, createUser, createUserProfile } from '../factories/User';

export class Users1660839318385 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const usersRepository = queryRunner.manager.getRepository(UsersEntity);
    const rolesRepository = queryRunner.manager.getRepository(RolesEntity);

    const userRole = await rolesRepository.findOne({ name: 'user' });
    const adminRole = await rolesRepository.findOne({ name: 'admin' });
    const superAdminRole = await rolesRepository.findOne({ name: 'super_admin' });

    const users = usersRepository.create(createManyUsers(10).map((u) => ({ ...u, roleId: userRole.id })));
    const admin = usersRepository.create(createUser());
    admin.roleId = adminRole.id;
    const superAdmin = usersRepository.create({
      firstName: 'Leonardo',
      lastName: 'Brito',
      username: 'leobritob',
      email: 'leonardo@teste.com',
      password: '123456789',
      roleId: superAdminRole.id,
      userProfiles: createUserProfile(),
    });

    await usersRepository.save([...users, admin, superAdmin]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM user_profiles`);
    await queryRunner.query(`DELETE FROM users`);
  }
}
