import { Entity, BaseEntity, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm'
import { Role, Permission } from './'

@Entity('role_has_permissions')
export class RoleHasPermission extends BaseEntity {
   @PrimaryGeneratedColumn({ type: 'integer' })
   id: number

   @ManyToOne(() => Role, {
      onDelete: 'CASCADE'
   })
   @JoinColumn({ name: 'role_id' })
   role: Role

   @ManyToOne(() => Permission, {
      onDelete: 'CASCADE'
   })
   @JoinColumn({ name: 'permission_id' })
   permission: Permission
}
