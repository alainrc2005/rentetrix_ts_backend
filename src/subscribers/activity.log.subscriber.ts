import {
   DataSource, EntityManager,
   EntitySubscriberInterface,
   InsertEvent,
   RemoveEvent,
   SoftRemoveEvent,
   UpdateEvent
} from 'typeorm'
import { ClsService } from 'nestjs-cls'
import { Injectable } from '@nestjs/common'
import { ActivityLog } from '@/entities'
import { plainToInstance } from 'class-transformer'
import { IUser, Optional } from '@/types'

@Injectable()
export class ActivityLogSubscriber implements EntitySubscriberInterface {
   public static readonly entityExcludes: Array<string> = ['ActivityLog']
   constructor(private readonly clsService: ClsService,
               private readonly dataSource: DataSource) {
      dataSource.subscribers.push(this)
   }

   async saveHistory(log: ActivityLog, manager: EntityManager): Promise<void> {
      log.workstation = this.clsService.get<Optional<string>>('ip')
      const currentUser = this.clsService.get<IUser>('currentUser')
      log.causer_id = currentUser.id
      await manager.save(log)
   }

   async afterInsert(event: InsertEvent<any>): Promise<any> {
      if (typeof event.metadata.target === 'function' &&
         !ActivityLogSubscriber.entityExcludes.includes(event.metadata.target.name)) {
         const log = plainToInstance(ActivityLog, {
            subject_type: event.metadata.target.name,
            subject_id: event.entity.id,
            action: Reflect.get(event.metadata.target, 'logAction')+'1',
            properties: {
               attributes: event.entity
            }
         })
         await this.saveHistory(log, event.manager)
      }
   }

   async afterUpdate(event: UpdateEvent<any>): Promise<any> {
      if (typeof event.metadata.target === 'function' &&
         !ActivityLogSubscriber.entityExcludes.includes(event.metadata.target.name)) {
         const log = plainToInstance(ActivityLog, {
            subject_type: event.metadata.target.name,
            subject_id: event.databaseEntity?.id,
            action: Reflect.get(event.metadata.target, 'logAction')+'2',
            properties: {
               attributes: event.entity,
               old: event.databaseEntity
            }
         })
         await this.saveHistory(log, event.manager)
      }
   }

   async beforeRemove(event: RemoveEvent<any>): Promise<any> {
      if (typeof event.metadata.target === 'function' &&
         !ActivityLogSubscriber.entityExcludes.includes(event.metadata.target.name)) {
         const log = plainToInstance(ActivityLog, {
            subject_type: event.metadata.target.name,
            subject_id: event.databaseEntity?.id,
            action: Reflect.get(event.metadata.target, 'logAction')+'3',
            properties: {
               attributes: event.entity
            }
         })
         await this.saveHistory(log, event.manager)
      }
   }

   async beforeSoftRemove(event: SoftRemoveEvent<any>): Promise<any> {
      return this.beforeRemove(event);
   }
}
