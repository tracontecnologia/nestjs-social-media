import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UsersEntity } from '../../users/entities/users.entity';

@Entity({ name: 'posts' })
export class PostsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UsersEntity, (user) => user.posts)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UsersEntity;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: string;
}
