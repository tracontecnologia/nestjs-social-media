import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UsersEntity } from '../../users/entities/users.entity';
import { PermissionsEntity } from './permissions.entity';

@Entity({ name: 'roles' })
export class RolesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToMany(() => PermissionsEntity, (permissions) => permissions.roles, { cascade: true })
  @JoinTable({
    name: 'roles_permissions',
    joinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'permission_id',
      referencedColumnName: 'id',
    },
  })
  permissions: PermissionsEntity[];

  @OneToMany(() => UsersEntity, (user) => user.role)
  users: UsersEntity[];
}
