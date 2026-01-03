import { Entity, Column, BaseEntity, PrimaryColumn } from 'typeorm'

@Entity('actions')
export class Action extends BaseEntity {
   @PrimaryColumn({ type: 'varchar', length: 150 })
   code: string

   @Column({ type: 'varchar', length: 150 })
   description: string
}
