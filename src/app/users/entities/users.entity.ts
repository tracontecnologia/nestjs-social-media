import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { UserProfilesEntity } from './user-profiles.entity';
import { PostsEntity } from '../../posts/entities/posts.entity';

@Entity({ name: 'users' })
export class UsersEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: string;

  @OneToOne(() => UserProfilesEntity, (userProfile) => userProfile.user, { cascade: true })
  userProfiles: UserProfilesEntity;

  @OneToMany(() => PostsEntity, (post) => post.user)
  posts: PostsEntity[];

  @BeforeInsert()
  passwordEncrypt() {
    this.password = bcrypt.hashSync(this.password, 10);
  }
}
