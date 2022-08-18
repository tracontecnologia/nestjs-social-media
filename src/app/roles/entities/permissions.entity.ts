import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RolesEntity } from './roles.entity';

@Entity({ name: 'permissions' })
export class PermissionsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToMany(() => RolesEntity, (roles) => roles.permissions)
  roles: RolesEntity[];
}
