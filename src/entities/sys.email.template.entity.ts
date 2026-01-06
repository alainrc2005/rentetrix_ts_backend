import { Entity, Column } from 'typeorm'
import { BaseEntity } from './'

@Entity('sys_email_templates')
export class SysEmailTemplate extends BaseEntity {
   @Column({ type: 'varchar', length: 180 })
   name: string

   @Column({ type: 'varchar', length: 255 })
   subject_es: string

   @Column({ type: 'varchar', length: 255 })
   subject_en: string

   @Column({ type: 'varchar', length: 255 })
   subject_fr: string

   @Column({ type: 'text' })
   mail_es: string

   @Column({ type: 'text' })
   mail_en: string

   @Column({ type: 'text' })
   mail_fr: string

   @Column({ type: 'varchar', length: 255 })
   action_es: string

   @Column({ type: 'varchar', length: 255 })
   action_en: string

   @Column({ type: 'varchar', length: 255 })
   action_fr: string

   public static readonly logAction = 'SET'
}
