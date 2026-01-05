import { Entity, Column, Unique } from 'typeorm'
import { BaseEntity } from './'

@Entity('sys_language')
export class SysLanguage extends BaseEntity {
   @Unique(['key'])
   @Column({ type: 'varchar', length: 50 })
   key: string

   @Column({ type: 'text' })
   name_es: string

   @Column({ type: 'text' })
   name_en: string

   @Column({ type: 'text' })
   name_fr: string

   @Column({ type: 'varchar', length: 10 })
   type: string

   public static readonly logAction = 'LAN'
}
