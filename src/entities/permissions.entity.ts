import {
  Entity,
  Column,
  BaseEntity, PrimaryGeneratedColumn
} from 'typeorm'

@Entity('permissions')
export class Permission extends BaseEntity {
  @PrimaryGeneratedColumn('identity', { generatedIdentity: 'ALWAYS' })
  id: number

  @Column({ type: 'varchar', length: 255 })
  name: string

  @Column({ type: 'varchar', length: 255 })
  description: string

  @Column({ type: 'integer' })
  position: number

  @Column({ type: 'boolean', default: false })
  active: boolean
}
