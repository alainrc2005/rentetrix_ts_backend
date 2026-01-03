import {
  Entity,
  Column
} from 'typeorm'

import { BaseEntity } from './'

@Entity('permissions')
export class Permission extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string

  @Column({ type: 'varchar', length: 255 })
  description: string

  @Column({ type: 'integer' })
  position: number

  @Column({ type: 'boolean', default: false })
  active: boolean
}
