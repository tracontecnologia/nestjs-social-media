import { UsersEntity } from '../../app/users/entities/users.entity';
import { TestIntegrationHelper } from './test-integration.helper';
import { faker } from '@faker-js/faker';
import { UserProfilesEntity } from '../../app/users/entities/user-profiles.entity';

export class UserTestIntegrationHelper extends TestIntegrationHelper {
  getFakeData() {
    return this.entityManager.create(UsersEntity, {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      userProfiles: {
        privacy: '0',
        bio: faker.lorem.lines(1),
        photoUrl: faker.image.people(),
      },
    });
  }

  async seed(): Promise<void> {
    const users: UsersEntity[] = [this.getFakeData(), this.getFakeData(), this.getFakeData()];
    await this.entityManager.save(UsersEntity, users);
  }

  async cleanSeed(): Promise<void> {
    const userProfiles = await this.entityManager.find(UserProfilesEntity);
    await this.entityManager.remove(UserProfilesEntity, userProfiles);

    const users = await this.entityManager.find(UsersEntity);
    await this.entityManager.remove(UsersEntity, users);
  }

  async findOne(): Promise<UsersEntity> {
    return this.entityManager.findOne(UsersEntity);
  }
}
