import {
   Entity,
   PrimaryGeneratedColumn,
   Column,
   CreateDateColumn,
   UpdateDateColumn,
   BeforeInsert,
   BeforeUpdate, BaseEntity
} from 'typeorm'
import moment from 'moment-timezone'

@Entity('activity_logs')
export class ActivityLog extends BaseEntity {
   @PrimaryGeneratedColumn('identity', { generatedIdentity: 'ALWAYS' })
   id: number

   @Column({ type: 'varchar', length: 10 })
   action: string

   @Column({ type: 'varchar', length: 255, nullable: true })
   subject_type?: string

   @Column({ type: 'integer', nullable: true })
   subject_id?: number

   @Column({ type: 'integer', nullable: true })
   causer_id?: number

   @Column({ type: 'json' })
   properties: { [key: string]: any }

   @Column({ type: 'varchar', length: 255, nullable: true })
   workstation?: string

   @CreateDateColumn()
   created_at: Date

   @UpdateDateColumn()
   updated_at: Date

   @BeforeInsert()
   insertCreated() {
      const now = new Date(
         moment().tz(process.env?.TZ || 'America/Managua').format('YYYY-MM-DD HH:mm:ss'),
      )
      this.created_at = now
      this.updated_at = now
   }

   @BeforeUpdate()
   insertUpdated() {
      this.updated_at = new Date(
         moment().tz(process.env?.TZ || 'America/Managua').format('YYYY-MM-DD HH:mm:ss'),
      )
   }
}
