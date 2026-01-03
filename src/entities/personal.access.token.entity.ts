import {
  Entity,
  Column, type ObjectLiteral, ManyToOne, JoinColumn
} from 'typeorm'

import { BaseEntity, User } from './'

@Entity('personal_access_tokens')
export class PersonalAccessToken extends BaseEntity {
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
