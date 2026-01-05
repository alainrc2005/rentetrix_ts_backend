import {
   Entity,
   Column,
   ManyToMany,
   JoinTable,
   Unique
} from 'typeorm'
import { BaseEntity, Role, Permission } from './'

@Entity('users')
export class User extends BaseEntity {
   @Column({ type: 'varchar', length: 255 })
   name: string

   @Unique(['email'])
   @Column({ type: 'varchar', length: 255 })
   email: string

   @Column({ type: 'varchar', length: 255 })
   password: string

   @Column({ type: 'varchar', length: 100, nullable: true })
   remember_token?: string | null

   @Column({ type: 'varchar', length: 20 })
   phone: string

   @Column({ type: 'varchar', nullable: true, length: 128 })
   photo: string

   @Column({ type: 'boolean', default: false })
   active: boolean

   @ManyToMany(() => Role)
   @JoinTable({
      name: 'user_has_roles',
      joinColumn: {
         name: 'user_id',
         referencedColumnName: 'id'
      },
      inverseJoinColumn: {
         name: 'role_id',
         referencedColumnName: 'id'
      }
   })
   public roles: Role[]

   @ManyToMany(() => Permission)
   @JoinTable({
      name: 'user_has_permissions',
      joinColumn: {
         name: 'user_id',
         referencedColumnName: 'id'
      },
      inverseJoinColumn: {
         name: 'permission_id',
         referencedColumnName: 'id'
      }
   })
   public permissions: Permission[]

   public static readonly logAction = 'CU0'
}
