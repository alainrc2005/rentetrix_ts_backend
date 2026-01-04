import {
  Entity,
  Column, type ObjectLiteral, ManyToOne, JoinColumn, BaseEntity, PrimaryGeneratedColumn
} from 'typeorm'
import { User } from '@/entities'

@Entity('personal_access_tokens')
export class PersonalAccessToken extends BaseEntity {
  @PrimaryGeneratedColumn('identity', { generatedIdentity: 'ALWAYS' })
  id: number

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'text' })
  token: string

  @Column({ type: 'jsonb', nullable: true })
  data: ObjectLiteral

  @Column({ type: 'timestamp' })
  last_used_at: Date

  @Column({ type: 'timestamp' })
  expired_at: Date
}
