import {
  Entity,
  Column, type ObjectLiteral, BaseEntity, PrimaryGeneratedColumn
} from 'typeorm'

@Entity('personal_access_tokens')
export class PersonalAccessToken extends BaseEntity {
  @PrimaryGeneratedColumn('identity', { generatedIdentity: 'ALWAYS' })
  id: number

  @Column({ type: 'integer' })
  user_id: number;

  @Column({ type: 'text' })
  token: string

  @Column({ type: 'jsonb', nullable: true })
  data: ObjectLiteral

  @Column({ type: 'timestamp' })
  last_used_at: Date

  @Column({ type: 'timestamp' })
  expired_at: Date
}
