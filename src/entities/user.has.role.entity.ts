import { Entity, BaseEntity, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm'
import { User, Role } from './'

@Entity('user_has_roles')
export class UserHasRole extends BaseEntity {
   @PrimaryGeneratedColumn({ type: 'integer' })
   id: number

   @ManyToOne(() => User, {
      onDelete: 'CASCADE'
   })
   @JoinColumn({ name: 'user_id' })
   user: User

   @ManyToOne(() => Role, {
      onDelete: 'CASCADE'
   })
   @JoinColumn({ name: 'role_id' })
   role: Role
}
