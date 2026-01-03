import {
   Entity,
   Column,
   ManyToMany,
   JoinTable,
   Unique, ManyToOne, JoinColumn
} from 'typeorm'

import { BaseEntity, User, Permission } from './'

@Entity('roles')
export class Role extends BaseEntity {
   @Unique(['name'])
   @Column({ type: 'varchar', length: 255 })
   name: string

   @Column({ type: 'varchar', length: 255 })
   description: string

   @Column({ type: 'boolean', default: false })
   system: boolean

   @ManyToOne(() => User, {
      onDelete: 'SET NULL',
   })
   @JoinColumn({ name: 'created_by' })
   createdBy: User | null

   @ManyToOne(() => User, {
      onDelete: 'SET NULL',
   })
   @JoinColumn({ name: 'updated_by' })
   updatedBy: User | null

   @ManyToMany(() => Permission, { eager: true })
   @JoinTable({
      name: 'role_has_permissions',
      joinColumn: {
         name: 'role_id',
         referencedColumnName: 'id'
      },
      inverseJoinColumn: {
         name: 'permission_id',
         referencedColumnName: 'id'
      }
   })
   permissions: Permission[]

   public static readonly logAction = 'ROL'
}
