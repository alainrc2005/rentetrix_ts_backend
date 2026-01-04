import {
   Entity,
   Column
} from 'typeorm'
import { BaseEntity } from './base.entity'

@Entity('sys_app_settings')
export class SysAppSetting extends BaseEntity {
   @Column({ type: 'varchar', length: 255 })
   key: string

   @Column({ type: 'text' })
   value: string

   @Column({ type: 'varchar', length: 25 })
   parse: string

   @Column({ type: 'boolean' })
   system: boolean
}
