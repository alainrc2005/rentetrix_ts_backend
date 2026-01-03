import { Entity, BaseEntity, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm'
import { User, Permission } from './'

@Entity('user_has_permissions')
export class UserHasPermission extends BaseEntity {
   @PrimaryGeneratedColumn({ type: 'integer' })
   id: number

   @ManyToOne(() => User, {
      onDelete: 'CASCADE'
   })
   @JoinColumn({ name: 'user_id' })
   user: User

   @ManyToOne(() => Permission, {
      onDelete: 'CASCADE'
   })
   @JoinColumn({ name: 'permission_id' })
   permission: Permission
}
