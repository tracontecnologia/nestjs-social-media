import { faker } from '@faker-js/faker';
import { StoreUserProfileDto } from '../../app/users/dto/store-user-profile.dto';
import { StoreUserDto } from '../../app/users/dto/store-user.dto';

export function createUserProfile(): StoreUserProfileDto {
  return {
    photoUrl: faker.image.people(150, 150, false),
    bio: faker.lorem.words(10),
    privacy: '0',
  };
}

export function createUser(): StoreUserDto {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: '123456789',
    userProfiles: createUserProfile(),
  };
}

export function createManyUsers(length = 1): StoreUserDto[] {
  return Array.from({ length }).map(() => createUser());
}
