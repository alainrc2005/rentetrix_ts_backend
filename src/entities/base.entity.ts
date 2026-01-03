import {
   BaseEntity as TypeOrmBaseEntity,
   BeforeInsert,
   BeforeUpdate,
   CreateDateColumn,
   UpdateDateColumn,
   PrimaryGeneratedColumn, Column,
} from 'typeorm'
import moment from 'moment-timezone'

export abstract class BaseEntity extends TypeOrmBaseEntity {
   @PrimaryGeneratedColumn('identity', { generatedIdentity: 'ALWAYS' })
   id: number

   @CreateDateColumn({ comment: 'Guarda la fecha de creación del registro' })
   created_at: Date

   @Column({ nullable: false, default: 0, comment: 'Guarda el índice del usuario que creó el registro' })
   created_by: number

   @UpdateDateColumn({ comment: 'Guarda la fecha de actualización del registro' })
   updated_at: Date

   @Column({ nullable: true, comment: 'Guarda el índice del usuario que actualizó el registro' })
   updated_by: number

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
