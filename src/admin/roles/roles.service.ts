import { Injectable, Logger } from '@nestjs/common'
import { DefaultResult, TResults, getErrorMessage } from '@/helpers'
import { IRequestDatatable, IUser, TDatatableColumns, TResult } from '@/types'
import { DataSource, EntityManager, Repository } from 'typeorm'
import { Permission, Role, RoleHasPermission, User } from '@/entities'
import * as assert from 'node:assert'
import { plainToInstance } from 'class-transformer'
import { InjectRepository } from '@nestjs/typeorm'
import { ClsService } from 'nestjs-cls'
import { RoleDTO } from './dto/RoleDTO'
import { DataTableService } from '@/commons/shared/data.table.service'

@Injectable()
export class RolesService {
   private readonly logger = new Logger(RolesService.name)

   constructor(private readonly dataSource: DataSource,
               private readonly dataTableService: DataTableService,
               private readonly clsService: ClsService,
               @InjectRepository(Role)
               private readonly roleRepository: Repository<Role>) {
   }

   async list(request: IRequestDatatable): Promise<TResult> {
      const result = DefaultResult()
      try {
         const currentUser = this.clsService.get<IUser>('currentUser')
         const columns: TDatatableColumns = [
            { field: 'id' },
            { field: 'name', search: true },
            { field: 'description', search: true },
            { field: 'system' },
         ]
         const where = new Array<string>()
         if (!currentUser.isSuperAdmin) {
            where.push(`name !='super-admin'`)
         }
         if (request?.terms?.search) {
            request.filter = request.terms.search
         }
         result.dt = await this.dataTableService.execute(request, 'roles', 'id', columns, where.join(' AND '))
      } catch (e: unknown) {
         result.code = getErrorMessage(e, this.logger)
      }
      return result
   }

   async fetch(id: number): Promise<TResult> {
      const result = DefaultResult()
      try {
         const role = await Role.findOneBy({ id })
         assert.ok(role !== null, TResults.E_RECORD_NOT_FOUND)
         result.permissions = role.permissions.map(p => p.id)
      } catch (e: unknown) {
         result.code = getErrorMessage(e, this.logger)
      }
      return result
   }

   async store(role: RoleDTO): Promise<TResult> {
      const result = DefaultResult()
      try {
         const currentUser = this.clsService.get<IUser>('currentUser')
         const user = await User.findOneBy({ id: currentUser.id })
         assert.ok(user !== null, TResults.E_RECORD_NOT_FOUND)
         await this.dataSource.manager.transaction(async (em) => {
            const repo = em.withRepository(this.roleRepository)
            const row = await repo.save(plainToInstance(Role, {
               name: role.name,
               description: role.description,
               system: role.system,
               created_by: user.id,
               updated_by: user.id
            }))
            return this.syncPermissions(row, role.permissions, em)
         })
      } catch (e: unknown) {
         result.code = getErrorMessage(e, this.logger)
      }
      return result
   }

   async update(id: number, role: RoleDTO): Promise<TResult> {
      const result = DefaultResult()
      try {
         const currentUser = this.clsService.get<IUser>('currentUser')
         const user = await User.findOneBy({ id: currentUser.id })
         assert.ok(user !== null, TResults.E_RECORD_NOT_FOUND)
         const roleDb = await this.roleRepository.findOne({ where: { id }, relations: ['permissions'] })
         assert.ok(roleDb !== null, TResults.E_RECORD_NOT_FOUND)
         await this.dataSource.manager.transaction(async (em) => {
            const repo = em.withRepository(this.roleRepository)
            repo.merge(roleDb, {
               name: role.name,
               description: role.description,
               system: role.system,
               updated_by: user.id,
               updated_at: new Date()
            })
            await repo.save(roleDb)
            return this.syncPermissions(roleDb, role.permissions, em)
         })
      } catch (e: unknown) {
         result.code = getErrorMessage(e, this.logger)
      }
      return result
   }

   async destroy(id: number): Promise<TResult> {
      const result = DefaultResult()
      try {
         const find = await this.roleRepository.findOneBy({ id })
         if (find !== null) {
            await this.roleRepository.remove(find)
         }
      } catch (e: unknown) {
         result.code = getErrorMessage(e, this.logger)
      }
      return result
   }

   /**
    * Obtiene la lista de todos los roles disponibles en el sistema
    * Para ser trabajada desde frontend con q-select
    */
   async getAll(): Promise<TResult> {
      const result: TResult = DefaultResult()
      try {
         const currentUser = this.clsService.get<IUser>('currentUser')
         const query = this.dataSource.manager.createQueryBuilder()
            .from(Role, 'roles')
            .select(['roles.id AS value', 'roles.description AS label'])
         if (!currentUser.isSuperAdmin) {
            query.where(`roles.name!='super-admin'`)
         }
         result.roles = await query.getRawMany()
      } catch (e) {
         result.code = getErrorMessage(e, this.logger)
      }
      return result
   }

   /**
    * Obtiene la lista de todos los permisos del sistema
    */
   async getPermissions(): Promise<TResult> {
      const result: TResult = DefaultResult()
      try {
         result.permissions = await this.dataSource.manager.createQueryBuilder()
            .from(Permission, 'permissions')
            .select(['permissions.id AS value', 'permissions.description AS label'])
            .getRawMany()
      } catch (e: unknown) {
         result.code = getErrorMessage(e, this.logger)
      }
      return result
   }

   async syncPermissions(role: Role, permissions: Array<number>, transaction: EntityManager): Promise<void> {
      await transaction.createQueryBuilder().delete().from(RoleHasPermission)
         .where('role_id = :role_id', { role_id: role.id }).execute()
      for (const permission of permissions) {
         await transaction.save(plainToInstance(RoleHasPermission, {
            role,
            permission
         }))
      }
   }
}
