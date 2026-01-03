import { Column, Entity } from 'typeorm'
import { BaseEntity } from './'
import type { TMetaFileStorage } from '@/types'

@Entity('file_storage')
export class FileStorage extends BaseEntity {
   @Column({ type: 'varchar', length: 128 })
   uuid: string

   @Column({ type: 'jsonb' })
   meta: TMetaFileStorage

   @Column({ type: 'integer' })
   year: number

   @Column({ type: 'integer' })
   month: number
}
