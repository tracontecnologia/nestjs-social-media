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
import { PostsEntity } from '../../posts/entities/posts.entity';

@Entity({ name: 'photos' })
export class PhotosEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => PostsEntity, (post) => post.photos)
  @JoinColumn({ name: 'post_id', referencedColumnName: 'id' })
  post: PostsEntity;

  @Column({ name: 'post_id', type: 'uuid' })
  postId: string;

  @Column({ name: 'photo_url', type: 'text', nullable: false })
  photoUrl: string;

  @CreateDateColumn({ name: 'created_at', nullable: false })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: string;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: string;
}
